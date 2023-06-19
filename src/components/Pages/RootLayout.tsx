import { Outlet } from "react-router-dom";
import MainNavigation from "../Layout/MainNavigation";
import Footer from "./Footer";

export default function RootLayout() {
    return (
        <>
            <MainNavigation />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
