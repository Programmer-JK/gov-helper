import { useState, useEffect, useCallback } from "react";
import {
  validateEmail,
  validateName,
  validateBusinessNumber,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
} from "@/util/function/validation";
import {
  SignUpFormData,
  SignInFormData,
  ValidationErrors,
} from "@/util/type/auth";

type FormType = "signin" | "signup";
type FormData = SignInFormData | SignUpFormData;

interface UseFormValidationProps {
  formType: FormType;
  formData: FormData;
  businessNumber?: string; // signup에서만 사용
  businessNumberState?: {
    isValid: boolean;
    checkResult: string;
  }; // 사업자번호 상태 추가
  touched: { [key: string]: boolean };
  onValidationChange?: () => void;
}

// 타입 가드 함수
const isSignUpFormData = (data: FormData): data is SignUpFormData => {
  return "name" in data;
};

export const useFormValidation = ({
  formType,
  formData,
  businessNumber = "",
  businessNumberState,
  touched,
  onValidationChange,
}: UseFormValidationProps) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors = {};

    // 공통 검증: 이메일
    if (touched.email) {
      newErrors.email = validateEmail(formData.email);
    }

    // 회원가입 전용 검증
    if (formType === "signup" && isSignUpFormData(formData)) {
      if (touched.name) {
        newErrors.name = validateName(formData.name);
      }
      if (touched.businessNumber) {
        const basicError = validateBusinessNumber(businessNumber);
        if (basicError) {
          newErrors.businessNumber = basicError;
        } else if (businessNumberState && businessNumber.length === 10) {
          // 기본 검증 통과 후 API 결과 검증
          if (!businessNumberState.isValid && businessNumberState.checkResult) {
            newErrors.businessNumber = businessNumberState.checkResult;
          }
        }
      }
      if (touched.phone) {
        newErrors.phone = validatePhone(formData.phone);
      }
      if (touched.password) {
        newErrors.password = validatePassword(formData.password);
      }
      if (touched.confirmPassword) {
        newErrors.confirmPassword = validateConfirmPassword(
          formData.password,
          formData.confirmPassword
        );
      }
    }

    // 로그인에서는 비밀번호 검증 안함 (서버에서 처리)

    return newErrors;
  }, [formType, formData, businessNumber, touched]);

  useEffect(() => {
    const newErrors = validateForm();
    const hasChanged = JSON.stringify(errors) !== JSON.stringify(newErrors);

    if (hasChanged) {
      setErrors(newErrors);
      onValidationChange?.();
    }
  }, [
    formData,
    businessNumber,
    businessNumberState,
    touched,
    validateForm,
    onValidationChange,
  ]);

  // 폼 유효성 검사 함수
  const isFormValid = useCallback(
    (additionalChecks?: {
      isBusinessNumberValid?: boolean;
      agreedToTerms?: boolean;
      agreedToPrivacy?: boolean;
    }) => {
      if (formType === "signin") {
        return formData.email && formData.password && !errors.email;
      }

      // 회원가입의 경우
      if (formType === "signup" && isSignUpFormData(formData)) {
        const {
          isBusinessNumberValid = false,
          agreedToTerms = false,
          agreedToPrivacy = false,
        } = additionalChecks || {};

        return (
          formData.email &&
          formData.name &&
          formData.phone &&
          formData.password &&
          formData.confirmPassword &&
          businessNumber.length === 10 &&
          isBusinessNumberValid &&
          agreedToTerms &&
          agreedToPrivacy &&
          !errors.email &&
          !errors.name &&
          !errors.phone &&
          !errors.password &&
          !errors.confirmPassword &&
          !errors.businessNumber
        );
      }

      return false;
    },
    [formType, formData, businessNumber, errors]
  );

  return {
    errors,
    isFormValid,
    validateForm,
  };
};
