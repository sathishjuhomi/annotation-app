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
import { SubscriptionsProps } from "@/app/component/interfaces";


export default function SubscriptionList(
    {
        subscriptions,
    }: SubscriptionsProps
) {
    return (
        <Box className="mt-10 w-full">
            <div className="flex justify-between pb-5">
                <Typography className="text-left font-Inter font-bold leading-7 text-xl">Subscribed Users</Typography>
            </div>
            <div className='bg-white w-full'>
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
                            {subscriptions.length > 0 ? subscriptions.map((subscription: any) => (
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell className="text-center normal-case font-Inter font-normal leading-6 text-sm">
                                    {subscription.email}
                                </TableCell>
                                <TableCell className=" text-center capitalize font-Inter font-normal leading-6 text-sm">
                                    {subscription.plan_name}
                                </TableCell>
                                <TableCell className="text-center capitalize font-Inter font-normal leading-6 text-sm">
                                    Maverick
                                </TableCell>
                                <TableCell className="text-center capitalize font-Inter font-normal leading-6 text-sm">
                                    {subscription.subscription_id}
                                </TableCell>
                                <TableCell className="text-center capitalize font-Inter font-normal leading-6 text-sm">
                                    {subscription.subscribed_on}
                                </TableCell>
                                <TableCell className="text-center capitalize font-Inter font-normal leading-6 text-sm">
                                    {subscription.payment_status}
                                </TableCell>
                                <TableCell className="text-center capitalize font-Inter font-normal leading-6 text-sm">
                                    {subscription.is_active? "Active" : "Inactive"}
                                </TableCell>
                            </TableRow>
                            )) : null}
                        </TableHead>
                    </Table>
                </TableContainer>
            </div>
        </Box>
    );
}