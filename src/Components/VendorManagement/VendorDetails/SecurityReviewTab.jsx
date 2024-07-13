import { Box, Typography, Button } from "@material-ui/core";

const SecurityReviewTab = ({ vendorData }) => {
  return (
    <>
      {console.log(vendorData)}
      {vendorData["SECURITY REVIEW"] ? (
        <Box
          display="flex"
          height="65vh"
          flexDirection="column"
          mt={2}
          overflow="auto"
          p={2}
        >
          <Box
            border={1}
            borderColor="rgb(221, 221, 221)"
            display="flex"
            flexDirection="column"
            alignItems="center"
            height="100%"
            mb={2}
            overflowY="scroll"
          >
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              p={4}
              width="400px"
            >
              <Typography variant="h6" textAlign="center">
                Next security review due{" "}
                {vendorData["SECURITY REVIEW"].due_date}
              </Typography>
              <Typography variant="subtitle2" align="center">
                Would you like to start the next review? Once the security
                review has been started, you may save or cancel at anytime.
              </Typography>
            </Box>
            <Box mb={2}>
              <Button variant="contained" color="primary">
                Start
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          height="65vh"
          flexDirection="column"
          mt={2}
          borderColor="rgb(221, 221, 221)"
          overflow="auto"
          p={2}
        >
          <Box
            border={1}
            borderColor="rgb(221, 221, 221)"
            display="flex"
            flexDirection="column"
            alignItems="center"
            height="100%"
            mb={2}
            overflowY="scroll"
            justifyContent="center"
          >
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              borderColor="rgb(221, 221, 221)"
              p={4}
              width="370px"
            >
              <Typography variant="h6" align="center">
                Start a security review for {vendorData.vendor_name}
              </Typography>
              <Typography variant="subtitle2" align="center">
                Once the security review has been started, you may save or
                cancel at anytime.
              </Typography>
            </Box>
            <Button variant="contained" color="primary">
              Start
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default SecurityReviewTab;
