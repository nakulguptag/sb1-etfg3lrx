import { useEffect } from 'react';
import { messaging, getToken, onMessage } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from '../types';

export function usePushNotifications(currentUser: User) {
  useEffect(() => {
    if (!('Notification' in window)) return;

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        getToken(messaging, {
          vapidKey: 'YOUR_VAPID_KEY_HERE',
        })
          .then((token) => {
            if (token) {
              console.log('✅ Push token:', token);
              // Save token with user + department info
              const ref = doc(db, 'pushTokens', currentUser.id);
              setDoc(ref, {
                token,
                userId: currentUser.id,
                name: currentUser.name,
                department: currentUser.department,
                createdAt: new Date()
              });
            }
          })
          .catch(console.error);

        onMessage(messaging, (payload) => {
          console.log('📩 Message received:', payload);
        });
      }
    });
  }, [currentUser]);
}