import { Navigate, Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages";
import { RecoveryPass } from "../pages/RecoveryPass";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="recovery" element={<RecoveryPass />} />

      <Route path="/*" element={<Navigate to="/auth/login" />} />

    </Routes>
  );
};
