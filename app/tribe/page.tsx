'use client';

import React, { useState, useEffect } from 'react';
import { tribeApi, type TribeMember } from '@/services/tribeApi';
import { MdAdd, MdCheckCircle, MdPending, MdError, MdPhone, MdEmail, MdPerson, MdDelete, MdRefresh } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import AppNavbar from '@/components/AppNavbar';

export default function TribePage() {
  const [members, setMembers] = useState<TribeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await tribeApi.getTribeMembers();
      setMembers(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load tribe members');
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter((member) => {
    if (filter === 'all') return true;
    if (filter === 'verified') return member.vetting_status === 'verified';
    if (filter === 'pending') return ['pending', 'invited', 'assessing'].includes(member.vetting_status);
    return true;
  });

  const handleRemoveMember = async (memberId: string, name: string) => {
    if (!confirm(`Remove ${name} from your tribe?`)) return;
    
    try {
      await tribeApi.removeTribeMember(memberId);
      toast.success('Member removed successfully');
      loadMembers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove member');
    }
  };

  const handleResendVetting = async (memberId: string, name: string) => {
    try {
      await tribeApi.resendVetting(memberId);
      toast.success(`Vetting invitation resent to ${name}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend invitation');
    }
  };

  const verifiedCount = members.filter((m) => m.vetting_status === 'verified').length;
  const pendingCount = members.filter((m) => ['pending', 'invited', 'assessing'].includes(m.vetting_status)).length;
  const highTrustCount = members.filter((m) => m.vetting_score && m.vetting_score >= 0.7).length;

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      {/* Header */}
      <div className="border-b border-border-subtle bg-card-bg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Tribe</h1>
              <p className="text-muted-foreground mt-1">
                Your accountability partners, vetted by AI
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors"
            >
              <MdAdd size={20} />
              Add Member
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <StatCard
              label="Total Members"
              value={members.length}
              icon={MdPerson}
              color="blue"
            />
            <StatCard
              label="Verified"
              value={verifiedCount}
              icon={MdCheckCircle}
              color="green"
            />
            <StatCard
              label="Pending"
              value={pendingCount}
              icon={MdPending}
              color="yellow"
            />
            <StatCard
              label="High Trust"
              value={highTrustCount}
              icon={MdCheckCircle}
              color="purple"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-6">
            {(['all', 'verified', 'pending'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-brand-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted-hover'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <MdPerson size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No {filter !== 'all' && filter} members yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Add accountability partners to your tribe for social accountability
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors"
            >
              Add Your First Member
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onRemove={handleRemoveMember}
                onResendVetting={handleResendVetting}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
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
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-500',
    green: 'bg-green-500/10 text-green-500',
    yellow: 'bg-yellow-500/10 text-yellow-500',
    purple: 'bg-purple-500/10 text-purple-500',
  };

  return (
    <div className="bg-card-bg border border-border-subtle rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MEMBER CARD
// ============================================================================

interface MemberCardProps {
  member: TribeMember;
  onRemove: (memberId: string, name: string) => void;
  onResendVetting: (memberId: string, name: string) => void;
}

function MemberCard({ member, onRemove, onResendVetting }: MemberCardProps) {
  const statusConfig = {
    pending: { color: 'bg-gray-500/10 text-gray-500', label: 'Pending', icon: MdPending },
    invited: { color: 'bg-blue-500/10 text-blue-500', label: 'Invited', icon: MdEmail },
    assessing: { color: 'bg-yellow-500/10 text-yellow-500', label: 'Assessing', icon: MdPending },
    verified: { color: 'bg-green-500/10 text-green-500', label: 'Verified', icon: MdCheckCircle },
    rejected: { color: 'bg-red-500/10 text-red-500', label: 'Rejected', icon: MdError },
  };

  const status = statusConfig[member.vetting_status];
  const StatusIcon = status.icon;

  const getTrustColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-blue-500';
    if (score >= 0.4) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-card-bg border border-border-subtle rounded-lg p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-lg">
            {member.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
            {member.relationship && (
              <p className="text-sm text-muted-foreground capitalize">
                {member.relationship.replace('_', ' ')}
              </p>
            )}
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${status.color}`}>
          <StatusIcon className="inline mr-1" size={14} />
          {status.label}
        </span>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-foreground">
          {member.platform === 'email' ? (
            <MdEmail className="text-muted-foreground" />
          ) : (
            <MdPhone className="text-muted-foreground" />
          )}
          <span className="truncate">{member.contact_info}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Platform:</span>
          <span className="text-foreground capitalize">{member.platform}</span>
        </div>
      </div>

      {/* Trust Score */}
      {member.vetting_status === 'verified' && member.vetting_score && (
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Trust Score</span>
            <span className={`text-lg font-bold ${getTrustColor(member.vetting_score)}`}>
              {(member.vetting_score * 100).toFixed(0)}%
            </span>
          </div>
          <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
            <div
              className={`h-full ${getTrustColor(member.vetting_score)} bg-current transition-all`}
              style={{ width: `${member.vetting_score * 100}%` }}
            />
          </div>
          {member.reliability_notes && (
            <p className="text-xs text-muted-foreground mt-2">
              {member.reliability_notes}
            </p>
          )}
        </div>
      )}

      {/* Permissions */}
      {member.vetting_status === 'verified' && (
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Permissions</p>
          <div className="flex flex-wrap gap-2">
            {member.can_see_private_goals && (
              <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded">
                Private Goals
              </span>
            )}
            {member.view_vault && (
              <span className="px-2 py-1 bg-purple-500/10 text-purple-500 text-xs rounded">
                Vault Access
              </span>
            )}
            {member.can_pity_override && (
              <span className="px-2 py-1 bg-orange-500/10 text-orange-500 text-xs rounded">
                Pity Override
              </span>
            )}
            {!member.can_see_private_goals && !member.view_vault && !member.can_pity_override && (
              <span className="text-xs text-muted-foreground">No special permissions</span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-border-subtle">
        {['pending', 'invited'].includes(member.vetting_status) && (
          <button
            onClick={() => onResendVetting(member.id, member.name)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary/10 rounded transition-colors"
          >
            <MdRefresh size={16} />
            Resend
          </button>
        )}
        <button
          onClick={() => onRemove(member.id, member.name)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded transition-colors"
        >
          <MdDelete size={16} />
          Remove
        </button>
      </div>

      {/* Timestamp */}
      <div className="mt-4 text-xs text-muted-foreground text-center">
        Added {new Date(member.created_at).toLocaleDateString()}
      </div>
    </div>
  );
}

// ============================================================================
// ADD MEMBER MODAL
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
    
    // Validation
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
    } catch (error: any) {
      toast.error(error.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card-bg rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border-subtle">
          <h2 className="text-2xl font-bold text-foreground">Add Tribe Member</h2>
          <p className="text-muted-foreground mt-1">
            Add an accountability partner. AI will vet them for reliability.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-background border border-border-subtle rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Platform *
            </label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
              className="w-full px-4 py-3 bg-background border border-border-subtle rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="in_app">In-App (AI Vetting)</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
              <option value="phone">Phone Call</option>
            </select>
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Contact Information *
            </label>
            <input
              type={formData.platform === 'email' ? 'email' : formData.platform === 'in_app' ? 'text' : 'tel'}
              value={formData.contact_info}
              onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
              placeholder={
                formData.platform === 'email'
                  ? 'john@example.com'
                  : formData.platform === 'in_app'
                  ? 'Their name or username'
                  : '+1234567890'
              }
              className="w-full px-4 py-3 bg-background border border-border-subtle rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.platform === 'email'
                ? 'Email address'
                : formData.platform === 'in_app'
                ? 'Any identifier — AI will vet them instantly based on relationship context'
                : 'Phone number in E.164 format (e.g., +1234567890)'}
            </p>
          </div>

          {/* Relationship */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Relationship
            </label>
            <select
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border-subtle rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">Select relationship</option>
              <option value="peer">Peer</option>
              <option value="mentor">Mentor</option>
              <option value="partner">Partner</option>
              <option value="spouse">Spouse</option>
              <option value="inner_circle">Inner Circle</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          {/* Relationship Tier */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Trust Tier
            </label>
            <select
              value={formData.relationship_tier}
              onChange={(e) => setFormData({ ...formData, relationship_tier: e.target.value as any })}
              className="w-full px-4 py-3 bg-background border border-border-subtle rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">Select tier</option>
              <option value="inner_circle">Inner Circle (Highest Trust)</option>
              <option value="mentor">Mentor</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Permissions
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.can_see_private_goals}
                  onChange={(e) => setFormData({ ...formData, can_see_private_goals: e.target.checked })}
                  className="w-5 h-5 rounded border-border-subtle"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">View Private Goals</p>
                  <p className="text-xs text-muted-foreground">Can see goals marked as private</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.view_vault}
                  onChange={(e) => setFormData({ ...formData, view_vault: e.target.checked })}
                  className="w-5 h-5 rounded border-border-subtle"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">Vault Access</p>
                  <p className="text-xs text-muted-foreground">Can view financial stake information</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.can_pity_override}
                  onChange={(e) => setFormData({ ...formData, can_pity_override: e.target.checked })}
                  disabled={formData.relationship_tier !== 'inner_circle'}
                  className="w-5 h-5 rounded border-border-subtle disabled:opacity-50"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">Pity Override</p>
                  <p className="text-xs text-muted-foreground">
                    Can override user's pity-based negotiations (Inner Circle only)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-muted text-foreground rounded-lg hover:bg-muted-hover transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : (
                <>
                  <MdAdd size={20} />
                  Add Member
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

