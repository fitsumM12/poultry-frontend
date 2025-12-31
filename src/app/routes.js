import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";
import Loadable from "./components/Loadable";
import Layout from "./components/Layout/Layout";
import materialRoutes from "app/views/components/MaterialRoutes";
import { patch } from "@mui/material";
import UserManageCard from "./views/components/UserManageCard";
import ManageUser from "./views/components/tables/ManageUsers";
// // SESSION PAGES
const NotFound = Loadable(lazy(() => import("app/views/sessions/NotFound")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const JwtRegister = Loadable(lazy(() => import("app/views/sessions/JwtRegister")));
const ForgotPassword = Loadable(lazy(() => import("app/views/sessions/ForgotPassword")));

// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));
const BroilerRecord = Loadable(lazy(() => import("app/views/components/tables/BroilerRecord")));
const BroilerForm = Loadable(lazy(() => import("app/views/components/forms/BroilerForm")));
const ProfilePage = Loadable(lazy(() => import("app/views/components/profile_page")));
const routes = [
  {
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      ...materialRoutes,
      { path: "/dashboard/", element: <Analytics /> },
      { path: "/newcase/", element: <BroilerForm /> },
      { path: "/records/", element: <BroilerRecord /> },
      { path: "/user_profile/", element: <ProfilePage /> },
      { path: "/user_management/", element: <ManageUser /> },
      { path: "*", element: <NotFound /> }
    ]
  },

  { path: "/session/404", element: <NotFound /> },
  { path: "/session/signin", element: <JwtLogin /> },
  { path: "/session/signup", element: <JwtRegister /> },
  { path: "/session/forgot-password", element: <ForgotPassword /> },
  { path: "/", element: <Navigate to="/dashboard/" /> },
  { path: "*", element: <NotFound /> }
];

export default routes;
