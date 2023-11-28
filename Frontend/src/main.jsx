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
import SelectedSemester from './pages/student/SelectedSemester'
import SelectedCourse from './pages/student/SelectedCourse'


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

      {
        path: "student",
        element: <StudentHome/>
      },

      {
        path: "admin",
        element: <AdminHome/>,
        children : [
          {
            path: "degree/:id",
            element: <SelectedDegree/>,
            children: [
              {
                path: "required-course/:id",
                element: <EditSelectedCourse/>
              }
            ]
          },
          {
            path: "department-course/:id",
            element: <EditProf/>,
          }
        ]
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
    <RouterProvider router={router} />
  </React.StrictMode>
);