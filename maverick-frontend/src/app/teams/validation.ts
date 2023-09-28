"use client";
import * as yup from "yup";
import * as Constants from "../utils/constant";

const schema = yup.object().shape({
    teamname: yup
    .string()
    .required(Constants.TEAMNAME_REQUIRED),
});

export default schema;