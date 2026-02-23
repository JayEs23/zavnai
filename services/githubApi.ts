/**
 * GitHub API Service
 *
 * Handles GitHub integration for code commitment verification
 * Tracks commits, pull requests, and repository activity
 */

import { api } from '@/lib/api';

// ============================================================================
// TYPES
// ============================================================================

export interface GitHubConnection {
  connected: boolean;
  username?: string;
  avatar_url?: string;
  profile_url?: string;
  last_sync?: string;
  sync_enabled: boolean;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  private: boolean;
  language?: string;
  updated_at: string;
  tracked: boolean;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  html_url: string;
  repository: string;
  verified: boolean;
}

export interface GitHubStats {
  total_commits_today: number;
  total_commits_week: number;
  total_commits_month: number;
  longest_streak: number;
  current_streak: number;
  repositories_active: number;
}

export interface GitHubAuthUrl {
  auth_url: string;
  state: string;
}

export interface CommitmentVerification {
  commitment_id: string;
  verified: boolean;
  verification_method: 'github_commit';
  github_commits: GitHubCommit[];
  verified_at?: string;
}

// ============================================================================
// API METHODS — all paths hit /api/integrations (backend prefix)
// ============================================================================

export const githubApi = {
  /** Get GitHub connection status */
  async getConnection(): Promise<GitHubConnection> {
    const res = await api.get<GitHubConnection>('/api/integrations/github');
    if (res.error) throw new Error(res.error.message || 'Failed to get GitHub connection');
    return res.data!;
  },

  /** Get OAuth authorization URL for GitHub */
  async getAuthUrl(redirectUri: string): Promise<GitHubAuthUrl> {
    const res = await api.post<GitHubAuthUrl>('/api/integrations/github/auth', {
      redirect_uri: redirectUri,
    });
    if (res.error) throw new Error(res.error.message || 'Failed to get GitHub auth URL');
    return res.data!;
  },

  /** Complete OAuth flow and save tokens */
  async connectGitHub(code: string, state: string): Promise<GitHubConnection> {
    const res = await api.post<GitHubConnection>('/api/integrations/github/callback', {
      code,
      state,
    });
    if (res.error) throw new Error(res.error.message || 'Failed to connect GitHub');
    return res.data!;
  },

  /** Disconnect GitHub */
  async disconnectGitHub(): Promise<{ success: boolean }> {
    const res = await api.delete<{ success: boolean }>('/api/integrations/github');
    if (res.error) throw new Error(res.error.message || 'Failed to disconnect GitHub');
    return res.data!;
  },

  /** Enable/disable GitHub sync */
  async toggleSync(enabled: boolean): Promise<GitHubConnection> {
    const res = await api.patch<GitHubConnection>('/api/integrations/github', {
      sync_enabled: enabled,
    });
    if (res.error) throw new Error(res.error.message || 'Failed to toggle GitHub sync');
    return res.data!;
  },

  /** Get user's GitHub repositories */
  async getRepositories(): Promise<GitHubRepository[]> {
    const res = await api.get<GitHubRepository[]>('/api/integrations/github/repositories');
    if (res.error) throw new Error(res.error.message || 'Failed to get GitHub repositories');
    return res.data || [];
  },

  /** Track/untrack a repository */
  async toggleRepositoryTracking(
    repoId: number,
    tracked: boolean
  ): Promise<GitHubRepository> {
    const res = await api.patch<GitHubRepository>(
      `/api/integrations/github/repositories/${repoId}`,
      { tracked }
    );
    if (res.error) throw new Error(res.error.message || 'Failed to toggle repository tracking');
    return res.data!;
  },

  /** Get recent commits across tracked repositories */
  async getCommits(
    since?: string,
    until?: string
  ): Promise<GitHubCommit[]> {
    const params = new URLSearchParams();
    if (since) params.append('since', since);
    if (until) params.append('until', until);
    const res = await api.get<GitHubCommit[]>(
      `/api/integrations/github/commits?${params}`
    );
    if (res.error) throw new Error(res.error.message || 'Failed to get GitHub commits');
    return res.data || [];
  },

  /** Get GitHub activity stats */
  async getStats(): Promise<GitHubStats> {
    const res = await api.get<GitHubStats>('/api/integrations/github/stats');
    if (res.error) throw new Error(res.error.message || 'Failed to get GitHub stats');
    return res.data!;
  },

  /** Manually trigger GitHub sync */
  async syncGitHub(): Promise<{ synced_commits: number }> {
    const res = await api.post<{ synced_commits: number }>(
      '/api/integrations/github/sync',
      {}
    );
    if (res.error) throw new Error(res.error.message || 'Failed to sync GitHub');
    return res.data!;
  },

  /** Verify a code-based commitment using GitHub commits */
  async verifyCommitment(
    commitmentId: string
  ): Promise<CommitmentVerification> {
    const res = await api.post<CommitmentVerification>(
      `/api/integrations/github/verify/${commitmentId}`,
      {}
    );
    if (res.error) throw new Error(res.error.message || 'Failed to verify commitment');
    return res.data!;
  },

  /** Link GitHub commit to commitment */
  async linkCommitToCommitment(
    commitmentId: string,
    commitSha: string
  ): Promise<{ success: boolean }> {
    const res = await api.post<{ success: boolean }>(
      `/api/integrations/github/link-commit`,
      {
        commitment_id: commitmentId,
        commit_sha: commitSha,
      }
    );
    if (res.error) throw new Error(res.error.message || 'Failed to link commit to commitment');
    return res.data!;
  },
};
