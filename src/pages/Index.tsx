import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to splash screen on initial load
    navigate("/splash");
  }, [navigate]);

  return null;
};

export default Index;
