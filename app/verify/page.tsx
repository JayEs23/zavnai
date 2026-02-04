'use client';

/**
 * Link Your Life - Phone Verification Screen (Optional)
 * Users can skip phone verification and use email as default communication channel
 */

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MdPhone, MdWhatsapp, MdSms, MdCall, MdCheckCircle, MdError } from 'react-icons/md';

type Channel = 'whatsapp' | 'sms' | 'call';

export default function VerifyPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [selectedChannel, setSelectedChannel] = useState<Channel>('whatsapp');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [step, setStep] = useState<'select' | 'otp'>('select');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    // Phone verification is optional, so no auto-redirect needed

    const handleSendOTP = async () => {
        if (!phoneNumber.trim()) {
            setError('Please enter a phone number');
            return;
        }

        // Validate E.164 format
        const e164Regex = /^\+[1-9]\d{1,14}$/;
        if (!e164Regex.test(phoneNumber)) {
            setError('Phone number must be in E.164 format (e.g., +1234567890)');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/auth/verify-send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.accessToken}`
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    channel: selectedChannel
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStep('otp');
                setError('');
            } else {
                setError(data.message || 'Failed to send verification code');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Error sending OTP:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otpCode.length !== 6) {
            setError('Please enter a 6-digit code');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/auth/verify-check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.accessToken}`
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    code: otpCode,
                    channel: selectedChannel
                })
            });

            const data = await res.json();

            if (res.ok && data.verified) {
                setSuccess(true);
                // Redirect to Echo after 1.5 seconds
                setTimeout(() => {
                    router.push('/echo');
                }, 1500);
            } else {
                setError(data.message || 'Invalid verification code');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Error verifying OTP:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <div className="text-amber-500 text-sm uppercase tracking-widest">Loading...</div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="mx-auto size-20 bg-amber-500 rounded-full flex items-center justify-center"
                    >
                        <MdCheckCircle className="text-4xl text-[#09090b]" />
                    </motion.div>
                    <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-wider">
                        Verified
                    </h2>
                    <p className="text-amber-500/60 text-sm uppercase tracking-widest">
                        Redirecting to Echo...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.03)_0%,transparent_70%)]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-[500px] z-10"
            >
                <div className="flex flex-col items-center space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <motion.div
                            animate={{
                                boxShadow: [
                                    "0 0 20px rgba(245,158,11,0.1)",
                                    "0 0 40px rgba(245,158,11,0.3)",
                                    "0 0 20px rgba(245,158,11,0.1)"
                                ],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="size-20 bg-amber-500 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)] mx-auto"
                        >
                            <MdPhone className="text-4xl text-[#09090b]" />
                        </motion.div>
                        <div className="space-y-2">
                            <span className="mono text-amber-500 text-[10px] tracking-[0.5em] uppercase font-black">
                                [LINK_YOUR_LIFE]
                            </span>
                            <h1 className="text-2xl font-black tracking-[0.2em] text-zinc-100 uppercase mono">
                                Link Your Phone (Optional)
                            </h1>
                            <p className="text-zinc-500 text-sm mt-4">
                                Add phone verification for SMS/WhatsApp notifications. Email is our default communication channel. You can skip this step.
                            </p>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 'select' ? (
                            <motion.div
                                key="select"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="w-full space-y-6"
                            >
                                {/* Channel Selection */}
                                <div className="grid grid-cols-3 gap-4">
                                    {(['whatsapp', 'sms', 'call'] as Channel[]).map((channel) => (
                                        <button
                                            key={channel}
                                            onClick={() => setSelectedChannel(channel)}
                                            className={`p-6 border-2 transition-all ${
                                                selectedChannel === channel
                                                    ? 'border-amber-500 bg-amber-500/10'
                                                    : 'border-zinc-800 hover:border-zinc-700'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                {channel === 'whatsapp' && (
                                                    <MdWhatsapp className={`text-3xl ${
                                                        selectedChannel === channel ? 'text-amber-500' : 'text-zinc-500'
                                                    }`} />
                                                )}
                                                {channel === 'sms' && (
                                                    <MdSms className={`text-3xl ${
                                                        selectedChannel === channel ? 'text-amber-500' : 'text-zinc-500'
                                                    }`} />
                                                )}
                                                {channel === 'call' && (
                                                    <MdCall className={`text-3xl ${
                                                        selectedChannel === channel ? 'text-amber-500' : 'text-zinc-500'
                                                    }`} />
                                                )}
                                                <span className={`mono text-xs uppercase tracking-wider ${
                                                    selectedChannel === channel ? 'text-amber-500' : 'text-zinc-500'
                                                }`}>
                                                    {channel === 'whatsapp' ? 'WhatsApp' : channel.toUpperCase()}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Phone Number Input */}
                                <div className="space-y-2">
                                    <label className="mono text-[9px] text-zinc-500 uppercase tracking-widest font-black block ml-1">
                                        [PHONE_NUMBER]
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+1234567890"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full bg-[#09090b] border border-zinc-800 py-4 px-6 mono text-[11px] text-amber-500 focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-800 tracking-wider"
                                    />
                                    <p className="text-[9px] text-zinc-600 uppercase tracking-wider">
                                        Format: +[country code][number]
                                    </p>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-red-500/5 border border-red-500/20 flex items-center gap-2"
                                    >
                                        <MdError className="text-red-500 shrink-0" />
                                        <p className="mono text-[9px] text-red-500 text-left uppercase tracking-[0.2em] font-black">
                                            {error}
                                        </p>
                                    </motion.div>
                                )}

                                <div className="space-y-3">
                                    <button
                                        onClick={handleSendOTP}
                                        disabled={isLoading || !phoneNumber.trim()}
                                        className="group relative w-full py-5 bg-transparent border border-amber-500/20 overflow-hidden hover:border-amber-500 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="relative z-10 mono text-amber-500 font-black tracking-[0.4em] uppercase text-xs group-hover:text-zinc-100 transition-colors">
                                            {isLoading ? 'SENDING...' : 'SEND_CODE'}
                                        </span>
                                        <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                                    </button>
                                    <button
                                        onClick={() => router.push('/echo')}
                                        className="w-full py-4 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-all mono text-xs uppercase tracking-wider"
                                    >
                                        Skip for now
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="w-full space-y-6"
                            >
                                <div className="text-center space-y-2">
                                    <p className="text-zinc-400 text-sm">
                                        Code sent to <span className="text-amber-500 font-bold">{phoneNumber}</span>
                                    </p>
                                    <p className="text-zinc-600 text-xs">
                                        Check your {selectedChannel === 'whatsapp' ? 'WhatsApp' : selectedChannel.toUpperCase()} messages
                                    </p>
                                </div>

                                {/* OTP Input */}
                                <div className="space-y-2">
                                    <label className="mono text-[9px] text-zinc-500 uppercase tracking-widest font-black block ml-1">
                                        [VERIFICATION_CODE]
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="000000"
                                        value={otpCode}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setOtpCode(value);
                                        }}
                                        className="w-full bg-[#09090b] border border-zinc-800 py-4 px-6 mono text-2xl text-amber-500 text-center focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-800 tracking-[0.5em]"
                                        maxLength={6}
                                    />
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-red-500/5 border border-red-500/20 flex items-center gap-2"
                                    >
                                        <MdError className="text-red-500 shrink-0" />
                                        <p className="mono text-[9px] text-red-500 text-left uppercase tracking-[0.2em] font-black">
                                            {error}
                                        </p>
                                    </motion.div>
                                )}

                                <div className="space-y-3">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => {
                                                setStep('select');
                                                setOtpCode('');
                                                setError('');
                                            }}
                                            className="flex-1 py-4 border border-zinc-800 hover:border-zinc-700 transition-all mono text-xs text-zinc-500 uppercase tracking-wider"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleVerifyOTP}
                                            disabled={isLoading || otpCode.length !== 6}
                                            className="flex-1 group relative py-4 bg-transparent border border-amber-500/20 overflow-hidden hover:border-amber-500 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="relative z-10 mono text-amber-500 font-black tracking-[0.4em] uppercase text-xs group-hover:text-zinc-100 transition-colors">
                                                {isLoading ? 'VERIFYING...' : 'VERIFY'}
                                            </span>
                                            <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => router.push('/echo')}
                                        className="w-full py-4 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-all mono text-xs uppercase tracking-wider"
                                    >
                                        Skip for now
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

