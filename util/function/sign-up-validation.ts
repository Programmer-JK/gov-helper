// utils/signup-validation.ts
import { SignUpFormData } from '@/util/type/auth';

// 전화번호 포맷 변환
export const convertPhoneFormat = (value: string): string => {
  const numbers = value.replace(/[^\d]/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

// 단계별 유효성 검사
export const validateStep = (step: number, formData: SignUpFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (step === 1) {
    // 이메일 검증
    if (!formData.email) {
      errors.email = "이메일을 입력해주세요";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "올바른 이메일 형식이 아닙니다";
    }
    
    // 이름 검증
    if (!formData.name) {
      errors.name = "이름을 입력해주세요";
    }
    
    // 전화번호 검증
    if (!formData.phone) {
      errors.phone = "전화번호를 입력해주세요";
    } else if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) {
      errors.phone = "올바른 전화번호 형식이 아닙니다";
    }
    
    // 비밀번호 검증
    if (!formData.password) {
      errors.password = "비밀번호를 입력해주세요";
    } else if (formData.password.length < 8) {
      errors.password = "비밀번호는 8자 이상이어야 합니다";
    }
    
    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      errors.confirmPassword = "비밀번호 확인을 입력해주세요";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }
  }

  if (step === 2) {
    // 사업자번호 검증
    if (!formData.businessNumber) {
      errors.businessNumber = "사업자번호를 입력해주세요";
    } else if (formData.businessNumber.length !== 10) {
      errors.businessNumber = "사업자번호는 10자리여야 합니다";
    }
    
    // 사업자 형태 검증
    if (!formData.businessType) {
      errors.businessType = "사업자 형태를 선택해주세요";
    }
    
    // 주소 검증
    if (!formData.address) {
      errors.address = "사업장 주소를 입력해주세요";
    }
    
    // 대표자명 검증
    if (!formData.representativeName) {
      errors.representativeName = "대표자명을 입력해주세요";
    }
    
    // 대표자 생년월일 검증
    if (!formData.representativeBirthDate) {
      errors.representativeBirthDate = "대표자 생년월일을 입력해주세요";
    }
  }

  if (step === 3) {
    // 임직원 수 검증
    if (!formData.employeeCount) {
      errors.employeeCount = "임직원 수를 입력해주세요";
    }
    
    // 매출액 검증
    if (!formData.lastYearRevenue) {
      errors.lastYearRevenue = "직전년도 매출액을 입력해주세요";
    }
  }

  return errors;
};

// 사업자 형태 옵션
export const businessTypeOptions = [
  { value: "corporation", label: "법인사업자" },
  { value: "individual", label: "개인사업자" },
  { value: "freelancer", label: "프리랜서" }
];

// 주소 검색 함수 (추후 다음 주소 API 연동)
export const handleAddressSearch = (): void => {
  // 주소 검색 API 연동 로직
  alert("주소 검색 기능이 실행됩니다.");
};