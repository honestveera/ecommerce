// assets
import React from 'react';
import { IconBook, IconUserCircle, IconBuilding, IconTruckDelivery } from '@tabler/icons';

// constant
const icons = {
  IconBook, IconUserCircle, IconBuilding,IconTruckDelivery 
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const adminPages = {
  id: 'pages',
  title: 'LMS Management',
  type: 'group',
  children: [
    {
      id: 'user',
      title: 'User',
      type: 'collapse',
      icon: icons.IconUserCircle,
      children: [
        {
          id: 'approved_user',
          title: 'Approved Users',
          type: 'item',
          url: '/admin/approved_users'
        },
        {
          id: 'unapproved_user',
          title: 'Unapproved Users',
          type: 'item',
          url: '/admin/unapproved_users'
        }
       ]
    }
  ]
};

export default adminPages;
