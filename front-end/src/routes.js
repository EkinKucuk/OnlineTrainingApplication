import React from 'react';


const Dashboard = React.lazy(() => import('./views/Dashboard'));
const CreateCourse = React.lazy(()=> import('./components/Courses/createCourseForm')); 
const CreateUser = React.lazy(()=> import('./components/User/addUserForm'));
const CourseOperations = React.lazy(()=>import('./components/Courses/courseOperations'));
const UserOperations = React.lazy(()=>import('./components/User/userOperations'));
const RoleOperations = React.lazy(()=> import('./components/Roles/roleOperations'));
const CreateRole = React.lazy(()=>import('./components/Roles/addRole'));
const AssignRole = React.lazy(()=>import('./components/Roles/addUserRoleForm'));
const ListCourses = React.lazy(()=>import("./components/Courses/showAllCourses"));
const GetUser = React.lazy(() => import('./components/User/viewAccount'));
const CourseTypes = React.lazy(() => import('./components/Courses/addCourseType'))
const CreateExam = React.lazy(()=>import('./components/Exam/createExam'))
const AssignPermission = React.lazy(() => import('./components/Roles/addRolePermission'))
const ManageMyCourses = React.lazy( () => import('./components/Courses/manageMyCourses'));
const ListSystemCourses = React.lazy( () => import('./components/Courses/listSystemCourses'));
// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/dashboard', name: 'Ana Sayfa', component: Dashboard },
  {path:'/kursyarat',exact:true,name:'Kurs Yarat',component: CreateCourse},
  {path: '/kullanıcıyarat',exact:true,name:'Kullanıcı Yarat',component: CreateUser},
  {path: '/kursdüzenle',exact:true,name:'Tüm Kursları Düzenle',component:CourseOperations},
  {path: '/kurslarımidüzenle',exact:true,name:'Kurslarımı Düzenle',component:ManageMyCourses},
  {path: '/kullanıcıdüzenle',exact:true,name:'Kullanıcı Düzenle',component:UserOperations},
  {path:'/roldüzenle',exact:true,name:'Rolleri Düzenle',component:RoleOperations},
  {path:'/rolyarat',exact:true,name:'Rol Yarat',component:CreateRole},
  {path:'/rolata',exact:true,name:'Rol Ata',component:AssignRole},
  {path:'/rolyetkisiata',exact:true,name:'Role Yetki Atama',component:AssignPermission},
  {path:'/kurslarım',exact:true,name:'Kurslarım',component:ListCourses},
  {path:'/tumacikkurslar',exact:true,name:'Kurs Arat',component:ListSystemCourses},
  {path:'/kullanıcı',exact:true,name:'Kullanıcı Sayfası',component:GetUser},
  {path:'/kurstipleri',exact:true,name:'Kurs Tipi Ekleme/Düzenleme',component:CourseTypes},
  {path: '/sınavyarat',exact:true,name:'Sınav Yaratma',component:CreateExam},

];

export default routes;