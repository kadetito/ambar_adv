import { AnimatePresence } from "framer-motion";
import { Route } from "react-router";
import { Routes } from "react-router-dom";
import { AuthRoutes } from "../auth/routes/AuthRoutes";
import { DashboardPage } from "../content/pages/DashboardPage";

//TODO lazy load
export const ApplicationRouter = () => {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* login */}
        <Route path="/auth/*" element={<AuthRoutes />} />

        {/* dashboard  */}
        <Route path="/*" element={<DashboardPage />} />

        <Route />
      </Routes>
    </AnimatePresence>
  );
};
