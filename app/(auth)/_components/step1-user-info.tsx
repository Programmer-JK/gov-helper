import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { FormInput } from '@/components/ui/form-components';
import { convertPhoneFormat } from '@/util/function/sign-up-validation';
import { StepProps } from '@/util/type/auth';

export const Step1UserInfo: React.FC<StepProps> = ({ 
  formData, onChange, onBlur, errors, touched 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePhoneChange = (value: string) => {
    const formattedValue = convertPhoneFormat(value);
    onChange('phone', formattedValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-3"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">사용자 정보 입력</h2>
        <p className="text-gray-600">회원가입을 위한 기본 정보를 입력해주세요</p>
      </div>

      <FormInput
        id="email"
        label="이메일"
        type="email"
        placeholder="name@example.com"
        value={formData.email}
        onChange={(value) => onChange('email', value)}
        onBlur={() => onBlur('email')}
        error={errors.email}
        touched={touched.email}
        required
      />

      <FormInput
        id="name"
        label="이름"
        placeholder="홍길동"
        value={formData.name}
        onChange={(value) => onChange('name', value)}
        onBlur={() => onBlur('name')}
        error={errors.name}
        touched={touched.name}
        required
      />

      <FormInput
        id="phone"
        label="전화번호"
        type="tel"
        placeholder="010-1234-5678"
        value={formData.phone}
        onChange={handlePhoneChange}
        onBlur={() => onBlur('phone')}
        error={errors.phone}
        touched={touched.phone}
        maxLength={13}
        required
      />

      <FormInput
        id="password"
        label="비밀번호"
        type={showPassword ? "text" : "password"}
        placeholder="비밀번호를 입력하세요"
        value={formData.password}
        onChange={(value) => onChange('password', value)}
        onBlur={() => onBlur('password')}
        error={errors.password}
        touched={touched.password}
        required
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        }
      />

      <FormInput
        id="confirmPassword"
        label="비밀번호 확인"
        type={showConfirmPassword ? "text" : "password"}
        placeholder="비밀번호를 다시 입력하세요"
        value={formData.confirmPassword}
        onChange={(value) => onChange('confirmPassword', value)}
        onBlur={() => onBlur('confirmPassword')}
        error={errors.confirmPassword}
        touched={touched.confirmPassword}
        required
        rightElement={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        }
      />
    </motion.div>
  );
};