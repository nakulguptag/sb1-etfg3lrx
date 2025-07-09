import React, { useEffect, useState } from 'react';
import { Bell, AlertTriangle } from 'lucide-react';
import {
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import { db, notificationRulesCollection } from '../firebase';
import { Department, UserRole } from '../types';

interface NotificationRule {
  id: string;
  name: string;
  department: Department | 'All';
  priority: 'Low' | 'Medium' | 'High' | 'All';
  triggerTime: number;
  escalationTime: number;
  notifyRoles: UserRole[];
  methods: NotificationMethod[];
  isActive: boolean;
}

interface NotificationMethod {
  type: 'email' | 'push';
  enabled: boolean;
}

interface NotificationSettingsProps {
  currentUser: {
    role: UserRole;
  };
}

const departments: (Department | 'All')[] = ['All', 'Housekeeping', 'Engineering', 'F&B', 'Front Desk', 'Maintenance'];
const roles: UserRole[] = ['Staff', 'Supervisor', 'Manager', 'Admin'];
const priorities = ['All', 'Low', 'Medium', 'High'];

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ currentUser }) => {
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [formData, setFormData] = useState<Omit<NotificationRule, 'id'>>({
    name: '',
    department: 'All',
    priority: 'Medium',
    triggerTime: 15,
    escalationTime: 30,
    notifyRoles: ['Supervisor'],
    methods: [
      { type: 'email', enabled: true },
      { type: 'push', enabled: true }
    ],
    isActive: true
  });
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  // 🔄 Real-time syncing with Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(notificationRulesCollection, (snapshot) => {
      const fetchedRules: NotificationRule[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NotificationRule[];
      setRules(fetchedRules);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    const ruleData = {
      ...formData,
      methods: formData.methods.filter(m => ['email', 'push'].includes(m.type)) // Just to be safe
    };

    try {
      if (editingRuleId) {
        const docRef = doc(db, 'notificationRules', editingRuleId);
        await updateDoc(docRef, ruleData);
      } else {
        await addDoc(notificationRulesCollection, ruleData);
      }
      resetForm();
    } catch (err) {
      console.error("Failed to save rule:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      department: 'All',
      priority: 'Medium',
      triggerTime: 15,
      escalationTime: 30,
      notifyRoles: ['Supervisor'],
      methods: [
        { type: 'email', enabled: true },
        { type: 'push', enabled: true }
      ],
      isActive: true
    });
    setEditingRuleId(null);
  };

  const toggleRule = async (id: string, current: boolean) => {
    try {
      const ref = doc(db, 'notificationRules', id);
      await updateDoc(ref, { isActive: !current });
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const editRule = (rule: NotificationRule) => {
    const { id, ...rest } = rule;
    setFormData(rest);
    setEditingRuleId(id);
  };

  const deleteRule = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notificationRules', id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const updateMethodEnabled = (type: 'email' | 'push', enabled: boolean) => {
    setFormData(prev => ({
      ...prev,
      methods: prev.methods.map(m => (m.type === type ? { ...m, enabled } : m))
    }));
  };

  if (currentUser.role !== 'Admin' && currentUser.role !== 'Manager') {
    return (
      <div className="p-4 border rounded bg-yellow-50 text-yellow-700">
        <AlertTriangle className="inline-block mr-2" />
        Only Admins and Managers can view this page.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Bell className="w-5 h-5 text-blue-600" /> Notification Settings
      </h2>

      {/* Rules List */}
      {rules.map(rule => (
        <div key={rule.id} className="border rounded p-4 bg-white shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <strong>{rule.name}</strong> — {rule.department}, {rule.priority}
              <div className="text-sm text-gray-500">
                Notify: {rule.notifyRoles.join(', ')}
              </div>
              <div className="text-xs text-gray-400">
                Methods: {rule.methods.filter(m => m.enabled).map(m => m.type).join(', ')}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => editRule(rule)} className="text-blue-600">Edit</button>
              <button onClick={() => toggleRule(rule.id, rule.isActive)} className="text-orange-600">
                {rule.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => deleteRule(rule.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        </div>
      ))}

      {/* Form */}
      <div className="p-4 border rounded bg-gray-50 space-y-4">
        <h3 className="font-semibold text-gray-700">
          {editingRuleId ? 'Edit Rule' : 'New Rule'}
        </h3>

        <input
          className="w-full border rounded p-2"
          placeholder="Rule Name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-2">
          <select
            className="border rounded p-2"
            value={formData.department}
            onChange={e => setFormData({ ...formData, department: e.target.value as Department })}
          >
            {departments.map(dep => <option key={dep}>{dep}</option>)}
          </select>

          <select
            className="border rounded p-2"
            value={formData.priority}
            onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
          >
            {priorities.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={1}
            className="border rounded p-2"
            placeholder="Trigger Time"
            value={formData.triggerTime}
            onChange={e => setFormData({ ...formData, triggerTime: parseInt(e.target.value) })}
          />
          <input
            type="number"
            min={1}
            className="border rounded p-2"
            placeholder="Escalation Time"
            value={formData.escalationTime}
            onChange={e => setFormData({ ...formData, escalationTime: parseInt(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Notify Roles:</label>
          <div className="grid grid-cols-2 gap-2">
            {roles.map(role => (
              <label key={role} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={formData.notifyRoles.includes(role)}
                  onChange={e => {
                    const updated = e.target.checked
                      ? [...formData.notifyRoles, role]
                      : formData.notifyRoles.filter(r => r !== role);
                    setFormData({ ...formData, notifyRoles: updated });
                  }}
                />
                {role}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Methods:</label>
          <div className="flex gap-4">
            {formData.methods.map(method => (
              <label key={method.type} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={method.enabled}
                  onChange={e => updateMethodEnabled(method.type, e.target.checked)}
                />
                {method.type}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingRuleId ? 'Update' : 'Create'} Rule
        </button>
      </div>
    </div>
  );
};
