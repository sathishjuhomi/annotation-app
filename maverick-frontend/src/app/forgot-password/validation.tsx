"use client";
import * as yup from "yup";
import * as Constants from "../utils/constant";

const schema = yup.object().shape({
  email: yup
    .string()
    .email(Constants.VALID_EMAIL)
    .required(Constants.EMAIL_REQUIRED),

});

export default schema;