import { createUserWithEmailAndPassword, UserCredential, signInWithEmailAndPassword, } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export interface UserData {
  name: string;
  email: string;
  birthDate: string;
}

export interface ScoreData {
  iq?: string;
  gas?: string;
}

export interface UserProfile extends UserData {
  scores?: ScoreData;
  symptoms?: string[];
}

export const signUpUser = async (
  userData: UserData,
  password: string,
  scores?: ScoreData,
  symptoms?: string[]
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      password
    );

    try {
      const userProfile: UserProfile = {
        ...userData,
        scores: scores || {},
        symptoms: symptoms || []
      };

      await setDoc(doc(db, "users", userCredential.user.uid), userProfile);
    } catch (firestoreError) {
      console.error("Firestore error:", firestoreError);
    }

    return userCredential;
  } catch (error) {
    console.error("Error in signUpUser:", error);
    throw error;
  }
};

export const loginUser = async (
    email: string,
    password: string
  ): Promise<{ userCredential: UserCredential; userData: UserProfile | null }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const userData = userDoc.exists() ? userDoc.data() as UserProfile : null;

      return { userCredential, userData };
    } catch (error) {
      console.error("Error in loginUser:", error);
      throw error;
    }
};