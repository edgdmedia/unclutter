/**
 * Authentication helpers for testing
 */

import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import models from '../../src/models';
import { UserRole } from '../../src/types';

// For backward compatibility with existing tests
type RoleType = 'user' | 'admin' | 'therapist';

// Helper to convert RoleType to UserRole
const roleTypeToUserRole = (role: RoleType): UserRole => {
  switch(role) {
    case 'user': return UserRole.USER;
    case 'admin': return UserRole.ADMIN;
    case 'therapist': return UserRole.THERAPIST;
    default: return UserRole.USER;
  }
};

/**
 * Generate a test JWT token
 */
export const generateTestToken = (role: RoleType = 'user') => {
  const userId = uuidv4();
  
  return jwt.sign(
    { id: userId, email: 'test@example.com', role },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

/**
 * Create a test user in the database and return a JWT token
 */
export const createTestUserAndToken = async (role: RoleType = 'user') => {
  // Create a test user
  const user = await models.User.create({
    email: `test-${uuidv4()}@example.com`,
    password: 'Password123!',
    role: roleTypeToUserRole(role),
    isVerified: true,
  });

  // Generate token
  return {
    user,
    token: jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    )
  };
};

/**
 * Create a test therapist in the database
 */
export const createTestTherapist = async (userId?: string) => {
  // Create a user first if userId not provided
  let user;
  if (!userId) {
    user = await models.User.create({
      email: `therapist-${uuidv4()}@example.com`,
      password: 'Password123!',
      role: UserRole.THERAPIST,
      isVerified: true,
    });
    userId = user.id;
  }

  // Create therapist profile
  const therapist = await models.Therapist.create({
    userId,
    bio: 'Test therapist bio',
    specialties: ['anxiety', 'depression'],
    credentials: ['Licensed Clinical Psychologist'],
    isActive: true,
    calendarIntegration: {},
    meta: {}
  });

  return { therapist, user };
};

/**
 * Create a test form in the database
 */
export const createTestForm = async () => {
  return models.Form.create({
    title: 'Test Form',
    description: 'Test form description',
    type: 'assessment',
    fields: [
      {
        id: 'field1',
        label: 'Test Field',
        type: 'text',
        required: true
      }
    ],
    isActive: true,
    meta: {}
  });
};

/**
 * Create a test resource in the database
 */
export const createTestResource = async (therapistId: string) => {
  return models.Resource.create({
    therapistId,
    title: 'Test Resource',
    description: 'Test resource description',
    type: 'article',
    url: 'https://example.com/resource',
    isPublic: true,
    tags: ['test', 'anxiety'],
    meta: {}
  });
};

/**
 * Create a test session in the database
 */
export const createTestSession = async (therapistId: string, clientId: string) => {
  return models.Session.create({
    therapistId,
    clientId,
    startTime: new Date(Date.now() + 86400000), // Tomorrow
    endTime: new Date(Date.now() + 86400000 + 3600000), // Tomorrow + 1 hour
    status: 'scheduled',
    type: 'initial',
    format: 'video',
    privateNotes: '',
    sharedNotes: '',
    meta: {}
  });
};

/**
 * Clean up test data
 */
export const cleanupTestData = async () => {
  await models.ResourceAssignment.destroy({ where: {} });
  await models.Resource.destroy({ where: {} });
  await models.FormResponse.destroy({ where: {} });
  await models.Form.destroy({ where: {} });
  await models.Session.destroy({ where: {} });
  await models.Therapist.destroy({ where: {} });
  await models.Profile.destroy({ where: {} });
  await models.User.destroy({ where: {} });
};
