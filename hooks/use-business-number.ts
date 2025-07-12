import { useState, useCallback } from "react";

interface BusinessNumberState {
  checkResult: string;
  isValid: boolean;
  isLoading: boolean;
}

export const useBusinessNumber = () => {
  const [value, setValue] = useState("");
  const [state, setState] = useState<BusinessNumberState>({
    checkResult: "",
    isValid: false,
    isLoading: false,
  });

  const handleChange = useCallback((inputValue: string) => {
    const numericValue = inputValue.replace(/\D/g, "").slice(0, 10);
    setValue(numericValue);

    if (numericValue.length === 10) {
      fetchCompanyInfo(numericValue);
    } else {
      setState({
        checkResult: "",
        isValid: false,
        isLoading: false,
      });
    }
  }, []);

  const fetchCompanyInfo = useCallback(async (businessNumber: string) => {
    if (businessNumber.length !== 10) {
      setState({
        checkResult: "",
        isValid: false,
        isLoading: false,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, isValid: false }));

    try {
      const response = await fetch("/api/business-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ businessNumber }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.isValid) {
        setState({
          checkResult: data.checkResult || "등록된 사업자번호",
          isValid: true,
          isLoading: false,
        });
      } else {
        setState({
          checkResult: data.message || "등록되지 않은 사업자번호",
          isValid: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("사업자번호 조회 실패:", error);
      setState({
        checkResult: "조회 중 오류가 발생했습니다",
        isValid: false,
        isLoading: false,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      checkResult: "",
      isValid: false,
      isLoading: false,
    });
  }, []);

  return {
    value,
    ...state,
    handleChange,
    reset,
  };
};
