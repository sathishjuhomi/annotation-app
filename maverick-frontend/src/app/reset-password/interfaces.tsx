export interface FormData {
    password: string;
    passwordConfirm: string;
  }
  
  export interface ResetPasswordData {
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
  