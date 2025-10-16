import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { HabitsProvider } from "./contexts/HabitsContext";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <HabitsProvider>
        <App />
      </HabitsProvider>
    </ThemeProvider>
  </BrowserRouter>
);
