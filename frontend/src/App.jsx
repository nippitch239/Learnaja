import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import CreateCourse from "./CreateCourse";
import AdminRoute from "./Routes/Admin";
import Courses from "./Courses";
// import "tailwindcss";

function AppContent() {

  const { token } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <nav>
        {!token && (
          <>
            {/* <Link to="/login">Login</Link>
            <br />
            <Link to="/register">Register</Link> */}
          </>
        )}

        {token && <Link to="/">Home</Link>}
      </nav>

      <Routes>
        <Route
          path="/"
          element={token ? <Home /> : <Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/" />}
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <CreateCourse />
            </AdminRoute>
          }
        />

        <Route
          path="/courses"
          element={token ? <Courses /> : <Navigate to="/login" />}
        />
      </Routes>


    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
