// components/signup/multi-step-signup-form.tsx
import React, { useRef, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Stepper } from '@/components/ui/stepper';
import { Step1UserInfo } from './step1-user-info';
import { Step2CompanyInfo } from './step2-company-info';
import { Step3CompanyDetails } from './step3-company-details';
import { TermsAgreement } from './terms-agreement';
import { NavigationButtons } from './navigation-buttons';
import { useSignupForm } from '@/hooks/use-signup-form';

interface MultiStepSignUpFormProps {
  onHeightChange?: (height: number) => void;
}

export default function MultiStepSignUpForm({ onHeightChange }: MultiStepSignUpFormProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const [formHeight, setFormHeight] = useState(0);

  const {
    currentStep,
    formData,
    touched,
    errors,
    agreedToTerms,
    agreedToPrivacy,
    isLoading,
    submitError,
    handleInputChange,
    handleBlur,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleTermsChange,
    handlePrivacyChange
  } = useSignupForm();

  // 높이 체크 함수
  const checkHeight = () => {
    if (formRef.current) {
      const newHeight = formRef.current.scrollHeight;
      setFormHeight(newHeight);
      onHeightChange?.(newHeight);
    }
  };

  // 단계 변경 시 높이 체크
  useEffect(() => {
    checkHeight();
  }, [currentStep, errors, submitError]);

  // ResizeObserver로 폼 크기 변화 감지
  useEffect(() => {
    if (!formRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      checkHeight();
    });

    resizeObserver.observe(formRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const renderStep = () => {
    const stepProps = {
      formData,
      onChange: handleInputChange,
      onBlur: handleBlur,
      errors,
      touched,
      checkHeight // 각 스텝에서도 높이 체크 가능하도록 전달
    };

    switch (currentStep) {
      case 1:
        return <Step1UserInfo {...stepProps} />;
      case 2:
        return <Step2CompanyInfo {...stepProps} />;
      case 3:
        return <Step3CompanyDetails {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <div ref={formRef} className="max-w-2xl mx-auto p-6 bg-white">
      {/* 단계 진행 상황 표시 */}
      <Stepper currentStep={currentStep} totalSteps={3} />
      
      {/* 각 단계 컴포넌트 */}
      <AnimatePresence mode="wait" onExitComplete={checkHeight}>
        {renderStep()}
      </AnimatePresence>

      {/* 네비게이션 버튼 */}
      <NavigationButtons
        currentStep={currentStep}
        totalSteps={3}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      {/* 약관 동의 (하단 고정) */}
      <TermsAgreement
        agreedToTerms={agreedToTerms}
        agreedToPrivacy={agreedToPrivacy}
        onTermsChange={handleTermsChange}
        onPrivacyChange={handlePrivacyChange}
        submitError={submitError}
      />
    </div>
  );
}