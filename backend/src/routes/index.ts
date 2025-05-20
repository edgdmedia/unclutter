import express from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import therapyRoutes from './therapy';
import notificationRoutes from './notification.routes';
import oauthRoutes from './oauth.routes';
import webhookRoutes from './webhook.routes';

const router = express.Router();

// Mount API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/therapy', therapyRoutes);
router.use('/notifications', notificationRoutes);
router.use('/oauth', oauthRoutes);
router.use('/webhooks', webhookRoutes);

export default router;
