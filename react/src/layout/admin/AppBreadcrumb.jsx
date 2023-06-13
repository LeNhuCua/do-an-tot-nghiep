// import React from "react";
// import { useLocation } from "react-router-dom";

// import routes from "../../routes/adminRoutes";

// import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";

// const AppBreadcrumb = () => {
//   const currentLocation = useLocation().pathname;

//   const getRouteName = (pathname, routes) => {
//     const currentRoute = routes.find((route) => route.path === pathname);
//     return currentRoute ? currentRoute.name : false;
//   };

//   const getBreadcrumbs = (location) => {
//     const breadcrumbs = [];
//     location.split("/quantri/").reduce((prev, curr, index, array) => {
//       const currentPathname = `${prev}/${curr}`;
//       const routeName = getRouteName(currentPathname, routes);
//       routeName &&
//         breadcrumbs.push({
//           pathname: currentPathname,
//           name: routeName,
//           active: index + 1 === array.length ? true : false,
//         });
//       return currentPathname;
//     });
//     return breadcrumbs;
//   };

//   const breadcrumbs = getBreadcrumbs(currentLocation);

//   return (
//     <CBreadcrumb className="m-0 ms-2">
//       <CBreadcrumbItem href="/quantri">Trang chủ</CBreadcrumbItem>
//       {breadcrumbs.map((breadcrumb, index) => {
//         return (
//           <CBreadcrumbItem
//             {...(breadcrumb.active
//               ? { active: true }
//               : { href: breadcrumb.pathname })}
//             key={index}
//           >
//             {breadcrumb.name}
//           </CBreadcrumbItem>
//         );
//       })}
//     </CBreadcrumb>
//   );
// };

// export default React.memo(AppBreadcrumb);

import { CBreadcrumb, CBreadcrumbItem, CContainer, CHeaderDivider } from "@coreui/react";
import React from "react";
import { Link } from "react-router-dom";

const AppBreadcrumb = ({ ListBreadcrumb }) => {
  return (
    <CContainer fluid className="mb-10">
           <CHeaderDivider />
      <CBreadcrumb>
        <CBreadcrumbItem>
          <Link to="/quantri">Trang chủ</Link>
        </CBreadcrumbItem>
        {ListBreadcrumb.map((breadcrumb, index) => {
          if (breadcrumb.link == null)
            return (
              <CBreadcrumbItem key={index} active>
                {breadcrumb.name}
              </CBreadcrumbItem>
            );
          return (
            <CBreadcrumbItem key={index}>
              <Link to={breadcrumb.link}>{breadcrumb.name}</Link>
            </CBreadcrumbItem>
          );
        })}
      </CBreadcrumb>
      </CContainer>
  );
};

export default AppBreadcrumb;
