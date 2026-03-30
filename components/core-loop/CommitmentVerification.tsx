'use client';

import React, { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { tribeApi, type TribeMember } from '@/services/tribeApi';
import {
  MdCheckCircle,
  MdPhotoCamera,
  MdLink,
  MdEditNote,
  MdClose,
  MdUpload,
  MdGroups,
} from 'react-icons/md';
import type { ProofTier } from '@/services/goalsApi';

const JOURNAL_MIN_BY_TIER: Record<ProofTier, number> = {
  light: 8,
  standard: 20,
  evidence: 40,
};

function journalMinChars(tier: ProofTier | undefined): number {
  return JOURNAL_MIN_BY_TIER[tier ?? 'light'];
}

interface CommitmentVerificationProps {
  commitmentId: string;
  commitmentTask: string;
  /** From API; defaults to light when omitted (older payloads). */
  proofTier?: ProofTier;
  onVerified: () => void;
  onCancel: () => void;
}

type VerificationMethod = 'photo' | 'link' | 'journal' | 'tribe';

export function CommitmentVerification({
  commitmentId,
  commitmentTask,
  proofTier,
  onVerified,
  onCancel,
}: CommitmentVerificationProps) {
  const journalMin = journalMinChars(proofTier);
  const [method, setMethod] = useState<VerificationMethod>('journal');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [journalText, setJournalText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [verifiedMembers, setVerifiedMembers] = useState<TribeMember[]>([]);
  const [selectedTribeMemberIds, setSelectedTribeMemberIds] = useState<string[]>([]);
  const [loadingTribeMembers, setLoadingTribeMembers] = useState(false);

  useEffect(() => {
    if (method !== 'tribe') return;

    const loadVerifiedMembers = async () => {
      try {
        setLoadingTribeMembers(true);
        const members = await tribeApi.getVerifiedMembers();
        setVerifiedMembers(members);
      } catch (err) {
        console.error('Failed to load verified tribe members:', err);
        setError('Unable to load verified Tribe members right now.');
      } finally {
        setLoadingTribeMembers(false);
      }
    };

    loadVerifiedMembers();
  }, [method]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);

    try {
      if (method === 'journal') {
        if (!journalText.trim() || journalText.trim().length < journalMin) {
          setError(
            `Please provide at least ${journalMin} characters for your journal entry (${proofTier ?? 'light'} tier).`
          );
          return;
        }

        const journalResponse = await api.post('/api/verify/journal', {
          commitment_id: commitmentId,
          text: journalText,
        });
        if (journalResponse.error) {
          throw new Error(journalResponse.error.message || 'Failed to verify with journal entry');
        }
        onVerified();
      } else if (method === 'link') {
        if (!linkUrl.trim()) {
          setError('Please provide a valid URL.');
          return;
        }

        const linkResponse = await api.post('/api/verify/link', {
          commitment_id: commitmentId,
          url: linkUrl,
        });
        if (linkResponse.error) {
          throw new Error(linkResponse.error.message || 'Failed to verify with link');
        }
        onVerified();
      } else if (method === 'photo') {
        if (!photoFile) {
          setError('Please upload a photo.');
          return;
        }

        const formData = new FormData();
        formData.append('commitment_id', commitmentId);
        formData.append('photo', photoFile);

        const photoResponse = await api.postForm<unknown>('/api/verify/photo', formData);
        if (photoResponse.error) {
          throw new Error(photoResponse.error.message || 'Failed to verify with photo');
        }
        onVerified();
      } else if (method === 'tribe') {
        const tribeResponse = await tribeApi.requestVerification(
          commitmentId,
          selectedTribeMemberIds.length > 0 ? selectedTribeMemberIds : undefined
        );
        if (!tribeResponse.success) {
          throw new Error(tribeResponse.message || 'Failed to request tribe verification');
        }
        onVerified();
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError((err as ApiError)?.message || 'Failed to verify commitment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = () => {
    if (method === 'journal') return journalText.trim().length >= 20;
    if (method === 'link') return linkUrl.trim().length > 0;
    if (method === 'photo') return photoFile !== null;
    if (method === 'tribe') return true;
    return false;
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Verify Commitment</h2>
            <p className="text-sm text-muted-foreground mt-1">{commitmentTask}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Method Selection */}
        <div className="p-6 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Verification Method</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => setMethod('journal')}
              className={`p-4 rounded-xl border-2 transition-all ${
                method === 'journal'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <MdEditNote
                className={`mx-auto mb-2 ${method === 'journal' ? 'text-primary' : 'text-muted-foreground'}`}
                size={24}
              />
              <p className="text-xs font-medium text-foreground">Journal</p>
            </button>

            <button
              onClick={() => setMethod('link')}
              className={`p-4 rounded-xl border-2 transition-all ${
                method === 'link'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <MdLink
                className={`mx-auto mb-2 ${method === 'link' ? 'text-primary' : 'text-muted-foreground'}`}
                size={24}
              />
              <p className="text-xs font-medium text-foreground">Link</p>
            </button>

            <button
              onClick={() => setMethod('photo')}
              className={`p-4 rounded-xl border-2 transition-all ${
                method === 'photo'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <MdPhotoCamera
                className={`mx-auto mb-2 ${method === 'photo' ? 'text-primary' : 'text-muted-foreground'}`}
                size={24}
              />
              <p className="text-xs font-medium text-foreground">Photo</p>
            </button>

            <button
              onClick={() => setMethod('tribe')}
              className={`p-4 rounded-xl border-2 transition-all ${
                method === 'tribe'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <MdGroups
                className={`mx-auto mb-2 ${method === 'tribe' ? 'text-primary' : 'text-muted-foreground'}`}
                size={24}
              />
              <p className="text-xs font-medium text-foreground">Tribe Vouch</p>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          {method === 'journal' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Journal entry (min {journalMin} characters
                {proofTier ? ` — ${proofTier} tier` : ''})
              </label>
              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Describe what you did, how it went, what you learned..."
                className="w-full min-h-[200px] px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {journalText.length}/{journalMin} characters
              </p>
            </div>
          )}

          {method === 'link' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Proof URL
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://github.com/... or any proof URL"
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Share a link to your work (GitHub commit, document, etc.)
              </p>
            </div>
          )}

          {method === 'photo' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Upload Photo
              </label>
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl border border-border"
                  />
                  <button
                    onClick={() => {
                      setPhotoFile(null);
                      setPhotoPreview(null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70"
                  >
                    <MdClose size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/30 transition-colors">
                  <MdUpload className="text-muted-foreground mb-2" size={32} />
                  <p className="text-sm text-muted-foreground">Click to upload photo</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}

          {method === 'tribe' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Ask Tribe Members to Verify
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                Select specific members, or leave unselected to notify top trusted verified members.
              </p>
              {loadingTribeMembers ? (
                <p className="text-sm text-muted-foreground">Loading verified members...</p>
              ) : verifiedMembers.length === 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-800">
                    You do not have any verified Tribe members yet. Add members in Tribe and complete vetting first.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {verifiedMembers.map((member) => {
                    const checked = selectedTribeMemberIds.includes(member.id);
                    return (
                      <label
                        key={member.id}
                        className="flex items-center gap-3 p-3 border border-border rounded-xl hover:bg-muted/40 transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            setSelectedTribeMemberIds((prev) =>
                              e.target.checked
                                ? [...prev, member.id]
                                : prev.filter((id) => id !== member.id)
                            );
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.platform} - {member.contact_info}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-border p-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-border rounded-xl text-foreground font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit() || submitting}
            className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <MdCheckCircle size={18} />
                Verify Commitment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

