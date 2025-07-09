import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { User, NewUser } from '../types';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const data = snapshot.docs.map((docSnap) => {
        const raw = docSnap.data() as Partial<User>;

        const createdAt =
          raw.createdAt instanceof Timestamp
            ? raw.createdAt.toDate()
            : new Date();

        const updatedAt =
          raw.updatedAt instanceof Timestamp
            ? raw.updatedAt.toDate()
            : createdAt;

        const lastLogin =
          raw.lastLogin instanceof Timestamp
            ? raw.lastLogin.toDate()
            : null;

        const user: User = {
          id: docSnap.id,
          name: raw.name ?? '',
          email: raw.email ?? '',
          role: raw.role ?? 'Staff',
          department: raw.department ?? 'Front Desk',
          isActive: raw.isActive ?? false,
          createdAt,
          updatedAt,
          lastLogin,
        };

        return user;
      });

      const sorted = data.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );

      setUsers(sorted);
    });

    return () => unsubscribe();
  }, []);

  const addUser = async (newUser: NewUser) => {
    try {
      await addDoc(collection(db, 'users'), {
        ...newUser,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastLogin: null,
      });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const updateUser = async (id: string, updatedFields: Partial<User>) => {
    try {
      const ref = doc(db, 'users', id);
      await updateDoc(ref, {
        ...updatedFields,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const toggleUserActive = async (id: string, currentState: boolean) => {
    try {
      const ref = doc(db, 'users', id);
      await updateDoc(ref, {
        isActive: !currentState,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error toggling user active status:', error);
    }
  };

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
    toggleUserActive,
  };
};
