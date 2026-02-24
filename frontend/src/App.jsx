import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CourseDetail from "./pages/CourseDetail";
import CourseEdit from "./pages/admin/CourseEdit";
import RequireAuth from "./Routes/RequireAuth";
import RequireRole from "./Routes/RequireRole";
import RequireOwner from "./Routes/RequireOwner";
import Guest from "./pages/Guest";
import MyCourses from "./pages/MyCourses";
import Admin from "./pages/admin/Admin";
import MyDetailCourse from "./pages/MyDetailCourse";
import InviteStudent from "./pages/InviteStudent";
import CourseTeacher from "./pages/CourseTeacher";
import EditStudent from "./pages/EditStudent";
import EditInfo from "./pages/EditInfo";
import EditCurriculum from "./pages/EditCurriculum";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

function AppContent() {

  const { token, user } = useContext(AuthContext);
  console.log(user)

  return (
    <BrowserRouter>

      {/* <nav> */}
      {token && <Navbar />}
      {/* </nav> */}

      <Routes>
        <Route
          path="/"
          element={!token ? <Guest /> : <Navigate to="/home" />}
        />
        <Route
          path="/home"
          element={token ? <Home /> : <Navigate to="/login" />}
        />


        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/home" />}
        />

        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/home" />}
        />

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <RequireRole role="admin">
                <Admin />
              </RequireRole>
            </RequireAuth>
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

              <CourseEdit />

            </RequireAuth>
          }
        />


        <Route
          path="/mycourses"
          element={token ? <MyCourses /> : <Navigate to="/login" />}
        />

        <Route
          path="/mycourses/:id"
          element={
            <RequireAuth>
              <RequireOwner>
                <MyDetailCourse />
              </RequireOwner>
            </RequireAuth>
          }
        />

        <Route
          path="/mycourses/:id/invite"
          element={
            <RequireAuth>
              <RequireRole role="teacher">
                <RequireOwner>
                  <InviteStudent />
                </RequireOwner>
              </RequireRole>
            </RequireAuth>
          }
        />
        {/* ทำไว้ดูดีไซน์เฉยๆ */}
        <Route
          path="/courseTeacher"
          element={token ? <CourseTeacher /> : <Navigate to="/login" />}
        />
        <Route
          path="/editStudent"
          element={token ? <EditStudent /> : <Navigate to="/login" />}
        />
        <Route
          path="/editInfo"
          element={token ? <EditInfo /> : <Navigate to="/login" />}
        />
        <Route
          path="/editCurriculum"
          element={token ? <EditCurriculum/> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={token ? <Profile/> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-profile"
          element={token ? <EditProfile /> : <Navigate to="/login" />}
        />
      </Routes>

      <Footer />

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
