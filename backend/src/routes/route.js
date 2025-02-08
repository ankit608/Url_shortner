import express from 'express';

import{shortenUrl,redirectUrl,getUrlAnalytics,getTopicAnalytics,getOverallAnalytics} from '../controllers/urlController.js'
import {authenticateUser} from '../middlewares/authMiddleware.js'

const router = express.Router()
router.get("/",authenticateUser,(req,res)=>{
    console.log("hello world")
})
router.post('/api/shorten/',shortenUrl)
router.get('/api/shorten/:alias',redirectUrl)

router.get('/api/analytics/topic/:topic',authenticateUser,getTopicAnalytics)
router.get('/api/analytics/overall', authenticateUser,getOverallAnalytics)

export default router 