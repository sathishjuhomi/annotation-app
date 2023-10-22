export interface SnackbarProps {
  showMessage: boolean;
  setShowMessage: any;
  message: string;
  messageColor: string;
}

export interface FormData {
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface SignUpProps {
  loading: boolean;
  showMessage: boolean;
  setShowMessage: any;
  message: string;
  messageColor: string;
  onSubmit: any;
  formHandleSubmit: any;
  register: any;
  errors: any;
}

export interface SignInProps {
  loading: boolean;
  showMessage: boolean;
  setShowMessage: any;
  message: string;
  messageColor: string;
  onSubmit: any;
  formHandleSubmit: any;
  handleOauth: any;
  register: any;
  errors: any;
}

export interface TeamsFormData {
  teamname: string;
}

export interface TeamsProps {
  loading: boolean;
  showMessage: boolean;
  setShowMessage: any;
  message: string;
  messageColor: string;
  onSubmit: any;
  formHandleSubmit: any;
  register: any;
  errors: any;
  teams: any;
  onAcceptTeamInvite: any;
  onDeclineTeamInvite: any;
}

export interface CreateUpdateProps {
  loading: boolean;
  showMessage: boolean;
  setShowMessage: any;
  message: string;
  messageColor: string;
  onSubmit: any;
  formHandleSubmit: any;
  register: any;
  errors: any;
  open: boolean;
  setOpen: any;
  teamTitle: string;
}

export interface InviteATeamMemberProps{
  loading: boolean;
  showMessage: boolean;
  setShowMessage: any;
  message: string;
  messageColor: string;
  onSubmit: any;
  formHandleSubmitInvite: any;
  register: any;
  errors: any;
  open: boolean;
  setOpen: any;
}

export interface InviteATeamMemberFormData {
  email: string;
  admin: boolean;
  member: boolean;
}

export interface AcceptTeamInviteProps {
  loading: boolean;
  showMessage: boolean;
  setShowMessage: any;
  message: string;
  messageColor: string;
  onSubmit: any;
  declineInviteTeam: any;
}

export interface UpdateATeamMemberProps{
  loading: boolean;
  showMessage: boolean;
  setShowMessage: any;
  message: string;
  messageColor: string;
  onSubmitRoles: any;
  formHandleSubmitRoles: any;
  register: any;
  errors: any;
  open: boolean;
  setOpen: any;
  teamId: string;
  teamMemberId: string;
}

export interface UpdateATeamMemberFormData {
  admin: boolean;
  member: boolean;
  owner: boolean;
}