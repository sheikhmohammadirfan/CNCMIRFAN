import React, { useEffect, useState } from 'react'
import actionTrackerFilters from '../../../assets/data/RiskManagement/ActionTracker/ActionTrackerFilters'
import { Box } from '@material-ui/core';
import ActionTrackerHeader from './ActionTrackerHeader';
import AddActionDialog from '../AddActionDialog';
import { getRegister } from '../../../Service/RiskManagement/RiskRegister.service';

const ActionTracker = ({
  owners: { owners, getOwners }
}) => {

  // Get filters to show in table header
  const [filterDropdowns, setFilterDropdowns] = useState(actionTrackerFilters);

  const [filters, setFilters] = useState({
    assignee: [],
    falcon_status: [],
    integration_status: []
  })
  const changeFilters = (filterName, itemId) => {
    setFilters(prev => {
      // Getting prev filters array of the filter
      let currentFilters = prev[filterName];
      // If id is already in filter, remove it, else add the id
      let updatedFilterIds = currentFilters.includes(itemId)
        ? currentFilters.filter((id) => id !== itemId)
        : [...currentFilters, itemId]
      return ({
        ...prev,
        [filterName]: updatedFilterIds
      })
    })
  }
  const clearFilters = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: []
    }))
  }

  const [selectedRows, setSelectedRows] = useState([])

  const [register, setRegister] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await getRegister()
      // console.log(owners);
      // console.log(data.map(row => ({ id: row["ID"], val: JSON.parse(row["Scenario"]).description })));
      setRegister(() => data.map(row => ({
        val: row["ID"],
        text: JSON.parse(row["Scenario"]).description,
      })));
    })()
  }, [owners])

  const [actionDialog, setActionDialog] = useState(false);
  const openAddActionForm = () => setActionDialog(true);
  const closeAddActionForm = () => setActionDialog(false);

  const handleAddActionFormSubmit = (values) => {
    const payload = {
      risk_id: values.risk,
      description: register.find(row => row.val === values.risk).text,
      due_date: values.due_date,
      assignee: owners.find(owner => owner.val === values.owner).id,
      notes: values.notes,
      source_id: 1,
    }
    console.log(payload);

  }

  return (
    <Box>

      <Box>
        <ActionTrackerHeader
          tableFilters={filterDropdowns}
          filters={{ filters, changeFilters, clearFilters }}
          selectedRows={selectedRows}
          openAddActionForm={openAddActionForm}
        />
      </Box>

      <AddActionDialog
        open={actionDialog}
        closeHandler={closeAddActionForm}
        register={register}
        owners={owners}
        onFormSubmit={handleAddActionFormSubmit}
      />

    </Box>
  )
}

export default ActionTracker