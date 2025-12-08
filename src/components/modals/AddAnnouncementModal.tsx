import React, { useState } from 'react';
import { X, Bell, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface AddAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (announcementData: AnnouncementFormData) => void;
  initialData?: AnnouncementFormData | null;
}

export interface AnnouncementFormData {
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'tenants' | 'specific';
  expiresAt?: string;
}

const AddAnnouncementModal: React.FC<AddAnnouncementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<AnnouncementFormData>(
    initialData || {
      title: '',
      message: '',
      priority: 'medium',
      targetAudience: 'all',
      expiresAt: '',
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof AnnouncementFormData, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name as keyof AnnouncementFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AnnouncementFormData, string>> = {};

    if (!formData.title.trim()) newErrors.title = 'Announcement title is required';
    if (!formData.message.trim()) newErrors.message = 'Announcement message is required';
    if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(formData);
    onClose();

    // Reset form
    setFormData({
      title: '',
      message: '',
      priority: 'medium',
      targetAudience: 'all',
      expiresAt: '',
    });
  };

  if (!isOpen) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 fade-in overflow-y-auto"
      onClick={onClose}
    >
      <Card
        padding="none"
        className="max-w-2xl w-full my-8 slide-up max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Bell className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {initialData ? 'Edit Announcement' : 'New Announcement'}
              </h2>
              <p className="text-sm text-slate-600">Share important updates with your tenants</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-slate-600" aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Title */}
            <Input
              label="Announcement Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Scheduled Maintenance on Saturday"
              error={errors.title}
              required
            />

            {/* Message */}
            <div>
              <label htmlFor="message" className="label">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className={`input ${errors.message ? 'input-error' : ''}`}
                placeholder="Write your announcement message here..."
                required
              />
              {errors.message && (
                <p className="mt-1.5 text-sm text-red-600">{errors.message}</p>
              )}
              <p className="mt-1.5 text-xs text-slate-500">
                {formData.message.length} characters
              </p>
            </div>

            {/* Priority & Target Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="label">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div>
                <label htmlFor="targetAudience" className="label">
                  Target Audience
                </label>
                <select
                  id="targetAudience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="all">All Users</option>
                  <option value="tenants">All Tenants</option>
                  <option value="specific">Specific Property</option>
                </select>
              </div>
            </div>

            {/* Expiration Date */}
            <Input
              label="Expires On (Optional)"
              name="expiresAt"
              type="datetime-local"
              value={formData.expiresAt}
              onChange={handleInputChange}
              helperText="Leave empty for announcement to remain active indefinitely"
            />

            {/* Preview */}
            <div>
              <label className="label mb-2 block">Preview</label>
              <div className={`border-2 rounded-lg p-4 ${getPriorityColor(formData.priority)}`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">
                      {formData.title || 'Announcement Title'}
                    </h3>
                    <p className="text-sm opacity-90">
                      {formData.message || 'Your announcement message will appear here...'}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs opacity-75">
                      <span className="font-medium uppercase">
                        {formData.priority} Priority
                      </span>
                      <span>•</span>
                      <span>To: {formData.targetAudience === 'all' ? 'All Users' : formData.targetAudience === 'tenants' ? 'All Tenants' : 'Specific Property'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <Button type="button" variant="secondary" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              fullWidth
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {initialData ? 'Update Announcement' : 'Post Announcement'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddAnnouncementModal;
