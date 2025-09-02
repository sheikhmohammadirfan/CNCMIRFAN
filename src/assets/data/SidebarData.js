import { Link } from "react-router-dom";
import { changeQueryParams } from "../../Components/Utils/Utils";
import { getUser } from "../../Service/UserFactory";

// Get user data to determine role-based visibility
const user = getUser();

/** Sidebar data for superadmin - only Organization */
const SuperAdminSidebarData = [
  {
    icon: "home",
    title: "Organization",
    component: Link,
    to: "/rbac/organization",
  },
];

/** Sidebar data for normal users - everything except Organization */
const NormalUserSidebarData = [
  {
    icon: "insert_chart",
    title: "Dashboard",
    component: Link,
    to: "/",
  },
  {
    icon: "manage_accounts",
    title: "Manage POA&M",
    component: Link,
    to: "/poam",
  },
  {
    icon: "description",
    title: "Document Compliance",
    subMenu: [
      {
        title: "Policies",
        component: Link,
        to: "/doc-compliance/policies",
      },
      {
        title: "Procedures",
        component: Link,
        to: "#",
      },
      {
        title: "Plans",
        component: Link,
        to: "#",
      },
      {
        title: "Artifacts",
        component: Link,
        to: "#",
      },
      {
        title: "Audit Reports",
        component: Link,
        to: "#",
      },
      {
        title: "Vendor Risk",
        component: Link,
        to: "#",
      },
      {
        title: "Templates",
        component: Link,
        to: "#",
      },
      {
        title: "Scan Results",
        component: Link,
        to: "#",
      },
      {
        title: "System Inventory",
        component: Link,
        to: "#",
      },
      {
        title: "System Diagrams",
        component: Link,
        to: "#",
      },
    ],
  },
  {
    icon: "verified",
    title: "Verify Compliance",
    component: Link,
    to: "#",
  },
  {
    icon: "category",
    title: "Security Controls Mapping",
    subMenu: [
      {
        title: "FEDRAMP / FISMA",
        component: Link,
        to: "#",
      },
      {
        title: "HIPAA",
        component: Link,
        to: "#",
      },
      {
        title: "PCI DSS",
        component: Link,
        to: "#",
      },
      {
        title: "ISO 27001",
        component: Link,
        to: "#",
      },
      {
        title: "CMMC",
        component: Link,
        to: "#",
      },
    ],
  },
  {
    icon: "repeat",
    title: "Continous Monitoring",
    component: Link,
    to: "#",
  },
  {
    icon: "merge_type",
    title: "Integration",
    component: Link,
    to: "/Integrated-Platforms",
  },
  {
    icon: "task",
    title: "My Tasks",
    component: Link,
    to: "#",
  },
  {
    icon: "drafts",
    title: "Email",
    component: Link,
    to: (obj) => ({
      ...obj,
      search: `?${changeQueryParams({ email: true })}`,
    }),
  },
  {
    icon: "store",
    title: "Vendor Management",
    collapseMenu: [
      {
        icon: "assessment",
        title: "Vendor Risk Dashboard",
        component: Link,
        to: "/vendor-management/risk-dashboard",
      },
      {
        icon: "search",
        title: "Requirement Analysis",
        component: Link,
        to: "/vendor-management/requirement-analysis",
      },
      {
        icon: "find_in_page",
        title: "Vendor Assessment",
        component: Link,
        to: "/vendor-management/assessment",
      },
      {
        icon: "shopping_cart",
        title: "Vendor Procurement",
        component: Link,
        to: "/vendor-management/procurement",
      },
      {
        icon: "person_add",
        title: "Onboard Vendor",
        component: Link,
        to: "/vendor-management/onboard",
      },
      {
        icon: "security",
        title: "Security Review",
        component: Link,
        to: "/vendor-management/security-review",
      },
      {
        icon: "assignment",
        title: "Compliance Reports",
        component: Link,
        to: "/vendor-management/compliance-reports",
      },
      {
        icon: "settings",
        title: "Vendor Settings",
        component: Link,
        to: "/vendor-management/settings",
      },
    ],
  },
  {
    icon: "warning",
    title: "Risk Management",
    collapseMenu: [
      {
        title: "Risk Library",
        component: Link,
        to: "/risk-management/risk-library",
        icon: "menu_book",
      },
      {
        title: "Risk Register",
        component: Link,
        to: "/risk-management/risk-register",
        icon: "list",
      },
      {
        title: "Action Tracker",
        component: Link,
        to: "/risk-management/action-tracker",
        icon: "timeline",
      },
      {
        title: "AI Agent",
        component: Link,
        to: "/risk-management/agent",
        icon: "smart_toy",
      },
      {
        title: "Settings",
        component: Link,
        to: "/risk-management/settings",
        icon: "settings",
      },
    ],
  },
  {
    icon: "accessibility",
    title: "Access Management",
    collapseMenu: [
      {
        title: "Accounts",
        component: Link,
        to: "/access-management/accounts",
        icon: "menu_book",
      },
      {
        title: "Reviews",
        component: Link,
        to: "/access-management/reviews",
        icon: "list",
      },
      {
        title: "Settings",
        component: Link,
        to: "/access-management/settings",
        icon: "settings",
      },
    ],
  },
  {
    icon: "shield_person",
    title: "Role based access control",
    collapseMenu: [
      {
        title: "Users",
        component: Link,
        to: "/rbac/users",
        icon: "manage_accounts",
      },
      {
        title: "Roles",
        component: Link,
        to: "/rbac/roles",
        icon: "key",
      },
    ],
  },
];

// Function to get sidebar data based on user role, dynamically. irfan.
export const getSidebarData = () => {
  const user = getUser();
  return user?.is_superuser ? SuperAdminSidebarData : NormalUserSidebarData;
};
