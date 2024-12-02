import React from "react";
import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import { useSelector } from "react-redux";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

const DashboardDefault = Loadable(
  lazy(() => import("../views/dashboard/Default"))
);
const CorporateDashboard = Loadable(
  lazy(() => import("../views/corporate-dashboard/index"))
);
const BookForm = Loadable(lazy(() => import("../views/pages/books/index")));
const AuthorForm = Loadable(lazy(() => import("../views/pages/authors/index")));
const PublisherForm = Loadable(
  lazy(() => import("../views/pages/publishers/index"))
);
const CategoryForm = Loadable(
  lazy(() => import("../views/pages/categories/index"))
);
const SubcategoryForm = Loadable(lazy(() => import('../views/pages/subcategories/index')));
const OrderForm = Loadable(lazy(() => import("../views/pages/orders/index")));
const AssignOrder = Loadable(
  lazy(() => import("../views/pages/assign_orders/index"))
);
const User = Loadable(lazy(() => import("../views/pages/users/index")));
const UnapprovedUser = Loadable(lazy(() => import("../views/pages/users/unapproved-users/index")));
const DeliveryPartner = Loadable(lazy(() => import("../views/pages/users/delivery-partners/index")));
const Corporate = Loadable(
  lazy(() => import("../views/pages/corporates/index"))
);
const EnquiryForm = Loadable(lazy(() => import('../views/pages/enquiries/index')));
const TermsAndConditionForm = Loadable(lazy(() => import('../views/pages/terms_and_conditions/index')));
const PrivacyPolicyForm = Loadable(lazy(() => import('../views/pages/privacy_policies/index')));

// utilities routing
const UtilsTypography = Loadable(
  lazy(() => import("../views/utilities/Typography"))
);
const UtilsColor = Loadable(lazy(() => import("../views/utilities/Color")));
const UtilsShadow = Loadable(lazy(() => import("../views/utilities/Shadow")));
const UtilsMaterialIcons = Loadable(
  lazy(() => import("../views/utilities/MaterialIcons"))
);
const UtilsTablerIcons = Loadable(
  lazy(() => import("../views/utilities/TablerIcons"))
);

// sample page routing
const SamplePage = Loadable(lazy(() => import("../views/sample-page")));
const AuthLogin3 = Loadable(
  lazy(() => import("../views/pages/authentication/authentication3/Login3"))
);
const NotFoundPage = Loadable(
  lazy(() => import("../views/utilities/notFound"))
);

// ==============================|| MAIN ROUTING ||============================== //

const superAdminRoutes = [
  {
    path: "/",
    element: <DashboardDefault />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/admin/dashboard",
    element: <DashboardDefault />,
  },
  {
    path: "/admin/book",
    element: <BookForm />,
  },
  {
    path: "/admin/author",
    element: <AuthorForm />,
  },
  {
    path: "/admin/publisher",
    element: <PublisherForm />,
  },
  {
    path: "/admin/category",
    element: <CategoryForm />,
  },
  {
    path: "/admin/enquiry",
    element: <EnquiryForm />,
  },
  {
    path: '/admin/subcategory',
    element: <SubcategoryForm />
  },
  {
    path: "/admin/orders",
    element: <OrderForm />,
  },
  {
    path: "/admin/assign_orders",
    element: <AssignOrder />,
  },
  {
    path: "/admin/users",
    element: <User />,
  },
  {
    path: "/admin/delivery_partners",
    element: <DeliveryPartner/>,
  },
  {
    path: "/admin/corporates",
    element: <Corporate />,
  },
  {
    path: "/admin/terms_and_condition",
    element: <TermsAndConditionForm />,
  },
  {
    path: "/admin/privacy_policy",
    element: <PrivacyPolicyForm />,
  },

  {
    path: "utils",
    children: [
      {
        path: "util-typography",
        element: <UtilsTypography />,
      },
    ],
  },
  {
    path: "utils",
    children: [
      {
        path: "util-color",
        element: <UtilsColor />,
      },
    ],
  },
  {
    path: "utils",
    children: [
      {
        path: "util-shadow",
        element: <UtilsShadow />,
      },
    ],
  },
  {
    path: "icons",
    children: [
      {
        path: "tabler-icons",
        element: <UtilsTablerIcons />,
      },
    ],
  },
  {
    path: "icons",
    children: [
      {
        path: "material-icons",
        element: <UtilsMaterialIcons />,
      },
    ],
  },
  {
    path: "sample-page",
    element: <SamplePage />,
  },
];

const adminRoutes = [
  {
    path: "/",
    element: <CorporateDashboard />,
  },
  {
    path: "/admin/dashboard",
    element: <CorporateDashboard />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/admin/approved_users",
    element: <User flag='approved' />,
  },
  {
    path: "/admin/unapproved_users",
    element: <UnapprovedUser/>,
  }
];

const routes = (data) => {
  console.log(`Corporate Name: ${data.corporate_name}`);
  console.log(`Role: ${data.role}`);
  return data.role == 'SuperAdmin' ? superAdminRoutes : adminRoutes;
};

const MainRoutes = (data) => {
  return {
    path: "/",
    element: <MainLayout />,
    children: routes(data),
  };
};

export default MainRoutes;