import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase.ts";
import type { UserProfile } from "../types.ts";

/**
 * OPTION POOL — theo CATEGORIES thật của bạn
 */
const FUN_OPTIONS = [
  "m1", "m2", "m3", "m4", // music
  "f1", "f2", "f3", "f4", // movies
  "d1", "d2", "d3", "d4", // dating
  "g1", "g2", "g3", "g4", // games
  "t1", "t2", "t3", "t4"  // travel
];

const STUDY_OPTIONS = [
  "l1", "l2", "l3", "l4", // language
  "r1", "r2", "r3", "r4", // reading
  "p1", "p2", "p3", "p4", // work
  "s1", "s2", "s3", "s4", // startup
  "h1", "h2", "h3", "h4"  // housework
];

// chọn ngẫu nhiên N phần tử
function pickRandom(arr: string[], count: number) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
}

/**
 * realistic interest generator
 * - 70% fun
 * - 30% study
 */
function generateOptions() {
  const funCount = Math.floor(Math.random() * 3) + 2; // 2–4 fun
  const studyCount = Math.floor(Math.random() * 2) + 1; // 1–2 study

  return [
    ...pickRandom(FUN_OPTIONS, funCount),
    ...pickRandom(STUDY_OPTIONS, studyCount)
  ];
}

/**
 * realistic score
 */
function generateScoreHistory() {
  const baseFun = Math.floor(Math.random() * 60) + 20;
  const baseStudy = Math.floor(Math.random() * 60) + 20;

  return [
    {
      date: new Date().toISOString(),
      score: {
        fun: baseFun,
        study: baseStudy
      }
    }
  ];
}

/**
 * VN realistic names
 */
const names = [
  "Minh Anh", "Tuấn Kiệt", "Phương Thảo", "Quang Huy",
  "Ngọc Trâm", "Thanh Bình", "Khánh Linh", "Gia Hân",
  "Bảo Khôi", "Anh Tuấn", "Trần Đức", "Hồng Ngọc",
  "Tấn Phát", "Thuỳ Dương", "Minh Khang", "Ngọc Anh",
  "Phúc Hậu", "Hoàng Long", "Lan Chi", "Hải Nam"
];

/**
 * realistic bios
 */
const bios = [
  "Thích cà phê và nói chuyện",
  "Hay đi du lịch cuối tuần",
  "Game thủ bán thời gian",
  "Sinh viên năm 3",
  "Thích học ngoại ngữ",
  "Làm việc IT",
  "Đam mê startup",
  "Người hướng nội",
  "Yêu âm nhạc và phim ảnh",
  "Thích khám phá quán mới"
];

/**
 * locations khắp VN
 */
const locations: [number, number][] = [
  [21.0285, 105.8542], // Hà Nội
  [20.8449, 106.6881], // Hải Phòng
  [20.9712, 107.0448], // Hạ Long
  [22.3364, 103.8438], // Sa Pa
  [16.0544, 108.2022], // Đà Nẵng
  [16.4637, 107.5909], // Huế
  [13.782, 109.219],   // Quy Nhơn
  [12.2388, 109.1967], // Nha Trang
  [11.9404, 108.4583], // Đà Lạt
  [12.6667, 108.05],   // Buôn Ma Thuột
  [10.7769, 106.7009], // HCM
  [10.0452, 105.7469], // Cần Thơ
  [10.2899, 103.984],  // Phú Quốc
  [10.4114, 107.1362], // Vũng Tàu
  [10.243, 106.375],   // Bến Tre
  [10.6956, 106.2431]  // Long An
];

/**
 * generate 20 profiles
 */
function generateProfiles(): UserProfile[] {
  return Array.from({ length: 20 }).map((_, i) => ({
    id: `seed_user_${i + 1}`,
    name: names[i % names.length],
    avatar: `/avatars/a${(i % 8) + 1}.jpg`,
    location: locations[i % locations.length],
    selectedOptions: generateOptions(),
    customTags: [],
    history: generateScoreHistory(),
    isPinned: true,
    bio: bios[Math.floor(Math.random() * bios.length)]
  }));
}

async function seedProfiles() {
  console.log("🌱 Seeding realistic profiles...");

  const profiles = generateProfiles();

  for (const profile of profiles) {
    await setDoc(doc(db, "profiles", profile.id), profile, {
      merge: true
    });

    console.log("✅ uploaded:", profile.name);
  }

  console.log("🎉 Done seeding!");
}

seedProfiles().catch(console.error);
