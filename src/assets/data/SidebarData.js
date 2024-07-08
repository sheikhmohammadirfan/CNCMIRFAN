import { Link } from "react-router-dom";
import { changeQueryParams } from "../../Components/Utils/Utils";

/** Sidebar data to map */
export const SidebarData = [
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
        to: "#",
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
    to: "/Integrated_Platforms",
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
    subMenu: [
      {
        icon: "assessment",
        title: "Vendor Risk Dashboard",
        component: Link,
        to: "/vendor_management/risk_dashboard",
      },
      {
        icon: "search",
        title: "Requirement Analysis",
        component: Link,
        to: "/vendor_management/requirement_analysis",
      },
      {
        icon: "find_in_page",
        title: "Vendor Assessment",
        component: Link,
        to: "/vendor_management/assessment",
      },
      {
        icon: "shopping_cart",
        title: "Vendor Procurement",
        component: Link,
        to: "/vendor_management/procurement",
      },
      {
        icon: "person_add",
        title: "Onboard Vendor",
        component: Link,
        to: "/vendor_management/onboard",
      },
      {
        icon: "security",
        title: "Security Review",
        component: Link,
        to: "/vendor_management/security_review",
      },
      {
        icon: "assignment",
        title: "Compliance Reports",
        component: Link,
        to: "/vendor_management/compliance_reports",
      },
      {
        icon: "settings",
        title: "Vendor Settings",
        component: Link,
        to: "/vendor_management/settings",
      },
    ],
  },
];
