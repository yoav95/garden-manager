import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

await updateDoc(doc(db, "gardens", g.id), {
  days: ["Monday", "Thursday"]
});