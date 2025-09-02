import { Box, Chip, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import SettingsHeader from './SettingsHeader'
import { HeaderCell, generateRows, mapDataToHeader, useStyle } from './SettingsUtils'
import DataTable from '../../Utils/DataTable/DataTable'
import { SCORE_COLS, SCORE_COL_WIDTHS, SCORE_GROUP_COLS, SCORE_GROUP_COL_WIDTHS } from '../../../assets/data/RiskManagement/Settings/SettingsColumns'
import RadioControl from '../../Utils/Control/Radio.control'
import RiskManagementContext from '../RiskManagementContext'

const Settings = () => {

  // Using context to get values
  const { categories: { categories, setCategories }, scores: { likelihoodScores, impactScores }, scoreGroups: { riskScoreGroups } } = useContext(RiskManagementContext);

  const [categoryList, setCategoryList] = useState([]);
  useEffect(() => {
    setCategoryList(categories);
  }, [categories]);


  const [likelihoodSelectedRow, setLikelihoodSelectedRow] = useState([])
  const [impactSelectedRow, setImpactSelectedRow] = useState([])
  const [scoreGroupSelectedRow, setScoreGroupSelectedRow] = useState([]);

  const [matchedCell, setMatchedCell] = useState([]);

  const preferenceOptions = useMemo(() => {
    return [
      {
        val: 'always_add',
        text: 'Always add recommended controls'
      },
      {
        val: 'ask_every_time',
        text: 'Ask me every time if I want to add recommended controls'
      },
      {
        val: 'never_add',
        text: 'Never add recommended controls'
      }
    ]
  }, [])

  const handleCategoryClick = (e) => {

  }

  // Map data to header
  const mapTableHeader = (cols) =>
    mapDataToHeader(cols);

  // Map data to body
  const mapTableBody = (data, cols, selectedRow) =>
    generateRows(
      data,
      cols,
      selectedRow,
      matchedCell,
      // sortingMap
    );

  const classes = useStyle();

  return (
    <Box display="flex" flexDirection="column" rowGap={4} pb={10}>

      <Box>
        <Typography variant='h6' color='primary' fontWeight='bold' sx={{ opacity: 0.8 }}>Risk Management Settings</Typography>
        <Typography sx={{ fontSize: '0.9rem', opacity: 0.8 }}>Manage your settings across risk management module from here.</Typography>
      </Box>

      <Box>
        <SettingsHeader title="Preferences" />
        <Box
          p={2}
          border={1}
          sx={{
            backgroundColor: '#fff',
            borderColor: '#d9d9d9'
          }}
        >
          <Typography variant="body2" color="initial" sx={{ opacity: 0.9 }}>When adding risk scenario from Falcon Library, </Typography>
          <Box>
            <RadioControl
              name="treatment_plan"
              hideLabel={true}
              direction="column"
              options={preferenceOptions}
              styleProps={{ className: classes.radioControl }}
              radioGroupProps={{
                style: {
                  marginTop: '10px'
                }
              }}
              radioProps={{
                size: 'small'
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box>
        <SettingsHeader
          title="Custom Categories"
          showActionButtons={true}
          categoryList={categoryList}
          setCategoryList={setCategoryList}
          setCategories={setCategories}
        />
        <Box
          p={2}
          border={1}
          sx={{
            backgroundColor: '#fff',
            borderColor: '#d9d9d9'
          }}
          display="flex"
          flexWrap='wrap'
          gap={1}
        >
          {categories.map((cat, index) => (
            <Chip key={index} className={classes.categoryChip} label={cat.category_name} />
          ))}
        </Box>
      </Box>

      <Box>
        <SettingsHeader title="Custom Fields" />
        <Box
          p={2}
          border={1}
          sx={{
            backgroundColor: '#fff',
            borderColor: '#d9d9d9'
          }}
          gap={1}
          textAlign='center'
        >
          <Typography sx={{ fontSize: '0.9rem', opacity: 0.8 }}>No custom fields added</Typography>
        </Box>
      </Box>

      <Box>
        <SettingsHeader title="Likelihood Scoring Scale" />
        <Grid
          container
          spacing={1}
          className={classes.gridContainer}
        >
          <Grid
            item
            xs={12}
          >
            <DataTable
              className={classes.tableStyle}
              verticalBorder={true}
              header={mapTableHeader(SCORE_COLS)}
              rowList={mapTableBody(likelihoodScores || [], SCORE_COLS, likelihoodSelectedRow)}
              checkbox={false}
              minCheckboxWidth={50}
              serialNo={false}
              resizeTable={false}
              resizeAfterColumns={1}
              selectedRows={likelihoodSelectedRow}
              setSelectedRows={setLikelihoodSelectedRow}
              headerWrapper={(text) => <HeaderCell text={text} />}
              // rowWrapper={(text, colName) => <RowCell text={text} column={colName} />}
              style={{ borderRadius: 5, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
              minCellWidth={SCORE_COLS.map(
                (name) => SCORE_COL_WIDTHS[SCORE_COLS.indexOf(name)]
              )}
            />
          </Grid>
        </Grid>
      </Box>

      <Box>
        <SettingsHeader title="Impact Scoring Scale" />
        <Grid
          container
          spacing={1}
          className={classes.gridContainer}
        >
          <Grid
            item
            xs={12}
          >
            <DataTable
              className={classes.tableStyle}
              verticalBorder={true}
              header={mapTableHeader(SCORE_COLS)}
              rowList={mapTableBody(impactScores || [], SCORE_COLS, impactSelectedRow)}
              checkbox={false}
              minCheckboxWidth={50}
              serialNo={false}
              resizeTable={false}
              resizeAfterColumns={1}
              selectedRows={impactSelectedRow}
              setSelectedRows={setImpactSelectedRow}
              headerWrapper={(text) => <HeaderCell text={text} />}
              // rowWrapper={(text, colName) => <RowCell text={text} column={colName} />}
              style={{ borderRadius: 5, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
              minCellWidth={SCORE_COLS.map(
                (name) => SCORE_COL_WIDTHS[SCORE_COLS.indexOf(name)]
              )}
            />
          </Grid>
        </Grid>
      </Box>

      <Box>
        <SettingsHeader title="Score Groups" />
        <DataTable
          className={classes.tableStyle}
          verticalBorder={true}
          header={mapTableHeader(SCORE_GROUP_COLS)}
          rowList={mapTableBody(riskScoreGroups || [], SCORE_GROUP_COLS, impactSelectedRow)}
          checkbox={false}
          minCheckboxWidth={50}
          serialNo={false}
          resizeTable={false}
          resizeAfterColumns={1}
          selectedRows={scoreGroupSelectedRow}
          setSelectedRows={setScoreGroupSelectedRow}
          headerWrapper={(text) => <HeaderCell text={text} />}
          // rowWrapper={(text, colName) => <RowCell text={text} column={colName} />}
          style={{ borderRadius: 5, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
          minCellWidth={SCORE_GROUP_COLS.map(
            (name) => SCORE_GROUP_COL_WIDTHS[SCORE_GROUP_COLS.indexOf(name)]
          )}
        />
      </Box>

    </Box>
  )
}

export default Settings