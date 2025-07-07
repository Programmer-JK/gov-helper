"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { validateEmail } from "@/util/function/validation";
import { SignInFormData, ValidationErrors } from "@/util/type/auth";

interface SignInFormProps {
  onFormRef: (ref: HTMLFormElement | null) => void;
}

export default function SignInForm({ onFormRef }: SignInFormProps) {
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>("");

  // Validation
  useEffect(() => {
    const newErrors: ValidationErrors = {};

    if (touched.email) {
      newErrors.email = validateEmail(formData.email);
    }

    setErrors(newErrors);
  }, [formData, touched]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setTouched({ ...touched, [field]: true });
    // 입력할 때마다 로그인 에러 초기화
    if (loginError) setLoginError("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 이메일 유효성 검증
    if (!formData.email || !formData.password) {
      setLoginError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (errors.email) {
      setLoginError("올바른 이메일을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setLoginError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // 성공 시 페이지 이동 (Next.js App Router 방식)
        window.location.href = "/main";
      } else {
        const errorData = await response.json();
        setLoginError(
          errorData.message || "이메일 또는 비밀번호가 올바르지 않습니다."
        );
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      setLoginError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
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
      key="signin"
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
          onChange={(e) => handleInputChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
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
            className={getInputClassName("password", false)}
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
        </div>
        {/* 비밀번호 개별 에러는 제거 */}
      </motion.div>

      <motion.div className="flex items-center" variants={itemVariants}>
        <motion.input
          id="remember"
          type="checkbox"
          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
        <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
          로그인 상태 유지
        </label>
      </motion.div>

      {/* 로그인 에러 메시지 */}
      <AnimatePresence>
        {loginError && (
          <motion.div
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            variants={itemVariants}
          >
            <XCircle className="w-4 h-4 flex-shrink-0" />
            <span>{loginError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
          isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-primary-600 to-primary-300 text-white hover:from-primary-700 hover:to-primary-400"
        }`}
        variants={itemVariants}
        whileHover={!isLoading ? { scale: 1.02 } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
      >
        {isLoading ? "로그인 중..." : "로그인"}
      </motion.button>
    </motion.form>
  );
}
