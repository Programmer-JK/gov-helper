"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignInForm from "./auth/signin-form";
import SignUpForm from "./auth/signup-form";

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [formHeight, setFormHeight] = useState<number>(0);

  // Refs for measuring form heights
  const signinFormRef = useRef<HTMLFormElement>(null);
  const signupFormRef = useRef<HTMLFormElement>(null);

  // Measure form heights and set initial height
  useEffect(() => {
    const measureHeight = () => {
      if (activeTab === "signin" && signinFormRef.current) {
        const formElement = signinFormRef.current;
        const computedStyle = window.getComputedStyle(formElement);
        const paddingTop = parseFloat(computedStyle.paddingTop);
        const paddingBottom = parseFloat(computedStyle.paddingBottom);
        const contentHeight = formElement.scrollHeight;
        const totalHeight = contentHeight + paddingTop + paddingBottom + 150;
        setFormHeight(totalHeight);
      } else if (activeTab === "signup" && signupFormRef.current) {
        const formElement = signupFormRef.current;
        const computedStyle = window.getComputedStyle(formElement);
        const paddingTop = parseFloat(computedStyle.paddingTop);
        const paddingBottom = parseFloat(computedStyle.paddingBottom);
        const contentHeight = formElement.scrollHeight;
        const totalHeight = contentHeight + paddingTop + paddingBottom + 150;
        setFormHeight(totalHeight);
      }
    };

    const frameId = requestAnimationFrame(() => {
      measureHeight();
      setTimeout(measureHeight, 100);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [activeTab]);

  const tabVariants = {
    inactive: { scale: 1, opacity: 0.7 },
    active: {
      scale: 1.02,
      opacity: 1,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden"
        whileHover={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          transition: { duration: 0.3 },
        }}
      >
        {/* Tab Headers */}
        <div className="flex bg-gradient-to-r from-primary-600 to-primary-400 relative">
          <motion.div
            className="absolute bottom-0 h-0.5 bg-white"
            layoutId="activeTab"
            initial={false}
            animate={{
              x: activeTab === "signin" ? "0%" : "100%",
              width: "50%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          <motion.button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 relative ${
              activeTab === "signin"
                ? "text-white"
                : "text-primary-50 hover:text-white"
            }`}
            variants={tabVariants}
            animate={activeTab === "signin" ? "active" : "inactive"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            로그인
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 relative ${
              activeTab === "signup"
                ? "text-white"
                : "text-primary-50 hover:text-white"
            }`}
            variants={tabVariants}
            animate={activeTab === "signup" ? "active" : "inactive"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            회원가입
          </motion.button>
        </div>

        {/* Form Content with Height Animation */}
        <motion.div
          className="overflow-hidden"
          animate={{
            height: formHeight || "auto",
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 40,
            mass: 0.8,
            duration: 0.5,
          }}
          layout
        >
          <div className="p-8">
            <div className="relative">
              <AnimatePresence mode="wait" initial={false}>
                {activeTab === "signin" ? (
                  <SignInForm
                    onFormRef={(ref) => {
                      signinFormRef.current = ref;
                    }}
                  />
                ) : (
                  <SignUpForm
                    onFormRef={(ref) => {
                      signupFormRef.current = ref;
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
