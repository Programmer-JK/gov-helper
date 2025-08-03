"use client";

import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.div
      className="w-full bg-primary-600 text-white py-8 md:py-12"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 md:px-6 text-center">
        <motion.h1
          className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 flex items-center justify-center gap-2 md:gap-3"
          whileHover={{ scale: 1.02 }}
        >
          🏛️ 정부지원 사업 매칭 시스템
        </motion.h1>
        <p className="text-base md:text-xl text-primary-100">
          고객사와 정부지원 사업의 적합성을 분석합니다
        </p>
      </div>
    </motion.div>
  );
}