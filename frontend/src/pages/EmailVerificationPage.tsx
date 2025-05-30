import { useAuthStore } from "@/store/authStore";
import { motion } from "motion/react";
import { useRef, useState, type KeyboardEvent } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail } = useAuthStore();

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];

    // Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.slice().reverse().findIndex(digit => digit !== "");
      const focusIndex = lastFilledIndex === -1 ? 0 : 5 - lastFilledIndex;

      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      throw new Error("Verification code must be 6 characters");
    }

    try {
      await verifyEmail({ verificationCode });
      navigate("/");
      toast.success("Email verified successfully");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
      >
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
          Verify Your Email
        </h2>

        <p className='text-center text-gray-300 mb-6'>
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='flex justify-between'>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el; // Just assign, don't return
                }}
                type='text'
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none'
              />
            ))}
          </div>

          {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type='submit'
            disabled={isLoading || code.some((digit) => !digit)}
            className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 cursor-pointer'
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default EmailVerificationPage;