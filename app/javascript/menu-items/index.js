import React from 'react';
import dashboard from './dashboard';
import pages from './pages';
import adminPages from './adminPages';
import utilities from './utilities';
import other from './other';
import { useSelector } from 'react-redux';

// ==============================|| MENU ITEMS ||============================== //


const menuItems = () => {
  const authData = useSelector((state) => state.auth.data);

  return { 
    items: authData.role == 'SuperAdmin' ? [dashboard, pages, other] : [dashboard, adminPages]
  }
};

export default menuItems;
