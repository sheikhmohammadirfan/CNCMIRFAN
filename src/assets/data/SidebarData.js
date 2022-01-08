import { Link } from "react-router-dom";

/** Sidebar data to map */
export const SidebarData = [
  {
    icon: "description",
    title: "Compliance Documention",
    component: Link,
    to: "/about-us",
  },
  {
    icon: "verified",
    title: "Verify Complaince",
    component: Link,
    to: "/verify",
  },
  {
    icon: "manage_accounts",
    title: "Manage Artifacts",
    component: Link,
    to: "/support",
  },
  {
    icon: "category",
    title: "Complaince Mapping",
    component: Link,
    to: "/contact",
    subMenu: [
      {
        title: "FEDRAMP / FISMA",
        component: Link,
        to: "/services/services1",
        icon: "star",
      },
      {
        title: "HIPAA",
        component: Link,
        to: "/services/services2",
        icon: "star",
      },
      {
        title: "PCI DSS",
        component: Link,
        to: "/services/services3",
        icon: "star",
      },
      {
        title: "ISO 27001",
        component: Link,
        to: "/services/services3",
        icon: "star",
        subMenu: [
          {
            title: "Compliance",
            component: Link,
            to: "/events",
            icon: "star",
          },
          {
            title: "MY TASKS",
            component: Link,
            to: "/events",
            icon: "star",
          },
          {
            title: "MY TASKS",
            component: Link,
            to: "/events",
            icon: "star",
          },
          {
            title: "MY TASKS",
            component: Link,
            to: "/events",
            icon: "star",
          },
        ],
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
    icon: "settings",
    title: "Settings",
    component: Link,
    to: "",
    subMenu: [
      {
        title: "Compliance",
        component: Link,
        to: "/events",
        icon: "star",
        subMenu: [
          {
            title: "Compliance",
            component: Link,
            to: "/events",
            icon: "star",
          },
          {
            title: "MY TASKS",
            component: Link,
            to: "/events",
            icon: "star",
          },
          {
            title: "MY TASKS",
            component: Link,
            to: "/events",
            icon: "star",
          },
          {
            title: "MY TASKS",
            component: Link,
            to: "/events",
            icon: "star",
          },
        ],
      },
      {
        title: "MY TASKS",
        component: Link,
        to: "/events",
        icon: "star",
      },
      {
        title: "MY TASKS",
        component: Link,
        to: "/events",
        icon: "star",
        subMenu: [
          {
            title: "Compliance",
            component: Link,
            to: "/events",
            icon: "star",
          },
          {
            title: "MY TASKS",
            component: Link,
            to: "/events",
            icon: "star",
          },
          {
            title: "MY TASKS",
            component: Link,
            to: "/events",
            icon: "star",
          },
          {
            title: "MY TASKS",
            component: Link,
            to: "/events",
            icon: "star",
          },
        ],
      },
      {
        title: "MY TASKS",
        component: Link,
        to: "/events",
        icon: "star",
      },
    ],
  },
];
