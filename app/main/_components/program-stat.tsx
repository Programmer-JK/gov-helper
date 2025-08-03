"use client";

import { motion } from "framer-motion";
import { Scroll, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Program {
  id: string;
  programName: string;
}

interface ProgramStatProps {
  programs: Program[];
}

export default function ProgramStat({ programs }: ProgramStatProps) {
  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <Card className="bg-[linear-gradient(180deg,theme(colors.primary.800),theme(colors.primary.300))]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-50">
            <Scroll className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
            정부지원 사업 갯수
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="bg-primary-50 rounded-lg p-4 md:p-8 text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="text-3xl md:text-4xl font-bold text-primary-600 mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              {programs.length}
            </motion.div>
            <p className="text-sm md:text-base text-primary-700">로드된 사업 수</p>
          </motion.div>
        </CardContent>
      </Card>

      <Card className="bg-[linear-gradient(180deg,theme(colors.primary.800),theme(colors.primary.300))]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-50">
            <List className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
            정부지원 사업 리스트
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col gap-2 overflow-y-auto h-40 md:h-52 px-2"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#14919B #D7FEDF",
            }}
          >
            {programs.map((program) => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                whileTap={{ scale: 0.98 }}
                key={program.id}
                className="bg-primary-50 rounded-md min-h-8 md:min-h-10 p-2 text-xs md:text-sm overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
                title={program.programName}
              >
                {program.programName}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}