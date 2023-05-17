import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { MenusContext } from "../../../context/customer/MenuContext";




function CustomLink({ children, to, categoryId }) {
    const location = useLocation();
    const match = location.pathname === "/" + to || location.pathname ===  to ;
    const { setHoverIndex } = useContext(MenusContext);

    return (
        <li className="">
            <Link
                onMouseEnter={() => setHoverIndex(categoryId)}
                // onMouseLeave={() => setHoverIndex(null)}
                to={to}
                className={
                    match
                        ? "item-menu  cs-menuItem bg-yellow-300 text-white  "
                        : "item-menu cs-menuItem "
                }
            >
                {children}
            </Link>
        </li>
    );
}
export default CustomLink;
