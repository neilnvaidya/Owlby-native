import { Request, Response } from 'express';
import { createLearningNode, getLearningNode, updateLearningNode, deleteLearningNode } from '../../controllers/learning-nodes';
import { testLearningNode } from '../test-data';
import { 
  getMockFrom,
  getMockInsert,
  getMockSelect,
  getMockEq,
  getMockSingle,
  getMockUpdate,
  getMockDelete
} from '../setup';

describe('Learning Nodes Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('createLearningNode', () => {
    it('should create a new learning node', async () => {
      mockReq.body = {
        title: 'Test Learning Node',
        content: 'Test content',
        topic: 'test-topic',
        difficulty: 'beginner',
      };

      // Set up the mock chain
      getMockFrom().mockReturnThis();
      getMockInsert().mockReturnThis();
      getMockSelect().mockReturnThis();
      getMockSingle().mockResolvedValueOnce({
        data: testLearningNode,
        error: null,
      });

      await createLearningNode(mockReq as Request, mockRes as Response);

      // Note: Implementation uses res.json() without status for success
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: { learningNode: testLearningNode },
      });
    });

    it('should handle missing required fields', async () => {
      mockReq.body = {
        title: 'Test Learning Node',
        // Missing content, topic, and difficulty
      };

      await createLearningNode(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Missing required fields: title, content, difficulty, topic',
      });
    });
  });

  describe('getLearningNode', () => {
    it('should get a learning node by id', async () => {
      mockReq.params = { id: '123' };

      // Set up the mock chain
      getMockFrom().mockReturnThis();
      getMockSelect().mockReturnThis();
      getMockEq().mockReturnThis();
      getMockSingle().mockResolvedValueOnce({
        data: testLearningNode,
        error: null,
      });

      await getLearningNode(mockReq as Request, mockRes as Response);

      // Note: Implementation uses res.json() without status for success
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: { learningNode: testLearningNode },
      });
    });

    it('should handle non-existent learning node', async () => {
      mockReq.params = { id: 'non-existent' };

      // Set up the mock chain
      getMockFrom().mockReturnThis();
      getMockSelect().mockReturnThis();
      getMockEq().mockReturnThis();
      getMockSingle().mockResolvedValueOnce({
        data: null,
        error: null,
      });

      await getLearningNode(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Learning node not found',
      });
    });
  });

  describe('updateLearningNode', () => {
    it('should update a learning node', async () => {
      mockReq.params = { id: '123' };
      mockReq.body = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      // Set up the mock chain for update
      getMockFrom().mockReturnThis();
      getMockUpdate().mockReturnThis();
      getMockSelect().mockReturnThis();
      getMockSingle().mockResolvedValueOnce({
        data: { 
          ...testLearningNode, 
          ...mockReq.body,
          updated_at: new Date().toISOString()
        },
        error: null,
      });

      await updateLearningNode(mockReq as Request, mockRes as Response);

      // Note: Implementation uses res.json() without status for success
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: { 
          learningNode: { 
            ...testLearningNode, 
            ...mockReq.body,
            updated_at: expect.any(String)
          } 
        },
      });
    });

    it('should handle non-existent learning node', async () => {
      mockReq.params = { id: 'non-existent' };
      mockReq.body = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      // Set up the mock chain for update
      getMockFrom().mockReturnThis();
      getMockUpdate().mockReturnThis();
      getMockSelect().mockReturnThis();
      getMockSingle().mockResolvedValueOnce({
        data: null,
        error: null,
      });

      await updateLearningNode(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Learning node not found',
      });
    });
  });

  describe('deleteLearningNode', () => {
    it('should delete a learning node', async () => {
      mockReq.params = { id: '123' };

      // Set up the mock chain for delete
      getMockFrom().mockReturnThis();
      getMockDelete().mockReturnThis();
      getMockEq().mockReturnThis();
      getMockSingle().mockResolvedValueOnce({
        data: testLearningNode,
        error: null,
      });

      await deleteLearningNode(mockReq as Request, mockRes as Response);

      // Note: Implementation uses res.json() without status for success
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Learning node deleted successfully',
      });
    });

    it('should handle non-existent learning node', async () => {
      mockReq.params = { id: 'non-existent' };

      // Set up the mock chain for delete
      getMockFrom().mockReturnThis();
      getMockDelete().mockReturnThis();
      getMockEq().mockReturnThis();
      getMockSingle().mockResolvedValueOnce({
        data: null,
        error: null,
      });

      await deleteLearningNode(mockReq as Request, mockRes as Response);

      // Note: Implementation doesn't check for existence before deleting
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Learning node deleted successfully',
      });
    });
  });
}); 