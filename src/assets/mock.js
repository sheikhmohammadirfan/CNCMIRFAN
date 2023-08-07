export const SUCCESS = { status: true };

export const FAILURE = { status: false };

export const login = {
  data: {
    access: "JWT",
    user: {
      first_name: "Hello",
      last_name: "Falcon",
      contact_no: "+91-1234567890",
      city: "Mumbai",
      state: "Austin",
      postal_code: "410901",
      country: "UK",
    },
    integration: {
      jira: true,
      teams: false,
      github: true,
    },
  },
  status: true,
};

export const updateProfile = (data) => ({ data: data, status: false });

export const getFiles = {
  data: [
    {
      id: 1,
      file_name: "File #1",
    },
    {
      id: 2,
      file_name: "File #2",
    },
    {
      id: 3,
      file_name: "File #3",
    },
  ],
  status: true,
};

export const fetchProjects = {
  data: [
    { key: "1", name: "Project 1" },
    { key: "2", name: "Project 2" },
    { key: "3", name: "Project 3" },
  ],
  status: true,
};

export const fetchIssueTypes = {
  data: ["Issue #1", "Issue #2"],
  status: true,
};

export const fetchAssignee = {
  data: [
    {
      id: "1",
      displayName: "Assignee 1",
      avatarUrls:
        "https://plus.unsplash.com/premium_photo-1661698976513-94ddedafbfa8",
    },
    {
      id: "2",
      displayName: "Assignee 2",
      avatarUrls:
        "https://plus.unsplash.com/premium_photo-1661698976513-94ddedafbfa8",
    },
    {
      id: "3",
      displayName: "Assignee 3",
      avatarUrls:
        "https://plus.unsplash.com/premium_photo-1661698976513-94ddedafbfa8",
    },
  ],
  status: true,
};

export const fetchPriority = {
  data: ["Prority #1", "Prority #2", "Prority #3"],
  status: true,
};

export const fetchEpicLink = {
  data: [
    { id: "Epic-1", summary: "Lorem Ipsum 1" },
    { id: "Epic-2", summary: "Lorem Ipsum 2" },
    { id: "Epic-3", summary: "Lorem Ipsum 3" },
  ],
  status: true,
};

export const fetchComponents = {
  data: ["Component #1", "Component #2", "Component #3"],
  status: true,
};

export const fetchSprint = {
  data: [
    { id: "101", name: "Sprint-101" },
    { id: "102", name: "Sprint-102" },
    { id: "103", name: "Sprint-103" },
  ],
  status: true,
};

export const fetchIssueDetails = {
  data: {
    project: "1",
    issue_key: "IS-102",
    issuetype: "Issue #2",
    summary: "Issue summary",
    description: "Lorem ipsum",
    reporter: "2",
    assignee: "1",
    labels: ["Label-1", "label-2"],
    priority: "Prority #1",
    customfield_10014: "Epic-3",
    components: "Component #2",
    customfield_10020: "102",
    duedate: "2023-10-10",
  },
  status: true,
};

export const createIssue = {
  message: "Issue x created successfully",
  status: true,
};

export const updateIssue = {
  message: "Issue x updated successfully",
  status: true,
};

export const createPoam = {
  data: { file_id: "10" },
  status: true,
};

export const uploadPoam = {
  data: { file_id: "11" },
  status: true,
};

export const getCSP = {
  data: {
    csp: "CSP NAME",
  },
  status: true,
};

export const getData = {
  data: {
    file_name: "POAM File 1",
    csp: "CSP 100",
    system_name: "Healthcase",
    agency_name: "Agency",
    open_data: {
      "POAM ID": {
        0: "V-000",
        1: "V-001",
        3: "V-002",
        4: "V-003",
        5: "V-004",
      },
      Controls: {
        0: "RA-1",
        1: "RA-2",
        3: "SP-2",
        4: "CC-1",
        5: "CC-2",
      },
      "Weakness Name": {
        0: `Name of the weakness as provided by the scanner or otherwise summarizing the weakness`,
        1: `K8s DeaemonSet not managed by the package system

        Plugin ID: 338
        
        CVE(s): None`,
        3: `RDP Doesn't Use Network Level Authentication (NLA) Only

        Plugin ID: 58432
        
        CVE(s): None`,
        4: `External Information System used within boundary`,
        5: `Use of Deprecated Signer Certificate`,
      },
      "Weakness Description": {
        0: ``,
        1: `Some daemon processes on the remote host are associated with programs that have been installed manually.`,
        3: ``,
        4: `Non FedRAMP services used within the boundary`,
        5: `If the HttpOnly attribute is set on a cookie, then the cookie's value cannot be read or set by client-side JavaScript. This measure makes certain client-side attacks, such as cross-site scripting, slightly harder to exploit by preventing them from trivially capturing the cookie's value via an injected script.`,
      },
      "Weakness Detector Source": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Weakness Source Identifier": {
        0: ``,
        1: ``,
        3: `33851

        SAR Table 4-1 RET Identifier: V061-RA-5`,
        4: ``,
        5: ``,
      },
      "Asset Identifier": {
        0: `10.10.20.184`,
        1: ``,
        3: `Android mobile application`,
        4: ``,
        5: `https://ISEE-console.ACME Inc.com/en/, https://ISEE-console.ACME Inc.com/zconfig.js, https://ISEE-console.ACME Inc.com/auth/login/
        https://ISEE-console.ACME Inc.com/static/klmConsole/js/klmConsole.app.templates.js
        https://ISEE-console.ACME Inc.com/static/klmConsole/js/klmConsole.zstrap.templates.js`,
      },
      "Point of Contact": {
        0: ``,
        1: `Andy Jessy`,
        3: ``,
        4: ``,
        5: `Andy Jessy`,
      },
      "Resources Required": {
        0: ``,
        1: ``,
        3: ``,
        4: `TBD`,
        5: `TBD`,
      },
      "Overall Remediation Plan": {
        0: ``,
        1: ``,
        3: `Review the full list of external servISEEs being used, and track and monitor these vendors until they have received either a JAB P-ATO or an Agency ATO.  Additionally, limit any exposure of government data or metadata to these servISEEs.`,
        4: `The signing key must be upgraded on the Android Application.`,
        5: `There is usually no good reason not to set the HttpOnly flag on all cookies. Unless you specifically require legitimate client-side scripts within your application to read or set a cookie's value, you should set the HttpOnly flag by including this attribute within the relevant Set-cookie directive.
        You should be aware that the restrictions imposed by the HttpOnly flag can potentially be circumvented in some circumstances, and that numerous other serious attacks can be delivered by client-side script injection, aside from simple cookie stealing.`,
      },
      "Original Detection Date": {
        0: `2/5/2020`,
        1: ``,
        3: ``,
        4: `1/7/2019`,
        5: `1/25/2019`,
      },
      "Scheduled Completion Date": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Planned Milestones": {
        0: ``,
        1: ``,
        3: `(1) 2019/01/25: Vulnerability is being researched for remediation actions.`,
        4: `(1)2020/11/10: Scheduling window to remediate issue before next scan cycle.`,
        5: ``,
      },
      "Milestone Changes": {
        0: ``,
        1: ``,
        3: `(1) New 2019-01-25: The vulnerability was newly identified and there is no changes as of 1/25/2019 for the planned milestones.
        (2) Update 2019-03-06: There were no changes to the planned milestones as of 3/6/2019.
        (3) Update 2019-05-03: There were no changes to the planned milestones.
        (4) Update 2019-05-09: This finding/issue has been raised with ABC-SaaS Development Team to investigate and recommend mitigation action.
        (5) Update 2019-07-10: There were no changes to the planned milestones.
        (6) Update 2019-08-16:  Vulnerability was updated with the deviation rationale and supporting evidence references.
        (7) Update 2019-09-09: Deviation request is pending Agency approval.  There were no changes for the planned milestones.
        (8-11) Updated: This vulnerability had no changes to the milestone as of 10/9/2019, 11/6/2019, 12/4/2019, and 1/10/2020 and will be re-evaluated during the assessment.
        (12) Update 2020-2-7: This vulnerability will be assessed for closure during the 3PAO assessment (February 2020).
        (13) Update 2020-3-6: This vulnerability had no changes to the milestone and is being assessed for closure during the 3PAO assessment.
        (14) Update 2020-4-7: This vulnerability had no changes to the milestone.  
        (15) Update 2020-5-8: This vulnerability had no changes to the milestone.  Two duplicate vulnerabilities (V-172-PF-03, V-173-PF-04) were merged into this vulnerability.
        (16-19) Update 2020-6-10: This vulnerability had no changes to the milestone as of 6/10/2020, 6/30/2020, 8/5/2020, 9/4/2020, and 10/13/2020. 
        (20) Update 2020-11-10: This vulnerability had no changes to milestone
        (21) Update 2020-12-4: This vulnerability had no changes to milestone
        (22) Update 2020-12-11: This vulnerability had no changes to milestone
        (23) Update 2020-12-14: This vulnerability had no changes to milestone.
        (25-30) No update to milestone on 1-5-2021, 2-9-2021, 3-9-2021, 4-6-2021, 7-14-2021, 2021-08-13`,
        4: `(1) New 2020-11-10: The vulnerability was newly identified and is planned to be remediated before next scanning cycle.
        (2) Update 2020-12-4: This vulnerability had no changes to milestone
        (3) Update 2020-12-11: This vulnerability had no changes to milestone
        (4) Update 2020-12-14: Operation Requirement set to pending. Deviation Rationale documented.
        (25-28) No update to milestone on 1-5-2021, 2-9-2021, 3-9-2021, 4-6-2021
        (29-31) No changes occurred to this vulnerability milestone, updated 2021-06-14, 2021-07-14, 2021-08-13`,
        5: ``,
      },
      "Status Date": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Vendor Dependency": {
        0: ``,
        1: ``,
        3: `No`,
        4: ``,
        5: ``,
      },
      "Last Vendor Check-in Date": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Vendor Dependent Product Name": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Original Risk Rating": {
        0: ``,
        1: ``,
        3: `Low`,
        4: ``,
        5: `Moderate`,
      },
      "Adjusted Risk Rating": {
        0: ``,
        1: ``,
        3: `No`,
        4: ``,
        5: ``,
      },
      "Risk Adjustment": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "False Positive": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Operational Requirement": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Deviation Rationale": {
        0: ``,
        1: ``,
        3: `This devISEE has a windows operating system within a environment that does not have active directory.  AWS trouble shooting guidance for connecting to the in instance stated within the manual steps for the network level authentication configuration to be disabled on the instance that was not part of an active directory domain.  Asset affected is only privately accessible using internal IP addresses.  The rule of least access is applied and NACLs and Security Groups are leveraged to prevent access from non-authorized components of the private network.  All traffic from customers/devISEEs comes through an RDP with a valid self-signed certificate. In addition, Burp Suite server will be disabled (powered off) when not in use.`,
        4: ``,
        5: `The URLs do not have the HttpOnly attribute set on the cookie because this flag does not provide practical protection and the CSRF cookie only protects against cross-domain attacks.  If the attacker can read the cookie via JavaScript, then they are already on the same domain. The URLs were single page applications with JavaScript that require the ability to access the CSRF cookie and send it via AJAX requests. If HttpOnly flag is enabled, the cookie must be pulled from a hidden CSRF token form input. However, the JavaScript is not capable of pulling the value from a hidden CSRF token form input instead of the cookie because the page is a single page design and the CRSF token pulled from a form has the potential of not matching the one issued by the server.`,
      },
      "Supporting Documents": {
        0: ``,
        1: ``,
        3: ``,
        4: `Remediation Evidence : v-246 MSP-Inc SIEM Filebeat 2020-12-14.png
        Deviation Request : FedRAMP Vulnerability DR Form_ACME Inc ABC-SaaS_12.2020.xlsx`,
        5: `Remediation Evidence : None
        Deviation Request : FedRAMP Vulnerability DR Form_ACME Inc ABC-SaaS_2.2019.xlsx,  FedRAMP Vulnerability DR Form_ACME Inc ABC-SaaS_4.2019_Approved_043019.xlsx`,
      },
      Comments: {
        0: ``,
        1: ``,
        3: `None`,
        4: `None`,
        5: `None`,
      },
      "Auto-Approve": {
        0: ``,
        1: ``,
        3: `Yes`,
        4: `No`,
        5: `No`,
      },
      justification: {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      jira_issues: {
        0: ``,
        1: ``,
        3: ``,
        4: "IS-102",
        5: ``,
      },
    },
    closed_data: {
      "POAM ID": {
        0: "V-000",
        1: "V-101",
        3: "V-202",
        4: "V-303",
        5: "V-304",
      },
      Controls: {
        0: `SI-2`,
        1: `SI-2`,
        3: `SI-2`,
        4: ``,
        5: ``,
      },
      "Weakness Name": {
        0: `Fortinet FortiGate <= 5.2.x / 5.4.x < 5.4.9 / 5.6.x < 5.6.3 Multiple Vulnerabilities (FG-IR-17-231, FG-IR-17-245 and FG-IR-17-172)

        Plugin ID: 110415
        
        CVE(s): CVE-2017-14187, CVE-2017-7738, CVE-2017-14185`,
        1: ``,
        3: ``,
        4: `Amazon Linux AMI : python-paramiko (ALAS-2018-1096)

        Plugin ID: 118363
        
        CVE(s): CVE-2018-1000805`,
        5: ``,
      },
      "Weakness Description": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Weakness Detector Source": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Weakness Source Identifier": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Asset Identifier": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Point of Contact": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Resources Required": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Overall Remediation Plan": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Original Detection Date": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Scheduled Completion Date": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Planned Milestones": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Milestone Changes": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Status Date": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Vendor Dependency": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Last Vendor Check-in Date": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Vendor Dependent Product Name": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Original Risk Rating": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Adjusted Risk Rating": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Risk Adjustment": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "False Positive": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Operational Requirement": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Deviation Rationale": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Supporting Documents": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      Comments: {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      "Auto-Approve": {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      justification: {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
      jira_issues: {
        0: ``,
        1: ``,
        3: ``,
        4: ``,
        5: ``,
      },
    },
  },
  status: true,
};

export const getPoamList = {
  data: {
    10: "POA&M 1",
    12: "POA&M 2",
    13: "POA&M 3",
  },
  status: true,
};

export const addRow = (data) => ({ data, status: true });

export const updateRow = (data) => ({ data, status: true });


