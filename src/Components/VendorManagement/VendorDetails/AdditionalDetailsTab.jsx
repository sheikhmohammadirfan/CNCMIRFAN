import { Box, Typography, Grid } from "@mui/material";

const AdditionalDetailsTab = (findingDetails) => {
	console.log(findingDetails)
  return (
    <Box mt={2}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body2">Added by</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2">{findingDetails.findingDetails.author} on Nov 15, 2023</Typography>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body2">Treatment</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2">Not applicable</Typography>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body2">Jira task status</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2">No linked Jira tasks</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdditionalDetailsTab;
