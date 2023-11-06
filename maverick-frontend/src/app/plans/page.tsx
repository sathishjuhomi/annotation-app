"use client";
import * as React from "react";
import PlansForm from "./component/PlansForm";
import NavBar from "../component/NavBar";
import Box from "@mui/material/Box";



const Plans = () => {


return (
    <Box className="flex">
      <NavBar></NavBar>
      <Box component="main" className="mt-10"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
            <PlansForm/>
      </Box>
    </Box>
  );

};
export default Plans;