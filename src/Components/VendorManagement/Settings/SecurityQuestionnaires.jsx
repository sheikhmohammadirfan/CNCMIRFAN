import { Box, Typography, Button, Icon, makeStyles } from "@material-ui/core";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const useStyles = makeStyles({
  button: {
    textTransform: "none",
  },
});

const SecurityQuestionnaires = () => {
  const classes = useStyles();
  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Security Questionnaires</Typography>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<Icon>add</Icon>}
        >
          Add Questionnaire
        </Button>
      </Box>
      <Box>
        <Typography variant="subtitle1">
          Manage your library of security questionnaire templates. Templates
          added here will be made available for you to send to vendors during
          security reviews.
        </Typography>
      </Box>
      <Box
        textAlign="center"
        mt={4}
        p={3}
        bgcolor="#fff"
        borderRadius="8px"
        border="#D9D9D9"
      >
        <Typography variant="h6" gutterBottom>
          No security questionnaires
        </Typography>
        <Typography variant="body1" gutterBottom>
          Upload a custom questionnaire for vendors to complete in future
          security reviews. You can also use Falcon's template, which has been
          carefully crafted by security experts.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<AttachFileIcon />}
        >
          Upload your own
        </Button>
        <Button
          variant="outlined"
          className={classes.button}
          startIcon={<Icon>uploadfile</Icon>}
        >
          Use Falcon's template
        </Button>
      </Box>
    </div>
  );
};

export default SecurityQuestionnaires;
