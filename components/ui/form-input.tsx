import { motion, AnimatePresence } from "framer-motion";
import { XCircle, CheckCircle } from "lucide-react";

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  maxLength?: number;
  rightElement?: React.ReactNode;
  className?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  maxLength,
  rightElement,
  className = "",
}: FormInputProps) {
  const getInputClassName = (hasError: boolean) => {
    const baseClass =
      "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300";

    if (hasError) {
      return `${baseClass} border-red-300 focus:ring-red-500/20 bg-red-50/50`;
    }
    if (touched && !hasError && value) {
      return `${baseClass} border-primary-300 focus:ring-primary-300/20 bg-primary-50/30`;
    }
    return `${baseClass} border-gray-300 focus:ring-primary-300/20`;
  };

  const showSuccess = touched && !error && value;
  const showError = error && touched;

  // 비밀번호 필드에서는 성공 아이콘을 표시하지 않음
  const shouldShowSuccess = showSuccess && type !== "password";

  return (
    <motion.div variants={itemVariants} className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} {required && "*"}
      </label>
      <div className="relative">
        <motion.input
          id={id}
          type={type}
          placeholder={placeholder}
          className={getInputClassName(!!error)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          maxLength={maxLength}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {rightElement}
          </div>
        )}

        {shouldShowSuccess && !rightElement && (
          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500" />
        )}

        {shouldShowSuccess && rightElement && (
          <CheckCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500" />
        )}
      </div>

      <AnimatePresence>
        {showError && (
          <motion.div
            className="flex items-center gap-2 mt-2 text-sm text-red-600"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <XCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
