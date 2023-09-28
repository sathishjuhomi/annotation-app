"use client";
import Box from "@mui/material/Box";
import * as React from "react";
import NavBar from "../component/NavBar";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

const View = () => {

    function createData(
        Member: string,
        Role: string,
      ) {
        return { Member, Role};
      }

    const rows = [
        createData('Murali', 'Owner,Admin'),
        createData('Sriram', 'Admin'),
        createData('Sathish', 'Member'),
      ];

    return (
        <Box className="flex">
            <NavBar></NavBar>
            <Box component="main" className="mt-10"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
                <Paper className="mt-4 ml-4 mr-4">
                    <br></br>
                    <Typography className="ml-4 font-bold text-xl">Maverick </Typography>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell className="text-left font-bold text-lg">Member</TableCell>
                                <TableCell className="text-right font-bold text-lg">Role</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.Member}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    {/* <ListItemAvatar>
                                        <Avatar className="bg-tertiary">{row.Member[0]}</Avatar>
                                    </ListItemAvatar> */}
                                    <TableCell className="text-base"component="th" scope="row">
                                        {row.Member}
                                    </TableCell>
                                    <TableCell className="text-base" align="right">{row.Role}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </Paper>
            </Box>
        </Box>
    );
};
export default View