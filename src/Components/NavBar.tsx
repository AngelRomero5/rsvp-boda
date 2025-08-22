import './NavBar.css'

interface NavBarProps {
    section: "rsvp" | "historia" | "galeria" | "ayudanos" | "2";
    setSection: (section: "rsvp" | "historia" | "galeria" | "ayudanos" | "2") => void;
}

function NavBar({ section, setSection }: NavBarProps) {
    return (
        <section id="NavBar">
            <ul>
                <li
                    className={section === "rsvp" ? "active" : ""}
                    onClick={() => setSection("rsvp")}
                >
                    RSVP
                </li>
                <li
                    className={section === "historia" ? "active" : ""}
                    onClick={() => setSection("historia")}
                >
                    ¿Cómo comenzó?
                </li>
                <li
                    className={section === "galeria" ? "active" : ""}
                    onClick={() => setSection("galeria")}
                >
                    Nosotros
                </li>
                <li
                    className={section === "ayudanos" ? "active" : ""}
                    onClick={() => setSection("ayudanos")}
                >
                    Sé parte
                </li>
            </ul>
        </section>
    )
}

export default NavBar