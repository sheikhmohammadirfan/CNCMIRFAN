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
        to: "/services/services1",
      },
      {
        title: "Procedures",
        component: Link,
        to: "/services/services2",
      },
      {
        title: "Plans",
        component: Link,
        to: "/services/services3",
      },
      {
        title: "Artifacts",
        component: Link,
        to: "/services/services3",
      },
      {
        title: "Audit Reports",
        component: Link,
        to: "/services/services3",
      },
      {
        title: "Vendor Risk",
        component: Link,
        to: "/services/services3",
      },
      {
        title: "Templates",
        component: Link,
        to: "/services/services3",
      },
      {
        title: "Scan Results",
        component: Link,
        to: "/services/services3",
      },
      {
        title: "System Inventory",
        component: Link,
        to: "/services/services3",
      },
      {
        title: "System Diagrams",
        component: Link,
        to: "/services/services3",
      },
    ],
  },
  {
    icon: "verified",
    title: "Verify Compliance",
    component: Link,
    to: "/verify",
  },
  {
    icon: "category",
    title: "Security Control Mapping",
    subMenu: [
      {
        title: "FEDRAMP / FISMA",
        component: Link,
        to: "/services/services1",
      },
      {
        title: "HIPAA",
        component: Link,
        to: "/services/services2",
      },
      {
        title: "PCI DSS",
        component: Link,
        to: "/services/services3",
      },
      {
        title: "ISO 27001",
        component: Link,
        to: "/services/services3",
      },
    ],
  },
  {
    icon: "repeat",
    title: "Continous Monitoring",
    component: Link,
    to: "/events",
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
    to: "/events",
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
];
