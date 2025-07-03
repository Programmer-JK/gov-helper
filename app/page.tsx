"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Building2, Users, FileCheck, Headphones } from "lucide-react"
import AuthForm from "@/components/auth-form"

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide(1)
  }

  const prevSlide = () => {
    setCurrentSlide(0)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const featureVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Side - Service Info */}
        <motion.div
          className="flex-1 bg-gradient-to-br from-primary-800 via-primary-600 to-primary-400 p-12 flex items-center justify-center relative overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-300/20 to-primary-200/20"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(10, 209, 200, 0.2), rgba(69, 223, 177, 0.2))",
                "linear-gradient(45deg, rgba(69, 223, 177, 0.2), rgba(10, 209, 200, 0.2))",
                "linear-gradient(45deg, rgba(10, 209, 200, 0.2), rgba(69, 223, 177, 0.2))",
              ],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />

          <div className="relative z-10 max-w-lg text-white">
            <motion.div className="mb-8" variants={itemVariants}>
              <motion.h1
                className="text-4xl font-bold mb-4 flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                >
                  🏛️
                </motion.span>
                정부 헬퍼
              </motion.h1>
              <motion.p className="text-xl text-primary-100 mb-8" variants={itemVariants}>
                정부지원사업과 고객사를
                <br />
                스마트하게 매칭해드립니다
              </motion.p>
            </motion.div>

            <motion.div className="space-y-6" variants={containerVariants}>
              {[
                {
                  icon: Building2,
                  title: "맞춤형 정부지원사업 추천",
                  desc: "기업 특성에 맞는 최적의 지원사업을 찾아드립니다",
                },
                {
                  icon: FileCheck,
                  title: "간편한 온라인 신청 프로세스",
                  desc: "복잡한 서류 작업을 간소화하여 쉽게 신청하세요",
                },
                { icon: Users, title: "실시간 진행 상황 확인", desc: "신청부터 승인까지 모든 과정을 투명하게 확인" },
                { icon: Headphones, title: "전문가 상담 서비스", desc: "정부지원사업 전문가가 1:1로 상담해드립니다" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  variants={featureVariants}
                  whileHover={{ x: 10, transition: { duration: 0.2 } }}
                >
                  <motion.div
                    className="bg-white/20 p-3 rounded-lg"
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <feature.icon className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-primary-100 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          className="flex-1 flex items-center justify-center p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <AuthForm />
        </motion.div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen relative overflow-hidden">
        <AnimatePresence mode="wait">
          {currentSlide === 0 ? (
            <motion.div
              key="slide1"
              className="w-full min-h-screen bg-gradient-to-br from-primary-800 via-primary-600 to-primary-400 p-6 flex flex-col justify-center relative overflow-hidden"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-black/20"></div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-300/20 to-primary-200/20"
                animate={{
                  background: [
                    "linear-gradient(45deg, rgba(10, 209, 200, 0.2), rgba(69, 223, 177, 0.2))",
                    "linear-gradient(45deg, rgba(69, 223, 177, 0.2), rgba(10, 209, 200, 0.2))",
                  ],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />

              <motion.div
                className="relative z-10 text-white"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="text-center mb-12" variants={itemVariants}>
                  <motion.h1 className="text-3xl font-bold mb-4" whileHover={{ scale: 1.05 }}>
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                      className="inline-block"
                    >
                      🏛️
                    </motion.span>{" "}
                    정부 헬퍼
                  </motion.h1>
                  <motion.p className="text-lg text-primary-100 mb-8" variants={itemVariants}>
                    정부지원사업과 고객사를
                    <br />
                    스마트하게 매칭해드립니다
                  </motion.p>
                </motion.div>

                <motion.div className="space-y-6 mb-12" variants={containerVariants}>
                  {[
                    {
                      icon: Building2,
                      title: "맞춤형 정부지원사업 추천",
                      desc: "기업 특성에 맞는 최적의 지원사업을 찾아드립니다",
                    },
                    {
                      icon: FileCheck,
                      title: "간편한 온라인 신청 프로세스",
                      desc: "복잡한 서류 작업을 간소화하여 쉽게 신청하세요",
                    },
                    {
                      icon: Users,
                      title: "실시간 진행 상황 확인",
                      desc: "신청부터 승인까지 모든 과정을 투명하게 확인",
                    },
                    {
                      icon: Headphones,
                      title: "전문가 상담 서비스",
                      desc: "정부지원사업 전문가가 1:1로 상담해드립니다",
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4"
                      variants={featureVariants}
                      whileHover={{ x: 5 }}
                    >
                      <motion.div
                        className="bg-white/20 p-3 rounded-lg"
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        <feature.icon className="w-5 h-5" />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                        <p className="text-primary-100 text-sm">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div className="text-center" variants={itemVariants}>
                  <motion.button
                    onClick={nextSlide}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 mx-auto"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    시작하기
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="slide2"
              className="w-full min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6 flex flex-col justify-center relative"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <motion.button
                onClick={prevSlide}
                className="absolute top-6 left-6 z-10 bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full transition-all duration-300"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 1)" }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <AuthForm />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {[0, 1].map((slide) => (
            <motion.button
              key={slide}
              onClick={() => setCurrentSlide(slide)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === slide ? "bg-white" : "bg-white/50"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
