// import { createRoot } from "react-dom/client";
// import App from "./app/App.jsx";
// import "./styles/index.css";

// createRoot(document.getElementById("root")).render(<App />);

import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import { BrushingProvider } from "./app/context/BrushingContext.jsx";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <BrushingProvider>
    <App />
  </BrushingProvider>
);