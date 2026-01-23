import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ProtectedRoute from "../components/common/ProtectedRoute";
import PublicRoute from "../components/common/PublicRoute";
import LoadingSpinner from "../components/common/LoadingSpinner";
import PageNotFound from "../pages/public/PageNotFound";

// Public
const LandingPage = lazy(() => import("../pages/public/LandingPage"));
const HowItWorksPage = lazy(() => import("../pages/public/HowItWorks"));
const HelpCenterPage = lazy(() => import("../pages/public/HelpCenterPage"));
const LoginPage = lazy(() => import("../pages/public/Login"));
const RegisterPage = lazy(() => import("../pages/public/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("../pages/public/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(
  () => import("../pages/public/ResetPasswordPage"),
);

// User / Common
const DashboardPage = lazy(() => import("../pages/protected/Dashboard"));
const ProfilePage = lazy(() => import("../pages/protected/ProfilePage"));
const SettingsPage = lazy(() => import("../pages/protected/SettingsPage"));
const NotificationsPage = lazy(
  () => import("../pages/protected/NotificationPage"),
);
const SchedulePickupPage = lazy(
  () => import("../pages/protected/SchedulePickupPage"),
);
const PickupListPage = lazy(() => import("../pages/admin/PickupsPage"));
const PickupDetailsPage = lazy(
  () => import("../pages/protected/SchedulePickupPage"),
);
import PaymentsPage from "../pages/admin/PaymentsPage";
const ReportsPage = lazy(() => import("../pages/admin/ReportPage"));

// Driver
const DriverDashboardPage = lazy(
  () => import("../pages/driver/DriverDashboardPage"),
);
const DriverPickupsPage = lazy(
  () => import("../pages/driver/DriverPickupsPage"),
);
const AvailablePickupsPage = lazy(
  () => import("../pages/driver/AvailablePickupsPage"),
);
const DriverProfilePage = lazy(
  () => import("../pages/driver/DriverProfilePage"),
);
const DriverPerformancePage = lazy(
  () => import("../pages/driver/DriverPerformancePage"),
);
const EarningsPage = lazy(() => import("../pages/driver/EarningsPage"));

// Admin
const AdminDashboardPage = lazy(() => import("../pages/admin/AdminDashboard"));
const UsersManagementPage = lazy(
  () => import("../pages/admin/UsersManagementPage"),
);
const PickupsManagementPage = lazy(
  () => import("../pages/admin/PickupsManagementPage"),
);
const DriversManagementPage = lazy(
  () => import("../pages/admin/DriversManagementPage"),
);

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

const AppRoutes = () => {
  const { isLoading } = useAuth();
  if (isLoading) return <PageLoader />;

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/help" element={<HelpCenterPage />} />

        <Route element={<PublicRoute restrictAuthenticated />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
        </Route>

        {/* Common Protected */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["user", "driver", "admin"]} />
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/payment" element={<PaymentsPage />} />
        </Route>

        {/* User */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/schedule-pickup" element={<SchedulePickupPage />} />
          <Route path="/pickups" element={<PickupListPage />} />
          <Route path="/pickups/:id" element={<PickupDetailsPage />} />
          <Route path="/payment/:pickupId" element={<PaymentsPage />} />
        </Route>

        {/* Driver */}
        <Route element={<ProtectedRoute allowedRoles={["driver"]} />}>
          <Route path="/driver" element={<DriverDashboardPage />} />
          <Route path="/driver/pickups" element={<DriverPickupsPage />} />
          <Route path="/driver/available" element={<AvailablePickupsPage />} />
          <Route path="/driver/profile" element={<DriverProfilePage />} />
          <Route path="/driver/stats" element={<DriverPerformancePage />} />
          <Route path="/driver/earnings" element={<EarningsPage />} />
          <Route path="/driver/pickup/:id" element={<PickupDetailsPage />} />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UsersManagementPage />} />
          <Route path="/admin/pickups" element={<PickupsManagementPage />} />
          <Route path="/admin/drivers" element={<DriversManagementPage />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
