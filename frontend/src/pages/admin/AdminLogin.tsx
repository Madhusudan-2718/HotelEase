import { useState } from "react";
import { motion } from "motion/react";
import { Hotel, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login (replace with actual authentication)
    setTimeout(() => {
      if (email && password) {
        toast.success("Login successful! Welcome back.");
        setIsLoading(false);
        onLoginSuccess();
      } else {
        toast.error("Please enter valid credentials");
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleBackToHome = () => {
    const event = new CustomEvent('navigate', { detail: 'home' });
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Static Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/src/public/images/loginbackground.png')",
        }}
      />
      
      {/* Dark Overlay for Readability */}
      <div className="fixed inset-0 bg-black/50"></div>

      {/* Back to Home Button */}
      <button
        onClick={handleBackToHome}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 
bg-[#FFD700]/90 backdrop-blur-sm rounded-lg shadow-xl hover:shadow-2xl 
transition-all duration-200 hover:bg-[#FFD700] group border border-yellow-300/40"

      >
        <ArrowLeft className="w-5 h-5 text-[#6B8E23] group-hover:-translate-x-1 transition-transform" />
        <span className="font-poppins font-semibold text-[#000000]">Back to Home</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-sm z-10"
      >
        <div className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30 relative overflow-hidden">
          {/* Decorative Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FFD700] via-[#6B8E23] to-[#FFD700]"></div>
          
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center mb-5"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#FFD700] rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Hotel className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#6B8E23] rounded-full border-4 border-white"></div>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-playfair text-2xl font-bold text-[#FFD700] mb-2"
            >
              HotelEase Admin
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-[#6B8E23] font-poppins font-semibold"
            >
              Sign in to manage your hotel operations
            </motion.p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="email" className="text-white font-bold text-sm">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@hotelease.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white border-2 border-gray-300 text-[#2D2D2D] placeholder:text-gray-500 focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/30 focus:bg-white transition-all font-medium text-base"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
            >
              <Label htmlFor="password" className="text-white font-bold text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-white border-2 border-gray-300 text-[#2D2D2D] placeholder:text-gray-500 focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/30 focus:bg-white transition-all font-medium text-base"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-between text-sm"
            >
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-white rounded cursor-pointer"
                />
                <span className="text-white group-hover:text-[#556B2F] transition-colors font-semibold">Remember me</span>
              </label>
              <a
                href="#"
                className="text-white hover:text-[#556B2F] transition-colors font-bold"
              >
                Forgot password?
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#2D2D2D] hover:shadow-lg hover:scale-[1.02] font-semibold transition-all duration-200 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#2D2D2D] border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFA500] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-[#6B8E23] flex items-center justify-center gap-2 font-semibold">
              <Lock className="w-3 h-3 text-[#6B8E23]" />
              Secure access for authorized personnel only
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

