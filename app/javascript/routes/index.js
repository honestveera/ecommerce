import React from 'react';
import { useRoutes, Navigate   } from 'react-router-dom';
import { useSelector } from 'react-redux';

// routes
import { lazy } from 'react';
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';

import Loadable from '../ui-component/Loadable';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const data = useSelector((state) => state.auth.data);

  return useRoutes([
    isAuthenticated ? MainRoutes(data) : AuthenticationRoutes
  ]);
}
