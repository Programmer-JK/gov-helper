"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, XCircle, Loader2, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import {
  validateEmail,
  validateName,
  validateBusinessNumber,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
} from "@/util/function/validation";
import { SignUpFormData, ValidationErrors } from "@/util/type/auth";

interface SignUpFormProps {
  onFormRef: (ref: HTMLFormElement | null) => void;
}

export default function SignUpForm({ onFormRef }: SignUpFormProps) {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [businessNumber, setBusinessNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  const [isBusinessNumberValid, setIsBusinessNumberValid] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState<string>("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  // Validation
  useEffect(() => {
    const newErrors: ValidationErrors = {};

    if (touched.email) {
      newErrors.email = validateEmail(formData.email);
    }
    if (touched.name) {
      newErrors.name = validateName(formData.name);
    }
    if (touched.businessNumber) {
      newErrors.businessNumber = validateBusinessNumber(businessNumber);
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

    setErrors(newErrors);
  }, [formData, businessNumber, touched]);

  // 사업자번호 조회 API 호출
  const fetchCompanyName = async (businessNum: string) => {
    if (businessNum.length !== 10) return;

    setIsLoadingCompany(true);
    setIsBusinessNumberValid(false);

    try {
      const response = await fetch(
        `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${process.env.NEXT_PUBLIC_ODCLOUD_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Accept: "application/json",
          },
          body: JSON.stringify({
            b_no: [businessNum],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.match_cnt === 1 && data.data && data.data.length > 0) {
        const businessData = data.data[0];
        if (businessData.b_stt_cd === "01") {
          setCompanyName(businessData.tax_type || "등록된 사업자번호");
          setIsBusinessNumberValid(true);
        } else {
          setCompanyName("사업을 중단한 사업자번호");
          setIsBusinessNumberValid(false);
        }
      } else {
        setCompanyName("등록되지 않은 사업자번호");
        setIsBusinessNumberValid(false);
      }
    } catch (error) {
      console.error("사업자번호 조회 실패:", error);
      setCompanyName("조회 중 오류가 발생했습니다");
      setIsBusinessNumberValid(false);
    } finally {
      setIsLoadingCompany(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setTouched({ ...touched, [field]: true });
    // 입력할 때마다 회원가입 에러 초기화
    if (signupError) setSignupError("");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // 숫자만 추출

    // 11자리로 제한
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    // 하이픈 자동 삽입
    if (value.length >= 7) {
      value = value.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    } else if (value.length >= 3) {
      value = value.replace(/(\d{3})(\d{4})/, "$1-$2");
    }

    setFormData({ ...formData, phone: value });
    setTouched({ ...touched, phone: true });
    if (signupError) setSignupError("");
  };

  const handleBusinessNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setBusinessNumber(value);
    setTouched({ ...touched, businessNumber: true });

    if (value.length === 10) {
      fetchCompanyName(value);
    } else {
      setCompanyName("");
      setIsBusinessNumberValid(false);
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const getInputClassName = (field: string, hasError: boolean) => {
    const baseClass =
      "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300";
    if (hasError) {
      return `${baseClass} border-red-300 focus:ring-red-500/20 bg-red-50/50`;
    }
    if (touched[field] && !hasError) {
      return `${baseClass} border-primary-300 focus:ring-primary-300/20 bg-primary-50/30`;
    }
    return `${baseClass} border-gray-300 focus:ring-primary-300/20`;
  };

  // 회원가입 버튼 활성화 조건
  const isFormValid = () => {
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
  };

  const isSignUpDisabled = !isFormValid();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 모든 필드를 touched로 설정하여 에러 표시
    const allFields = {
      email: true,
      name: true,
      phone: true,
      password: true,
      confirmPassword: true,
      businessNumber: true,
    };
    setTouched(allFields);

    // 유효성 검증
    if (!isFormValid()) {
      setSignupError("모든 필수 정보를 올바르게 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setSignupError("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          businessNumber,
          companyName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // 성공 시 페이지 이동 또는 성공 메시지 표시
        alert("회원가입이 완료되었습니다!");
        // 로그인 페이지로 리다이렉트하거나 자동 로그인 처리
      } else {
        const errorData = await response.json();
        setSignupError(errorData.message || "회원가입 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
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
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.form
      key="signup"
      ref={(ref) => onFormRef(ref)}
      className="space-y-6"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      onSubmit={handleSubmit}
    >
      <motion.div variants={itemVariants}>
        <label
          htmlFor="signup-email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          이메일 *
        </label>
        <div className="relative">
          <motion.input
            id="signup-email"
            type="email"
            placeholder="name@example.com"
            className={getInputClassName("email", !!errors.email)}
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
          />
          {touched.email && !errors.email && formData.email && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500" />
          )}
        </div>
        <AnimatePresence>
          {errors.email && touched.email && (
            <motion.div
              className="flex items-center gap-1 mt-1 text-xs text-red-600"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <XCircle className="w-3 h-3" />
              {errors.email}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label
          htmlFor="signup-name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          이름 *
        </label>
        <div className="relative">
          <motion.input
            id="signup-name"
            type="text"
            placeholder="홍길동"
            className={getInputClassName("name", !!errors.name)}
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
          />
          {touched.name && !errors.name && formData.name && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500" />
          )}
        </div>
        <AnimatePresence>
          {errors.name && touched.name && (
            <motion.div
              className="flex items-center gap-1 mt-1 text-xs text-red-600"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <XCircle className="w-3 h-3" />
              {errors.name}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label
          htmlFor="business-number"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          사업자번호 *
        </label>
        <div className="relative">
          <motion.input
            id="business-number"
            type="text"
            value={businessNumber}
            onChange={handleBusinessNumberChange}
            placeholder="1234567890"
            className={getInputClassName(
              "businessNumber",
              !!errors.businessNumber ||
                (!isBusinessNumberValid && businessNumber.length === 10)
            )}
          />
          {touched.businessNumber &&
            !errors.businessNumber &&
            businessNumber.length === 10 &&
            isBusinessNumberValid && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500" />
            )}
          {businessNumber.length === 10 &&
            !isBusinessNumberValid &&
            !isLoadingCompany && (
              <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
            )}
        </div>
        <AnimatePresence>
          {errors.businessNumber && touched.businessNumber && (
            <motion.div
              className="flex items-center gap-2 mt-2 text-sm text-red-600"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <XCircle className="w-4 h-4" />
              {errors.businessNumber}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {businessNumber.length === 10 && (
            <motion.div
              className="mt-2 text-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isLoadingCompany ? (
                <motion.span
                  className="text-gray-500 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="w-4 h-4" />
                  </motion.div>
                  회사명 조회 중...
                </motion.span>
              ) : companyName && isBusinessNumberValid ? (
                <motion.span
                  className="text-primary-600 flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle className="w-4 h-4" />
                  {companyName}
                </motion.span>
              ) : !isBusinessNumberValid && !isLoadingCompany ? (
                <motion.span
                  className="text-red-500 flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <XCircle className="w-4 h-4" />
                  유효하지 않은 사업자번호입니다.
                </motion.span>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label
          htmlFor="signup-phone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          전화번호 *
        </label>
        <div className="relative">
          <motion.input
            id="signup-phone"
            type="tel"
            placeholder="010-1234-5678"
            className={getInputClassName("phone", !!errors.phone)}
            value={formData.phone}
            onChange={handlePhoneChange}
            onBlur={() => handleBlur("phone")}
            maxLength={13}
          />
          {touched.phone && !errors.phone && formData.phone && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500" />
          )}
        </div>
        <AnimatePresence>
          {errors.phone && touched.phone && (
            <motion.div
              className="flex items-center gap-2 mt-2 text-sm text-red-600"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <XCircle className="w-4 h-4" />
              {errors.phone}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label
          htmlFor="signup-password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          비밀번호 *
        </label>
        <div className="relative">
          <motion.input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력하세요"
            className={getInputClassName("password", !!errors.password)}
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            onBlur={() => handleBlur("password")}
          />
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 h-full text-gray-500 hover:text-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </motion.button>
          {touched.password && !errors.password && formData.password && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500" />
          )}
        </div>
        <AnimatePresence>
          {errors.password && touched.password && (
            <motion.div
              className="flex items-center gap-2 mt-2 text-sm text-red-600"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <XCircle className="w-4 h-4" />
              {errors.password}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          비밀번호 확인 *
        </label>
        <div className="relative">
          <motion.input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="비밀번호를 다시 입력하세요"
            className={getInputClassName(
              "confirmPassword",
              !!errors.confirmPassword
            )}
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            onBlur={() => handleBlur("confirmPassword")}
          />
          <motion.button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 h-full text-gray-500 hover:text-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </motion.button>
          {touched.confirmPassword &&
            !errors.confirmPassword &&
            formData.confirmPassword && (
              <CheckCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500" />
            )}
        </div>
        <AnimatePresence>
          {errors.confirmPassword && touched.confirmPassword && (
            <motion.div
              className="flex items-center gap-2 mt-2 text-sm text-red-600"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <XCircle className="w-4 h-4" />
              {errors.confirmPassword}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div className="space-y-3" variants={itemVariants}>
        <div className="flex items-start">
          <motion.input
            id="terms"
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
            이용약관에 동의합니다.{" "}
            <motion.a
              href="#"
              className="text-primary-600 hover:underline"
              whileHover={{ scale: 1.05 }}
            >
              약관 보기
            </motion.a>
          </label>
        </div>
        <div className="flex items-start">
          <motion.input
            id="privacy"
            type="checkbox"
            checked={agreedToPrivacy}
            onChange={(e) => setAgreedToPrivacy(e.target.checked)}
            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
          <label htmlFor="privacy" className="ml-2 text-sm text-gray-700">
            개인정보 처리방침에 동의합니다.{" "}
            <motion.a
              href="#"
              className="text-primary-600 hover:underline"
              whileHover={{ scale: 1.05 }}
            >
              약관 보기
            </motion.a>
          </label>
        </div>
      </motion.div>

      {/* 회원가입 에러 메시지 */}
      <AnimatePresence>
        {signupError && (
          <motion.div
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            variants={itemVariants}
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
        variants={itemVariants}
        whileHover={!isSignUpDisabled && !isLoading ? { scale: 1.02 } : {}}
        whileTap={!isSignUpDisabled && !isLoading ? { scale: 0.98 } : {}}
      >
        {isLoading ? "회원가입 중..." : "회원가입"}
      </motion.button>
    </motion.form>
  );
}
