import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { User } from '../types';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const data: User[] = snapshot.docs.map((docSnap) => {
        const raw = docSnap.data();
        return {
          id: docSnap.id,
          name: raw.name,
          email: raw.email,
          role: raw.role,
          department: raw.department,
          isActive: raw.isActive,
          createdAt: raw.createdAt?.toDate?.() || new Date(),
          lastLogin: raw.lastLogin?.toDate?.() || null
        };
      });
      setUsers(data);
    });

    return () => unsubscribe();
  }, []);

  const addUser = async (newUser: Omit<User, 'id'>) => {
    await addDoc(collection(db, 'users'), {
      ...newUser,
      createdAt: Timestamp.now(),
    });
  };

  const updateUser = async (id: string, updatedFields: Partial<User>) => {
    const ref = doc(db, 'users', id);
    await updateDoc(ref, {
      ...updatedFields,
      updatedAt: Timestamp.now()
    });
  };

  const deleteUser = async (id: string) => {
    await deleteDoc(doc(db, 'users', id));
  };

  const toggleUserActive = async (id: string, currentState: boolean) => {
    const ref = doc(db, 'users', id);
    await updateDoc(ref, {
      isActive: !currentState,
      updatedAt: Timestamp.now()
    });
  };

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
    toggleUserActive
  };
};
