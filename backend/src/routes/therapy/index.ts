import express from 'express';
import therapistRoutes from './therapist.routes';
import sessionRoutes from './session.routes';
import formRoutes from './form.routes';
import resourceRoutes from './resource.routes';
import calendarRoutes from './calendar.routes';

const router = express.Router();

// Mount therapy module routes
router.use('/therapists', therapistRoutes);
router.use('/sessions', sessionRoutes);
router.use('/forms', formRoutes);
router.use('/resources', resourceRoutes);
router.use('/calendar', calendarRoutes);

export default router;
