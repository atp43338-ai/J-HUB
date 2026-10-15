import { Routes, Route } from "react-router";

import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/*" element={<UserRoutes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;