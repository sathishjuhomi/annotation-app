export interface FormData {
    email: string;
  }
  
  export interface ForgotPasswordData {
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