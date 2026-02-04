'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdAttachMoney, MdSecurity, MdInfoOutline } from 'react-icons/md';

interface StakeStepProps {
  onComplete: (stake: number) => void;
  onSkip: () => void;
}

export default function StakeStep({ onComplete, onSkip }: StakeStepProps) {
  const [stake, setStake] = useState<number>(50);
  const [isCustom, setIsCustom] = useState(false);

  const presetStakes = [25, 50, 100, 250];

  const handleSubmit = () => {
    onComplete(stake);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Skin in the Game</h2>
        <p className="text-gray-400">
          Loss aversion is the strongest motivator. Put your money where your mouth is.
        </p>
      </div>

      <div className="bg-zavn-green/10 border border-zavn-green/30 rounded-xl p-6 space-y-4">
        <div className="flex items-start space-x-3">
          <MdInfoOutline className="text-zavn-green mt-1" size={24} />
          <div>
            <h4 className="font-medium text-white">How it works</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your stake is held in the <strong>ZAVN Vault</strong>. If you hit your goal, the money is returned to you. If you fail, a 20% fee is taken, and the rest is donated to a cause you philosophically oppose.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 space-y-8">
          <div className="flex items-center justify-center space-x-4">
            <MdAttachMoney className="text-zavn-green" size={48} />
            <span className="text-6xl font-bold text-white">{stake}</span>
            <span className="text-2xl text-gray-500 font-medium">USD</span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {presetStakes.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setStake(amount);
                  setIsCustom(false);
                }}
                className={`py-3 rounded-lg border font-bold transition-all ${
                  stake === amount && !isCustom
                    ? 'bg-zavn-green border-zavn-green text-black scale-105'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setIsCustom(true)}
              className={`w-full py-3 rounded-lg border font-medium transition-colors ${
                isCustom ? 'border-zavn-green text-zavn-green' : 'border-gray-700 text-gray-500'
              }`}
            >
              Set Custom Amount
            </button>
            {isCustom && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="overflow-hidden"
              >
                <input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(Number(e.target.value))}
                  className="w-full bg-gray-800 border border-zavn-green rounded-lg px-4 py-3 text-center text-xl text-white focus:outline-none"
                  placeholder="Enter amount..."
                  autoFocus
                />
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
          <MdSecurity size={16} />
          <span>Secured by Stripe Treasury</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onSkip}
          className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Skip for Now
        </button>
        <button
          onClick={handleSubmit}
          className="px-10 py-4 bg-zavn-green text-black rounded-xl font-bold text-lg hover:bg-zavn-green/80 transition-all active:scale-[0.98]"
        >
          Lock in Stake
        </button>
      </div>
    </div>
  );
}

