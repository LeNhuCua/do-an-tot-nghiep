import { useLocation, useNavigate } from 'react-router-dom';
import routes from '../../routes';
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';
import React from 'react';

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname.replace(/\/$/, '');
  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname);
    return currentRoute ? currentRoute.name : false;
  };

  const getBreadcrumbs = (location) => {
    const breadcrumbs = [];
    const paths = location.split('/quantri/').filter((path) => path);
  
    paths.reduce((prev, curr, index) => {
      const currentPathname = `${prev}/${curr}`;
      const routeName = getRouteName(currentPathname, routes);
  
      if (routeName) {
        breadcrumbs.push({
          currentPathname: currentPathname,
          pathname: `${currentPathname}`,
          name: routeName,
          active: index === paths.length - 1 ? true : false,
        });
      }
      return currentPathname;
    }, '');
  
    return breadcrumbs;
  };
  
  const breadcrumbs = getBreadcrumbs(currentLocation);
  const navigate = useNavigate();

  return (
    <CBreadcrumb className="m-0 ms-2">
      <CBreadcrumbItem href="/quantri/">Trang chủ</CBreadcrumbItem>
      <CBreadcrumbItem className='cursor-pointer' onClick={() => navigate(-1)}>Trang trước</CBreadcrumbItem>
      {/* <button onClick={() => navigate(-1)}>Trang trước</button> */}
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active
              ? { active: true }
              : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        );
      })}
    </CBreadcrumb>
  );
};

export default React.memo(AppBreadcrumb);
