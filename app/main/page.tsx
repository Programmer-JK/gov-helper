"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Download,
  BarChart3,
  CheckCircle,
  AlertCircle,
  XCircle,
  ExternalLink,
  Users,
  List,
  Scroll,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
}

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

  const mockPrograms = [
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

  const getMatchingColor = (rate: number) => {
    if (rate >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (rate >= 50) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getMatchingIcon = (rate: number) => {
    if (rate >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (rate >= 50) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getMatchingLabel = (rate: number) => {
    if (rate >= 80) return "높은 매칭";
    if (rate >= 50) return "중간 매칭";
    return "낮은 매칭";
  };

  const highMatching = matchingResults.filter(
    (r) => r.matchingRate >= 80
  ).length;
  const mediumMatching = matchingResults.filter(
    (r) => r.matchingRate >= 50 && r.matchingRate < 80
  ).length;
  const lowMatching = matchingResults.filter((r) => r.matchingRate < 50).length;

  if (isLoading) {
    return (
      <div className="min-h-screen w-[75rem]">
        <div className="container py-8 w-full">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col items-center">
      {/* Header */}
      <motion.div
        className="w-full bg-gradient-to-r from-primary-600 to-primary-300 text-white py-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl font-bold mb-4 flex items-center justify-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            🏛️ 정부지원 사업 매칭 시스템
          </motion.h1>
          <p className="text-xl text-primary-100">
            고객사와 정부지원 사업의 적합성을 분석합니다
          </p>
        </div>
      </motion.div>

      <div className="max-w-[60rem] px-6 py-8 space-y-8">
        {/* 정부지원 사업 데이터 로드 */}
        <motion.div
          className="md:grid md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="md:col-span-1 bg-[linear-gradient(180deg,theme(colors.primary.800),theme(colors.primary.300))]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary-50">
                <Scroll className="w-5 h-5" strokeWidth={3} />
                정부지원 사업 갯수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="bg-primary-50 rounded-lg p-8 text-center"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="text-4xl font-bold text-primary-600 mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  {mockPrograms.length}
                </motion.div>
                <p className="text-primary-700">로드된 사업 수</p>
              </motion.div>
            </CardContent>
          </Card>
          <Card className="md:col-span-1 bg-[linear-gradient(180deg,theme(colors.primary.800),theme(colors.primary.300))]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary-50">
                <List className="w-5 h-5" strokeWidth={3} />
                정부지원 사업 리스트
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="flex flex-col gap-2 overflow-y-auto h-52 px-2"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#14919B #D7FEDF",
                }}
              >
                {mockPrograms.map((program) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    whileTap={{ scale: 0.98 }}
                    key={program.id}
                    className="bg-primary-50 rounded-md min-h-10 p-2 text-sm overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {program.programName}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 매칭 분석 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-[linear-gradient(225deg,theme(colors.primary.800),theme(colors.primary.300))]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary-50">
                <Search className="w-5 h-5" strokeWidth={3} />
                매칭 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mb-6"
              >
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-primary-200 to-primary-50 hover:bg-primary-500 text-primary-700 px-8 py-3 text-lg font-bold"
                >
                  {isAnalyzing ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
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
                      <BarChart3 className="w-5 h-5 mr-2" />
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <motion.div
                        className="bg-slate-50 p-4 rounded-lg text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-2xl font-bold text-primary-600">
                          {matchingResults.length}
                        </div>
                        <div className="text-sm text-gray-600">총 매칭 수</div>
                      </motion.div>
                      <motion.div
                        className="bg-green-50 p-4 rounded-lg text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-2xl font-bold text-green-600">
                          {highMatching}
                        </div>
                        <div className="text-sm text-gray-600">높은 매칭</div>
                      </motion.div>
                      <motion.div
                        className="bg-yellow-50 p-4 rounded-lg text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-2xl font-bold text-yellow-600">
                          {mediumMatching}
                        </div>
                        <div className="text-sm text-gray-600">중간 매칭</div>
                      </motion.div>
                      <motion.div
                        className="bg-red-50 p-4 rounded-lg text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-2xl font-bold text-red-600">
                          {lowMatching}
                        </div>
                        <div className="text-sm text-gray-600">낮은 매칭</div>
                      </motion.div>
                    </div>

                    {/* 매칭 결과 상세 */}
                    <div className="space-y-6">
                      {matchingResults.map((result, index) => (
                        <motion.div
                          key={result.id}
                          className={`border-l-4 p-6 rounded-lg ${getMatchingColor(
                            result.matchingRate
                          )}`}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {getMatchingIcon(result.matchingRate)}
                              <div>
                                <h3 className="text-xl font-bold">
                                  {result.programName}
                                </h3>
                                <p className="text-sm opacity-75 flex flex-col md:flex-row gap-0 md:gap-2">
                                  <span>고객사: {result.company}</span>
                                  <span className="hidden md:inline"> | </span>
                                  <span>주관기관: {result.department}</span>
                                </p>
                                <p className="text-sm opacity-75">
                                  예산: {result.budget}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold mb-1">
                                {result.matchingRate}%
                              </div>
                              <div className="text-sm hidden md:flex">
                                {getMatchingLabel(result.matchingRate)}
                              </div>
                            </div>
                          </div>

                          {/* 매칭률 프로그레스 바 */}
                          <div className="mb-4">
                            <div className="bg-white/50 rounded-full h-3 overflow-hidden">
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

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-semibold mb-2">매칭 이유:</h4>
                              <ul className="text-sm space-y-1">
                                {result.reasons.map((reason, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    {reason}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">신청 요건:</h4>
                              <ul className="text-sm space-y-1">
                                {result.requirements.map((req, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center gap-2"
                                  >
                                    <AlertCircle className="w-4 h-4 text-blue-500" />
                                    {req}
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
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() =>
                                    alert(
                                      `${result.programName} 지원 페이지로 이동합니다.`
                                    )
                                  }
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  지원하기
                                </Button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
