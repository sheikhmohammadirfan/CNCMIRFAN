export const ROLES_MOCK = [
  {
    "name": "John Smith",
    "poam_view": true,
    "poam_edit": false,
    "rm_view": true,
    "rm_edit": true,
    "am_review": false,
    "am_review_approve": true
  },
  {
    "name": "Emily Johnson",
    "poam_view": false,
    "poam_edit": true,
    "rm_view": true,
    "rm_edit": false,
    "am_review": true,
    "am_review_approve": false
  },
  {
    "name": "Carlos Ramirez",
    "poam_view": true,
    "poam_edit": true,
    "rm_view": false,
    "rm_edit": false,
    "am_review": true,
    "am_review_approve": true
  },
  {
    "name": "Sophia Lee",
    "poam_view": false,
    "poam_edit": false,
    "rm_view": true,
    "rm_edit": true,
    "am_review": true,
    "am_review_approve": false
  },
  {
    "name": "Liam Brown",
    "poam_view": true,
    "poam_edit": true,
    "rm_view": false,
    "rm_edit": false,
    "am_review": false,
    "am_review_approve": true
  }
]

export const PERMISSIONS_MOCK = [
  {
    permission: 'poam_view',
    text: 'POA&M View blah blah blah',
  },
  {
    permission: 'poam_edit',
    text: 'POA&M Edit'
  },
  {
    permission: 'rm_view',
    text: 'RM View',
  },
  {
    permission: 'rm_edit',
    text: 'RM Edit'
  },
  {
    permission: 'am_review',
    text: 'AM Review',
  },
  {
    permission: 'am_review_approve',
    text: 'AM Review Approve'
  },
]