/* eslint-disable */
import { lazy } from 'react';
import { USER_ROLE } from 'constants.js';
import { DEFAULT_PATHS } from 'config.js';


const home = {
  list: lazy(() => import('views/home/Home')),
};


const importData = {
  working: lazy(() => import('views/import-data-working/ImportData')),
  salary: lazy(() => import('views/import-data-salary/ImportData')),
};

const masterData = {
  working: lazy(() => import('views/master/working/Working')),
  workingDetail: lazy(() => import('views/master/working-detail/WorkingDetail')),
  salary: lazy(() => import('views/master/salary/Salary')),
  employee: lazy(() => import('views/master/employee/Employee')),
  employeeDetail: lazy(() => import('views/master/employee-detail/EmployeeDetail')),
  blackList: lazy(() => import('views/master/blackList/BlackList')),
};

const appRoot = DEFAULT_PATHS.APP.endsWith('/') ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length) : DEFAULT_PATHS.APP;

const routesAndMenuItems = {
  mainMenuItems: [
    {
      path: `${appRoot}/`,
      exact: true,
      redirect: true,
      to: `${appRoot}/home`,
    },
    {
      path: `${appRoot}/home`,
      component: home.list,
      label: 'หน้าหลัก',
      icon: 'home',
      protected: true,
      hideInMenu: false,
    },
    {
      path: `${appRoot}/import-data`,
      label: 'นำเข้าข้อมูล',
      icon: 'download',
      exact: true,
      redirect: true,
      protected: true,
      hideInMenu: false,
      subs: [
        { path: '/working',icon: 'laptop', label: 'นำเข้าข้อมูลการทำงาน', component: importData.working, hideInMenu: false },
        { path: '/salary',icon: 'dollar', label: 'นำเข้าข้อมูลการเงินเดือน', component: importData.salary, hideInMenu: false },
      ],
    },
    {
      path: `${appRoot}/master`,
      label: 'จัดการข้อมูล',
      icon: 'edit',
      exact: true,
      redirect: true,
      protected: true,
      hideInMenu: false,
      subs: [
        { path: '/working',icon: 'online-class', label: 'ข้อมูลการทำงาน', component: masterData.working, hideInMenu: false },
        { path: '/working-detail/new', label: 'ข้อมูลการทำงาน', component: masterData.workingDetail, hideInMenu: true },
        { path: '/working-detail/:id', label: 'ข้อมูลการทำงาน', component: masterData.workingDetail, hideInMenu: true },
        { path: '/salary',icon: 'money', label: 'ข้อมูลเงินเดือน', component: masterData.salary, hideInMenu: false },
        { path: '/employee',icon: 'air-balloon', label: 'ข้อมูลพนักงาน', component: masterData.employee, hideInMenu: false },
        { path: '/employee-detail/new', label: 'ข้อมูลการทำงาน', component: masterData.employeeDetail, hideInMenu: true },
        { path: '/employee-detail/:id', label: 'ข้อมูลการทำงาน', component: masterData.employeeDetail, hideInMenu: true },
        { path: '/blackList',icon: 'error-hexagon', label: 'Black List', component: masterData.blackList, hideInMenu: false },
      ],
    },
  ],
  sidebarItems: [],
};
export default routesAndMenuItems;
