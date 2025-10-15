import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gradient-primary text-white text-center p-5">
      <div className="text-7xl mb-5">🏆</div>
      <h1 className="text-5xl font-bold mb-2">Habitus</h1>
      <p className="text-xl opacity-90">Construindo hábitos com propósito</p>
    </div>
  );
}
