"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import AdminNavBar from "./component/AdminNavBar";

const Admin = () => {



  return (
    <Box className="flex">
      <Box component="main" className="mb-4"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
        <AdminNavBar></AdminNavBar>
      </Box>
    </Box>
  );

};
export default Admin;