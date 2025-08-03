import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { businessNumber } = await request.json();

    if (!businessNumber || businessNumber.length !== 10) {
      return NextResponse.json(
        { success: false, message: "올바른 사업자번호를 입력해주세요." },
        { status: 400 }
      );
    }

    // 환경변수에서 API 키 가져오기 (서버에서만 접근 가능)
    const apiKey = process.env.ODCLOUD_API_KEY;

    if (!apiKey) {
      console.error("ODCLOUD_API_KEY가 설정되지 않았습니다.");
      return NextResponse.json(
        { success: false, message: "서버 설정 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Accept: "application/json",
        },
        body: JSON.stringify({
          b_no: [businessNumber],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.match_cnt === 1 && data.data && data.data.length > 0) {
      const businessData = data.data[0];

      if (businessData.b_stt_cd === "01") {
        // 정상 사업자
        return NextResponse.json({
          success: true,
          isValid: true,
          companyName: businessData.tax_type || "등록된 사업자번호",
        });
      } else {
        // 사업 중단
        return NextResponse.json({
          success: true,
          isValid: false,
          message: "사업을 중단한 사업자번호",
        });
      }
    } else {
      // 등록되지 않은 사업자번호
      return NextResponse.json({
        success: true,
        isValid: false,
        message: "등록되지 않은 사업자번호",
      });
    }
  } catch (error) {
    console.error("사업자번호 조회 실패:", error);
    return NextResponse.json(
      {
        success: false,
        message: "조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 500 }
    );
  }
}
