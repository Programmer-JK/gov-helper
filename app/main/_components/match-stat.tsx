"use client";

import { motion } from "framer-motion";

interface MatchingStatProps {
  totalMatching: number;
  highMatching: number;
  mediumMatching: number;
  lowMatching: number;
}

export default function MatchingStat({
  totalMatching,
  highMatching,
  mediumMatching,
  lowMatching,
}: MatchingStatProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8">
      <motion.div
        className="bg-slate-50 p-3 md:p-4 rounded-lg text-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-xl md:text-2xl font-bold text-primary-600">
          {totalMatching}
        </div>
        <div className="text-xs md:text-sm text-gray-600">총 매칭 수</div>
      </motion.div>
      <motion.div
        className="bg-green-50 p-3 md:p-4 rounded-lg text-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-xl md:text-2xl font-bold text-green-600">
          {highMatching}
        </div>
        <div className="text-xs md:text-sm text-gray-600">높은 매칭</div>
      </motion.div>
      <motion.div
        className="bg-yellow-50 p-3 md:p-4 rounded-lg text-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-xl md:text-2xl font-bold text-yellow-600">
          {mediumMatching}
        </div>
        <div className="text-xs md:text-sm text-gray-600">중간 매칭</div>
      </motion.div>
      <motion.div
        className="bg-red-50 p-3 md:p-4 rounded-lg text-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-xl md:text-2xl font-bold text-red-600">
          {lowMatching}
        </div>
        <div className="text-xs md:text-sm text-gray-600">낮은 매칭</div>
      </motion.div>
    </div>
  );
}