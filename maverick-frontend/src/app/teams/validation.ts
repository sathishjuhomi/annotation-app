"use client";
import * as yup from "yup";
import * as Constants from "../utils/constant";

const schema = yup.object().shape({
    teamname: yup
    .string()
    .required(Constants.TEAMNAME_REQUIRED),
    email: yup
    .string()
    .email(Constants.VALID_EMAIL)
    .required(Constants.EMAIL_REQUIRED),
    owner: yup
    .string(),
    admin: yup
    .string(),
    member: yup
    .string(),
});

export default schema;