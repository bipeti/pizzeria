import classes from "./Pages.module.css";

export default function Description() {
    return (
        <>
            <h1>Ludas Pizzéria</h1>
            <h2>DEMO - Tájékoztató</h2>
            <div className={` ${classes.information} ${classes.description}`}>
                <p>
                    A weboldal egy portfólió részeként került kialakításra. Egy
                    olyan oldal létrehozása volt a célom, amely optimális
                    megjelenést biztosít a különböző méretű eszközökön, legyen
                    szó mobiltelefonról, tabletről, vagy akár monitorról. A
                    kosár különböző megjelenését akár már a telefon álló és
                    fekvő módjaiban is ki tudod próbálni.
                </p>
                <p>
                    Elérhetőek különböző extrák, illetve gyerekadag egyes
                    ételeknél, ezeket a kosárra kattintás után tudod testre
                    szabni. Az italoknál nincsenek ilyen lehetőségek, ott a
                    kosárba helyezés egyszerűbb, azonnal megtörténik.
                </p>
                <p>
                    A megrendelő kérésére a csomagolási díjak ételenként
                    eltérőek lehetnek, ezek a kosárban összesítve kerülnek
                    feltüntetésre.
                </p>
                <p>
                    Az oldal látogatói tudják böngészni a kínálatot, tudnak
                    kosárba helyezni, azonban a megrendeléshez bejelentkezés
                    szükséges. A regisztrációmentes, gyors belépés érdekében egy
                    demo felhasználó került létrehozásra, amivel a megrendelés
                    folyamatát egyszerűen ki tudod próbálni:
                </p>
                <div className={classes.code}>
                    <p>E-mail: demo@ludasmeggyes.hu</p>
                    <p>Jelszó: Ludas1234</p>
                </div>
                <p>
                    A regisztráció folyamatát is kipróbálhatod, ehhez az e-mail
                    címeden kívül kérem, hogy te is{" "}
                    <u>csak fiktív adatokat használj</u>. Az e-mail címre
                    érkezik majd egy aktivációs link, ezért annak valósnak kell
                    lennie.
                </p>
            </div>
        </>
    );
}
