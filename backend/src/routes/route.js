import express from 'express';

import{shortenUrl,redirectUrl,getUrlAnalytics,getTopicAnalytics,getOverallAnalytics} from '../controllers/urlController.js'
import {authenticateUser} from '../middlewares/authMiddleware.js'
import { limiter } from '../utils/ratelimit.js';

const router = express.Router()

router.get("/",authenticateUser,(req,res)=>{
    console.log("hello world")
})/** * @swagger * /api/shorten: * post: * summary: Shorten a URL * tags: [URL Shortener] * security: * - BearerAuth: [] * requestBody: * required: true * content: * application/json: * schema: * type: object * properties: * longUrl: * type: string * example: "https://example.com/long-url" * customAlias: * type: string * example: "custom123" * topic: * type: string * example: "marketing" * responses: * 201: * description: Short URL created successfully * 400: * description: Custom alias already taken * 500: * description: Server error */  
router.post('/api/shorten/',limiter,shortenUrl)
  /** * @swagger * /api/shorten/{alias}: * get: * summary: Redirect to the original URL * tags: [URL Shortener] * parameters: * - in: path * name: alias * required: true * schema: * type: string * example: "abcd1234" * responses: * 302: * description: Redirects to the original URL * 404: * description: Short URL not found * 500: * description: Server error */  
router.get('/api/shorten/:alias',redirectUrl)
/** * @swagger * /api/analytics/topic/{topic}: * get: * summary: Get analytics for a specific topic * tags: [Analytics] * security: * - BearerAuth: [] * parameters: * - in: path * name: topic * required: true * schema: * type: string * example: "marketing" * responses: * 200: * description: Returns topic-based analytics * 500: * description: Server error */  
router.get('/api/analytics/topic/:topic',authenticateUser,getTopicAnalytics)
/** * @swagger * /api/analytics/overall: * get: * summary: Get overall analytics for the authenticated user * tags: [Analytics] * security: * - BearerAuth: [] * responses: * 200: * description: Returns overall analytics data * 500: * description: Server error */  
router.get('/api/analytics/overall', authenticateUser,getOverallAnalytics)

export default router 