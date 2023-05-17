import { Link, useLocation } from "react-router-dom";

function CustomLink_Mobile({ children, to }) {
    const location = useLocation();
    const match = location.pathname === to;

    return (
        <li>
            <Link
                to={to}
                className={
                    match
                        ? "block p-3 text-sm font-bold uppercase border-b hover:text-yellow-300 text-yellow-300"
                        : "block p-3 text-sm font-bold uppercase border-b hover:text-yellow-300"
                }
                href="##"
            >
                {children}
            </Link>
        </li>
    );
}
export default CustomLink_Mobile;
