import { Box, Typography, Divider } from "@material-ui/core";

const Info = ({ vendorData, owners, formatDate }) => {
  return (
    <Box
      mt={2}
      ml={2}
      mr={2}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box display="flex" mt={2}>
        <Box width="50%">
          <Typography variant="body2">Name:</Typography>
        </Box>
        <Typography variant="body2">
          {vendorData.vendor_name}
        </Typography>
      </Box>
      <Box display="flex" mt={2}>
        <Box width="50%">
          <Typography variant="body2">Category: </Typography>
        </Box>
        <Typography variant="body2">
          {vendorData.category}
        </Typography>
      </Box>
      <Box display="flex" mt={2} mb={2}>
        <Box width="50%">
          <Typography variant="body2">Security Owner: </Typography>
        </Box>
        <Typography variant="body2">{owners[vendorData.security_owner]}</Typography>
      </Box>
      <Divider />
      <Box mt={2}>
        <Typography variant="body2">Dates</Typography>
      </Box>

      <Box display="flex" mt={2}>
        <Box width="50%">
          <Typography variant="body2">Last Review: </Typography>
        </Box>
        <Typography variant="body2">{formatDate(vendorData.last_review)}</Typography>
        <Divider />
      </Box>
    </Box>
  );
};

export default Info;
