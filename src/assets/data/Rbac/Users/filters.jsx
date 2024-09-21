const USER_FILTERS = {
  roles: {
    name: "roles",
    text: "Roles",
    order: 1,
    options: []
  },
  status: {
    name: "status",
    text: "Status",
    order: 2,
    options: [
      {
        id: 0,
        text: 'Inactive'
      },
      {
        id: 1,
        text: 'Active'
      },
      {
        id: 2,
        text: 'Invited'
      },
    ]
  },
}

export default USER_FILTERS