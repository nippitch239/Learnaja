import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import CourseInfoEdit from "./pages/admin/CourseInfoEdit";
import RequireAuth from "./Routes/RequireAuth";
import RequireRole from "./Routes/RequireRole";
import RequireOwner from "./Routes/RequireOwner";
import Guest from "./pages/Guest";
import MyCourses from "./pages/MyCourses";
import Admin from "./pages/admin/Admin";
import MyDetailCourse from "./pages/MyDetailCourse";
import InviteStudent from "./pages/InviteStudent";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
// import CourseTeacher from "./pages/CourseTeacher";
// import EditStudent from "./pages/EditStudent";
// import EditInfo from "./pages/EditInfo";
// import EditCurriculum from "./pages/EditCurriculum";
// import Lesson from "./pages/Lesson";
import InstanceDetail from "./pages/InstanceDetail";
import EditInstanceCurriculum from "./pages/EditInstanceCurriculum";
import EditInstanceInfo from "./pages/EditInstanceInfo";
import RegisterTeacher from "./pages/RegisterTeacher";

function AppContent() {

  const { token, user } = useContext(AuthContext);

  console.log(user)

  return (
    <BrowserRouter>

      {token && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={!token ? <Guest /> : <Navigate to="/home" />}
        />
        <Route
          path="/home"
          element={token ? <Home /> : <Navigate to="/" />}
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
              <RequireRole role="admin">
                <CourseInfoEdit />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/courses/:id/edit/curriculum"
          element={
            <RequireAuth>
              <RequireRole role="admin">
                <CourseEdit />
              </RequireRole>
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
          path="/mycourses/:id/view"
          element={
            <RequireAuth>
              <RequireOwner>
                <InstanceDetail />
              </RequireOwner>
            </RequireAuth>
          }
        />

        <Route
          path="/mycourses/:id/edit"
          element={
            <RequireAuth>
              <RequireOwner>
                <EditInstanceCurriculum />
              </RequireOwner>
            </RequireAuth>
          }
        />

        <Route
          path="/mycourses/:id/edit/info"
          element={
            <RequireAuth>
              <RequireOwner>
                <EditInstanceInfo />
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

        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-profile"
          element={token ? <EditProfile /> : <Navigate to="/login" />}
        />

        <Route
          path="/register-teacher"
          element={token ? <RegisterTeacher /> : <Navigate to="/login" />}
        />

        {/* ทำไว้ดูดีไซน์เฉยๆ */}
        {/* <Route
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
          element={token ? <EditCurriculum /> : <Navigate to="/login" />}
        />

        <Route
          path="/lesson"
          element={token ? <Lesson /> : <Navigate to="/login" />}
        /> */}
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
