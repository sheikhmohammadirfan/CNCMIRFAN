// import React from "react";
// import {
//   Table,
//   TableHead,
//   TableBody,
//   TableCell,
//   TableRow,
//   TableContainer,
//   Paper,
//   makeStyles,
// } from "@material-ui/core";

// const useStyles = makeStyles({
//   tableContainer: {
//     maxHeight: 400,
//     overflowY: "auto",
//   },
// });

// const AccessTable = ({ columns, rows, isPending }) => {
//   const classes = useStyles();

//   return (
//     <TableContainer component={Paper} className={classes.tableContainer}>
//       <Table stickyHeader>
//         <TableHead>
//           <TableRow>
//             {columns.map((column) => (
//               <TableCell key={column.field}>{column.header}</TableCell>
//             ))}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {isPending ? (
//             <TableRow>
//               <TableCell colSpan={columns.length} align="center">
//                 Loading...
//               </TableCell>
//             </TableRow>
//           ) : (
//             rows.map((row) => (
//               <TableRow key={row.id}>
//                 {columns.map((column) => (
//                   <TableCell key={column.field}>{row[column.field]}</TableCell>
//                 ))}
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default AccessTable;
