import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import "./App.css";
import RootLayout from "./components/Pages/RootLayout";
import HomePage from "./components/Pages/HomePage";
import FoodsPage from "./components/Pages/FoodsPage";
import GaleryPage from "./components/Pages/GaleryPage";
import ContactPage from "./components/Pages/ContactPage";
import Activation from "./components/User/Activation";
import Admin from "./components/Pages/Admin";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        // errorElement: <ErrorPage />,
        children: [
            { index: true, element: <HomePage isPasswordReset={false} /> },
            { path: "foods", element: <FoodsPage /> },
            { path: "galery", element: <GaleryPage /> },
            { path: "contact", element: <ContactPage /> },
            { path: "activation", element: <Activation /> },
            { path: "admin", element: <Admin /> },
            {
                path: "passwordReset",
                element: <HomePage isPasswordReset={true} />,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
