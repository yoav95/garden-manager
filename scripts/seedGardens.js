import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export async function seedGardens() {
  const sampleNames = [
    "דונש",
    "פאגלין 9",
    "הכובשים",
    "גן האורנים",
    "גן שקדיה"
  ];

  const sampleAddresses = [
    "הרצל 12, תל אביב",
    "אבן גבירול 88, תל אביב",
    "דב הוז 10, גבעתיים",
    "ויצמן 40, רמת גן",
    "שויצמן דגשד"
  ];

  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday"];

  const sampleImages = [
    "/assets/1.jpg",
    "/assets/2.jpg",
    "/assets/3.jpg",
    "/assets/4.jpg",
    "/assets/5.jpg",
  ];

  for (let i = 0; i < 5; i++) {
    const garden = {
      name: sampleNames[i],
      address: sampleAddresses[i],
      day: days[i],
      imageURL: sampleImages[i],
      lastVisit: "2025-01-15",

      visits: [
        {
          date: "2025-01-15",
          tasks: ["ניקוי עלים", "השקיה", "בדיקת מערכת טפטוף"],
          notes: ["הדשא במצב טוב", "עץ אחד נראה יבש"],
        },
        {
          date: "2025-01-02",
          tasks: ["גיזום שיחים"],
          notes: ["נראה טוב"],
        },
      ],
    };

    await addDoc(collection(db, "gardens"), garden);
    console.log(`Created garden ${garden.name}`);
  }

  console.log("🌱 Dummy gardens inserted!");
}
