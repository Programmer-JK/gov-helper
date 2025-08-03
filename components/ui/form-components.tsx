// components/ui/form-components.tsx
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { FormInputProps, FormSelectProps, FileUploadProps } from '@/util/type/auth';

// FormInput 컴포넌트
export const FormInput: React.FC<FormInputProps> = ({ 
  id, label, type = "text", placeholder, value, onChange, onBlur, 
  error, touched, required, maxLength, rightElement 
}) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        maxLength={maxLength}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error && touched ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {rightElement}
        </div>
      )}
    </div>
    {error && touched && (
      <p className="text-sm text-red-600">{error}</p>
    )}
  </div>
);

// FormSelect 컴포넌트
export const FormSelect: React.FC<FormSelectProps> = ({ 
  id, label, value, onChange, options, placeholder, required, error, touched 
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error && touched ? 'border-red-500' : 'border-gray-300'
      }`}
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && touched && (
      <p className="text-sm text-red-600">{error}</p>
    )}
  </div>
);

// FileUpload 컴포넌트
export const FileUpload: React.FC<FileUploadProps> = ({ 
  id, label, onChange, accept = "*/*", required, error, touched 
}) => {
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file?.name || "");
    onChange(file);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor={id}
          className={`flex items-center justify-center w-full px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 ${
            error && touched ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {fileName || "파일을 선택하세요"}
            </span>
          </div>
        </label>
      </div>
      {error && touched && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};