'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { tribeApi, type TribeMember } from '@/services/tribeApi';
import {
  MdAdd,
  MdCheckCircle,
  MdPending,
  MdError,
  MdPhone,
  MdEmail,
  MdPerson,
  MdDelete,
  MdRefresh,
  MdShield,
  MdVerifiedUser,
  MdGroups,
  MdStar,
  MdVisibility,
  MdLock,
  MdGavel,
  MdChat,
} from 'react-icons/md';
import { toast } from 'react-hot-toast';
import AppNavbar from '@/components/AppNavbar';

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function TribePage() {
  const [members, setMembers] = useState<TribeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tribeApi.getTribeMembers();
      setMembers(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load tribe members';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const filteredMembers = members.filter((member) => {
    if (filter === 'all') return true;
    if (filter === 'verified') return member.vetting_status === 'verified';
    if (filter === 'pending')
      return ['pending', 'invited', 'assessing'].includes(member.vetting_status);
    return true;
  });

  const handleRemoveMember = async (memberId: string, name: string) => {
    if (!confirm(`Remove ${name} from your tribe?`)) return;
    try {
      await tribeApi.removeTribeMember(memberId);
      toast.success('Member removed');
      loadMembers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove member';
      toast.error(msg);
    }
  };

  const handleResendVetting = async (memberId: string, name: string) => {
    try {
      await tribeApi.resendVetting(memberId);
      toast.success(`AI vetting re-initiated for ${name}`);
      loadMembers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resend vetting';
      toast.error(msg);
    }
  };

  const verifiedCount = members.filter((m) => m.vetting_status === 'verified').length;
  const pendingCount = members.filter((m) =>
    ['pending', 'invited', 'assessing'].includes(m.vetting_status)
  ).length;
  const highTrustCount = members.filter(
    (m) => m.vetting_score != null && m.vetting_score >= 70
  ).length;
  const avgTrust =
    members.length > 0
      ? Math.round(
          members.reduce((acc, m) => acc + (m.vetting_score || 0), 0) / members.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      {/* ── Hero Header ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-border-subtle">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-500/5 to-pink-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

        <div className="relative max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg shadow-purple-500/25">
                  <MdGroups size={28} />
                </div>
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
                  Your Tribe
                </h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-xl">
                AI-vetted accountability partners who keep you honest. Each member is scored for
                reliability and trustworthiness.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5"
            >
              <MdAdd size={22} />
              Add Member
            </button>
          </div>

          {/* ── Stats Grid ────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <StatCard
              label="Total Members"
              value={members.length}
              icon={MdPerson}
              gradient="from-blue-500 to-cyan-400"
              shadow="shadow-blue-500/20"
            />
            <StatCard
              label="AI Verified"
              value={verifiedCount}
              icon={MdVerifiedUser}
              gradient="from-emerald-500 to-green-400"
              shadow="shadow-emerald-500/20"
            />
            <StatCard
              label="Pending Vetting"
              value={pendingCount}
              icon={MdPending}
              gradient="from-amber-500 to-yellow-400"
              shadow="shadow-amber-500/20"
            />
            <StatCard
              label="High Trust"
              value={highTrustCount}
              icon={MdStar}
              gradient="from-purple-500 to-pink-400"
              shadow="shadow-purple-500/20"
              subtitle={avgTrust > 0 ? `avg ${avgTrust}%` : undefined}
            />
          </div>

          {/* ── Filters ───────────────────────────────────────── */}
          <div className="flex gap-2 mt-6">
            {(['all', 'verified', 'pending'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  filter === status
                    ? 'bg-white text-foreground shadow-md shadow-black/5 dark:bg-white/10 dark:text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5'
                }`}
              >
                {status === 'all' && `All (${members.length})`}
                {status === 'verified' && `Verified (${verifiedCount})`}
                {status === 'pending' && `Pending (${pendingCount})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Members Grid ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-900" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
              </div>
              <p className="text-muted-foreground mt-4 text-sm">Loading your tribe…</p>
            </div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <EmptyState filter={filter} onAdd={() => setShowAddModal(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member, idx) => (
              <MemberCard
                key={member.id}
                member={member}
                index={idx}
                onRemove={handleRemoveMember}
                onResendVetting={handleResendVetting}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── How It Works Banner ───────────────────────────────── */}
      {!loading && members.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-purple-500/10 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <MdShield className="text-purple-500" /> How AI Vetting Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: '1',
                  title: 'Add Partner',
                  desc: 'Enter their name, relationship, and preferred contact platform.',
                },
                {
                  step: '2',
                  title: 'AI Assessment',
                  desc: 'Our Tribe AI evaluates relationship context and assigns an initial trust score.',
                },
                {
                  step: '3',
                  title: 'Dynamic Trust',
                  desc: 'Trust scores update in real-time based on interactions and accountability behavior.',
                },
                {
                  step: '4',
                  title: 'Accountability',
                  desc: 'Verified members can vouch for your commitments and receive escalation alerts.',
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-3 text-lg shadow-md shadow-purple-500/25">
                    {item.step}
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Add Member Modal ──────────────────────────────────── */}
      {showAddModal && (
        <AddMemberModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadMembers();
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// STAT CARD
// ============================================================================

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  shadow: string;
  subtitle?: string;
}

function StatCard({ label, value, icon: Icon, gradient, shadow, subtitle }: StatCardProps) {
  return (
    <div className={`relative overflow-hidden bg-card-bg border border-border-subtle rounded-2xl p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 ${shadow}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-3xl font-extrabold text-foreground mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg ${shadow}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EMPTY STATE
// ============================================================================

function EmptyState({
  filter,
  onAdd,
}: {
  filter: string;
  onAdd: () => void;
}) {
  return (
    <div className="text-center py-20">
      <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <MdGroups size={48} className="text-purple-500/60" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-3">
        {filter !== 'all' ? `No ${filter} members` : 'Build Your Tribe'}
      </h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
        Add accountability partners who will be AI-vetted for reliability.
        They&apos;ll receive escalation alerts when you miss commitments.
      </p>
      <button
        onClick={onAdd}
        className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/25 hover:shadow-xl hover:-translate-y-0.5 text-lg"
      >
        <MdAdd className="inline mr-2 -mt-0.5" size={22} />
        Add Your First Member
      </button>
    </div>
  );
}

// ============================================================================
// MEMBER CARD — demo-ready with gradients, trust ring, permissions
// ============================================================================

interface MemberCardProps {
  member: TribeMember;
  index: number;
  onRemove: (memberId: string, name: string) => void;
  onResendVetting: (memberId: string, name: string) => void;
}

function MemberCard({ member, index, onRemove, onResendVetting }: MemberCardProps) {
  const statusConfig: Record<
    string,
    { color: string; bg: string; label: string; icon: React.ElementType }
  > = {
    pending: { color: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Pending', icon: MdPending },
    invited: { color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Invited', icon: MdEmail },
    assessing: {
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      label: 'AI Assessing',
      icon: MdShield,
    },
    verified: {
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      label: 'AI Verified',
      icon: MdVerifiedUser,
    },
    rejected: { color: 'text-red-500', bg: 'bg-red-500/10', label: 'Rejected', icon: MdError },
  };

  const status = statusConfig[member.vetting_status] ?? statusConfig.pending;
  const StatusIcon = status.icon;

  // Trust score helpers (score is 0-100 from backend)
  const score = member.vetting_score ?? 0;
  const getTrustGradient = (s: number) => {
    if (s >= 80) return 'from-emerald-400 to-green-500';
    if (s >= 60) return 'from-blue-400 to-indigo-500';
    if (s >= 40) return 'from-amber-400 to-yellow-500';
    return 'from-red-400 to-orange-500';
  };
  const getTrustLabel = (s: number) => {
    if (s >= 80) return 'Highly Trusted';
    if (s >= 60) return 'Trusted';
    if (s >= 40) return 'Moderate';
    return 'Low Trust';
  };

  // Initials gradient — rotates hue based on index
  const avatarGradients = [
    'from-indigo-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-pink-500 to-rose-600',
    'from-blue-500 to-cyan-600',
    'from-violet-500 to-fuchsia-600',
  ];
  const avatarGradient = avatarGradients[index % avatarGradients.length];

  const platformLabels: Record<string, string> = {
    in_app: '🔷 In-App',
    whatsapp: '💬 WhatsApp',
    sms: '📱 SMS',
    email: '📧 Email',
    phone: '📞 Phone',
  };

  return (
    <div className="group bg-card-bg border border-border-subtle rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-black/5 transition-all hover:-translate-y-1">
      {/* Top accent bar */}
      {member.vetting_status === 'verified' && (
        <div className={`h-1 bg-gradient-to-r ${getTrustGradient(score)}`} />
      )}
      {member.vetting_status !== 'verified' && (
        <div className="h-1 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600" />
      )}

      <div className="p-6">
        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
              {member.name.charAt(0).toUpperCase()}
              {member.vetting_status === 'verified' && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-card-bg shadow">
                  <MdCheckCircle size={14} className="text-white" />
                </div>
              )}
            </div>
            {/* Name + relationship */}
            <div>
              <h3 className="text-lg font-bold text-foreground leading-tight">
                {member.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {member.relationship && (
                  <span className="text-xs font-medium text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded-full">
                    {member.relationship.replace('_', ' ')}
                  </span>
                )}
                {member.relationship_tier && (
                  <span className="text-xs font-medium text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full capitalize">
                    {member.relationship_tier.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status badge */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
            <StatusIcon size={14} />
            {status.label}
          </span>
        </div>

        {/* ── Contact + Platform ──────────────────────────── */}
        <div className="flex items-center gap-4 mb-5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            {member.platform === 'email' ? (
              <MdEmail size={16} />
            ) : member.platform === 'in_app' ? (
              <MdChat size={16} />
            ) : (
              <MdPhone size={16} />
            )}
            <span className="truncate max-w-[160px]">{member.contact_info}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {platformLabels[member.platform] || member.platform}
          </span>
        </div>

        {/* ── Trust Score Section (verified only) ─────────── */}
        {member.vetting_status === 'verified' && score > 0 && (
          <div className="mb-5 p-4 bg-gradient-to-r from-background to-muted/50 rounded-xl border border-border-subtle">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MdShield className={`${score >= 70 ? 'text-emerald-500' : score >= 40 ? 'text-blue-500' : 'text-amber-500'}`} size={18} />
                <span className="text-sm font-semibold text-foreground">
                  AI Trust Score
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-extrabold bg-gradient-to-r ${getTrustGradient(score)} bg-clip-text text-transparent`}>
                  {Math.round(score)}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getTrustGradient(score)} transition-all duration-1000`}
                style={{ width: `${Math.min(100, score)}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="text-xs font-medium text-muted-foreground">
                {getTrustLabel(score)}
              </p>
              {member.reliability_notes && (
                <p className="text-xs text-muted-foreground italic truncate max-w-[180px]">
                  {member.reliability_notes}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Permissions (verified only) ─────────────────── */}
        {member.vetting_status === 'verified' && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Permissions
            </p>
            <div className="flex flex-wrap gap-2">
              {member.can_see_private_goals && (
                <PermissionBadge
                  icon={MdVisibility}
                  label="Private Goals"
                  color="text-blue-500 bg-blue-500/10"
                />
              )}
              {member.view_vault && (
                <PermissionBadge
                  icon={MdLock}
                  label="Vault Access"
                  color="text-purple-500 bg-purple-500/10"
                />
              )}
              {member.can_pity_override && (
                <PermissionBadge
                  icon={MdGavel}
                  label="Pity Override"
                  color="text-orange-500 bg-orange-500/10"
                />
              )}
              {!member.can_see_private_goals &&
                !member.view_vault &&
                !member.can_pity_override && (
                  <span className="text-xs text-muted-foreground italic">
                    Standard permissions
                  </span>
                )}
            </div>
          </div>
        )}

        {/* ── Actions ─────────────────────────────────────── */}
        <div className="flex gap-2 pt-4 border-t border-border-subtle">
          {['pending', 'invited', 'assessing'].includes(member.vetting_status) && (
            <button
              onClick={() => onResendVetting(member.id, member.name)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-indigo-500 bg-indigo-500/5 hover:bg-indigo-500/10 rounded-xl transition-colors"
            >
              <MdRefresh size={16} />
              Re-Vet
            </button>
          )}
          <button
            onClick={() => onRemove(member.id, member.name)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <MdDelete size={16} />
            Remove
          </button>
        </div>

        {/* ── Timestamp ───────────────────────────────────── */}
        <p className="mt-3 text-xs text-muted-foreground text-center">
          Added {new Date(member.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// PERMISSION BADGE
// ============================================================================

function PermissionBadge({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${color}`}>
      <Icon size={14} />
      {label}
    </span>
  );
}

// ============================================================================
// ADD MEMBER MODAL — polished
// ============================================================================

interface AddMemberModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function AddMemberModal({ onClose, onSuccess }: AddMemberModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    contact_info: '',
    platform: 'in_app' as 'in_app' | 'whatsapp' | 'sms' | 'email' | 'phone',
    relationship: '',
    relationship_tier: '' as '' | 'inner_circle' | 'mentor' | 'professional',
    can_see_private_goals: false,
    view_vault: false,
    can_pity_override: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter a name');
      return;
    }
    if (!formData.contact_info.trim()) {
      toast.error('Please enter contact information');
      return;
    }

    try {
      setLoading(true);
      await tribeApi.addTribeMember({
        name: formData.name,
        contact_info: formData.contact_info,
        platform: formData.platform,
        relationship: formData.relationship || undefined,
        relationship_tier: formData.relationship_tier || undefined,
        can_see_private_goals: formData.can_see_private_goals,
        view_vault: formData.view_vault,
        can_pity_override: formData.can_pity_override,
      });
      toast.success('Tribe member added! AI vetting initiated.');
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add member';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card-bg rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border-subtle">
        {/* Header */}
        <div className="p-6 border-b border-border-subtle bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
              <MdAdd size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Add Tribe Member</h2>
              <p className="text-muted-foreground text-sm">
                AI will vet them for reliability and assign a trust score
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-background border border-border-subtle rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              required
            />
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Platform *</label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { value: 'in_app', label: '🔷 In-App', desc: 'Instant AI vetting' },
                { value: 'whatsapp', label: '💬 WhatsApp', desc: 'Via message' },
                { value: 'sms', label: '📱 SMS', desc: 'Text message' },
                { value: 'email', label: '📧 Email', desc: 'Via email' },
                { value: 'phone', label: '📞 Phone', desc: 'Phone call' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, platform: opt.value as typeof formData.platform })}
                  className={`p-3 rounded-xl border-2 text-center transition-all text-xs ${
                    formData.platform === opt.value
                      ? 'border-purple-500 bg-purple-500/5 text-foreground'
                      : 'border-border-subtle hover:border-purple-500/30 text-muted-foreground'
                  }`}
                >
                  <div className="text-lg mb-1">{opt.label.split(' ')[0]}</div>
                  <div className="font-medium">{opt.label.split(' ').slice(1).join(' ')}</div>
                </button>
              ))}
            </div>
            {formData.platform === 'in_app' && (
              <p className="text-xs text-emerald-500 mt-2 font-medium">
                ✨ In-app members are AI-vetted instantly — no external messaging required
              </p>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Contact Info *
            </label>
            <input
              type={
                formData.platform === 'email'
                  ? 'email'
                  : formData.platform === 'in_app'
                  ? 'text'
                  : 'tel'
              }
              value={formData.contact_info}
              onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
              placeholder={
                formData.platform === 'email'
                  ? 'john@example.com'
                  : formData.platform === 'in_app'
                  ? 'Their name or username'
                  : '+1234567890'
              }
              className="w-full px-4 py-3 bg-background border border-border-subtle rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              required
            />
          </div>

          {/* Relationship + Tier side-by-side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Relationship
              </label>
              <select
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border-subtle rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="">Select…</option>
                <option value="peer">Peer</option>
                <option value="mentor">Mentor</option>
                <option value="partner">Partner</option>
                <option value="spouse">Spouse</option>
                <option value="inner_circle">Inner Circle</option>
                <option value="professional">Professional</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Trust Tier
              </label>
              <select
                value={formData.relationship_tier}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    relationship_tier: e.target.value as typeof formData.relationship_tier,
                  })
                }
                className="w-full px-4 py-3 bg-background border border-border-subtle rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="">Select…</option>
                <option value="inner_circle">Inner Circle (Highest)</option>
                <option value="mentor">Mentor</option>
                <option value="professional">Professional</option>
              </select>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Permissions
            </label>
            <div className="space-y-3">
              <PermissionCheckbox
                checked={formData.can_see_private_goals}
                onChange={(v) => setFormData({ ...formData, can_see_private_goals: v })}
                icon={MdVisibility}
                label="View Private Goals"
                description="Can see goals marked as private"
                color="text-blue-500"
              />
              <PermissionCheckbox
                checked={formData.view_vault}
                onChange={(v) => setFormData({ ...formData, view_vault: v })}
                icon={MdLock}
                label="Vault Access"
                description="Can view financial stake information"
                color="text-purple-500"
              />
              <PermissionCheckbox
                checked={formData.can_pity_override}
                onChange={(v) => setFormData({ ...formData, can_pity_override: v })}
                icon={MdGavel}
                label="Pity Override"
                description="Can override pity-based negotiations (Inner Circle only)"
                color="text-orange-500"
                disabled={formData.relationship_tier !== 'inner_circle'}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3.5 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  AI Vetting…
                </>
              ) : (
                <>
                  <MdShield size={20} />
                  Add &amp; Vet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// PERMISSION CHECKBOX
// ============================================================================

function PermissionCheckbox({
  checked,
  onChange,
  icon: Icon,
  label,
  description,
  color,
  disabled = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
        disabled
          ? 'opacity-40 cursor-not-allowed border-border-subtle'
          : checked
          ? 'border-purple-500/30 bg-purple-500/5'
          : 'border-border-subtle hover:border-purple-500/20'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />
      <div
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
          checked
            ? 'bg-purple-500 border-purple-500 text-white'
            : 'border-border-subtle'
        }`}
      >
        {checked && <MdCheckCircle size={14} />}
      </div>
      <Icon size={18} className={color} />
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </label>
  );
}
