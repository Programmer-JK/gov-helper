export interface ValidationErrors {
  email?: string;
  name?: string;
  businessNumber?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  email: string;
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
