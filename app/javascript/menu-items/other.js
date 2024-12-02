// assets
import React from 'react';
import { IconBrandChrome, IconHelp, IconAccessible } from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconHelp, IconAccessible };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: 'sample-docs-roadmap',
  type: 'group',
  children: [
    {
      id: 'Subcription',
      title: 'Subcription List',
      type: 'item',
      url: '/sample-page',
      icon: icons.IconAccessible,
      breadcrumbs: false
    },
    {
      id: 'enquiry_list',
      title: 'Enquiries',
      icon: icons.IconHelp,
      type: 'collapse',
      children: [
      {
        id: 'enquiry',
        title: 'Enquiries',
        type: 'item',
        url: '/admin/enquiry'
      }
     ]

    },
    {
      id: 'terms_and_condition_page',
      title: 'Terms And Conditions',
      icon: icons.IconHelp,
      type: 'collapse',
      children: [
      {
        id: 'terms_and_condition',
        title: 'Terms And Conditions',
        type: 'item',
        url: '/admin/terms_and_condition'
      }
     ]

    },
    {
      id: 'privacy_policies_page',
      title: 'Privacy Policies',
      icon: icons.IconHelp,
      type: 'collapse',
      children: [
      {
        id: 'privacy_policies',
        title: 'Privacy Policies',
        type: 'item',
        url: '/admin/privacy_policy'
      }
     ]

    }
   
  ]
};

export default other;
