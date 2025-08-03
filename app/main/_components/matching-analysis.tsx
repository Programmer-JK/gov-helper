"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MatchingStat from "./match-stat";
import MatchingResultCard from "./matching-result-card";

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

interface MatchingAnalysisProps {
  isAnalyzing: boolean;
  showResults: boolean;
  matchingResults: MatchingResult[];
  onAnalyze: () => void;
  onApply: (programName: string) => void;
}

export default function MatchingAnalysis({
  isAnalyzing,
  showResults,
  matchingResults,
  onAnalyze,
  onApply,
}: MatchingAnalysisProps) {
  const highMatching = matchingResults.filter((r) => r.matchingRate >= 80).length;
  const mediumMatching = matchingResults.filter(
    (r) => r.matchingRate >= 50 && r.matchingRate < 80
  ).length;
  const lowMatching = matchingResults.filter((r) => r.matchingRate < 50).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="bg-[linear-gradient(225deg,theme(colors.primary.800),theme(colors.primary.300))]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-50">
            <Search className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
            매칭 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-4 md:mb-6"
          >
            <Button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-primary-200 to-primary-50 hover:bg-primary-500 text-primary-700 px-6 md:px-8 py-2 md:py-3 text-base md:text-lg font-bold w-full md:w-auto"
            >
              {isAnalyzing ? (
                <>
                  <motion.div
                    className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                  매칭 분석 중...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  매칭 분석 실행
                </>
              )}
            </Button>
          </motion.div>

          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* 매칭 통계 */}
                <MatchingStat
                  totalMatching={matchingResults.length}
                  highMatching={highMatching}
                  mediumMatching={mediumMatching}
                  lowMatching={lowMatching}
                />

                {/* 매칭 결과 상세 */}
                <div className="space-y-4 md:space-y-6">
                  {matchingResults.map((result, index) => (
                    <MatchingResultCard
                      key={result.id}
                      result={result}
                      index={index}
                      onApply={onApply}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}