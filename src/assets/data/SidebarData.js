import { Link } from "react-router-dom";

/** Sidebar data to map */
export const SidebarData = [
  {
    icon: "description",
    title: "Document Compliance",
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
    title: "Complaince Framework",
    component: Link,
    to: "/contact",
    icon: "crop_free",
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
    title: "Settings",
    component: Link,
    to: "",
    icon: "settings",
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
  {
    title: "MY TASKS",
    component: Link,
    to: "/events",
    icon: "task",
  },
  {
    title: "Manage Artifacts",
    component: Link,
    to: "/support",
    icon: "manage_accounts",
  },
];
