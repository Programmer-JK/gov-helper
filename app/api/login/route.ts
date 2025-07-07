import { type NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// 더미 사용자 데이터
const DUMMY_USERS = [
  {
    userIdx: "user_1",
    email: "admin@govhelper.com",
    password: "Admin123!",
    name: "쿠루루",
    companyNum: "1234567890",
    companyName: "야스쿠치",
    phone: "010-1234-5678",
  },
];

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    // 요청 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { email, password } = await request.json();

    // 입력 검증
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          errorCode: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    // 사용자 찾기
    const user = DUMMY_USERS.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          errorCode: "USER_001",
        },
        { status: 400 }
      );
    }

    // 비밀번호 확인 (실제로는 bcrypt 등으로 해시 비교)
    if (user.password !== password) {
      return NextResponse.json(
        {
          success: false,
          errorCode: "USER_003",
        },
        { status: 400 }
      );
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        userId: user.userIdx,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const refreshToken = jwt.sign({ userId: user.userIdx }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // 사용자 정보 (비밀번호 제외)
    const { password: _, ...userInfo } = user;

    return NextResponse.json({
      success: true,
      data: {
        user: userInfo,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}
