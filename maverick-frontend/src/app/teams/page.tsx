"use client"
import * as React from "react";
import { createTheme } from "@mui/material/styles";
import TeamsForm from "./component/TeamsForm";
import NavBar from "../component/NavBar";
import Box from "@mui/material/Box";

const defaultTheme = createTheme();

const Teams = () =>{
    return (
        <Box className="flex">
        <NavBar></NavBar>
        <Box component="main" className="mt-10"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
        <TeamsForm></TeamsForm>
        </Box>
        </Box>
    );  

};
export default Teams;
