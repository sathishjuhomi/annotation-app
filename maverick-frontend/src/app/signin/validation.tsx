"use client";
import * as yup from "yup";
import * as Constants from "../utils/constant";

const schema = yup.object().shape({
  email: yup
    .string()
    .email(Constants.VALID_EMAIL)
    .required(Constants.EMAIL_REQUIRED),
  password: yup
    .string()
    .required(Constants.PASSWORD_REQUIRED)
    .min(4, Constants.PASSWORD_MIN_CHAR),
});

export default schema;
