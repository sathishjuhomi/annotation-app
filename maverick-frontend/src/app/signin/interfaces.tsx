
  export interface FormData {
    email: string;
    password: string;
  }
  
  export interface SigninData {
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