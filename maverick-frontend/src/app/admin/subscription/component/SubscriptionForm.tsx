"use client";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import * as React from "react";


export default function SubscriptionList() {
    return (
        <Box className="mt-10 w-full">
            <div className="flex justify-between pb-5">
                <Typography className="text-left font-Inter font-bold leading-7 text-xl">Subscribed Users</Typography>
            </div>
            <div className='bg-white w-full mt-2'>
                <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead className='mt-2 mb-2'>
                        <TableRow>
                            <TableCell className="text-center font-Inter font-bold leading-6 text-sm">Email</TableCell>
                            <TableCell className="text-center font-Inter font-bold leading-6 text-sm">Plan Name</TableCell>
                            <TableCell className="text-center font-Inter font-bold leading-6 text-sm">Team Name</TableCell>
                            <TableCell className="text-center font-Inter font-bold leading-6 text-sm">Subscription Id</TableCell>
                            <TableCell className="text-center font-Inter font-bold leading-6 text-sm">Subscribed On</TableCell>
                            <TableCell className="text-center font-Inter font-bold leading-6 text-sm">Payment Status</TableCell>
                            <TableCell className="text-center font-Inter font-bold leading-6 text-sm">Subscription Status</TableCell>
                        </TableRow>
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell className="text-center normal-case font-Inter font-normal leading-6 text-sm">
                                jayabharathi@juhomi.com
                            </TableCell>
                            <TableCell className=" text-center capitalize font-Inter font-normal leading-6 text-sm">
                                Week Plan
                            </TableCell>
                            <TableCell className="text-center capitalize font-Inter font-normal leading-6 text-sm">
                                Maverick
                            </TableCell>
                            <TableCell className="text-center capitalize font-Inter font-normal leading-6 text-sm">
                                ffb67d3c-df52-4590-8d1b-567d1905c26c
                            </TableCell>
                            <TableCell className="text-center capitalize font-Inter font-normal leading-6 text-sm">
                                14/11/2023
                            </TableCell>
                            <TableCell className="text-center capitalize font-Inter font-normal leading-6 text-sm">
                                Paid
                            </TableCell>
                            <TableCell className="text-center capitalize font-Inter font-normal leading-6 text-sm">
                                Active
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
                </TableContainer>
            </div>
        </Box>
    );
}