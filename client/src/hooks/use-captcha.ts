import { useState, useCallback } from "react";

export function useCaptcha(length = 6) {
  const [captcha, setCaptcha] = useState<string>("");

  const generateCaptcha = useCallback(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    return result;
  }, [length]);

  const verifyCaptcha = useCallback(
    (input: string) => {
      return input.toUpperCase() === captcha;
    },
    [captcha]
  );

  return {
    captcha,
    generateCaptcha,
    verifyCaptcha,
  };
}
