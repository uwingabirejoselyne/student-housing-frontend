import React, { useState } from 'react';
import { X, User, Wrench, DollarSign, Calendar, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface AssignTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (assignmentData: AssignmentData) => void;
  requestDetails: {
    id: number;
    issue: string;
    tenantName: string;
    property: string;
    unit: string;
    category: string;
    priority: string;
  };
}

export interface AssignmentData {
  technicianId: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedCost: number;
  notes: string;
}

const technicians = [
  { id: '1', name: 'John Technician', specialty: 'General', rating: 4.8, completedJobs: 156, available: true },
  { id: '2', name: 'Mike Electrician', specialty: 'Electrical', rating: 4.9, completedJobs: 203, available: true },
  { id: '3', name: 'Paul Locksmith', specialty: 'Security', rating: 4.7, completedJobs: 98, available: false },
  { id: '4', name: 'Sarah Plumber', specialty: 'Plumbing', rating: 4.9, completedJobs: 187, available: true },
  { id: '5', name: 'David HVAC Tech', specialty: 'HVAC', rating: 4.6, completedJobs: 142, available: true },
];

const AssignTechnicianModal: React.FC<AssignTechnicianModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  requestDetails,
}) => {
  const [formData, setFormData] = useState<AssignmentData>({
    technicianId: '',
    scheduledDate: '',
    scheduledTime: '',
    estimatedCost: 0,
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AssignmentData, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedCost' ? parseFloat(value) || 0 : value,
    }));

    if (errors[name as keyof AssignmentData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleTechnicianSelect = (technicianId: string) => {
    setFormData(prev => ({ ...prev, technicianId }));
    if (errors.technicianId) {
      setErrors(prev => ({ ...prev, technicianId: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AssignmentData, string>> = {};

    if (!formData.technicianId) newErrors.technicianId = 'Please select a technician';
    if (!formData.scheduledDate) newErrors.scheduledDate = 'Scheduled date is required';
    if (!formData.scheduledTime) newErrors.scheduledTime = 'Scheduled time is required';
    if (formData.estimatedCost <= 0) newErrors.estimatedCost = 'Please provide a cost estimate';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onAssign(formData);
    onClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-orange-600 bg-orange-50';
      case 'low':
        return 'text-slate-600 bg-slate-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 fade-in overflow-y-auto"
      onClick={onClose}
    >
      <Card
        padding="none"
        className="max-w-3xl w-full my-8 slide-up max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-orange-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Wrench className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Assign Technician</h2>
              <p className="text-sm text-slate-600">Schedule maintenance work</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-slate-600" aria-hidden="true" />
          </button>
        </div>

        {/* Request Summary */}
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Request Details</h3>
          <div className="bg-white rounded-lg p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-900">{requestDetails.issue}</p>
                <p className="text-sm text-slate-600 mt-1">
                  {requestDetails.property} - {requestDetails.unit}
                </p>
                <p className="text-sm text-slate-600">Tenant: {requestDetails.tenantName}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="neutral">{requestDetails.category}</Badge>
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(requestDetails.priority)}`}>
                  {requestDetails.priority.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Select Technician */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-600" aria-hidden="true" />
                  Select Technician
                </h3>
                {errors.technicianId && (
                  <p className="text-sm text-red-600">{errors.technicianId}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {technicians.map((tech) => (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => handleTechnicianSelect(tech.id)}
                    disabled={!tech.available}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.technicianId === tech.id
                        ? 'border-orange-600 bg-orange-50'
                        : tech.available
                        ? 'border-slate-200 bg-white hover:border-orange-300'
                        : 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold shadow-md">
                          {tech.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{tech.name}</p>
                          <p className="text-sm text-slate-600">{tech.specialty}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span>⭐ {tech.rating}</span>
                            <span>•</span>
                            <span>{tech.completedJobs} jobs</span>
                          </div>
                        </div>
                      </div>
                      {tech.available ? (
                        <Badge variant="success">Available</Badge>
                      ) : (
                        <Badge variant="neutral">Busy</Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" aria-hidden="true" />
                Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Scheduled Date"
                  name="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={handleInputChange}
                  error={errors.scheduledDate}
                  icon={Calendar}
                  required
                />

                <Input
                  label="Scheduled Time"
                  name="scheduledTime"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={handleInputChange}
                  error={errors.scheduledTime}
                  icon={Clock}
                  required
                />
              </div>
            </div>

            {/* Cost Estimate */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-600" aria-hidden="true" />
                Cost Estimate
              </h3>
              <Input
                label="Estimated Cost (RWF)"
                name="estimatedCost"
                type="number"
                value={formData.estimatedCost}
                onChange={handleInputChange}
                min="0"
                error={errors.estimatedCost}
                helperText="Approximate cost for parts and labor"
                required
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="notes" className="label">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="input"
                placeholder="Any special instructions or notes for the technician..."
              />
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
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Assign Technician
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AssignTechnicianModal;
