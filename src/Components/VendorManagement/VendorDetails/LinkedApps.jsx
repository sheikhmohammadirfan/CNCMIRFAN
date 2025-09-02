import { Box, Typography } from "@material-ui/core";

const LinkedApps = ({ vendorData }) => {
  return (
    <Box
      display="flex"
      height="65vh"
      flexDirection="column"
      borderColor="rgb(221, 221, 221)"
      overflow="auto"
      p={2}
    >
      <Box ml={3} mb={2}>
        <Typography variant="h6">Linked discovery applications</Typography>
      </Box>

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
        <Typography variant="h6">No linked applications</Typography>
        <Typography variant="body2">
          You can link applications to a vendor via the discovery page
        </Typography>
      </Box>
    </Box>
  );
};

export default LinkedApps;
