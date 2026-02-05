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
  tracked: boolean; // Whether we're tracking this repo for commitments
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
// API METHODS
// ============================================================================

export const githubApi = {
  /**
   * Get GitHub connection status
   */
  getConnection: async (): Promise<GitHubConnection> => {
    return api.get<GitHubConnection>('/integrations/github');
  },

  /**
   * Get OAuth authorization URL for GitHub
   */
  getAuthUrl: async (redirectUri: string): Promise<GitHubAuthUrl> => {
    return api.post<GitHubAuthUrl>('/integrations/github/auth', {
      redirect_uri: redirectUri,
    });
  },

  /**
   * Complete OAuth flow and save tokens
   */
  connectGitHub: async (code: string, state: string): Promise<GitHubConnection> => {
    return api.post<GitHubConnection>('/integrations/github/callback', {
      code,
      state,
    });
  },

  /**
   * Disconnect GitHub
   */
  disconnectGitHub: async (): Promise<{ success: boolean }> => {
    return api.delete<{ success: boolean }>('/integrations/github');
  },

  /**
   * Enable/disable GitHub sync
   */
  toggleSync: async (enabled: boolean): Promise<GitHubConnection> => {
    return api.patch<GitHubConnection>('/integrations/github', {
      sync_enabled: enabled,
    });
  },

  /**
   * Get user's GitHub repositories
   */
  getRepositories: async (): Promise<GitHubRepository[]> => {
    return api.get<GitHubRepository[]>('/integrations/github/repositories');
  },

  /**
   * Track/untrack a repository
   */
  toggleRepositoryTracking: async (
    repoId: number,
    tracked: boolean
  ): Promise<GitHubRepository> => {
    return api.patch<GitHubRepository>(
      `/integrations/github/repositories/${repoId}`,
      { tracked }
    );
  },

  /**
   * Get recent commits across tracked repositories
   */
  getCommits: async (
    since?: string,
    until?: string
  ): Promise<GitHubCommit[]> => {
    const params = new URLSearchParams();
    if (since) params.append('since', since);
    if (until) params.append('until', until);
    return api.get<GitHubCommit[]>(
      `/integrations/github/commits?${params}`
    );
  },

  /**
   * Get GitHub activity stats
   */
  getStats: async (): Promise<GitHubStats> => {
    return api.get<GitHubStats>('/integrations/github/stats');
  },

  /**
   * Manually trigger GitHub sync
   */
  syncGitHub: async (): Promise<{ synced_commits: number }> => {
    return api.post<{ synced_commits: number }>(
      '/integrations/github/sync',
      {}
    );
  },

  /**
   * Verify a code-based commitment using GitHub commits
   */
  verifyCommitment: async (
    commitmentId: string
  ): Promise<CommitmentVerification> => {
    return api.post<CommitmentVerification>(
      `/integrations/github/verify/${commitmentId}`,
      {}
    );
  },

  /**
   * Link GitHub commit to commitment
   */
  linkCommitToCommitment: async (
    commitmentId: string,
    commitSha: string
  ): Promise<{ success: boolean }> => {
    return api.post<{ success: boolean }>(
      `/integrations/github/link-commit`,
      {
        commitment_id: commitmentId,
        commit_sha: commitSha,
      }
    );
  },
};

