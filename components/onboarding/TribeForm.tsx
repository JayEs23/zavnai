'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface TribeMember {
  name: string;
  contact: string;
  platform: 'whatsapp' | 'sms' | 'email';
  relationship: 'peer' | 'mentor' | 'partner' | 'spouse' | 'friend' | 'colleague';
}

interface TribeFormProps {
  suggestedContact?: string; // Name suggested by AI
  onComplete: (members: TribeMember[]) => void;
  onSkip: () => void;
}

export default function TribeForm({ suggestedContact, onComplete, onSkip }: TribeFormProps) {
  const [members, setMembers] = useState<TribeMember[]>(
    suggestedContact
      ? [
          {
            name: suggestedContact,
            contact: '',
            platform: 'whatsapp',
            relationship: 'friend',
          },
        ]
      : []
  );

  const [errors, setErrors] = useState<Record<number, string>>({});

  const validateContact = (contact: string, platform: 'whatsapp' | 'sms' | 'email'): boolean => {
    if (platform === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(contact);
    } else {
      // E.164 format: +1234567890
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      return phoneRegex.test(contact);
    }
  };

  const addMember = () => {
    setMembers([
      ...members,
      {
        name: '',
        contact: '',
        platform: 'whatsapp',
        relationship: 'friend',
      },
    ]);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
  };

  const updateMember = (index: number, field: keyof TribeMember, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);

    // Clear error for this field
    if (errors[index]) {
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<number, string> = {};

    members.forEach((member, index) => {
      if (!member.name || member.name.length < 2) {
        newErrors[index] = 'Name must be at least 2 characters';
        return;
      }

      if (!member.contact) {
        newErrors[index] = 'Contact is required';
        return;
      }

      if (!validateContact(member.contact, member.platform)) {
        if (member.platform === 'email') {
          newErrors[index] = 'Invalid email address';
        } else {
          newErrors[index] = 'Phone must be in E.164 format (e.g., +1234567890)';
        }
        return;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onComplete(members);
  };

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-[var(--foreground)] uppercase tracking-tighter">Tribe Formation</h2>
        <p className="text-[var(--muted-foreground)] text-xs uppercase font-bold tracking-widest">
          Recruiting high-stakes accountability partners for your network.
        </p>
      </div>

      <div className="space-y-6">
        {members.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#09090b] border border-zinc-900 p-8 space-y-8 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] font-black text-8xl select-none group-hover:opacity-[0.07] transition-opacity">
              0{index + 1}
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="size-2 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Node_{index + 1}</h3>
              </div>
              {members.length > 1 && (
                <button
                  onClick={() => removeMember(index)}
                  className="text-zinc-700 hover:text-red-500 transition-all text-[9px] font-black uppercase tracking-widest border border-zinc-900 px-3 py-1 hover:border-red-500/30"
                >
                  [Terminate]
                </button>
              )}
            </div>

            {errors[index] && (
              <div className="bg-red-500/5 border border-red-500/20 p-4 text-red-500 text-[9px] font-black uppercase tracking-widest">
                [CRITICAL_FAILURE]: {errors[index]}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
              {/* Name */}
              <div className="space-y-3">
                <label className="block text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1">
                  [IDENTITY_NAME]
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateMember(index, 'name', e.target.value)}
                    placeholder="ENTER_NAME"
                    className="w-full px-6 py-4 bg-[#09090b] border border-zinc-800 text-zinc-100 placeholder:text-zinc-800 focus:outline-none focus:border-amber-500 transition-all font-mono text-xs uppercase tracking-wider"
                  />
                </div>
              </div>

              {/* Relationship */}
              <div className="space-y-3">
                <label className="block text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1">
                  [NETWORK_ROLE]
                </label>
                <select
                  value={member.relationship}
                  onChange={(e) => updateMember(index, 'relationship', e.target.value)}
                  className="w-full px-6 py-4 bg-[#09090b] border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-500 transition-all font-mono text-xs uppercase appearance-none cursor-pointer tracking-wider"
                >
                  <option value="friend">Friend</option>
                  <option value="colleague">Colleague</option>
                  <option value="partner">Partner</option>
                  <option value="spouse">Spouse</option>
                  <option value="mentor">Mentor</option>
                  <option value="peer">Peer</option>
                </select>
              </div>

              {/* Platform */}
              <div className="sm:col-span-2 space-y-3">
                <label className="block text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1">
                  [COMM_PROTOCOL]
                </label>
                <div className="flex gap-2">
                  {(['whatsapp', 'sms', 'email'] as const).map((platform) => (
                    <button
                      key={platform}
                      onClick={() => updateMember(index, 'platform', platform)}
                      className={`flex-1 py-4 border transition-all text-[9px] font-black uppercase tracking-widest ${
                        member.platform === platform
                          ? 'bg-amber-500 text-[#09090b] border-amber-500'
                          : 'bg-[#09090b] border-zinc-800 text-zinc-600 hover:border-amber-500/30'
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="sm:col-span-2 space-y-3">
                <label className="block text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1">
                  {member.platform === 'email' ? '[ACCESS_EMAIL]' : '[ACCESS_PHONE]'}
                </label>
                <input
                  type={member.platform === 'email' ? 'email' : 'tel'}
                  value={member.contact}
                  onChange={(e) => updateMember(index, 'contact', e.target.value)}
                  placeholder={
                    member.platform === 'email'
                      ? "IDENTITY@NETWORK.COM"
                      : "+10000000000"
                  }
                  className="w-full px-6 py-4 bg-[#09090b] border border-zinc-800 text-zinc-100 placeholder:text-zinc-800 focus:outline-none focus:border-amber-500 transition-all font-mono text-xs tracking-wider"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 pt-12">
        <button
          onClick={addMember}
          className="w-full sm:w-auto px-10 py-5 bg-transparent border border-amber-500/20 hover:border-amber-500 transition-all text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 group relative overflow-hidden"
        >
          <div className="scan-line opacity-10" />
          <span className="relative z-10">[+] Add_Node</span>
          <div className="absolute inset-0 bg-amber-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </button>
        <div className="flex-1" />
        <div className="flex w-full sm:w-auto gap-6">
          <button
            onClick={onSkip}
            className="flex-1 sm:flex-none px-8 py-5 text-zinc-600 hover:text-zinc-100 transition-all text-[10px] font-black uppercase tracking-[0.4em] mono"
          >
            Skip_Phase
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 sm:flex-none px-12 py-5 bg-amber-500 text-[#09090b] font-black uppercase tracking-[0.4em] text-[10px] hover:opacity-90 transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] group relative overflow-hidden"
          >
            <div className="scan-line opacity-20" />
            <span className="relative z-10">Deploy_Tribe</span>
          </button>
        </div>
      </div>
    </div>
  );
}

