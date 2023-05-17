import { Link, useLocation } from "react-router-dom";

function CustomLink_Children({ children, to }) {
  const location = useLocation();
  const match = location.pathname === "/" + to || location.pathname === to;

  return (
    <li
      className={`${
        match ? "bg-yellow-300 " : ""
      } sub-group h-[40px] border-b px-4 flex items-center font-[500] hover:text-white hover:bg-yellow-300 hover:cursor-pointer transition-all duration-100`}
    >
      <Link
        to={to}
        className={`${
          match ? "text-white" : ""
        } transition-all text-gray-950 w-full  no-underline h-full flex items-center duration-300 sub-group-content`}
      >
        {children}
      </Link>
    </li>
  );
}
export default CustomLink_Children;
