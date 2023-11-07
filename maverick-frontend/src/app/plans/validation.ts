"use client";
import * as yup from "yup";
import * as Constants from "../utils/constant";

export const createPlanSchema = yup.object().shape({
    planname: yup
    .string()
    .required(Constants.PLANNAME_REQUIRED),
    description: yup
    .string()
    .required(Constants.DESCRIPTION_REQUIRED),
    price: yup
    .number()
    .required(Constants.PRICE_REQUIRED),
    currency: yup
    .string()
    .required(Constants.CURRENCY_REQUIRED),
    paymentmode: yup
    .string()
    .required(Constants.PAYMENTMODE_REQUIRED),
    paymenttype: yup
    .string()
    .required(Constants.PAYMENTTYPE_REQUIRED),
    billingperiod: yup
    .string()
    .required(Constants.BILLINGPERIOD_REQUIRED),
    intervalcount: yup
    .number()
    .required(Constants.INTERVALCOUNT_REQUIRED),
    active: yup
    .boolean()
    .required(Constants.ACTIVE_REQUIRED),
});