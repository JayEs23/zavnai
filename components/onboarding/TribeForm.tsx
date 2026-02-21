'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdAdd, MdDelete, MdPeople, MdLock } from 'react-icons/md';

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
            platform: 'email',
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
        platform: 'email',
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
    <div className="w-full max-w-5xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-lg border border-border p-8 space-y-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MdPeople className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Build Your Tribe</h2>
              <p className="text-muted-foreground">Add people who will keep you accountable to your goals</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {members.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed border-border">
              <MdPeople className="mx-auto text-muted-foreground mb-4" size={48} />
              <p className="text-muted-foreground mb-4">No accountability partners added yet</p>
              <button
                onClick={addMember}
                className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all font-medium inline-flex items-center gap-2"
              >
                <MdAdd size={20} />
                Add Your First Partner
              </button>
            </div>
          ) : (
            members.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-6 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Partner {index + 1}</h3>
                  </div>
                  {members.length > 1 && (
                    <button
                      onClick={() => removeMember(index)}
                      className="text-red-500 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                    >
                      <MdDelete size={20} />
                    </button>
                  )}
                </div>

                {errors[index] && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{errors[index]}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Name
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateMember(index, 'name', e.target.value)}
                      placeholder="Enter name"
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  {/* Relationship */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Relationship
                    </label>
                    <select
                      value={member.relationship}
                      onChange={(e) => updateMember(index, 'relationship', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer capitalize"
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
                    <label className="block text-sm font-medium text-foreground">
                      Contact Method
                    </label>
                    <div className="flex gap-3">
                      {/* Email - always available */}
                      <button
                        onClick={() => updateMember(index, 'platform', 'email')}
                        className={`flex-1 py-3 border-2 rounded-xl transition-all text-sm font-medium ${
                          member.platform === 'email'
                            ? 'border-primary bg-gradient-to-br from-primary to-accent text-white shadow-md'
                            : 'border-border bg-white text-foreground hover:border-primary/30'
                        }`}
                      >
                        Email
                      </button>

                      {/* WhatsApp & SMS - premium, disabled */}
                      {(['whatsapp', 'sms'] as const).map((platform) => (
                        <div key={platform} className="relative flex-1">
                          <button
                            disabled
                            className="w-full py-3 border-2 border-border rounded-xl text-sm font-medium bg-muted/50 text-muted-foreground cursor-not-allowed capitalize opacity-60"
                          >
                            {platform}
                          </button>
                          <span className="absolute -top-2 -right-2 flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200">
                            <MdLock size={10} />
                            PRO
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      WhatsApp and SMS notifications are available with Pro. You can upgrade anytime in Settings.
                    </p>
                  </div>

                  {/* Contact */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={member.contact}
                      onChange={(e) => updateMember(index, 'contact', e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <p className="text-xs text-muted-foreground">
                      We&apos;ll send accountability check-ins to this email
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {members.length > 0 && (
          <button
            onClick={addMember}
            className="w-full py-3 border-2 border-dashed border-border rounded-xl text-foreground hover:border-primary hover:bg-primary/5 transition-all font-medium inline-flex items-center justify-center gap-2"
          >
            <MdAdd size={20} />
            Add Another Partner
          </button>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-border">
          <button
            onClick={onSkip}
            className="w-full sm:w-auto px-6 py-3 text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Skip for now
          </button>
          <div className="flex-1" />
          <button
            onClick={handleSubmit}
            disabled={members.length === 0}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
