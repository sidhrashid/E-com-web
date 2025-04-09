import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeRoutes from "./routes/HomeRoutes/HomeRoutes";
import DashboardRoute from "./routes/DashboardRoutes/DashboardRoutes";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<HomeRoutes />} />
          <Route path="/admin/*" element={<DashboardRoute />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
