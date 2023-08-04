import MainNavigation from "../Layout/MainNavigation";
import Footer from "./Footer";
import classesroot from "./RootLayout.module.css";
import classespages from "./Pages.module.css";

export default function ErrorPage() {
    return (
        <div className={classesroot.root}>
            <MainNavigation />
            <main>
                <h1>Hiba</h1>
                <div
                    className={` ${classespages.information} ${classespages.description}`}
                >
                    <p>
                        Az erre a lapra mutató link hibás. Kérünk, használd a
                        fenti menüt!
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
