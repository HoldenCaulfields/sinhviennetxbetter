'use client';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { UserProfile, Category, ScoreHistory, ViewMode, DiscoveryMode, MapEvent } from '@/types';
import { calculatePersonaScore } from '@/utils';
import { useProfiles } from "@/hooks/useProfiles";
import { userMatchesFilter } from "@/lib/filtercategory";

import { doc, setDoc, collection, onSnapshot, query, orderBy, limit, addDoc, serverTimestamp, arrayUnion, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { getCategoryInterestScore, sortCategoriesByInterest } from '@/lib/interest';

const INITIAL_LOCATION: [number, number] = [10.762622, 106.660172];

export function useAppState() {
  const [viewMode, setViewMode] = useState<ViewMode>('present');
  const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>('self');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [centerTrigger, setCenterTrigger] = useState(0);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [lastSignal, setLastSignal] = useState<{ location: [number, number], userId: string } | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);

  const firestoreUsers = useProfiles();

  const [myProfile, setMyProfile] = useState<UserProfile>({
    id: 'me',
    name: 'Bạn (đổi tên)',
    avatar: '/tet.jpg',
    location: INITIAL_LOCATION,
    selectedOptions: ['m1', 'l1'],
    customTags: [],
    history: [],
    isPinned: false
  });

  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showOthers, setShowOthers] = useState(true);

  const personaScore = useMemo(() => calculatePersonaScore(myProfile.selectedOptions), [myProfile.selectedOptions]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('syncmap_profile_v2');
      if (saved) setMyProfile(JSON.parse(saved));
    } catch {
      console.warn('Invalid localStorage data');
    }
  }, []);

  useEffect(() => {
    if (auth.currentUser && firestoreUsers.length > 0) {
      const dbMe = firestoreUsers.find(u => u.id === auth.currentUser?.uid);
      if (dbMe) {
        setMyProfile(prev => ({
          ...prev,
          ...dbMe, // Ghi đè toàn bộ dữ liệu từ DB (bao gồm location mới)
          id: auth.currentUser?.uid || 'me'
        }));
      }
    }
  }, [firestoreUsers]); // Chạy mỗi khi danh sách user từ Firebase cập nhật

  useEffect(() => {
    localStorage.setItem('syncmap_profile_v2', JSON.stringify(myProfile));
  }, [myProfile]);

  const handleToggleOption = useCallback((optionId: string) => {
    setMyProfile(prev => {
      const isSelected = prev.selectedOptions.includes(optionId);
      const newOptions = isSelected
        ? prev.selectedOptions.filter(id => id !== optionId)
        : [...prev.selectedOptions, optionId];
      return { ...prev, selectedOptions: newOptions };
    });
  }, []);

  const handleAddCustomTag = useCallback((tag: string) => {
    setMyProfile(prev => ({
      ...prev,
      customTags: [...new Set([...prev.customTags, tag])]
    }));
  }, []);

  const handleRemoveCustomTag = useCallback((tag: string) => {
    setMyProfile(prev => ({
      ...prev,
      customTags: prev.customTags.filter(t => t !== tag)
    }));
  }, []);

  const handleOpenReview = () => setIsReviewModalOpen(true);

  const handleRecenter = useCallback(() => {
    if (!("geolocation" in navigator)) {
      alert("Trình duyệt của bạn không hỗ trợ định vị.");
      return;
    }

    // Cấu hình option dành riêng cho iOS
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // Tăng lên 10s vì GPS iPhone cần thời gian khởi động
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMyProfile(prev => ({ ...prev, location: [latitude, longitude] }));
        setCenterTrigger(prev => prev + 1);
      },
      (error) => {
        // Xử lý các mã lỗi đặc trưng của Safari
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Safari đã chặn quyền truy cập vị trí. Bạn hãy làm theo hướng dẫn bên dưới để mở lại nhé!");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Không thể xác định vị trí. Hãy kiểm tra xem bạn đã bật GPS (Dịch vụ định vị) trong cài đặt máy chưa.");
            break;
          case error.TIMEOUT:
            alert("Yêu cầu định vị quá hạn. Hãy thử lại lần nữa.");
            break;
        }
      },
      geoOptions
    );
  }, []);

  const handleConfirmSave = useCallback(async () => {
    if (!auth.currentUser) {
      console.log("Auth not ready");
      return;
    }

    // 1. Tự động lấy vị trí mới nhất ngay khi bấm lưu
  handleRecenter();

    const uid = auth.currentUser.uid;

    const newHistoryEntry = {
      date: new Date().toISOString(),
      score: personaScore
    };

    const updatedProfile = {
      ...myProfile,
      id: uid, // ⭐ sync id luôn
      isPinned: true,
      history: [...myProfile.history, newHistoryEntry]
    };

    setMyProfile(updatedProfile);

    localStorage.setItem(
      "syncmap_profile_v2",
      JSON.stringify(updatedProfile)
    );

    // ⭐ firestore
    await setDoc(
      doc(db, "profiles", uid),
      updatedProfile,
      { merge: true }
    );

    setIsReviewModalOpen(false);
    setDiscoveryMode('map'); // Lưu xong thì tự động đẩy ra map
  }, [personaScore, myProfile]);


  const handleResetDraft = () => {
    setMyProfile(prev => ({ ...prev, isPinned: false }));
    setDiscoveryMode('self');
  };

  const handleUpdateAvatar = useCallback((newAvatar: string) => {
    setMyProfile(prev => {
      const updated = { ...prev, avatar: newAvatar };
      localStorage.setItem('syncmap_profile_v2', JSON.stringify(updated));
      return updated;
    });
    // If showing self in modal, update that too indirectly
    if (selectedUser?.id === 'me' || selectedUser?.id === 'Bạn') {
      setSelectedUser(prev => prev ? ({ ...prev, avatar: newAvatar }) : null);
    }
  }, [selectedUser]);

  const handleUpdateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!auth.currentUser) return;

      const uid = auth.currentUser.uid;

      const updatedProfile = {
        ...myProfile,
        ...data,
        id: uid,
        lastUpdated: new Date().toISOString()
      };

      setMyProfile(updatedProfile);

      localStorage.setItem(
        "syncmap_profile_v2",
        JSON.stringify(updatedProfile)
      );

      await setDoc(
        doc(db, "profiles", uid),
        updatedProfile,
        { merge: true }
      );
    },
    [myProfile]
  );

  // combine me + others
  const allUsers = useMemo(() => {
    const others = firestoreUsers.filter(
      u => u.id !== myProfile.id
    );

    return [myProfile, ...others];
  }, [myProfile, firestoreUsers]);

  // ⭐ FILTER USERS
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user =>
      userMatchesFilter(user, activeFilter)
    );
  }, [allUsers, activeFilter]);

  // 1. Lắng nghe tín hiệu pháo hoa realtime
  useEffect(() => {
    const q = query(collection(db, "signals"), orderBy("timestamp", "desc"), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        // Chỉ cập nhật nếu signal này mới (trong vòng 5 giây qua)
        if (data.timestamp && (Date.now() - data.timestamp.toMillis() < 5000)) {
          setLastSignal({
            location: data.location,
            userId: data.userId
          });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Hàm bắn pháo hoa
  const handleBlastFirework = async () => {
    try {
      const docRef = await addDoc(collection(db, "signals"), {
        type: 'firework',
        userId: myProfile.id,
        userName: myProfile.name,
        location: myProfile.location,
        timestamp: serverTimestamp()
      });

      // Thời gian 10s là dư dả cho hiệu ứng Rocket (800ms) và nổ tung
      setTimeout(async () => {
        try {
          await deleteDoc(docRef);
          console.log("Dọn dẹp signal thành công");
        } catch (err) {
          console.error("Lỗi khi dọn dẹp signal:", err);
        }
      }, 20000);

    } catch (error) {
      console.error("Lỗi khi bắn pháo hoa:", error);
    }
  };

  // 3. Tham gia sự kiện
  const handleJoinEvent = async (eventId: string) => {
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, {
      attendees: arrayUnion(myProfile.id)
    });
  };

  const handleCreateEvent = async (eventData: Partial<MapEvent>) => {
    if (!auth.currentUser) return;

    try {
      const newEvent = {
        ...eventData,
        creatorId: auth.currentUser.uid,
        attendees: [auth.currentUser.uid],
        startTime: eventData.startTime || new Date().toISOString(),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "events"), newEvent);
      setIsEventModalOpen(false);
    } catch (error) {
      console.error("Lỗi tạo sự kiện:", error);
    }
  };

  //fetch events 
  useEffect(() => {
    // Tham chiếu đến collection 'events'
    const eventsRef = collection(db, "events");

    // Bạn có thể thêm điều kiện query (ví dụ: chỉ lấy sự kiện chưa diễn ra)
    // const q = query(eventsRef, where("startTime", ">=", new Date().toISOString()));

    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const eventList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MapEvent[];

      setEvents(eventList);
    }, (error) => {
      console.error("Lỗi khi lấy sự kiện:", error);
    });

    return () => unsubscribe(); // Hủy lắng nghe khi component unmount
  }, []);

  const onEventClick = useCallback((event: MapEvent) => {
  setSelectedEvent(event);
}, []);

//filter marker category by interest score 
const sortedCategories = useMemo(() => {
  const scored = getCategoryInterestScore(myProfile.selectedOptions)

  // nếu user chưa chọn gì → thêm all = 100%
  const totalSelected = myProfile.selectedOptions.length

  const withAll = [
    {
      id: "all",
      label: "Tất cả",
      icon: "🌍",
      interestScore: totalSelected === 0 ? 1 : 0,
      interestPercent: totalSelected === 0 ? 1 : 0,
    },
    ...scored,
  ]

  return sortCategoriesByInterest(withAll)
}, [myProfile.selectedOptions])

  return {
    viewMode,
    setViewMode,
    discoveryMode, setDiscoveryMode,
    isReviewModalOpen, setIsReviewModalOpen,
    isEditProfileOpen, setIsEditProfileOpen,
    centerTrigger, handleBlastFirework, handleJoinEvent, events, lastSignal,
    myProfile,
    setMyProfile,
    activeCategory,
    setActiveCategory,
    selectedUser,
    setSelectedUser,
    showOthers,
    setShowOthers,
    personaScore,
    firestoreUsers,
    handleToggleOption,
    handleAddCustomTag,
    handleRemoveCustomTag,
    handleOpenReview,
    handleConfirmSave,
    handleResetDraft, handleUpdateAvatar,
    handleRecenter, handleUpdateProfile,
    activeFilter, setActiveFilter, filteredUsers,
    handleCreateEvent, isEventModalOpen, setIsEventModalOpen,
    selectedEvent, setSelectedEvent, onEventClick,
    sortedCategories,
  };
}
