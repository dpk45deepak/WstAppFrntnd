import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { usePickup } from "../../hooks/usePickup";
import { useToast } from "../../hooks/useToast";
import { Calendar, Package, Clock, CheckCircle } from "lucide-react";
// import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import PickupCard from "../../components/pickup/PickupCard";
import LinkButton from "../../components/common/LinkButton";
import type { Pickup } from "../../types";

const DashboardPage = () => {
  const { user } = useAuth();
  const { getPickups } = usePickup();
  const { showToast } = useToast();
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      setLoading(true);
      const data = await getPickups();
      setPickups(data.slice(0, 5));
    } catch {
      showToast("Failed to fetch pickups", "error");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Pickups",
      value: pickups.length.toString(),
      icon: <Package className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "Scheduled",
      value: pickups.filter(p => p.status === "scheduled").length.toString(),
      icon: <Calendar className="w-6 h-6 text-yellow-600" />,
      color: "bg-yellow-50",
    },
    {
      title: "In Progress",
      value: pickups.filter(p => p.status === "in_progress").length.toString(),
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-50",
    },
    {
      title: "Completed",
      value: pickups.filter(p => p.status === "completed").length.toString(),
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      color: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your waste pickups today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <LinkButton
          to="/schedule-pickup"
          size="lg"
          className="flex-1"
        >
          Schedule New Pickup
        </LinkButton>

        <LinkButton
          to="/pickups"
          size="lg"
          variant="outline"
          className="flex-1"
        >
          View All Pickups
        </LinkButton>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Pickups */}
      <Card padding="lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recent Pickups</h2>
          <LinkButton to="/pickups" size="sm" variant="outline">
            View All
          </LinkButton>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-2 text-gray-600">Loading pickups...</p>
          </div>
        ) : pickups.length > 0 ? (
          <div className="space-y-4">
            {pickups.map(pickup => (
              <PickupCard key={pickup.id} pickup={pickup} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No pickups yet
            </h3>
            <p className="text-gray-600 mb-4">
              Schedule your first waste pickup!
            </p>
            <LinkButton to="/schedule-pickup">
              Schedule Pickup
            </LinkButton>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;
