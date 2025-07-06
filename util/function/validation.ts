export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "이메일을 입력해주세요";
  if (!emailRegex.test(email)) return "올바른 이메일 형식이 아닙니다";
  return "";
};

export const validateName = (name: string) => {
  if (!name) return "이름을 입력해주세요";
  if (name.length < 2) return "이름은 2글자 이상이어야 합니다";
  return "";
};

export const validateBusinessNumber = (number: string) => {
  if (!number) return "사업자번호를 입력해주세요";
  if (number.length !== 10) return "사업자번호는 10자리여야 합니다";
  return "";
};

export const validatePhone = (phone: string) => {
  const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
  if (!phone) return "전화번호를 입력해주세요";
  if (!phoneRegex.test(phone.replace(/-/g, "")))
    return "올바른 전화번호 형식이 아닙니다";
  return "";
};

export const validatePassword = (password: string) => {
  if (!password) return "비밀번호를 입력해주세요";
  if (password.length < 8) return "비밀번호는 8자리 이상이어야 합니다";
  if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password))
    return "영문과 숫자를 포함해야 합니다";
  return "";
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
) => {
  if (!confirmPassword) return "비밀번호 확인을 입력해주세요";
  if (password !== confirmPassword) return "비밀번호가 일치하지 않습니다";
  return "";
};
