import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext";
import { SubscriptionGuard } from "./components/subscription/SubscriptionGuard";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Home from "./pages/Home";
import Progress from "./pages/Progress";
import Community from "./pages/Community";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import EditHabit from "./pages/EditHabit";
import EditProfile from "./pages/EditProfile";
import Challenges from "./pages/Challenges";
import Subscription from "./pages/Subscription";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useUser();
  
  if (loading) {
    return <Splash />;
  }
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useUser();
  
  if (loading) {
    return <Splash />;
  }
  
  if (session) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="w-full max-w-[414px] mx-auto min-h-screen bg-background shadow-2xl overflow-x-hidden">
        <Routes>
          <Route path="/splash" element={<Splash />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/" element={<ProtectedRoute><SubscriptionGuard><Home /></SubscriptionGuard></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><SubscriptionGuard><Progress /></SubscriptionGuard></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><SubscriptionGuard><Community /></SubscriptionGuard></ProtectedRoute>} />
          <Route path="/achievements" element={<ProtectedRoute><SubscriptionGuard><Achievements /></SubscriptionGuard></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><SubscriptionGuard><Profile /></SubscriptionGuard></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SubscriptionGuard><Settings /></SubscriptionGuard></ProtectedRoute>} />
          <Route path="/edit-habit/:id" element={<ProtectedRoute><SubscriptionGuard><EditHabit /></SubscriptionGuard></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><SubscriptionGuard><EditProfile /></SubscriptionGuard></ProtectedRoute>} />
          <Route path="/challenges" element={<ProtectedRoute><SubscriptionGuard><Challenges /></SubscriptionGuard></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
          <Route path="/privacy" element={<ProtectedRoute><SubscriptionGuard><Privacy /></SubscriptionGuard></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
