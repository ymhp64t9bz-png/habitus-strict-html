import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timer);
    };
    
    checkAuth();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gradient-primary text-white text-center p-5">
      <img src={logo} alt="Habitus Logo" className="w-32 h-32 mb-5 animate-fade-in" />
      <h1 className="text-5xl font-bold mb-2">Habitus</h1>
      <p className="text-xl opacity-90">Construindo hábitos com propósito</p>
    </div>
  );
}
