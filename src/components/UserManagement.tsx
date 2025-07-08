import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Shield, UserCheck, Eye, EyeOff } from 'lucide-react';
import { User, UserRole, Department } from '../types';
import { useUsers } from '../hooks/useUsers';

interface UserManagementProps {
  currentUser: User;
}

const departments: Department[] = ['Housekeeping', 'Engineering', 'F&B', 'Front Desk', 'Maintenance'];
const roles: UserRole[] = ['Staff', 'Supervisor', 'Manager', 'Admin'];

export const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const { users, addUser, updateUser, deleteUser, toggleUserActive } = useUsers();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Staff' as UserRole,
    department: 'Front Desk' as Department,
    password: '',
    confirmPassword: ''
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    await addUser({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      isActive: true,
      createdAt: new Date(),
      lastLogin: null
    });

    setFormData({
      name: '',
      email: '',
      role: 'Staff',
      department: 'Front Desk',
      password: '',
      confirmPassword: ''
    });
    setShowAddForm(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      password: '',
      confirmPassword: ''
    });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    await updateUser(editingUser.id, {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      department: formData.department
    });

    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'Staff',
      department: 'Front Desk',
      password: '',
      confirmPassword: ''
    });
  };

  const handleToggleActive = async (userId: string, currentState: boolean) => {
    await toggleUserActive(userId, currentState);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(userId);
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Supervisor': return 'bg-green-100 text-green-800 border-green-200';
      case 'Staff': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password, confirmPassword: password }));
  };

  if (currentUser.role !== 'Admin') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="text-center py-8">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Access Restricted</h3>
          <p className="text-gray-600">Only administrators can manage user accounts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rest of your UI remains the same */}
    </div>
  );
};
