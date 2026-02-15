import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/types";

export function useProfiles() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "profiles"),
      (snapshot) => {
        const users: UserProfile[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserProfile[];

        setProfiles(users);
      }
    );

    return () => unsubscribe();
  }, []);

  return profiles;
}
