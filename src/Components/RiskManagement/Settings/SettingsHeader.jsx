import { Button, Icon, makeStyles, Box, Typography, useMediaQuery, useTheme, TextField } from '@material-ui/core';
import React, { useRef, useState } from 'react'
import colorShader from '../../Utils/ColorShader';
import { notification } from '../../Utils/Utils';
import { createCategory } from '../../../Service/RiskManagement/RiskRegister.service';
import { getUser } from '../../../Service/UserFactory';

const useStyle = makeStyles(theme => ({
  actionButton: {
    backgroundColor: colorShader(theme.palette.primary.main, 0.1),
    '&:hover': {
      backgroundColor: colorShader(theme.palette.primary.main, 0.2)
    },
    '&.Mui-disabled': {
      border: 'none'
    },
    border: 'none',
    borderRadius: 5,
    color: theme.palette.primary.main,
    textTransform: 'none',
    '&.MuiButton-root': {
      '@media (max-width: 960px)': {
        minWidth: '50px',
      }
    },
    '& .MuiButton-endIcon': {
      '@media (max-width: 960px)': {
        marginLeft: 0,
        marginRight: 0,
      }
    }
  }
}))

const SettingsHeader = ({ title, showActionButtons, categoryList, setCategoryList, setCategories }) => {

  // State to manage md breakpoint
  const theme = useTheme();
  const aboveMd = useMediaQuery(theme.breakpoints.up('md'));

  const [isLoading, setLoading] = useState(false);


  const inputRef = useRef("");
  const onAdd = async () => {
    const value  = inputRef.current.value.trim();
    if (!value) {
      notification("categories", "Please type category name first!", "error");
      return;
    }

    const isPresent = categoryList.find(c => c.category_name.toLowerCase() === value.toLowerCase());
    if (isPresent) {
      notification("categories", "A category with same name already exists!", "error");
      return;
    }

    setLoading(true);
    const {data, status} = await createCategory(value);
    if (status) {
      const newCat = {
        id: data.id,
        category_name: value,
        category_source: 1,
        organization_id: getUser().organization_id
      };
      setCategories(p => [...p, newCat]);
    }
    setLoading(false);
    inputRef.current.value = "";
  }

  const classes = useStyle();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={1}
      px={2}
      border={1}
      sx={{
        borderRadius: 3,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: '#fff',
        borderBottom: 'none',
        '& .MuiButton-startIcon': {
          marginRight: !aboveMd && 0,
          marginLeft: !aboveMd && 0
        },
        '& .MuiButton-root': {
          padding: aboveMd && '6px 16px',
        },
        borderColor: '#d9d9d9'
      }}
    >
      <Typography color="primary" style={{ fontSize: '1rem', fontWeight: 'bolder' }}>{title}</Typography>
      <Box display={showActionButtons ? "flex" : "none"} gridColumnGap={12}>
        {/* <Button
          size='small'
          disableElevation
          color='primary'
          startIcon={<Icon>edit</Icon>}
          className={classes.actionButton}
        >
          Edit
        </Button> */}
        <TextField
          placeholder='New Category'
          variant='outlined'
          size='small'
          inputRef={inputRef} />
        <Button
          size='small'
          disableElevation
          color='primary'
          startIcon={isLoading ? <Icon>hourglass_top</Icon> : <Icon>add</Icon>}
          className={classes.actionButton}
          onClick={onAdd}
          disabled={isLoading}
        >
          {isLoading ? "Adding" : "Add"}
        </Button>
      </Box>
    </Box>
  )
}

export default SettingsHeader