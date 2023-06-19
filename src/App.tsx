import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import "./App.css";
import RootLayout from "./components/Pages/RootLayout";
import HomePage from "./components/Pages/HomePage";
import FoodsPage from "./components/Pages/FoodsPage";
import GaleryPage from "./components/Pages/GaleryPage";
import ContactPage from "./components/Pages/ContactPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        // errorElement: <ErrorPage />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "foods", element: <FoodsPage /> },
            { path: "galery", element: <GaleryPage /> },
            { path: "contact", element: <ContactPage /> },
            // { path: "products/:productId", element: <ProductDetailPage /> },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
