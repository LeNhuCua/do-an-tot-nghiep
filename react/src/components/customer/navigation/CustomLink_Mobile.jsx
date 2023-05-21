import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { MenusContext } from "../../../context/customer/MenuContext";

function CustomLink_Mobile({ children, to, categoryId }) {
  const location = useLocation();
  const match = location.pathname === "/" + to || location.pathname ===  to ;

  const { setHoverIndex } = useContext(MenusContext);

  return (
    <li>
      <Link
        onClick={() => setHoverIndex(categoryId)}
        to={to}
        className={
          match
            ? "block no-underline p-3 text-sm font-bold uppercase border-b hover:text-yellow-300 text-yellow-300"
            : "block no-underline p-3 text-sm font-bold uppercase border-b hover:text-yellow-300"
        }
        href="##"
      >
        {children}
      </Link>
    </li>
  );
}
export default CustomLink_Mobile;
