import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="max-w-[414px] mx-auto min-h-screen bg-background shadow-2xl">
        <Routes>
          <Route path="/splash" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/community" element={<Community />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/edit-habit/:id" element={<EditHabit />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
