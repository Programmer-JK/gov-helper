// hooks/use-signup-form.ts
import { useState, useCallback } from 'react';
import { SignUpFormData } from '@/util/type/auth';
import { validateStep } from '@/util/function/sign-up-validation';

const initialFormData: SignUpFormData = {
  email: "",
  name: "",
  phone: "",
  password: "",
  confirmPassword: "",
  businessNumber: "",
  businessType: "",
  address: "",
  representativeName: "",
  representativeBirthDate: "",
  companyProfile: null,
  employeeCount: "",
  lastYearRevenue: ""
};

export const useSignupForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignUpFormData>(initialFormData);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // 입력값 변경 핸들러
  const handleInputChange = useCallback((field: keyof SignUpFormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    if (submitError) setSubmitError("");
    
    // 입력값 변경 시 짧은 지연 후 높이 체크 (DOM 업데이트 대기)
    setTimeout(() => {
      // checkHeight가 외부에서 전달되면 호출
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('formHeightCheck');
        window.dispatchEvent(event);
      }
    }, 0);
  }, [submitError]);

  // 블러 핸들러
  const handleBlur = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  // 단계 유효성 검사
  const validateCurrentStep = useCallback((): boolean => {
    const stepErrors = validateStep(currentStep, formData);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }, [currentStep, formData]);

  // 다음 단계로 이동
  const handleNext = useCallback(() => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  }, [validateCurrentStep]);

  // 이전 단계로 이동
  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  // 폼 제출
  const handleSubmit = useCallback(async () => {
    if (!validateCurrentStep() || !agreedToTerms || !agreedToPrivacy) {
      setSubmitError("모든 필수 정보를 입력하고 약관에 동의해주세요.");
      return;
    }

    setIsLoading(true);
    setSubmitError("");

    try {
      // API 호출 로직
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          // File 객체는 FormData로 별도 처리 필요
          companyProfile: formData.companyProfile?.name || null
        }),
      });

      if (response.ok) {
        alert("회원가입이 완료되었습니다!");
        // 성공 후 리다이렉트 등 처리
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.message || "회원가입 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      setSubmitError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [validateCurrentStep, agreedToTerms, agreedToPrivacy, formData]);

  // 약관 동의 핸들러
  const handleTermsChange = useCallback((agreed: boolean) => {
    setAgreedToTerms(agreed);
    if (submitError) setSubmitError("");
  }, [submitError]);

  const handlePrivacyChange = useCallback((agreed: boolean) => {
    setAgreedToPrivacy(agreed);
    if (submitError) setSubmitError("");
  }, [submitError]);

  return {
    // 상태
    currentStep,
    formData,
    touched,
    errors,
    agreedToTerms,
    agreedToPrivacy,
    isLoading,
    submitError,
    
    // 핸들러
    handleInputChange,
    handleBlur,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleTermsChange,
    handlePrivacyChange,
    
    // 유틸리티
    validateCurrentStep
  };
};