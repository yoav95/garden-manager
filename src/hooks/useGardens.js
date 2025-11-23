import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useEffect, useState } from "react";

export function useGardens() {
  console.log("useGardens hook loaded");

  const [gardens, setGardens] = useState([]);

  useEffect(() => {
    console.log("useEffect inside useGardens is running");

    const unsub = onSnapshot(collection(db, "gardens"), snap => {
      console.log("snapshot callback fired, size:", snap.size);

      setGardens(
        snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      );
    });

    return () => unsub();
  }, []);

  return gardens;
}
