export interface FormData {
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface SignUpData {
  loading: boolean,
  setLoading: any,
  showMessage: boolean;
  setShowMessage: any;
  message: string;
  messageColor: string;
  onSubmit: any;
  formHandleSubmit: any;
  register: any;
  errors: any;
}
