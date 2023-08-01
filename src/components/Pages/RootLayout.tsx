import { Outlet } from "react-router-dom";
import MainNavigation from "../Layout/MainNavigation";
import Footer from "./Footer";
import classes from "./RootLayout.module.css";

export default function RootLayout() {
    return (
        <div className={classes.root}>
            <MainNavigation />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
