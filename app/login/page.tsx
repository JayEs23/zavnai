"use client";

/**
 * ZAVN Auth Gateway
 * Terminal Minimalism / Industrial Command Center
 */

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MdEmail, MdLockOutline } from "react-icons/md";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isGlitching, setIsGlitching] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGlitching(true);
    
    // Scan-line glitch effect duration
    setTimeout(async () => {
      setIsLoading(true);
      setError("");

      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: true,
          callbackUrl: "/echo",
        });

        if (result?.error) {
          setError("Invalid credentials. Access denied.");
          setIsGlitching(false);
        }
      } catch (err) {
        setError("System error during authentication.");
        setIsGlitching(false);
      } finally {
        setIsLoading(false);
      }
    }, 150);
  };

  return (
    <main className={`min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all duration-300 ${isGlitching ? 'scale-[1.02] brightness-125' : ''}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.03)_0%,transparent_70%)]" />
      </div>

      {isGlitching && (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
          <div className="w-full h-px bg-amber-500/50 shadow-[0_0_15px_#f59e0b] absolute top-1/2 animate-scan" />
          <div className="w-full h-px bg-amber-500/30 absolute top-1/3 animate-scan [animation-delay:50ms]" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full max-w-[400px] z-10"
      >
        <div className="flex flex-col items-center space-y-12">
          {/* Pulsing Z Logo */}
          <motion.div
            animate={{ 
              boxShadow: ["0 0 20px rgba(245,158,11,0.1)", "0 0 40px rgba(245,158,11,0.3)", "0 0 20px rgba(245,158,11,0.1)"],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="size-16 bg-amber-500 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)]"
          >
            <span className="mono text-[#09090b] font-black text-3xl">Z</span>
          </motion.div>

          <div className="w-full space-y-8">
            <div className="space-y-2 text-center">
              <span className="mono text-amber-500 text-[10px] tracking-[0.5em] uppercase font-black">
                [GATEKEEPER_PROTOCOL]
              </span>
              <h1 className="text-xl font-black tracking-[0.2em] text-zinc-100 uppercase mono">
                Initialize_Session
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="mono text-[9px] text-zinc-500 uppercase tracking-widest font-black block ml-1">
                    [FULL_IDENTITY]
                  </label>
                  <input
                    type="email"
                    placeholder="ENTER_EMAIL"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#09090b] border border-zinc-800 py-4 px-6 mono text-[11px] text-amber-500 focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-800 tracking-wider"
                  />
                </div>
                <div className="space-y-2">
                  <label className="mono text-[9px] text-zinc-500 uppercase tracking-widest font-black block ml-1">
                    [SECURE_CIPHER]
                  </label>
                  <input
                    type="password"
                    placeholder="ENTER_PASSPHRASE"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#09090b] border border-zinc-800 py-4 px-6 mono text-[11px] text-amber-500 focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-800 tracking-wider"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/5 border border-red-500/20">
                  <p className="mono text-[9px] text-red-500 text-center uppercase tracking-[0.2em] font-black">
                    [CRITICAL_FAILURE: {error}]
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full py-5 bg-transparent border border-amber-500/20 overflow-hidden hover:border-amber-500 transition-all duration-500"
              >
                <span className="relative z-10 mono text-amber-500 font-black tracking-[0.4em] uppercase text-xs group-hover:text-zinc-100 transition-colors">
                  {isLoading ? "AUTHENTICATING..." : "INITIALIZE_INTEGRITY"}
                </span>
                <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              </button>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-900" />
              </div>
              <div className="relative flex justify-center text-[8px] uppercase mono tracking-[0.3em] font-black">
                <span className="bg-[#09090b] px-4 text-zinc-700">
                  External_Handshake
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/echo" })}
                className="flex items-center justify-center gap-3 py-4 border border-zinc-900 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:border-amber-500/50 transition-all mono text-[9px] font-black tracking-widest uppercase"
              >
                <FaGoogle className="text-zinc-100" /> Google
              </button>
              <button
                type="button"
                onClick={() => signIn("github", { callbackUrl: "/verify" })}
                className="flex items-center justify-center gap-3 py-4 border border-zinc-900 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:border-amber-500/50 transition-all mono text-[9px] font-black tracking-widest uppercase"
              >
                <FaGithub className="text-zinc-100" /> GitHub
              </button>
            </div>

            <p className="text-center text-[9px] mono text-zinc-600 uppercase tracking-widest font-black">
              First time access?{" "}
              <Link href="/signup" className="text-amber-500/60 hover:text-amber-500 transition-colors underline decoration-amber-500/20 underline-offset-4">
                Initialize_Identity
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
