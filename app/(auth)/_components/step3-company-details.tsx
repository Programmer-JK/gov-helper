// components/signup/step3-company-details.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FormInput } from '@/components/ui/form-components';
import { StepProps } from '@/util/type/auth';

export const Step3CompanyDetails: React.FC<StepProps> = ({ 
  formData, onChange, onBlur, errors, touched 
}) => {
  const getBusinessTypeLabel = (value: string): string => {
    const typeMap: Record<string, string> = {
      'corporation': '법인사업자',
      'individual': '개인사업자',
      'freelancer': '프리랜서'
    };
    return typeMap[value] || value;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-3"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">회사 상세 정보</h2>
        <p className="text-gray-600 break-keep">마지막 단계입니다. 회사의 상세 정보를 입력해주세요</p>
      </div>

      <FormInput
        id="employeeCount"
        label="임직원 수"
        type="number"
        placeholder="예: 50"
        value={formData.employeeCount}
        onChange={(value) => onChange('employeeCount', value)}
        onBlur={() => onBlur('employeeCount')}
        error={errors.employeeCount}
        touched={touched.employeeCount}
        required
      />

      <FormInput
        id="lastYearRevenue"
        label="직전년도 매출액"
        placeholder="예: 10억원"
        value={formData.lastYearRevenue}
        onChange={(value) => onChange('lastYearRevenue', value)}
        onBlur={() => onBlur('lastYearRevenue')}
        error={errors.lastYearRevenue}
        touched={touched.lastYearRevenue}
        required
      />
    </motion.div>
  );
};