import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { LiveOverview } from "./pages/LiveOverview";
import { SensorDetail } from "./pages/SensorDetail";
import { AlertLog } from "./pages/AlertLog";
import { Reports } from "./pages/Reports";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: LiveOverview },
      { path: "sensors", Component: SensorDetail },
      { path: "alerts", Component: AlertLog },
      { path: "reports", Component: Reports },
    ],
  },
]);
