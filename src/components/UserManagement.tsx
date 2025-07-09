import React, { useState } from 'react';
import {
  Users, Plus, Edit2, Trash2, Shield, UserCheck, Eye, EyeOff
} from 'lucide-react';
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
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" /> User Management
        </h2>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditingUser(null);
            setShowAddForm(!showAddForm);
          }}
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={editingUser ? handleUpdateUser : handleAddUser} className="bg-white p-4 rounded-lg shadow space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Name" value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })} className="input" required />
            <input type="email" placeholder="Email" value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })} className="input" required />
            <select value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="input">
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <select value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value as Department })}
              className="input">
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <input type={showPasswords['form'] ? 'text' : 'password'} placeholder="Password"
              value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="input" />
            <input type={showPasswords['form'] ? 'text' : 'password'} placeholder="Confirm Password"
              value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} className="input" />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" onChange={() => togglePasswordVisibility('form')} />
                Show Password
              </label>
              <button type="button" onClick={generatePassword} className="ml-4 text-blue-500 hover:underline">Generate Password</button>
            </div>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              {editingUser ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {users.map(user => (
          <div key={user.id} className="bg-white border rounded p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email} | {user.department}</p>
              <span className={`inline-block mt-1 px-2 py-1 text-xs border rounded ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
            </div>
            <div className="flex gap-3 items-center">
              <button onClick={() => handleEditUser(user)} title="Edit">
                <Edit2 className="w-5 h-5 text-blue-500" />
              </button>
              <button onClick={() => handleToggleActive(user.id, user.isActive)} title="Toggle Active">
                <UserCheck className={`w-5 h-5 ${user.isActive ? 'text-green-600' : 'text-gray-400'}`} />
              </button>
              <button onClick={() => handleDeleteUser(user.id)} title="Delete">
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
