"use client";
import * as yup from "yup";
import * as Constants from "../../utils/constant";

export const createPlanSchema = yup.object().shape({
    planName: yup
    .string()
    .required(Constants.PLANNAME_REQUIRED),
    description: yup
    .string(),
    price: yup
    .number()
    .required(Constants.PRICE_REQUIRED),
    currency: yup
    .string()
    .required(Constants.CURRENCY_REQUIRED),
    paymentMode: yup
    .string()
    .required(Constants.PAYMENTMODE_REQUIRED),
    paymentType: yup
    .string()
    .required(Constants.PAYMENTTYPE_REQUIRED),
    billingPeriod: yup
    .string(),
    intervalCount: yup
    .number(),
});

export const updatePlanSchema = yup.object().shape({
    planName: yup
    .string()
    .required(Constants.PLANNAME_REQUIRED),
    description: yup
    .string(),
});