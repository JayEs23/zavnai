/**
 * Tests for Goals API Service
 * 
 * Tests all API calls related to goals management.
 */

import { goalsApi } from '@/services/goalsApi';

// Mock fetch
global.fetch = jest.fn();

describe('Goals API', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getGoals', () => {
    it('should fetch goals successfully', async () => {
      const mockGoals = [
        {
          id: '123',
          title: 'Test Goal',
          status: 'active',
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGoals,
      });

      const result = await goalsApi.getGoals();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/goals/list'),
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockGoals);
    });

    it('should handle fetch error', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });

      await expect(goalsApi.getGoals()).rejects.toThrow();
    });
  });

  describe('createGoal', () => {
    it('should create goal successfully', async () => {
      const goalData = {
        goal: 'Launch product',
        deadline: '2026-12-31T23:59:59Z',
        financial_stake: 100,
        common_excuses: ['Excuse 1', 'Excuse 2'],
      };

      const mockResponse = {
        success: true,
        goal_id: '123',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await goalsApi.createGoal(goalData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/goals/ingest-contract'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(goalData),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle validation error', async () => {
      const invalidData = {
        goal: '',
        deadline: '',
        financial_stake: -1,
        common_excuses: [],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: async () => ({ detail: 'Validation error' }),
      });

      await expect(goalsApi.createGoal(invalidData)).rejects.toThrow();
    });
  });

  describe('completeGoal', () => {
    it('should mark goal as completed successfully', async () => {
      const goalId = '123';
      const mockResponse = {
        success: true,
        message: 'Goal completed',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await goalsApi.completeGoal(goalId);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/v1/goals/${goalId}/complete`),
        expect.objectContaining({
          method: 'PUT',
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('archiveGoal', () => {
    it('should archive goal successfully', async () => {
      const goalId = '123';

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await goalsApi.archiveGoal(goalId);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/v1/goals/${goalId}/archive`),
        expect.objectContaining({
          method: 'PUT',
        })
      );
    });
  });

  describe('getCommitments', () => {
    it('should fetch commitments for goal', async () => {
      const goalId = '123';
      const mockCommitments = [
        {
          id: 'c1',
          task_detail: 'Task 1',
          status: 'pending',
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCommitments,
      });

      const result = await goalsApi.getCommitments(goalId);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/v1/goals/${goalId}/commitments`),
        expect.any(Object)
      );
      expect(result).toEqual(mockCommitments);
    });
  });

  describe('generateCommitments', () => {
    it('should generate commitments successfully', async () => {
      const goalId = '123';
      const mockResponse = {
        success: true,
        goal_id: goalId,
        commitments_created: 2,
        commitments: [
          { id: 'c1', task_detail: 'Complete first draft', due_at: '2026-03-01T10:00:00Z' },
          { id: 'c2', task_detail: 'Review and edit', due_at: '2026-03-05T10:00:00Z' },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await goalsApi.generateCommitments(goalId, 2);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/v1/goals/${goalId}/generate-commitments`),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ count: 2 }),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });
});

