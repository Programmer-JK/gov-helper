// ===============================
// Base 타입 정의
// ===============================
export interface UserType {
  userId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  businessRegNum?: string;
  businessName?: string;
  companyDocLink?: string;
  ceoName?: string;
}

export interface ValidationErrors {
  email?: string;
  name?: string;
  businessNumber?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

// ===============================
// Form 데이터 타입
// ===============================
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
