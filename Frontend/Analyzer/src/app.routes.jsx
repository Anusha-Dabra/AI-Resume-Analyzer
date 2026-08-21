import { createBrowserRouter } from "react-router"
import Login from "./features/auth/pages/login"
import Logout from "./features/auth/pages/logout"
import Register from "./features/auth/pages/register"
import Protected from "./features/auth/component/protected"




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
        path: "/",
        element: <Protected> <h1>This is a home page</h1></Protected>
    }


])