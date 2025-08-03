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
// types/signup.ts
export interface SignUpFormData {
  // 1단계: 사용자 정보
  email: string;
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
  
  // 2단계: 회사 정보
  businessNumber: string;
  businessType: string;
  address: string;
  representativeName: string;
  representativeBirthDate: string;
  companyProfile: File | null;
  
  // 3단계: 회사 상세 정보
  employeeCount: string;
  lastYearRevenue: string;
}

export interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  maxLength?: number;
  rightElement?: React.ReactNode;
}

export interface FormSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
}

export interface FileUploadProps {
  id: string;
  label: string;
  onChange: (file: File | null) => void;
  accept?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
}

export interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export interface StepProps {
  formData: SignUpFormData;
  onChange: (field: keyof SignUpFormData, value: string | File | null) => void;
  onBlur: (field: string) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  checkHeight?: () => void;
}