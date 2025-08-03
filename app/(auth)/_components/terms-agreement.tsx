import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle } from 'lucide-react';

interface TermsAgreementProps {
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
  onTermsChange: (agreed: boolean) => void;
  onPrivacyChange: (agreed: boolean) => void;
  submitError?: string;
}

export const TermsAgreement: React.FC<TermsAgreementProps> = ({
  agreedToTerms,
  agreedToPrivacy,
  onTermsChange,
  onPrivacyChange,
  submitError
}) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="space-y-3">
        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => onTermsChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
            이용약관에 동의합니다.{" "}
            <a href="#" className="text-blue-600 hover:underline">
              약관 보기
            </a>
          </label>
        </div>
        <div className="flex items-start">
          <input
            id="privacy"
            type="checkbox"
            checked={agreedToPrivacy}
            onChange={(e) => onPrivacyChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
          />
          <label htmlFor="privacy" className="ml-2 text-sm text-gray-700">
            개인정보 처리방침에 동의합니다.{" "}
            <a href="#" className="text-blue-600 hover:underline">
              약관 보기
            </a>
          </label>
        </div>
      </div>

      {/* 에러 메시지 */}
      <AnimatePresence>
        {submitError && (
          <motion.div
            className="flex items-center gap-2 p-3 mt-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <XCircle className="w-4 h-4 flex-shrink-0" />
            <span>{submitError}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};