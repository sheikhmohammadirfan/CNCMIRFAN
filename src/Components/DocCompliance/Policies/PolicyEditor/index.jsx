import { Box, Button, Icon, Stack, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import TinyMceEditor from './TinyMceEditor'
import OptionDropdown from '../../../Utils/OptionDropdown'

const HeaderBtn = ({ children, ...btnProps }) => (
  <Button
    color='primary'
    size='small'
    sx={{ textTransform: 'none' }}
    disableElevation
    {...btnProps}
  >
    {children}
  </Button>
)

const PolicyEditor = () => {

  const editorRef = useRef(null)
  const handleSave = () => {
    console.log(editorRef.current.getContent())
  }

  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);

  return (
    <Stack height="100%" spacing={2}>

      <Box display="flex" justifyContent="space-between" alignItems="center">

        <Box>
          <Typography fontSize="1.1rem" fontWeight={500}>Human Resource Security Policy</Typography>
          <Typography fontSize="0.85rem" color="#797979">Last Editor 13h ago, by Affan Ansari</Typography>
        </Box>
        <Box display="flex" alignItems="center" columnGap={1}>
          <OptionDropdown
            open={moreOptionsOpen}
            handleClose={() => setMoreOptionsOpen(false)}
            placement="bottom-start"
            options={[
              {
                text: "Preview as PDF",
                clickHandler: () => console.log("HEY")
              }
            ]}
          >
            <HeaderBtn
              variant="outlined"
              onClick={() => setMoreOptionsOpen(true)}
              endIcon={<Icon>keyboard_arrow_down</Icon>}
            >
              More
            </HeaderBtn>
          </OptionDropdown>
          <HeaderBtn variant='outlined' onClick={handleSave}>Save and Close</HeaderBtn>
          <HeaderBtn variant='contained'>Submit for Approval</HeaderBtn>
        </Box>

      </Box>

      <Box flex={1}>
        <TinyMceEditor ref={editorRef} />
      </Box>

    </Stack>
  )
}

export default PolicyEditor