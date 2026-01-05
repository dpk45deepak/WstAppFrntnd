import { Calendar, MapPin, Package, Clock } from 'lucide-react';
import type { Pickup } from '../../types';
import { format } from 'date-fns';
import Button from '../common/Button';

interface PickupCardProps {
  pickup: Pickup;
  showActions?: boolean;
  onAction?: (action: string, pickupId: string) => void;
}

const PickupCard = ({ pickup, showActions = false, onAction }: PickupCardProps) => {
  const statusColors = {
    scheduled: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const wasteTypeIcons = {
    general: '🗑️',
    recyclable: '♻️',
    hazardous: '⚠️',
    organic: '🌿',
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{wasteTypeIcons[pickup.wasteType]}</span>
              <span className="font-medium capitalize">{pickup.wasteType} Waste</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[pickup.status]}`}>
              {pickup.status.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {format(new Date(pickup.pickupDate), 'MMM dd, yyyy')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {format(new Date(pickup.pickupDate), 'hh:mm a')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 truncate" title={pickup.address}>
                {pickup.address}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 capitalize">
                {pickup.status}
              </span>
            </div>
          </div>

          {pickup.notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                <strong>Notes:</strong> {pickup.notes}
              </p>
            </div>
          )}
        </div>

        {showActions && onAction && (
          <div className="flex flex-col gap-2 min-w-[120px]">
            {pickup.status === 'scheduled' && (
              <>
                <Button size="sm" onClick={() => onAction('start', pickup.id)}>
                  Start Pickup
                </Button>
                <Button variant="outline" size="sm" onClick={() => onAction('cancel', pickup.id)}>
                  Cancel
                </Button>
              </>
            )}
            {pickup.status === 'in_progress' && (
              <Button size="sm" onClick={() => onAction('complete', pickup.id)}>
                Mark Complete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupCard;