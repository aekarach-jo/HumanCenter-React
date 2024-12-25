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

const userData = {
  working: lazy(() => import('views/user/working/Working')),
  workingDetail: lazy(() => import('views/user/working-detail/WorkingDetail')),
  salary: lazy(() => import('views/user/salary/Salary')),
  salaryDetail: lazy(() => import('views/user/salary-detail/SalaryDetail')),
};

const appRoot = DEFAULT_PATHS.APP.endsWith('/') ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length) : DEFAULT_PATHS.APP;

const routesAndMenuItems = {
  mainMenuItems: [
    {
      path: `${appRoot}/`,
      exact: true,
      redirect: true,
      // roles: [USER_ROLE.ADMIN, USER_ROLE.USER],
      to: `${appRoot}/home`,
    },
    {
      path: `${appRoot}/home`,
      component: home.list,
      label: 'หน้าหลัก',
      icon: 'home',
      protected: true,
      // roles: [USER_ROLE.ADMIN, USER_ROLE.USER],
      hideInMenu: false,
    },
    {
      path: `${appRoot}/import-data`,
      label: 'นำเข้าข้อมูล',
      icon: 'download',
      exact: true,
      redirect: true,
      protected: true,
      // roles: [USER_ROLE.ADMIN],
      hideInMenu: false,
      subs: [
        { path: '/working', icon: 'laptop', label: 'นำเข้าข้อมูลการทำงาน', component: importData.working, hideInMenu: false },
        { path: '/salary', icon: 'dollar', label: 'นำเข้าข้อมูลการเงินเดือน', component: importData.salary, hideInMenu: false },
      ],
    },
    {
      path: `${appRoot}/master`,
      label: 'จัดการข้อมูล',
      icon: 'edit',
      exact: true,
      redirect: true,
      protected: true,
      // roles: ['admin'],
      hideInMenu: false,
      subs: [
        { path: '/working', icon: 'online-class', label: 'ข้อมูลการทำงาน', component: masterData.working, hideInMenu: false },
        { path: '/working-detail/new', label: 'ข้อมูลการทำงาน', component: masterData.workingDetail, hideInMenu: true },
        { path: '/working-detail/:id', label: 'ข้อมูลการทำงาน', component: masterData.workingDetail, hideInMenu: true },
        { path: '/salary', icon: 'money', label: 'ข้อมูลเงินเดือน', component: masterData.salary, hideInMenu: false },
        { path: '/employee', icon: 'air-balloon', label: 'ข้อมูลพนักงาน', component: masterData.employee, hideInMenu: false },
        { path: '/employee-detail/new', label: 'ข้อมูลการทำงาน', component: masterData.employeeDetail, hideInMenu: true },
        { path: '/employee-detail/:id', label: 'ข้อมูลการทำงาน', component: masterData.employeeDetail, hideInMenu: true },
        { path: '/blackList', icon: 'error-hexagon', label: 'Black List', component: masterData.blackList, hideInMenu: false },
      ],
    },
    {
      path: `${appRoot}/user/salary`,
      component: userData.salary,
      label: 'สลิปเงินเดือน',
      icon: 'dollar',
      protected: true,
      // roles: [USER_ROLE.ADMIN, USER_ROLE.USER],
      hideInMenu: false,
      subs: [
        { path: '/saary', icon: 'air-balloon', label: 'มูลการเงินเดือน', component: userData.salary, hideInMenu: true },
        { path: '/salary-detail/new', label: 'มูลการเงินเดือน', component: userData.salaryDetail, hideInMenu: true },
        { path: '/salary-detail/:id', label: 'มูลการเงินเดือน', component: userData.salaryDetail, hideInMenu: true },
      ],
    },
    {
      path: `${appRoot}/user/working`,
      component: userData.working,
      label: 'ข้อมูลการทำงาน',
      icon: 'online-class',
      protected: true,
      // roles: [USER_ROLE.ADMIN, USER_ROLE.USER],
      hideInMenu: false,
      subs: [
        { path: '/working-detail/new', label: 'ข้อมูลการทำงาน', component: userData.workingDetail, hideInMenu: true },
        { path: '/working-detail/:id', label: 'ข้อมูลการทำงาน', component: userData.workingDetail, hideInMenu: true },
      ],
    },
  ],
  sidebarItems: [],
};
export default routesAndMenuItems;
