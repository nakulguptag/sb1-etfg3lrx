import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Request, Department, RequestStatus } from '../types';

export const useRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);

  // Real-time listener to Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'guestRequests'), (snapshot) => {
      const data: Request[] = snapshot.docs.map((docSnap) => {
        const raw = docSnap.data() as any;

        return {
          id: docSnap.id,
          roomNumber: raw.roomNumber,
          department: raw.department,
          priority: raw.priority,
          description: raw.description,
          loggedBy: raw.loggedBy,
          status: raw.status,
          assignedTo: raw.assignedTo,
          resolutionComments: raw.resolutionComments || '',
          createdAt: raw.createdAt?.toDate?.() || new Date(),
          updatedAt: raw.updatedAt?.toDate?.() || new Date(),
          resolvedAt: raw.resolvedAt?.toDate?.() || undefined
        };
      });

      setRequests(data);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Add new guest request
  const addRequest = async (
    newRequest: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    await addDoc(collection(db, 'guestRequests'), {
      ...newRequest,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  };

  // Update request status
  const updateRequestStatus = async (
    id: string,
    status: RequestStatus,
    comments?: string
  ) => {
    const ref = doc(db, 'guestRequests', id);
    await updateDoc(ref, {
      status,
      updatedAt: Timestamp.now(),
      ...(status === 'Resolved' && {
        resolvedAt: Timestamp.now(),
        resolutionComments: comments || '',
      }),
    });
  };

  // Filter requests by department
  const getRequestsByDepartment = (department: Department) => {
    return requests.filter((req) => req.department === department);
  };

  // Get overdue requests (older than 15 minutes and not resolved)
  const getOverdueRequests = () => {
    const now = new Date();

    return requests.filter((req) => {
      if (req.status === 'Resolved') return false;

      const createdAt = req.createdAt instanceof Date
        ? req.createdAt
        : (req.createdAt as Timestamp).toDate?.() || new Date();

      const minutesElapsed = (now.getTime() - createdAt.getTime()) / (1000 * 60);
      return minutesElapsed > 15;
    });
  };

  return {
    requests,
    addRequest,
    updateRequestStatus,
    getRequestsByDepartment,
    getOverdueRequests,
  };
};
