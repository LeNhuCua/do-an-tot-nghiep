import { useLocation, useNavigate } from 'react-router-dom';

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';
import React from 'react';

const AppBreadcrumb = () => {


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
