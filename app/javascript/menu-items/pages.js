// assets
import React from 'react';
import { IconBook, IconUserCircle, IconBuilding, IconTruckDelivery } from '@tabler/icons';

// constant
const icons = {
  IconBook, IconUserCircle, IconBuilding,IconTruckDelivery 
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'LMS Management',
  type: 'group',
  children: [
    {
      id: 'book_items',
      title: 'Books',
      type: 'collapse',
      icon: icons.IconBook,
      children: [
        {
          id: 'books',
          title: 'Books',
          type: 'item',
          url: '/admin/book'
        },
        {
          id: 'author',
          title: 'Author',
          type: 'item',
          url: '/admin/author'
        },
        {
          id: 'publisher',
          title: 'Publisher',
          type: 'item',
          url: '/admin/publisher'
        },
        {
          id: 'category',
          title: 'Category',
          type: 'item',
          url: '/admin/category'
        },
        {
          id: 'subcategory',
          title: 'Sub Category',
          type: 'item',
          url: '/admin/subcategory'
        }

      // children: [
      //   {
      //     id: 'login3',
      //     title: 'Login',
      //     type: 'item',
      //     url: '/pages/login/login3',
      //     target: true
      //   },
      //   {
      //     id: 'register3',
      //     title: 'Register',
      //     type: 'item',
      //     url: '/pages/register/register3',
      //     target: true
      //   }
       ]
    },
    {
      id: 'user',
      title: 'User',
      type: 'collapse',
      icon: icons.IconUserCircle,
      children: [
        {
          id: 'user',
          title: 'Users',
          type: 'item',
          url: '/admin/users'
        },
        {
          id: 'delivery_partners',
          title: 'Delivery Partners',
          type: 'item',
          url: '/admin/delivery_partners'
        }
       ]
    },
    {
      id: 'corporate',
      title: 'Corporate',
      type: 'collapse',
      icon: icons.IconBuilding,
      children: [
        {
          id: 'corporate_membership',
          title: 'Corporate Details',
          type: 'item',
          url: '/admin/corporates'
        }
       ]
    },
    {
      id: 'order',
      title: 'Order',
      type: 'collapse',
      icon: icons.IconTruckDelivery,
      children: [
        {
          id: 'order_details',
          title: 'Order Details',
          type: 'item',
          url: '/admin/orders'
        },
        {
          id: 'assign_order',
          title: 'Assign Order',
          type: 'item',
          url: '/admin/assign_orders'
        }
       ]
    }
  ]
};

export default pages;
