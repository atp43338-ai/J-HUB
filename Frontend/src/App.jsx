import { Routes, Route } from "react-router";

import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/*" element={<UserRoutes />} />
    </Routes>
  );
}

export default App;