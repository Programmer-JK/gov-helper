"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, XCircle } from "lucide-react";
import { useState, useCallback } from "react";
import { SignUpFormData } from "@/util/type/auth";
import { convertPhoneFormat } from "@/util/function/convert-format";
import FormInput from "@/components/ui/form-input";
import { useBusinessNumber } from "@/hooks/use-business-number";
import { useFormValidation } from "@/hooks/use-form-validation";

interface SignUpFormProps {
  checkHeight: () => void;
}

export default function SignUpForm({ checkHeight }: SignUpFormProps) {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState<string>("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const businessNumber = useBusinessNumber();
  const { errors, isFormValid } = useFormValidation({
    formType: "signup",
    formData,
    businessNumber: businessNumber.value,
    businessNumberState: {
      isValid: businessNumber.isValid,
      checkResult: businessNumber.checkResult,
    },
    touched,
    onValidationChange: checkHeight,
  });

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setTouched((prev) => ({ ...prev, [field]: true }));
      if (signupError) setSignupError("");
    },
    [signupError]
  );

  const handlePhoneChange = useCallback(
    (value: string) => {
      const formattedValue = convertPhoneFormat(value);
      handleInputChange("phone", formattedValue);
    },
    [handleInputChange]
  );

  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allFields = {
      email: true,
      name: true,
      phone: true,
      password: true,
      confirmPassword: true,
      businessNumber: true,
    };
    setTouched(allFields);

    // 올바른 검증 로직
    if (
      !isFormValid({
        isBusinessNumberValid: businessNumber.isValid,
        agreedToTerms,
        agreedToPrivacy,
      })
    ) {
      setSignupError("모든 필수 정보를 올바르게 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setSignupError("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          businessNumber: businessNumber.value,
        }),
      });

      if (response.ok) {
        alert("회원가입이 완료되었습니다!");
      } else {
        const errorData = await response.json();
        setSignupError(errorData.message || "회원가입 중 오류가 발생했습니다.");
      }
    } catch (error) {
      setSignupError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const isSignUpDisabled = !isFormValid({
    isBusinessNumberValid: businessNumber.isValid,
    agreedToTerms,
    agreedToPrivacy,
  });

  return (
    <motion.form
      className="space-y-6"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      onSubmit={handleSubmit}
    >
      <FormInput
        id="signup-email"
        label="이메일"
        type="email"
        placeholder="name@example.com"
        value={formData.email}
        onChange={(value) => handleInputChange("email", value)}
        onBlur={() => handleBlur("email")}
        error={errors.email}
        touched={touched.email}
        required
      />

      <FormInput
        id="signup-name"
        label="이름"
        placeholder="홍길동"
        value={formData.name}
        onChange={(value) => handleInputChange("name", value)}
        onBlur={() => handleBlur("name")}
        error={errors.name}
        touched={touched.name}
        required
      />

      <FormInput
        id="business-number"
        label="사업자번호"
        placeholder="1234567890"
        value={businessNumber.value}
        onChange={(value) => businessNumber.handleChange(value)}
        onBlur={() => handleBlur("businessNumber")}
        error={errors.businessNumber}
        touched={touched.businessNumber}
        required
        maxLength={10}
      />

      <FormInput
        id="signup-phone"
        label="전화번호"
        type="tel"
        placeholder="010-1234-5678"
        value={formData.phone}
        onChange={handlePhoneChange}
        onBlur={() => handleBlur("phone")}
        error={errors.phone}
        touched={touched.phone}
        maxLength={13}
        required
      />

      <FormInput
        id="signup-password"
        label="비밀번호"
        type={showPassword ? "text" : "password"}
        placeholder="비밀번호를 입력하세요"
        value={formData.password}
        onChange={(value) => handleInputChange("password", value)}
        onBlur={() => handleBlur("password")}
        error={errors.password}
        touched={touched.password}
        required
        rightElement={
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 hover:text-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </motion.button>
        }
      />

      <FormInput
        id="confirm-password"
        label="비밀번호 확인"
        type={showConfirmPassword ? "text" : "password"}
        placeholder="비밀번호를 다시 입력하세요"
        value={formData.confirmPassword}
        onChange={(value) => handleInputChange("confirmPassword", value)}
        onBlur={() => handleBlur("confirmPassword")}
        error={errors.confirmPassword}
        touched={touched.confirmPassword}
        required
        rightElement={
          <motion.button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-gray-500 hover:text-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </motion.button>
        }
      />

      {/* 약관 동의 체크박스들 */}
      <motion.div className="space-y-3">
        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
            이용약관에 동의합니다.{" "}
            <a href="#" className="text-primary-600 hover:underline">
              약관 보기
            </a>
          </label>
        </div>
        <div className="flex items-start">
          <input
            id="privacy"
            type="checkbox"
            checked={agreedToPrivacy}
            onChange={(e) => setAgreedToPrivacy(e.target.checked)}
            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
          />
          <label htmlFor="privacy" className="ml-2 text-sm text-gray-700">
            개인정보 처리방침에 동의합니다.{" "}
            <a href="#" className="text-primary-600 hover:underline">
              약관 보기
            </a>
          </label>
        </div>
      </motion.div>

      {/* 에러 메시지 */}
      <AnimatePresence>
        {signupError && (
          <motion.div
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <XCircle className="w-4 h-4 flex-shrink-0" />
            <span>{signupError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={isSignUpDisabled || isLoading}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
          isSignUpDisabled || isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-primary-400 to-primary-200 text-white hover:from-primary-500 hover:to-primary-300"
        }`}
        whileHover={!isSignUpDisabled && !isLoading ? { scale: 1.02 } : {}}
        whileTap={!isSignUpDisabled && !isLoading ? { scale: 0.98 } : {}}
      >
        {isLoading ? "회원가입 중..." : "회원가입"}
      </motion.button>
    </motion.form>
  );
}
