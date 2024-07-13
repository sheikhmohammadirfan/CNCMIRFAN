import React from 'react'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Icon } from '@material-ui/core';

function SystemCards({ iconName, title, count }) {
  return (
    <Card sx={{ maxWidth: 270 }}>
    <CardContent style={{display:"flex", gap:"20px", alignItems:"center"}}>
      <Icon style={{ fontSize: "5rem", color:"#4477CE"}}>{iconName}</Icon>
      <Box>
        <Typography gutterBottom variant="body1" component="div">
          {title}
        </Typography>
        <Typography variant="h5" color="textSecondary" component="p">
          {count}
        </Typography>
      </Box>
    </CardContent>
  </Card>
  )
}

export default SystemCards
