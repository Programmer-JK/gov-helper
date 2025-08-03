"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MatchingResult {
  id: string;
  programName: string;
  company: string;
  department: string;
  budget: string;
  matchingRate: number;
  reasons: string[];
  requirements: string[];
}

interface MatchingResultCardProps {
  result: MatchingResult;
  index: number;
  onApply: (programName: string) => void;
}

export default function MatchingResultCard({
  result,
  index,
  onApply,
}: MatchingResultCardProps) {
  const getMatchingColor = (rate: number) => {
    if (rate >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (rate >= 50) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getMatchingIcon = (rate: number) => {
    if (rate >= 80) return <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />;
    if (rate >= 50) return <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />;
    return <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />;
  };

  const getMatchingLabel = (rate: number) => {
    if (rate >= 80) return "높은 매칭";
    if (rate >= 50) return "중간 매칭";
    return "낮은 매칭";
  };

  return (
    <motion.div
      className={`border-l-4 p-4 md:p-6 rounded-lg ${getMatchingColor(
        result.matchingRate
      )}`}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-3">
        <div className="flex items-start gap-2 md:gap-3 flex-1">
          {getMatchingIcon(result.matchingRate)}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg md:text-xl font-bold break-words">
              {result.programName}
            </h3>
            <div className="text-xs md:text-sm opacity-75 space-y-1 md:space-y-0 mt-1">
              <div className="flex flex-col md:flex-row md:gap-2">
                <span>고객사: {result.company}</span>
                <span className="hidden md:inline"> | </span>
                <span>주관기관: {result.department}</span>
              </div>
              <p>예산: {result.budget}</p>
            </div>
          </div>
        </div>
        <div className="text-center md:text-right flex-shrink-0">
          <div className="text-xl md:text-2xl font-bold mb-1">
            {result.matchingRate}%
          </div>
          <div className="text-xs md:text-sm">
            {getMatchingLabel(result.matchingRate)}
          </div>
        </div>
      </div>

      {/* 매칭률 프로그레스 바 */}
      <div className="mb-4">
        <div
          className={`bg-white/50 rounded-full h-2 md:h-3 overflow-hidden border ${
            result.matchingRate >= 80
              ? "border-green-500"
              : result.matchingRate >= 50
              ? "border-yellow-500"
              : "border-red-500"
          }`}
        >
          <motion.div
            className={`h-full ${
              result.matchingRate >= 80
                ? "bg-green-500"
                : result.matchingRate >= 50
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${result.matchingRate}%` }}
            transition={{ duration: 1, delay: index * 0.2 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-semibold mb-2 text-sm md:text-base">매칭 이유:</h4>
          <ul className="text-xs md:text-sm space-y-1">
            {result.reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="break-words">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-sm md:text-base">신청 요건:</h4>
          <ul className="text-xs md:text-sm space-y-1">
            {result.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="break-words">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 지원하기 버튼 (80% 이상일 때만 표시) */}
      <AnimatePresence>
        {result.matchingRate >= 80 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto"
              onClick={() => onApply(result.programName)}
            >
              <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              지원하기
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}