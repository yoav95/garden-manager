import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// ⚡ Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCHOlJWgmZ3CYCVPJe3K4FjDL0vknku0lg",
  authDomain: "goldie-a343e.firebaseapp.com",
  projectId: "goldie-a343e",
  storageBucket: "goldie-a343e.firebasestorage.app",
  messagingSenderId: "964011676118",
  appId: "1:964011676118:web:7e4c3784c708ed366a1477",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Example gardens data
const gardens = [
  {
    name: "Roth Garden",
    lastVisit: "2025-11-15",
    address: "Haifa, Roth St 12",
    notes: "Lots of weeds",
    location: { lat: 32.7940, lng: 34.9896 },
    imageURL: "https://via.placeholder.com/200",
    visitLogs: [
      {
        date: "2025-11-01",
        tasks: ["Weeded flower beds", "Pruned roses", "Watered garden"],
        nextVisitTasks: ["Fertilize lawn", "Trim hedges"],
      },
      {
        date: "2025-10-15",
        tasks: ["Removed dead leaves", "Checked irrigation system"],
        nextVisitTasks: ["Plant seasonal flowers"],
      },
    ],
  },
  {
    name: "Green Valley",
    lastVisit: "2025-10-20",
    address: "Tel Aviv, Green St 5",
    notes: "Needs more watering",
    location: { lat: 32.0853, lng: 34.7818 },
    imageURL: "https://via.placeholder.com/200",
    visitLogs: [
      {
        date: "2025-10-05",
        tasks: ["Watered garden", "Pruned trees"],
        nextVisitTasks: ["Fertilize plants"],
      },
    ],
  },
  {
    name: "Sunny Park",
    lastVisit: "2025-11-10",
    address: "Jerusalem, Park Rd 8",
    notes: "Good condition",
    location: { lat: 31.7683, lng: 35.2137 },
    imageURL: "https://via.placeholder.com/200",
    visitLogs: [],
  },
];

async function seed() {
  const collectionRef = collection(db, "gardens");

  for (const garden of gardens) {
    await addDoc(collectionRef, garden);
    console.log(`Added garden: ${garden.name}`);
  }

  console.log("All gardens added!");
}

seed();
