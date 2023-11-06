"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Accordion, AccordionDetails, AccordionSummary, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';

export default function PlansList() {

    return (
        <Box className="mt-10 w-full mr-4">
            <div className="flex justify-between pb-5">
                <Typography className="text-left font-Inter font-bold leading-7 text-xl">Plans</Typography>
                <Button
                    size="small"
                    variant="contained"
                    className="w-28 h-11 normal-case font-Inter font-normal font-bold text-sm text-white bg-button hover:bg-lightgreen"
                >
                    Create Plan
                </Button>
            </div>
            <Box>
                <Accordion className='shadow-none divide-y-2 divide-lightgrey'>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>Plan 1</Typography>
                        <Button className='ml-auto mr-2'> <EditIcon className='text-green' /> </Button>
                    </AccordionSummary>
                    <AccordionDetails>
                        {/* <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget.
                        </Typography> */}
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="text-left font-Inter font-normal leading-6 text-sm">
                                        ID
                                    </TableCell>
                                    <TableCell className="text-right font-Inter font-normal leading-6 text-sm">
                                        Name
                                    </TableCell>
                                    <TableCell className="text-right font-Inter font-normal leading-6 text-sm">
                                        Description
                                    </TableCell>
                                    <TableCell className="text-left font-Inter font-normal leading-6 text-sm">
                                        Price
                                    </TableCell>
                                    <TableCell className="text-right font-Inter font-normal leading-6 text-sm">
                                        Currency
                                    </TableCell>
                                    <TableCell className="text-right font-Inter font-normal leading-6 text-sm">
                                        Payment Mode
                                    </TableCell>
                                    <TableCell className="text-left font-Inter font-normal leading-6 text-sm">
                                        Payment Type
                                    </TableCell>
                                    <TableCell className="text-right font-Inter font-normal leading-6 text-sm">
                                        Billing Period
                                    </TableCell>
                                    <TableCell className="text-right font-Inter font-normal leading-6 text-sm">
                                        Interval Count
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    {/* <TableCell className="text-base" component="th" scope="row">
                                        
                                    </TableCell>
                                    <TableCell className="text-base" align="right">
                                        
                                    </TableCell> */}
                                    <TableCell className="text-left font-Inter font-normal leading-6 text-sm">
                                        #01
                                    </TableCell>
                                    <TableCell className="text-right font-Inter font-normal leading-6 text-sm">
                                        Plan 1
                                    </TableCell>
                                    <TableCell className="text-right font-Inter font-normal leading-6 text-sm">
                                        Description of plan1
                                    </TableCell>
                                    <TableCell className="text-left font-Inter font-normal leading-6 text-sm">
                                        #23.0
                                    </TableCell>
                                    <TableCell className="text-right font-Inter font-normal leading-6 text-sm">
                                        $
                                    </TableCell>
                                    <TableCell className="text-right font-Inter font-normal leading-6 text-sm">
                                        Credit Card
                                    </TableCell>
                                    <TableCell className="text-left font-Inter font-normal leading-6 text-sm">
                                        Credit Card
                                    </TableCell>
                                    <TableCell className="text-right font-Inter font-normal leading-6 text-sm">
                                        One Month
                                    </TableCell>
                                    <TableCell className="text-right font-Inter font-normal leading-6 text-sm">
                                        30 days
                                    </TableCell>

                                </TableRow>

                            </TableBody>
                        </Table>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    )
}