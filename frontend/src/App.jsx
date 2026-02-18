import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateCourse from "./pages/CreateCourse";
import AdminRoute from "./Routes/Admin";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CourseEdit from "./pages/CourseEdit";
import RequireAuth from "./Routes/RequireAuth";
import RequireRole from "./Routes/RequireRole";
import RequireOwner from "./Routes/RequireOwner";


function AppContent() {

  const { token, user } = useContext(AuthContext);
  console.log(user)

  return (
    <BrowserRouter>
      <nav>
        {!token && (
          <>
            <Link to="/login">Login</Link>
            <br />
            <Link to="/register">Register</Link>
          </>
        )}


        {token && <Link to="/">Home</Link>}
        {token && <Link to="/courses">Courses</Link>}
        {token && user?.roles?.includes("admin") && <Link to="/admin">Admin</Link>}
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

        <Route
          path="/courses/:id"
          element={token ? <CourseDetail /> : <Navigate to="/login" />}
        />
        <Route
          path="/courses/:id/edit"
          element={
            <RequireAuth>
              <RequireOwner>
                <CourseEdit />
              </RequireOwner>
            </RequireAuth>
          }
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
