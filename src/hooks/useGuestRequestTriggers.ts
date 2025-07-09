import { useEffect } from 'react';
import { onSnapshot, Timestamp, collection, getDocs } from 'firebase/firestore';
import { db, notificationRulesCollection } from '../firebase';
import { useNotification } from '../context/NotificationContext';

interface GuestRequest {
  id: string;
  createdAt: Timestamp;
  department: string;
  priority: 'Low' | 'Medium' | 'High';
  status: string;
}

interface NotificationRule {
  id: string;
  name: string;
  department: string; // "All" or specific
  priority: string;   // "All" or "High" | "Medium" | "Low"
  triggerTime: number;
  escalationTime: number;
  notifyRoles: string[];
  methods: { type: 'email' | 'push'; enabled: boolean }[];
  isActive: boolean;
}

export function useGuestRequestTriggers() {
  const { addNotification, openPanel } = useNotification(); // ✅ Access in-app notification context

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'guestRequests'), async (snapshot) => {
      const rulesSnapshot = await getDocs(notificationRulesCollection);

      const rules: NotificationRule[] = rulesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as NotificationRule[];

      const now = Date.now();

      snapshot.docChanges().forEach(change => {
        const data = change.doc.data() as GuestRequest;
        const createdAt = data.createdAt?.toDate?.();

        if (!createdAt || data.status === 'Resolved') return;

        const ageInMinutes = (now - createdAt.getTime()) / (1000 * 60);

        rules.forEach(rule => {
          const matchesDepartment = rule.department === 'All' || rule.department === data.department;
          const matchesPriority = rule.priority === 'All' || rule.priority === data.priority;
          const isTriggered = ageInMinutes >= rule.triggerTime;

          if (rule.isActive && matchesDepartment && matchesPriority && isTriggered) {
            rule.methods.forEach(method => {
              if (!method.enabled) return;

              if (method.type === 'email') {
                triggerEmailNotification(data, rule);
              } else if (method.type === 'push') {
                const message = `🔔 ${rule.name}: ${data.department} - ${data.priority} request`;
                addNotification(message); // ✅ Adds to panel
                openPanel();              // ✅ Opens slide-in panel
              }
            });
          }
        });
      });
    });

    return () => unsubscribe(); // ✅ Cleanup on unmount
  }, [addNotification, openPanel]);
}

// ✅ Basic email trigger (you can delete this if not using emails)
function triggerEmailNotification(request: GuestRequest, rule: NotificationRule) {
  fetch('/api/send-email', {
    method: 'POST',
    body: JSON.stringify({
      subject: `[GRM] ${rule.name}`,
      message: `A guest request in ${request.department} with priority ${request.priority} has triggered an alert.`,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
