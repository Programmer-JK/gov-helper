"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, XCircle } from "lucide-react";
import { useState, useCallback } from "react";
import { SignInFormData } from "@/util/type/auth";
import FormInput from "@/components/ui/form-input";
import { useFormValidation } from "@/hooks/use-form-validation";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

interface SignInFormProps {
  checkHeight: () => void;
}

export default function SignInForm({ checkHeight }: SignInFormProps) {
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showPassword, setShowPassword] = useState(false);

  const { errors } = useFormValidation({
    formType: "signin",
    formData,
    touched,
    onValidationChange: checkHeight,
  });

  const {
    login,
    clearError,
    savedId,
    isLoading,
    error,
    setSavedId,
    removeSavedId,
  } = useAuthStore();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const isFormValid = formData.email && formData.password && !errors.email;

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(formData);

    if (success) {
      router.push("/main");
    } else {
      checkHeight();
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.form
      key="signin"
      className="space-y-6"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      onSubmit={handleSubmit}
    >
      <FormInput
        id="signin-email"
        label="이메일"
        type="email"
        placeholder="name@example.com"
        value={formData.email}
        onChange={(value) => handleInputChange("email", value)}
        onBlur={() => handleBlur("email")}
        error={errors.email}
        touched={touched.email}
      />

      <FormInput
        id="signin-password"
        label="비밀번호"
        type={showPassword ? "text" : "password"}
        placeholder="비밀번호를 입력하세요"
        value={formData.password}
        onChange={(value) => handleInputChange("password", value)}
        onBlur={() => handleBlur("password")}
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

      <AnimatePresence>
        {error && (
          <motion.div
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            variants={itemVariants}
          >
            <XCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={!isFormValid || isLoading}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
          !isFormValid || isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-primary-600 to-primary-300 text-white hover:from-primary-700 hover:to-primary-400"
        }`}
        variants={itemVariants}
        whileHover={isFormValid && !isLoading ? { scale: 1.02 } : {}}
        whileTap={isFormValid && !isLoading ? { scale: 0.98 } : {}}
      >
        {isLoading ? "로그인 중..." : "로그인"}
      </motion.button>
    </motion.form>
  );
}
