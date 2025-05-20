import request from 'supertest';
import { sequelize } from '../../../src/models';
import { createTestUserAndToken, createTestTherapist, cleanupTestData } from '../../fixtures/auth-helpers';
import app from '../../../src/app';

describe('Therapist Routes Integration Tests', () => {
  let authToken: string;
  let adminToken: string;
  let therapistId: string;

  beforeAll(async () => {
    // Create test data
    const { token } = await createTestUserAndToken('user');
    authToken = token;

    const { token: adminTokenData } = await createTestUserAndToken('admin');
    adminToken = adminTokenData;

    const { therapist } = await createTestTherapist();
    therapistId = therapist.id;
  });

  afterAll(async () => {
    // Clean up test data
    await cleanupTestData();
    await sequelize.close();
  });

  describe('GET /api/v1/therapy/therapists', () => {
    it('should return a list of therapists', async () => {
      const response = await request(app)
        .get('/api/v1/therapy/therapists')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('therapists');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.therapists)).toBe(true);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/v1/therapy/therapists');

      expect(response.status).toBe(401);
    });

    it('should allow filtering by query parameters', async () => {
      const response = await request(app)
        .get('/api/v1/therapy/therapists?isActive=true&page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(10);
    });
  });

  describe('GET /api/v1/therapy/therapists/:id', () => {
    it('should return a therapist by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/therapy/therapists/${therapistId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('id', therapistId);
    });

    it('should return 404 for non-existent therapist', async () => {
      const response = await request(app)
        .get('/api/v1/therapy/therapists/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /api/v1/therapy/therapists', () => {
    it('should create a new therapist profile', async () => {
      // Create a user to associate with the therapist
      const { user } = await createTestUserAndToken();

      const response = await request(app)
        .post('/api/v1/therapy/therapists')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: user.id,
          bio: 'Test therapist bio',
          specialties: ['anxiety', 'depression'],
          credentials: ['Licensed Clinical Psychologist'],
          isActive: true
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('userId', user.id);
      expect(response.body.data).toHaveProperty('bio', 'Test therapist bio');
    });

    it('should return 409 when creating duplicate therapist profile', async () => {
      // Get an existing therapist's user ID
      const response1 = await request(app)
        .get(`/api/v1/therapy/therapists/${therapistId}`)
        .set('Authorization', `Bearer ${authToken}`);

      const userId = response1.body.data.userId;

      // Try to create another therapist profile for the same user
      const response2 = await request(app)
        .post('/api/v1/therapy/therapists')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId,
          bio: 'Duplicate therapist bio',
          specialties: ['anxiety'],
          isActive: true
        });

      expect(response2.status).toBe(409);
      expect(response2.body.status).toBe('error');
    });
  });

  describe('PUT /api/v1/therapy/therapists/:id', () => {
    it('should update a therapist profile', async () => {
      const response = await request(app)
        .put(`/api/v1/therapy/therapists/${therapistId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          bio: 'Updated therapist bio',
          specialties: ['anxiety', 'depression', 'trauma'],
          isActive: true
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('bio', 'Updated therapist bio');
      expect(response.body.data.specialties).toContain('trauma');
    });

    it('should return 404 for non-existent therapist', async () => {
      const response = await request(app)
        .put('/api/v1/therapy/therapists/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          bio: 'Updated therapist bio'
        });

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/v1/therapy/therapists/:id/availability', () => {
    it('should get therapist availability', async () => {
      const response = await request(app)
        .get(`/api/v1/therapy/therapists/${therapistId}/availability`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('therapistId', therapistId);
      expect(response.body.data).toHaveProperty('sessions');
      expect(Array.isArray(response.body.data.sessions)).toBe(true);
    });

    it('should allow filtering by date range', async () => {
      const response = await request(app)
        .get(`/api/v1/therapy/therapists/${therapistId}/availability?startDate=2025-01-01&endDate=2025-12-31`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });

  // Note: We're not testing DELETE endpoint in integration tests to avoid removing test data
  // that other tests might depend on. This would be better tested in isolation.
});
