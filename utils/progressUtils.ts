import { doc, updateDoc, getDoc } from "firebase/firestore";
import { firestore } from "../config/firebaseConfig";

export const updateProgress = async (userId: string, completedLevel: number) => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const progress = userSnapshot.data()?.progress || {};
      progress[`level_${completedLevel}`] = true;

      if (completedLevel < 6) {
        progress[`level_${completedLevel + 1}`] = true;
      }

      await updateDoc(userDocRef, { progress });
    } else {
      console.error("User document not found.");
    }
  } catch (error) {
    console.error("Error updating progress:", error);
  }
};
