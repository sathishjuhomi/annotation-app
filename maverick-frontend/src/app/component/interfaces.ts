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

// To Do for show all team for testing I have a static data to show
// temporary  I am using SinUpProps to test the create team
// export interface TeamsProps {
//   loading: boolean;
//   showMessage: boolean;
//   setShowMessage: any;
//   message: string;
//   messageColor: string;
//   onSubmit: any;
//   formHandleSubmit: any;
//   register: any;
//   errors: any;
//   teams: string;
// }