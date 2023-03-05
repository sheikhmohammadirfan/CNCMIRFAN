import { Link } from "react-router-dom";
import { changeQueryParams } from "../../Components/Utils/Utils";

/** Sidebar data to map */
export const SidebarData = [
  {
    icon: "description",
    title: "Document Compliance",
    component: Link,
    to: "/about-us",
    subMenu: [
      {
        title: "Policies",
        component: Link,
        to: "/services/services1",
        icon: "",
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
    icon: "manage_accounts",
    title: "Manage POA&M",
    component: Link,
    to: "/poam",
  },
  {
    icon: "category",
    title: "Security Control Mapping",
    component: Link,
    to: "/contact",
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
    icon: "task",
    title: "My Audit Tasks",
    component: Link,
    to: "/events",
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
    title: "Utility",
    icon: "more_horiz",
    subMenu: [
      {
        title: "Email",
        component: Link,
        to: (obj) => ({
          ...obj,
          search: `?${changeQueryParams({ email: true })}`,
        }),
      },
    ],
  },
];
