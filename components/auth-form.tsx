"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";

interface ValidationErrors {
  email?: string;
  name?: string;
  businessNumber?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [businessNumber, setBusinessNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  const [formHeight, setFormHeight] = useState<number>(0);

  // Refs for measuring form heights
  const signinFormRef = useRef<HTMLFormElement>(null);
  const signupFormRef = useRef<HTMLFormElement>(null);

  // Form data
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Measure form heights and set initial height
  useEffect(() => {
    const measureHeight = () => {
      if (activeTab === "signin" && signinFormRef.current) {
        // 패딩을 포함한 전체 높이 계산
        const formElement = signinFormRef.current;
        const computedStyle = window.getComputedStyle(formElement);
        const paddingTop = parseFloat(computedStyle.paddingTop);
        const paddingBottom = parseFloat(computedStyle.paddingBottom);
        const contentHeight = formElement.scrollHeight;
        const totalHeight = contentHeight + paddingTop + paddingBottom;
        setFormHeight(totalHeight);
      } else if (activeTab === "signup" && signupFormRef.current) {
        // 패딩을 포함한 전체 높이 계산
        const formElement = signupFormRef.current;
        const computedStyle = window.getComputedStyle(formElement);
        const paddingTop = parseFloat(computedStyle.paddingTop);
        const paddingBottom = parseFloat(computedStyle.paddingBottom);
        const contentHeight = formElement.scrollHeight;
        const totalHeight = contentHeight + paddingTop + paddingBottom;
        setFormHeight(totalHeight);
      }
    };

    // requestAnimationFrame을 사용하여 다음 프레임에서 측정
    const frameId = requestAnimationFrame(() => {
      measureHeight();
      // 추가로 약간의 지연 후 한 번 더 측정
      setTimeout(measureHeight, 100);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [activeTab, errors, businessNumber, companyName, isLoadingCompany]);

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "이메일을 입력해주세요";
    if (!emailRegex.test(email)) return "올바른 이메일 형식이 아닙니다";
    return "";
  };

  const validateName = (name: string) => {
    if (!name) return "이름을 입력해주세요";
    if (name.length < 2) return "이름은 2글자 이상이어야 합니다";
    return "";
  };

  const validateBusinessNumber = (number: string) => {
    if (!number) return "사업자번호를 입력해주세요";
    if (number.length !== 10) return "사업자번호는 10자리여야 합니다";
    return "";
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
    if (!phone) return "전화번호를 입력해주세요";
    if (!phoneRegex.test(phone.replace(/-/g, "")))
      return "올바른 전화번호 형식이 아닙니다";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "비밀번호를 입력해주세요";
    if (password.length < 8) return "비밀번호는 8자리 이상이어야 합니다";
    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password))
      return "영문과 숫자를 포함해야 합니다";
    return "";
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ) => {
    if (!confirmPassword) return "비밀번호 확인을 입력해주세요";
    if (password !== confirmPassword) return "비밀번호가 일치하지 않습니다";
    return "";
  };

  // Real-time validation
  useEffect(() => {
    const newErrors: ValidationErrors = {};

    if (touched.email) newErrors.email = validateEmail(formData.email);
    if (touched.name) newErrors.name = validateName(formData.name);
    if (touched.businessNumber)
      newErrors.businessNumber = validateBusinessNumber(businessNumber);
    if (touched.phone) newErrors.phone = validatePhone(formData.phone);
    if (touched.password)
      newErrors.password = validatePassword(formData.password);
    if (touched.confirmPassword)
      newErrors.confirmPassword = validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      );

    setErrors(newErrors);
  }, [formData, businessNumber, touched]);

  // Mock API call for business registration number lookup
  const fetchCompanyName = async (businessNum: string) => {
    if (businessNum.length !== 10) return;

    setIsLoadingCompany(true);
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
            b_no: [businessNum], // 배열로 전송 (API 스펙에 따라)
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      // 원본 jQuery 코드의 로직 그대로 구현
      if (data.match_cnt === "1") {
        // 성공
        console.log("success");
        return { success: true, data: data };
      } else {
        // 실패
        console.log("fail");
        if (data.data && data.data[0] && data.data[0].tax_type) {
          alert(data.data[0].tax_type);
        }
        return { success: false, data: data };
      }
    } catch (error) {
      console.log("error");
      console.error("API 호출 실패:", error);
      return { success: false, error: error };
    }
    // Simulate API call
    setTimeout(() => {
      // Mock company names based on business number
      const mockCompanies: { [key: string]: string } = {
        "1234567890": "(주)테크놀로지",
        "9876543210": "스마트솔루션(주)",
        "5555555555": "이노베이션코리아(주)",
      };
      setCompanyName(mockCompanies[businessNum] || "등록되지 않은 사업자번호");
      setIsLoadingCompany(false);
    }, 1000);
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
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setTouched({ ...touched, [field]: true });
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

  const tabVariants = {
    inactive: { scale: 1, opacity: 0.7 },
    active: {
      scale: 1.02,
      opacity: 1,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden"
        whileHover={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          transition: { duration: 0.3 },
        }}
      >
        {/* Tab Headers */}
        <div className="flex bg-gradient-to-r from-primary-600 to-primary-400 relative">
          <motion.div
            className="absolute bottom-0 h-0.5 bg-white"
            layoutId="activeTab"
            initial={false}
            animate={{
              x: activeTab === "signin" ? "0%" : "100%",
              width: "50%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          <motion.button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 relative ${
              activeTab === "signin"
                ? "text-white"
                : "text-primary-50 hover:text-white"
            }`}
            variants={tabVariants}
            animate={activeTab === "signin" ? "active" : "inactive"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            로그인
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 relative ${
              activeTab === "signup"
                ? "text-white"
                : "text-primary-50 hover:text-white"
            }`}
            variants={tabVariants}
            animate={activeTab === "signup" ? "active" : "inactive"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            회원가입
          </motion.button>
        </div>

        {/* Form Content with Height Animation */}
        <motion.div
          className="overflow-hidden"
          animate={{
            height: formHeight || "auto",
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 40,
            mass: 0.8,
            duration: 0.5,
          }}
          layout
        >
          <div className="p-8">
            <div className="relative">
              <AnimatePresence mode="wait" initial={false}>
                {activeTab === "signin" ? (
                  <motion.form
                    key="signin"
                    ref={signinFormRef as React.RefObject<HTMLFormElement>}
                    className="space-y-6"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    onAnimationComplete={() => {
                      // 애니메이션 완료 후 높이 재측정
                      if (signinFormRef.current) {
                        const formElement = signinFormRef.current;
                        const computedStyle =
                          window.getComputedStyle(formElement);
                        const paddingTop = parseFloat(computedStyle.paddingTop);
                        const paddingBottom = parseFloat(
                          computedStyle.paddingBottom
                        );
                        const contentHeight = formElement.scrollHeight;
                        const totalHeight =
                          contentHeight + paddingTop + paddingBottom;
                        setFormHeight(totalHeight);
                      }
                    }}
                  >
                    <motion.div variants={itemVariants}>
                      <label
                        htmlFor="signin-email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        이메일
                      </label>
                      <motion.input
                        id="signin-email"
                        type="email"
                        placeholder="name@example.com"
                        className={getInputClassName("email", !!errors.email)}
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        onBlur={() => handleBlur("email")}
                        whileFocus={{
                          scale: 1.02,
                          boxShadow: "0 0 0 3px rgba(10, 209, 200, 0.1)",
                        }}
                      />
                      <AnimatePresence>
                        {errors.email && touched.email && (
                          <motion.div
                            className="flex items-center gap-2 mt-2 text-sm text-red-600"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <XCircle className="w-4 h-4" />
                            {errors.email}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label
                        htmlFor="signin-password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        비밀번호
                      </label>
                      <div className="relative">
                        <motion.input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="비밀번호를 입력하세요"
                          className={getInputClassName(
                            "password",
                            !!errors.password
                          )}
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          onBlur={() => handleBlur("password")}
                          whileFocus={{
                            scale: 1.02,
                            boxShadow: "0 0 0 3px rgba(10, 209, 200, 0.1)",
                          }}
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </motion.button>
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

                    <motion.div
                      className="flex items-center"
                      variants={itemVariants}
                    >
                      <motion.input
                        id="remember"
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      />
                      <label
                        htmlFor="remember"
                        className="ml-2 text-sm text-gray-700"
                      >
                        로그인 상태 유지
                      </label>
                    </motion.div>

                    <motion.button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-300 text-white py-3 px-4 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-400 transition-all duration-300"
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 10px 25px rgba(10, 209, 200, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      로그인
                    </motion.button>
                    <motion.div className="text-center" variants={itemVariants}>
                      <motion.a
                        href="#"
                        className="text-sm text-primary-600 hover:text-primary-800 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                      >
                        비밀번호를 잊으셨나요?
                      </motion.a>
                    </motion.div>
                  </motion.form>
                ) : (
                  <motion.form
                    key="signup"
                    ref={signupFormRef as React.RefObject<HTMLFormElement>}
                    className="space-y-6"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    onAnimationComplete={() => {
                      // 애니메이션 완료 후 높이 재측정
                      if (signupFormRef.current) {
                        const formElement = signupFormRef.current;
                        const computedStyle =
                          window.getComputedStyle(formElement);
                        const paddingTop = parseFloat(computedStyle.paddingTop);
                        const paddingBottom = parseFloat(
                          computedStyle.paddingBottom
                        );
                        const contentHeight = formElement.scrollHeight;
                        const totalHeight =
                          contentHeight + paddingTop + paddingBottom;
                        setFormHeight(totalHeight);
                      }
                    }}
                  >
                    <div>
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
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          onBlur={() => handleBlur("email")}
                          whileFocus={{
                            scale: 1.02,
                            boxShadow: "0 0 0 3px rgba(10, 209, 200, 0.1)",
                          }}
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
                    </div>
                    <div>
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
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          onBlur={() => handleBlur("name")}
                          whileFocus={{
                            scale: 1.02,
                            boxShadow: "0 0 0 3px rgba(10, 209, 200, 0.1)",
                          }}
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
                    </div>

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
                            !!errors.businessNumber
                          )}
                          whileFocus={{
                            scale: 1.02,
                            boxShadow: "0 0 0 3px rgba(10, 209, 200, 0.1)",
                          }}
                        />
                        {touched.businessNumber &&
                          !errors.businessNumber &&
                          businessNumber.length === 10 && (
                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500" />
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
                            ) : companyName ? (
                              <motion.span
                                className={
                                  companyName.includes("등록되지 않은")
                                    ? "text-red-500"
                                    : "text-primary-600"
                                }
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                {companyName}
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
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          onBlur={() => handleBlur("phone")}
                          whileFocus={{
                            scale: 1.02,
                            boxShadow: "0 0 0 3px rgba(10, 209, 200, 0.1)",
                          }}
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
                          className={getInputClassName(
                            "password",
                            !!errors.password
                          )}
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          onBlur={() => handleBlur("password")}
                          whileFocus={{
                            scale: 1.02,
                            boxShadow: "0 0 0 3px rgba(10, 209, 200, 0.1)",
                          }}
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </motion.button>
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
                          whileFocus={{
                            scale: 1.02,
                            boxShadow: "0 0 0 3px rgba(10, 209, 200, 0.1)",
                          }}
                        />
                        <motion.button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        />
                        <label
                          htmlFor="terms"
                          className="ml-2 text-sm text-gray-700"
                        >
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
                          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        />
                        <label
                          htmlFor="privacy"
                          className="ml-2 text-sm text-gray-700"
                        >
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

                    <motion.button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary-400 to-primary-200 text-white py-3 px-4 rounded-lg font-semibold hover:from-primary-500 hover:to-primary-300 transition-all duration-300"
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 10px 25px rgba(20, 145, 155, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      회원가입
                    </motion.button>

                    <motion.div className="text-center" variants={itemVariants}>
                      <span className="text-sm text-gray-600">
                        이미 계정이 있으신가요?{" "}
                        <motion.button
                          type="button"
                          onClick={() => setActiveTab("signin")}
                          className="text-primary-600 hover:text-primary-800 font-semibold transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                        >
                          로그인
                        </motion.button>
                      </span>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
