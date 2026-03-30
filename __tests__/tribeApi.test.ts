/**
 * Tests for Tribe API Service
 * 
 * Tests all API calls related to tribe member management.
 */

import { tribeApi, type CreateTribeMemberRequest } from '@/services/tribeApi';

// Mock fetch
global.fetch = jest.fn();

describe('Tribe API', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getTribeMembers', () => {
    it('should fetch tribe members successfully', async () => {
      const mockMembers = [
        {
          id: '123',
          name: 'John Doe',
          vetting_status: 'approved',
          trust_score: 85,
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMembers,
      });

      const result = await tribeApi.getTribeMembers();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tribe'),
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockMembers);
    });

    it('should throw when fetch fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(tribeApi.getTribeMembers()).rejects.toThrow('An error occurred');
    });
  });

  describe('addTribeMember', () => {
    it('should add tribe member successfully', async () => {
      const memberData: CreateTribeMemberRequest = {
        name: 'Jane Smith',
        contact_info: '+11234567890',
        platform: 'whatsapp',
        relationship: 'peer',
      };

      const mockResponse = {
        id: '456',
        ...memberData,
        vetting_status: 'pending',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await tribeApi.addTribeMember(memberData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tribe'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(memberData),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should map duplicate member error to a friendly message', async () => {
      const memberData: CreateTribeMemberRequest = {
        name: 'Existing Member',
        contact_info: '+11234567890',
        platform: 'whatsapp',
        relationship: 'peer',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({
          error: {
            message: 'Tribe member already exists: A member with contact test@example.com already exists',
            details: {
              reason: 'A member with contact test@example.com already exists',
            },
          },
        }),
      });

      await expect(tribeApi.addTribeMember(memberData)).rejects.toThrow(
        'This contact is already in your Tribe. Try a different contact or remove the existing member first.'
      );
    });
  });

  describe('requestVerification', () => {
    it('should request tribe verification successfully', async () => {
      const commitmentId = 'commitment-123';
      const memberIds = ['member-1', 'member-2'];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, requests_sent: 2, total_members: 2 }),
      });

      const result = await tribeApi.requestVerification(commitmentId, memberIds);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/tribe/request-verification/${commitmentId}`),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ tribe_member_ids: memberIds }),
        })
      );
      expect(result.success).toBe(true);
    });

    it('should map no verified members error to a friendly message', async () => {
      const commitmentId = 'commitment-123';

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ detail: 'No tribe members available' }),
      });

      await expect(tribeApi.requestVerification(commitmentId)).rejects.toThrow(
        'No verified Tribe members are available yet. Verify at least one member, then try again.'
      );
    });
  });

  describe('updateTribeMember', () => {
    it('should update tribe member successfully', async () => {
      const memberId = '123';
      const updates = { relationship: 'mentor' };

      const mockResponse = {
        id: memberId,
        relationship: 'mentor',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await tribeApi.updateTribeMember(memberId, updates);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/tribe/${memberId}`),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updates),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('removeTribeMember', () => {
    it('should remove tribe member successfully', async () => {
      const memberId = '123';

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await tribeApi.removeTribeMember(memberId);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/tribe/${memberId}`),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('updateTrustScore', () => {
    it('should update trust score successfully', async () => {
      const memberId = '123';
      const update = {
        interaction_type: 'message_sent' as const,
        interaction_outcome: 'positive' as const,
      };

      const mockResponse = {
        id: memberId,
        vetting_status: 'verified',
        vetting_score: 90,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await tribeApi.updateTrustScore(memberId, update);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/tribe/${memberId}/trust-score`),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(update),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('resendVetting', () => {
    it('should resend vetting invitation successfully', async () => {
      const memberId = '123';

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Invitation sent' }),
      });

      const result = await tribeApi.resendVetting(memberId);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/tribe/${memberId}/resend-vetting`),
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(result.success).toBe(true);
    });
  });
});

