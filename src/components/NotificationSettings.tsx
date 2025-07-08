import React, { useState } from 'react';
import { Bell, Clock, Mail, MessageSquare, Phone, Settings, Save, AlertTriangle } from 'lucide-react';
import { Department, UserRole } from '../types';

interface NotificationRule {
  id: string;
  name: string;
  department: Department | 'All';
  priority: 'Low' | 'Medium' | 'High' | 'All';
  triggerTime: number; // minutes
  escalationTime: number; // minutes
  notifyRoles: UserRole[];
  methods: NotificationMethod[];
  isActive: boolean;
}

interface NotificationMethod {
  type: 'email' | 'sms' | 'push' | 'slack' | 'teams' | 'webhook';
  enabled: boolean;
  config?: Record<string, any>;
}

interface NotificationSettingsProps {
  currentUser: any;
}

const departments: (Department | 'All')[] = ['All', 'Housekeeping', 'Engineering', 'F&B', 'Front Desk', 'Maintenance'];
const roles: UserRole[] = ['Staff', 'Supervisor', 'Manager', 'Admin'];
const priorities = ['All', 'Low', 'Medium', 'High'];

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ currentUser }) => {
  const [rules, setRules] = useState<NotificationRule[]>([
    {
      id: '1',
      name: 'High Priority Immediate Alert',
      department: 'All',
      priority: 'High',
      triggerTime: 5,
      escalationTime: 15,
      notifyRoles: ['Supervisor', 'Manager'],
      methods: [
        { type: 'email', enabled: true },
        { type: 'sms', enabled: true },
        { type: 'push', enabled: true }
      ],
      isActive: true
    },
    {
      id: '2',
      name: 'Standard Request Alert',
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
    },
    {
      id: '3',
      name: 'Engineering Emergency',
      department: 'Engineering',
      priority: 'High',
      triggerTime: 2,
      escalationTime: 10,
      notifyRoles: ['Supervisor', 'Manager', 'Admin'],
      methods: [
        { type: 'email', enabled: true },
        { type: 'sms', enabled: true },
        { type: 'push', enabled: true },
        { type: 'slack', enabled: true }
      ],
      isActive: true
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null);
  const [formData, setFormData] = useState<Partial<NotificationRule>>({
    name: '',
    department: 'All',
    priority: 'Medium',
    triggerTime: 15,
    escalationTime: 30,
    notifyRoles: ['Supervisor'],
    methods: [
      { type: 'email', enabled: true },
      { type: 'push', enabled: false },
      { type: 'sms', enabled: false },
      { type: 'slack', enabled: false },
      { type: 'teams', enabled: false },
      { type: 'webhook', enabled: false }
    ],
    isActive: true
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    email: {
      smtpServer: 'smtp.hotel.com',
      smtpPort: 587,
      username: 'notifications@hotel.com',
      password: '••••••••',
      fromAddress: 'Hotel Operations <notifications@hotel.com>'
    },
    sms: {
      provider: 'twilio',
      accountSid: 'AC••••••••••••••••••••••••••••••••',
      authToken: '••••••••••••••••••••••••••••••••',
      fromNumber: '+1234567890'
    },
    slack: {
      webhookUrl: 'https://hooks.slack.com/services/••••••••••••••••••••••••••••••••',
      channel: '#hotel-operations',
      botName: 'Hotel Operations Bot'
    },
    teams: {
      webhookUrl: 'https://outlook.office.com/webhook/••••••••••••••••••••••••••••••••',
      channelName: 'Hotel Operations'
    },
    webhook: {
      url: 'https://api.hotel.com/notifications',
      secret: '••••••••••••••••••••••••••••••••',
      method: 'POST'
    }
  });

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRule) {
      setRules(prev => prev.map(rule => 
        rule.id === editingRule.id 
          ? { ...formData, id: editingRule.id } as NotificationRule
          : rule
      ));
    } else {
      const newRule: NotificationRule = {
        ...formData,
        id: Date.now().toString()
      } as NotificationRule;
      setRules(prev => [...prev, newRule]);
    }

    resetForm();
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingRule(null);
    setFormData({
      name: '',
      department: 'All',
      priority: 'Medium',
      triggerTime: 15,
      escalationTime: 30,
      notifyRoles: ['Supervisor'],
      methods: [
        { type: 'email', enabled: true },
        { type: 'push', enabled: false },
        { type: 'sms', enabled: false },
        { type: 'slack', enabled: false },
        { type: 'teams', enabled: false },
        { type: 'webhook', enabled: false }
      ],
      isActive: true
    });
  };

  const handleEditRule = (rule: NotificationRule) => {
    setEditingRule(rule);
    setFormData(rule);
    setShowAddForm(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this notification rule?')) {
      setRules(prev => prev.filter(rule => rule.id !== ruleId));
    }
  };

  const toggleRuleActive = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const updateMethodEnabled = (methodType: string, enabled: boolean) => {
    setFormData(prev => ({
      ...prev,
      methods: prev.methods?.map(method => 
        method.type === methodType ? { ...method, enabled } : method
      )
    }));
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <Phone className="w-4 h-4" />;
      case 'push': return <Bell className="w-4 h-4" />;
      case 'slack': return <MessageSquare className="w-4 h-4" />;
      case 'teams': return <MessageSquare className="w-4 h-4" />;
      case 'webhook': return <Settings className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (currentUser.role !== 'Admin' && currentUser.role !== 'Manager') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="text-center py-8">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Access Restricted</h3>
          <p className="text-gray-600">Only administrators and managers can configure notification settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Notification Settings</h2>
              <p className="text-sm text-gray-600">Configure automated alerts and escalation rules</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Bell className="w-4 h-4" />
            Add Rule
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Active Rules</p>
                <p className="text-2xl font-bold text-blue-800">{rules.filter(r => r.isActive).length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Rules</p>
                <p className="text-2xl font-bold text-green-800">{rules.length}</p>
              </div>
              <Settings className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Avg Trigger Time</p>
                <p className="text-2xl font-bold text-orange-800">
                  {Math.round(rules.reduce((acc, r) => acc + r.triggerTime, 0) / rules.length)}m
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Notification Rules</h3>
          {rules.map(rule => (
            <div key={rule.id} className={`border rounded-lg p-4 ${rule.isActive ? 'border-gray-200 bg-white' : 'border-gray-300 bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium text-gray-800">{rule.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rule.priority)}`}>
                    {rule.priority}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {rule.department}
                  </span>
                  {!rule.isActive && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditRule(rule)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    title="Edit rule"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleRuleActive(rule.id)}
                    className={`p-1 rounded ${rule.isActive ? 'text-orange-600 hover:bg-orange-100' : 'text-green-600 hover:bg-green-100'}`}
                    title={rule.isActive ? 'Deactivate rule' : 'Activate rule'}
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                    title="Delete rule"
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Trigger Time</p>
                  <p className="font-medium">{rule.triggerTime} minutes</p>
                </div>
                <div>
                  <p className="text-gray-600">Escalation Time</p>
                  <p className="font-medium">{rule.escalationTime} minutes</p>
                </div>
                <div>
                  <p className="text-gray-600">Notify Roles</p>
                  <p className="font-medium">{rule.notifyRoles.join(', ')}</p>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-gray-600 text-sm mb-2">Notification Methods</p>
                <div className="flex gap-2">
                  {rule.methods.filter(m => m.enabled).map(method => (
                    <span key={method.type} className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {getMethodIcon(method.type)}
                      {method.type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Integration Settings</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Configuration
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Server</label>
                <input
                  type="text"
                  value={integrationSettings.email.smtpServer}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                  <input
                    type="number"
                    value={integrationSettings.email.smtpPort}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={integrationSettings.email.username}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SMS Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              SMS Configuration (Twilio)
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account SID</label>
                <input
                  type="text"
                  value={integrationSettings.sms.accountSid}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Number</label>
                <input
                  type="text"
                  value={integrationSettings.sms.fromNumber}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Slack Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Slack Integration
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                <input
                  type="text"
                  value={integrationSettings.slack.webhookUrl}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                <input
                  type="text"
                  value={integrationSettings.slack.channel}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Webhook Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Custom Webhook
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                <input
                  type="text"
                  value={integrationSettings.webhook.url}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                <select
                  value={integrationSettings.webhook.method}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled
                >
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Rule Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingRule ? 'Edit Notification Rule' : 'Add New Notification Rule'}
            </h3>
            
            <form onSubmit={handleSaveRule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as Department | 'All' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trigger Time (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.triggerTime}
                    onChange={(e) => setFormData({ ...formData, triggerTime: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Escalation Time (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.escalationTime}
                    onChange={(e) => setFormData({ ...formData, escalationTime: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notify Roles</label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map(role => (
                    <label key={role} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.notifyRoles?.includes(role)}
                        onChange={(e) => {
                          const newRoles = e.target.checked
                            ? [...(formData.notifyRoles || []), role]
                            : (formData.notifyRoles || []).filter(r => r !== role);
                          setFormData({ ...formData, notifyRoles: newRoles });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Methods</label>
                <div className="grid grid-cols-2 gap-2">
                  {formData.methods?.map(method => (
                    <label key={method.type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={method.enabled}
                        onChange={(e) => updateMethodEnabled(method.type, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="flex items-center gap-1 text-sm text-gray-700">
                        {getMethodIcon(method.type)}
                        {method.type.charAt(0).toUpperCase() + method.type.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingRule ? 'Update Rule' : 'Create Rule'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};