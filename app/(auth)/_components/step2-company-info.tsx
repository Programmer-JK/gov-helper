// components/signup/step2-company-info.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FormInput, FormSelect, FileUpload } from '@/components/ui/form-components';
import { businessTypeOptions, handleAddressSearch } from '@/util/function/sign-up-validation';
import { StepProps } from '@/util/type/auth';

export const Step2CompanyInfo: React.FC<StepProps> = ({ 
  formData, onChange, onBlur, errors, touched 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-3"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">회사 정보 입력</h2>
        <p className="text-gray-600">사업자 정보와 회사 정보를 입력해주세요</p>
      </div>

      <FormInput
        id="businessNumber"
        label="사업자번호"
        placeholder="1234567890"
        value={formData.businessNumber}
        onChange={(value) => onChange('businessNumber', value.replace(/[^\d]/g, ''))}
        onBlur={() => onBlur('businessNumber')}
        error={errors.businessNumber}
        touched={touched.businessNumber}
        maxLength={10}
        required
      />

      <FormSelect
        id="businessType"
        label="사업자 형태"
        value={formData.businessType}
        onChange={(value) => onChange('businessType', value)}
        options={businessTypeOptions}
        placeholder="사업자 형태를 선택하세요"
        error={errors.businessType}
        touched={touched.businessType}
        required
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          사업장 주소 <span className="text-red-500">*</span>
        </label>
        <div className="hidden md:flex space-x-2">
          <input
            type="text"
            placeholder="주소를 입력하세요"
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
            onBlur={() => onBlur('address')}
            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.address && touched.address ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={handleAddressSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            주소검색
          </button>
        </div>
        <div className="flex flex-col md:hidden space-y-1">
          <button
            type="button"
            onClick={handleAddressSearch}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            주소검색
          </button>
          <input
            type="text"
            placeholder="주소를 입력하세요"
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
            onBlur={() => onBlur('address')}
            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.address && touched.address ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.address && touched.address && (
          <p className="text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      <FormInput
        id="representativeName"
        label="대표자명"
        placeholder="대표자 이름을 입력하세요"
        value={formData.representativeName}
        onChange={(value) => onChange('representativeName', value)}
        onBlur={() => onBlur('representativeName')}
        error={errors.representativeName}
        touched={touched.representativeName}
        required
      />

      <FormInput
        id="representativeBirthDate"
        label="대표자 생년월일"
        type="date"
        placeholder="YYYY-MM-DD"
        value={formData.representativeBirthDate}
        onChange={(value) => onChange('representativeBirthDate', value)}
        onBlur={() => onBlur('representativeBirthDate')}
        error={errors.representativeBirthDate}
        touched={touched.representativeBirthDate}
        required
      />

      <FileUpload
        id="companyProfile"
        label="회사소개서"
        onChange={(file) => onChange('companyProfile', file)}
        accept=".pdf,.doc,.docx,.ppt,.pptx"
        error={errors.companyProfile}
        touched={touched.companyProfile}
      />
    </motion.div>
  );
};