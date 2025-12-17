import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/dashboard" element={<h1>Dashboard</h1>} />
    </Routes>
  );
}

export default App;
