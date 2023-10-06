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
    // owner: yup.boolean(),
    // admin: yup.boolean(),
    // member: yup.boolean()
    // .required(Constants.MEMBER_REQUIRED),
    roles: yup
        .array()
        .of(
            yup.object().shape({
                name: yup.string(), // Assuming a string field for the checkbox name
                checked: yup.boolean(), // Boolean field to track checkbox state
            })
        )
        .required(Constants.MEMBER_REQUIRED)
        .test(
            "at-least-one-role",
            "Select at least one role",
            (roles) => roles.some((role) => role.checked)
        ),
});