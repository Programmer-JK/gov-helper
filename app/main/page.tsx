"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import ProgramStat from "./_components/program-stat";
import MatchingAnalysis from "./_components/matching-analysis";
import Footer from "@/components/footer";
import { MatchingResult } from "@/util/type/application";

export default function MainPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchingResults, setMatchingResults] = useState<MatchingResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // 로그인 상태 확인
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
    setIsLoggedIn(true);
    setIsLoading(false);
  }, [router]);

  // Mock matching results
  const mockResults: MatchingResult[] = [
    {
      id: "1",
      programName: "청년창업 지원사업",
      company: "(CamChokChey)",
      department: "중소벤처기업부",
      budget: "200억원",
      matchingRate: 85,
      reasons: ["업종 일치", "기업 규모 적합", "창업 연차 조건 만족"],
      requirements: ["대표자 만 39세 이하", "창업 7년 이내"],
    },
    {
      id: "2",
      programName: "스마트공장 구축지원",
      company: "(CamChokChey)",
      department: "산업통상자원부",
      budget: "150억원",
      matchingRate: 65,
      reasons: ["제조업 해당", "중소기업 조건 만족"],
      requirements: ["제조업 영위", "스마트공장 구축 계획"],
    },
    {
      id: "3",
      programName: "R&D 혁신바우처",
      company: "(CamChokChey)",
      department: "과학기술정보통신부",
      budget: "50억원",
      matchingRate: 45,
      reasons: ["기업 규모 적합"],
      requirements: ["R&D 수행 경험", "기술개발 계획서"],
    },
  ];

  const mockPrograms: Program[] = [
    {
      id: "1",
      programName:
        "2025년 2차 친환경 경량소재 적용 미래차 부품산업 전환 생태계 기반구축사업 시제품 제작 수혜기업 모집 공고",
    },
    {
      id: "2",
      programName:
        "[경북] 2025년 메타 얼라이언스 프로젝트그룹 참여기업 모집 공고",
    },
    {
      id: "3",
      programName:
        "2025년 2차 바이오헬스산업 기술평가 사업화 연계 지원사업 참여기관(업) 모집 공고",
    },
    {
      id: "4",
      programName:
        "[세종] 조달청 다수공급자계약(MAS) 활용 컨설팅 지원사업 공고",
    },
    {
      id: "5",
      programName:
        "[경북] 2025년 소상공인 IP(지식재산)창출지원 IP출원지원(상표출원) 사업 공고",
    },
    {
      id: "6",
      programName: "2023년 바이오의료기술개발사업 신규과제 제1차 공고 안내",
    },
    {
      id: "7",
      programName: "2024년 바이오의료기술개발사업 신규과제 제1차 공고 안내",
    },
    {
      id: "8",
      programName: "2025년 바이오의료기술개발사업 신규과제 제1차 공고 안내",
    },
    {
      id: "9",
      programName: "2026년 바이오의료기술개발사업 신규과제 제1차 공고 안내",
    },
    {
      id: "10",
      programName: "2027년 바이오의료기술개발사업 신규과제 제1차 공고 안내",
    },
  ];

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setMatchingResults(mockResults);
      setShowResults(true);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleApply = (programName: string) => {
    alert(`${programName} 지원 페이지로 이동합니다.`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1 w-full max-w-none lg:max-w-[60rem] mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        <ProgramStat programs={mockPrograms} />

        <MatchingAnalysis
          isAnalyzing={isAnalyzing}
          showResults={showResults}
          matchingResults={matchingResults}
          onAnalyze={handleAnalyze}
          onApply={handleApply}
        />
      </div>
      <Footer />
    </div>
  );
}