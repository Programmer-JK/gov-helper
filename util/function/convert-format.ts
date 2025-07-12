export const convertPhoneFormat = (phone: string) => {
  return phone
    .replace(/[^0-9]/g, "")
    .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
};

export const convertMoneyFormat = (money: number) => {
  return money.toLocaleString("ko-KR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const convertEmailFormat = (email: string) => {
  return email.replace(/[^a-zA-Z0-9@._-]/g, "");
};
