import { ValidationRule } from "@/utils/type/ui"

export const REQUIRED_RULES: ValidationRule[] = [
  {
    id: "required",
    label: "필수 입력",
    test: (value) => value.length > 0,
  },
]

export const PASSWORD_RULES: ValidationRule[] = [
  {
    id: "length",
    label: "8자 이상",
    test: (value) => value.length >= 8,
  },
  {
    id: "uppercase",
    label: "대문자 포함",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: "lowercase",
    label: "소문자 포함",
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: "number",
    label: "숫자 포함",
    test: (value) => /\d/.test(value),
  },
  {
    id: "special",
    label: "특수문자 포함",
    test: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
  },
]

export const CONFIRM_PASSWORD_RULES: ValidationRule[] = [
  {
    id: "match",
    label: "비밀번호 일치",
    test: (value, confirmValue) => value === confirmValue && confirmValue.length > 0,
  },
]

export const EMAIL_RULES: ValidationRule[] = [
  {
    id: "email",
    label: "회사 이메일 입력",
    test: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
      && !value.includes("gmail.com") 
      && !value.includes("naver.com")
      && !value.includes("daum.net")
      && !value.includes("nate.com")
      && !value.includes("yahoo.com")
      && !value.includes("hotmail.com")
      && !value.includes("outlook.com")
      && !value.includes("live.com"),
  },
]

export const NAME_RULES: ValidationRule[] = [
  {
    id: "name",
    label: "이름 입력",
    test: (value) => /^[가-힣]{2,}$/.test(value),
  },
]
export const COMPANY_RULES: ValidationRule[] = [
  {
    id: "company",
    label: "회사명 입력",
    test: (value) => /^[가-힣a-zA-Z0-9]{1,}$/.test(value),
  },
]

export const PHONE_RULES: ValidationRule[] = [
  {
    id: "phone",
    label: "전화번호 입력",
    test: (value) => /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/.test(value),
  },
]