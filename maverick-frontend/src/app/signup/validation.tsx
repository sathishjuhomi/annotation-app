"use client";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email("Enter valid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(4, "​Password must be at least 4 characters"),
  passwordConfirm: yup
    .string()
    .required("Passwords does not match")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default schema;
