import React from 'react';
import { lazy } from 'react';

// project imports
import Loadable from '../ui-component/Loadable';
import MinimalLayout from '../layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('../views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('../views/pages/authentication/authentication3/Register3')));
 import TermsAndCondition from '../views/pages/terms_and_conditions/list';
 import PrivacyPolicy from '../views/pages/privacy_policies/list';

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/',
      element: <AuthLogin3 />
    },
    {
      path: '*',
      element: <AuthLogin3 />
    },
    {
      path: '/login',
      element: <AuthLogin3 />
    },
    {
      path: "/terms-and-conditions",
      element: < TermsAndCondition/>
    },
    {
      path: "/privacy-policies",
      element: <PrivacyPolicy/>
    },
  ]
};

export default AuthenticationRoutes;
