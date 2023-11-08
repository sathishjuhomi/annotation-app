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
  teamId: any;
}

export interface InviteATeamMemberProps {
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

export interface UpdateATeamMemberProps {
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
  teamMemberId: any;
  teamMemberEmailId: string;
}

export interface UpdateATeamMemberFormData {
  admin: boolean;
  member: boolean;
  owner: boolean;
}

export interface DeleteTeamProps {
  loading: boolean;
  showMessage: boolean;
  setShowMessage: any;
  message: string;
  messageColor: string;
  open: boolean;
  setOpen: any;
  teamTitle: string;
  teamId: string;
  handleDeleteTeam: any;
}

export interface CreatePlanProps {
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
}

export interface CreatePlanFormData {
  planname: string;
  description: string;
  price: number;
  currency: string;
  paymentmode: string;
  paymenttype: string;
  billingperiod: string;
  intervalcount: number;
}

export interface UpdatePlanProps {
  loading: boolean;
  showMessage: boolean;
  setShowMessage: any;
  message: string;
  messageColor: string;
  onSubmitPlan: any;
  formHandleSubmitPlan: any;
  register: any;
  errors: any;
  open: boolean;
  setOpen: any;
  planName: string;
  description: string;
}

export interface UpdatePlanFormData {
  planname: string;
  description: string;
}
export interface PlansProps {
  loading: boolean;
  showMessage: boolean;
  setShowMessage: any;
  message: string;
  messageColor: string;
  onSubmit: any;
  formHandleSubmit: any;
  register: any;
  errors: any;
  plans: any;
}

export interface ActivateDeactivateProps {
  loading: boolean;
  showMessage: boolean;
  setShowMessage: any;
  message: string;
  messageColor: string;
  handleActivateOrDeactivate: any;
  open: boolean;
  setOpen: any;
  statusValue: string;
  priceId: any;
  planName: string
}

export interface ActivateProps {
  loading: boolean;
  showMessage: boolean;
  setShowMessage: any;
  message: string;
  messageColor: string;
  handleActivate: any;
  open: boolean;
  setOpen: any;
  priceId: any;
  planName: string
}