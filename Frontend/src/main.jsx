import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// General purpose 
import Layout from './components/Layout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

// Student pages
import StudentHome from './pages/student/StudentHome'
import StudentSemester from './pages/student/StudentSemester'
import StudentCourse from './pages/student/StudentCourse'


// Admin pages
import AdminHome from './pages/administrator/AdminHome'
import SelectedDegree from './pages/administrator/SelectedDegree'
import EditSelectedCourse from './pages/administrator/EditSelectedCourse'
import EditProf from './pages/administrator/EditProf'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children:[
      {
        path: "",
        element: <Login/>
      },

      // Student routes
      {
        path: "student",
        element: <StudentHome/>
      },
      {
        path: "student/semester/:id",
        element: <StudentSemester/>
      },
      {
        path: "student/semester/:id/course/:id",
        element: <StudentCourse/>
      },

      // Admin routes
      {
        path: "admin",
        element: <AdminHome/>
      },
      {
        path: "admin/degree/:id",
        element: <SelectedDegree/>
      },
      {
        path: "admin/degree/:id/course/:id",
        element: <EditSelectedCourse/>
      },
      {
        path: "admin/dept-course/:id",
        element: <EditProf/>
      },
    ]
  },
  {
    path: "*",
    element: <NotFound/>
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="app">
      <div className="container">
          <RouterProvider router={router} />
      </div>
    </div>
  </React.StrictMode>
);

