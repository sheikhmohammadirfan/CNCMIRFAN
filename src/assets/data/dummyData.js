import slack from "../img/integration/slack-2.svg";
import aws from "../img/integration/aws-2.svg";
import googleCloud from "../img/integration/google-cloud-3.svg";
import github from "../img/integration/github-icon-1.svg";
import jira from "../img/integration/jira-1.svg";
import teams from "../img/integration/teams.png";

/** Dummy userData for charts */
export const userData = [
  { name: "Jan", "Active User": 4000 },
  { name: "Feb", "Active User": 3000 },
  { name: "Mar", "Active User": 5000 },
  { name: "Apr", "Active User": 4000 },
  { name: "May", "Active User": 3000 },
  { name: "Jun", "Active User": 2000 },
  { name: "Jul", "Active User": 4000 },
  { name: "Agu", "Active User": 3000 },
  { name: "Sep", "Active User": 4000 },
  { name: "Oct", "Active User": 1000 },
  { name: "Nov", "Active User": 4000 },
  { name: "Dec", "Active User": 3000 },
];

export const integratedPlatforms = [
  {
    name: "Jira",
    image: jira,
    onClick: (setter) => {
      setter("Jira");
    },
  },
  {
    name: "Teams",
    image: teams,
    onClick: () => {},
  },
  {
    name: "Slack",
    image: slack,
    onClick: () => {},
  },
  {
    name: "AWS",
    image: aws,
    onClick: () => {},
  },
  {
    name: "Google Cloud",
    image: googleCloud,
    onClick: () => {},
  },
  {
    name: "GitHub",
    image: github,
    onClick: () => {},
  },
];
