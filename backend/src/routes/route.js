import express from 'express';

import{shortenUrl,redirectUrl,getUrlAnalytics,getTopicAnaLytics,getOverallAnalytics} from '../controllers/urlController.js'
import {authenticateUser} from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/api/shorten',authenticateUser,shortenUrl)
router.get('/api/shorten/:alias',redirectUrl)

router.get('/api/analytics/topic/:topic', authenticateUser,getTopicAnaLytics)
router.get('/api/analytics/overall', authenticateUser,getOverallAnalytics)

export default router