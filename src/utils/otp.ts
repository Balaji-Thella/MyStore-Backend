const otpStore = new Map<string, string>();

export const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const saveOtp = (phone: string, otp: string) => {
  otpStore.set(phone, otp);
  setTimeout(() => otpStore.delete(phone), 5 * 60 * 1000); // 5 min
};

export const verifyOtp = (phone: string, otp: string) => {
  return otpStore.get(phone) === otp;
};
