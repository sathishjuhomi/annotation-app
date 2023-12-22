"use client";
import * as yup from "yup";
import * as Constants from "../utils/constant";

export const createOrUpdateTeamSchema = yup.object().shape({
    teamname: yup
    .string()
    .required(Constants.TEAMNAME_REQUIRED),
});

export const inviteTeamMemberSchema = yup.object().shape({
    email: yup
    .string()
    .email(Constants.VALID_EMAIL)
    .required(Constants.EMAIL_REQUIRED),
    roles: yup
        .array()
        .of(
            yup.object().shape({
                name: yup.string(), 
                checked: yup.boolean(), 
            })
        )
        .required(Constants.ROLES_REQUIRED)
        .test(
            "at-least-one-role",
            "Select at least one role",
            (roles) => roles.some((role) => role.checked)
        ),
});

export const updateTeamMemberSchema = yup.object().shape({
    roles: yup
        .array()
        .of(
            yup.object().shape({
                name: yup.string(), 
                checked: yup.boolean(), 
            })
        )
        .required(Constants.ROLES_REQUIRED)
        .test(
            "at-least-one-role",
            "Select at least one role",
            (roles) => roles.some((role) => role.checked)
        ),
});