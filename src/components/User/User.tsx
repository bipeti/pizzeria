import { useEffect, useState } from "react";
import "./User-tabs.css";
import Login from "./Login";
import Registration from "./Registration";
import NewPassword from "./NewPassword";
import UserModal from "./UserModal";
import { useSelector } from "react-redux";
import { AuthState } from "../../store/auth-slice";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import classes from "./User.module.css";

/* If the user is logged in, his profil is visible, else the login/registration page is visible. */

const User = ({ onClose }: { onClose: () => void }) => {
    const [tabButtons, setTabButtons] = useState<JSX.Element | null>(null);
    const [tabContent, setTabContent] = useState<JSX.Element | null>(null);

    const userData = useSelector(
        (state: { auth: AuthState }) => state.auth.user
    );
    const isLoggedIn = useSelector(
        (state: { auth: AuthState }) => state.auth.isLoggedIn
    );

    useEffect(() => {
        function filledUserData() {
            if (!userData) {
                /* It means, the token was valid, but this user can't found in the database. 
                At this point it can just because of sg database error, or external database 
                operation. */
                console.log("Kérem, jelentkezzen be újra!");
                return;
            }
            setTabButtons(
                <TabList>
                    <Tab>Saját adatok</Tab>
                    <Tab>Jelszó módosítás</Tab>
                    <Tab>Rendelések</Tab>
                </TabList>
            );
            setTabContent(
                <>
                    <TabPanel className={classes.content}>
                        <Registration userData={userData} />
                    </TabPanel>
                    <TabPanel className={classes.content}>
                        <NewPassword />
                    </TabPanel>
                    <TabPanel className={classes.content}>
                        <div className={classes["content-wrapper"]}>
                            Fejlesztés alatt...
                        </div>
                    </TabPanel>
                </>
            );
        }

        if (!isLoggedIn) {
            setTabButtons(
                <TabList>
                    <Tab>Belépés</Tab>
                    <Tab>Regisztráció</Tab>
                </TabList>
            );
            setTabContent(
                <>
                    <TabPanel className={classes.content}>
                        <Login onClose={onClose} />
                    </TabPanel>
                    <TabPanel className={classes.content}>
                        <Registration />
                    </TabPanel>
                </>
            );
        } else {
            filledUserData();
        }
    }, [onClose, userData, isLoggedIn]);

    return (
        <UserModal onClose={onClose}>
            <Tabs
                className={classes.content}
                disableUpDownKeys={true}
                disableLeftRightKeys={true}
            >
                {tabButtons}
                {tabContent}
            </Tabs>
        </UserModal>
    );
};

export default User;
