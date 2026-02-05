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

  describe('fetchGoals', () => {
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

      const result = await goalsApi.fetchGoals();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/goals'),
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

      await expect(goalsApi.fetchGoals()).rejects.toThrow();
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

  describe('updateGoal', () => {
    it('should update goal successfully', async () => {
      const goalId = '123';
      const updates = { status: 'completed' };

      const mockResponse = {
        id: goalId,
        status: 'completed',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await goalsApi.updateGoal(goalId, updates);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/goals/${goalId}`),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(updates),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteGoal', () => {
    it('should delete goal successfully', async () => {
      const goalId = '123';

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await goalsApi.deleteGoal(goalId);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/goals/${goalId}`),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('fetchCommitments', () => {
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

      const result = await goalsApi.fetchCommitments(goalId);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/goals/${goalId}/commitments`),
        expect.any(Object)
      );
      expect(result).toEqual(mockCommitments);
    });
  });

  describe('createCommitment', () => {
    it('should create commitment successfully', async () => {
      const goalId = '123';
      const commitmentData = {
        task_detail: 'Complete first draft',
        due_at: '2026-03-01T10:00:00Z',
      };

      const mockResponse = {
        id: 'c1',
        ...commitmentData,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await goalsApi.createCommitment(goalId, commitmentData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/goals/${goalId}/commitments`),
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });
});

