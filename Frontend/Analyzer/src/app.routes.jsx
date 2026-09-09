import { createBrowserRouter } from "react-router"
import Login from "./features/auth/pages/login"
import Logout from "./features/auth/pages/logout"
import Register from "./features/auth/pages/register"
import Protected from "./features/auth/component/protected"
import Home from "./features/interview/pages/home"
import Interview from "./features/interview/pages/interview"
import Profile from "./features/auth/pages/profile"

export const router = createBrowserRouter([

    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/logout",
        element: <Logout />,
    },
    {
        path: "/profile",
        element: <Protected> <Profile /></Protected>
    },
    {
        path: "/",
        element: <Protected> <Home /></Protected>
    },
    {
        path: "/interview/:id",
        element: <Protected> <Interview /></Protected>
    }


])