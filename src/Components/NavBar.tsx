import { useState } from 'react';
import { IconMenu2, IconUser, IconX } from '@tabler/icons-react';
import './NavBar.css';

interface NavBarProps {
    section: "rsvp" | "upload" | "vestimenta" | "historia" | "galeria" | "ayudanos" |"qa" | "2";
    setSection: (section: "rsvp" | "upload" | "vestimenta" | "historia" | "galeria" | "ayudanos" | "qa" | "2") => void;
    onAdminClick?: () => void;
}

function NavBar({ section, setSection, onAdminClick }: NavBarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleNavClick = (value: NavBarProps['section']) => {
        setSection(value);
        setMobileOpen(false);
    };

    const NavItems = () => (
        <>
            <li
                className={section === "rsvp" ? "active" : ""}
                onClick={() => handleNavClick("rsvp")}
            >
                RSVP
            </li>
            {/* Se comenta mientras se hacen los cambios */}
            {/* <li
                className={section === "upload" ? "active" : ""}
                onClick={() => handleNavClick("upload")}
            >
                Upload
            </li> */}
            <li
                className={section === "vestimenta" ? "active" : ""}
                onClick={() => handleNavClick("vestimenta")}
            >
                Vestimenta
            </li>
            <li
                className={section === "historia" ? "active" : ""}
                onClick={() => handleNavClick("historia")}
            >
                ¿Cómo comenzó?
            </li>
            <li
                className={section === "galeria" ? "active" : ""}
                onClick={() => handleNavClick("galeria")}
            >
                Galería
            </li>
            <li
                className={section === "ayudanos" ? "active" : ""}
                onClick={() => handleNavClick("ayudanos")}
            >
                Ayúdanos
            </li>

            <li
                className={section === "qa" ? "active" : ""}
                onClick={() => handleNavClick("qa")}
            >
                FAQ
            </li>

            {onAdminClick && (
                <li className="admin-button-li">
                    <button
                        type="button"
                        className="navbar-admin-button"
                        onClick={onAdminClick}
                        aria-label="Open admin access"
                        title="Admin"
                    >
                        <IconUser />
                    </button>
                </li>
            )}
        </>
    );

    return (
        <header id="NavBar">
            <div className="navbar-inner">
                <div className="navbar-title">Ángel &amp; Mariana</div>

                <button
                    className="navbar-burger"
                    type="button"
                    onClick={() => setMobileOpen((o) => !o)}
                >
                    {mobileOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
                </button>

                {/* Desktop menu */}
                <nav className="navbar-menu navbar-menu-desktop">
                    <ul>
                        <NavItems />
                    </ul>
                </nav>
            </div>

            {/* Mobile dropdown */}
            <nav
                className={`navbar-menu navbar-menu-mobile ${mobileOpen ? 'open' : ''}`}
            >
                <ul>
                    <NavItems />
                </ul>
            </nav>
        </header>
    );
}

export default NavBar;
