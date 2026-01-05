import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { usePickup } from '../../hooks/usePickup';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { Calendar, MapPin, Package, MessageSquare } from 'lucide-react';

const scheduleSchema = z.object({
  pickupDate: z.string().min(1, 'Pickup date is required'),
  pickupTime: z.string().min(1, 'Pickup time is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  wasteType: z.enum(['general', 'recyclable', 'hazardous', 'organic']),
  notes: z.string().optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

const SchedulePickupPage = () => {
  const { schedulePickup } = usePickup();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
  });

  const onSubmit = async (data: ScheduleFormData) => {
    setLoading(true);
    try {
      // Combine date and time
      const pickupDateTime = new Date(`${data.pickupDate}T${data.pickupTime}`);
      
      await schedulePickup({
        pickupDate: pickupDateTime.toISOString(),
        address: data.address,
        wasteType: data.wasteType,
        notes: data.notes,
      });
      
      showToast('Pickup scheduled successfully!', 'success');
      navigate('/pickups');
    } catch (error: any) {
      showToast(error.message || 'Failed to schedule pickup', 'error');
    } finally {
      setLoading(false);
    }
  };

  const wasteTypes = [
    { value: 'general', label: 'General Waste', icon: '🗑️', description: 'Household waste' },
    { value: 'recyclable', label: 'Recyclable', icon: '♻️', description: 'Paper, plastic, metal' },
    { value: 'hazardous', label: 'Hazardous', icon: '⚠️', description: 'Chemicals, batteries' },
    { value: 'organic', label: 'Organic', icon: '🌿', description: 'Food waste, yard trimmings' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <Card padding="lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Schedule Pickup</h1>
          <p className="text-gray-600 mt-2">Provide details for your waste pickup</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Date & Time */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Pickup Date
              </label>
              <Input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                error={errors.pickupDate?.message}
                {...register('pickupDate')}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Pickup Time
              </label>
              <Input
                type="time"
                error={errors.pickupTime?.message}
                {...register('pickupTime')}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              Pickup Address
            </label>
            <Input
              placeholder="123 Main St, City, State, ZIP"
              error={errors.address?.message}
              {...register('address')}
            />
          </div>

          {/* Waste Type */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-4">
              <Package className="w-4 h-4 mr-2" />
              Type of Waste
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {wasteTypes.map((type) => (
                <label
                  key={type.value}
                  className={`
                    relative flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all
                    hover:border-blue-500 hover:bg-blue-50
                    ${errors.wasteType ? 'border-red-300' : 'border-gray-200'}
                  `}
                >
                  <input
                    type="radio"
                    value={type.value}
                    className="sr-only"
                    {...register('wasteType')}
                  />
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <span className="font-medium text-sm">{type.label}</span>
                  <span className="text-xs text-gray-500 text-center mt-1">
                    {type.description}
                  </span>
                </label>
              ))}
            </div>
            {errors.wasteType && (
              <p className="mt-2 text-sm text-red-600">{errors.wasteType.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 mr-2" />
              Additional Notes (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Any special instructions for the driver..."
              {...register('notes')}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
              size="lg"
            >
              Schedule Pickup
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SchedulePickupPage;