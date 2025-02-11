import express from 'express';

import{shortenUrl,redirectUrl,getUrlAnalytics,getTopicAnalytics,getOverallAnalytics} from '../controllers/urlController.js'
import {authenticateUser} from '../middlewares/authmiddleware.js'
import { limiter } from '../utils/ratelimit.js';
import { PassAuth,passAuthCallback,logout,sendcookie } from '../services/Oauth.js';

const router = express.Router()


/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Redirect to Google OAuth login
 *     description: Initiates authentication using Google OAuth 2.0.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects to Google login page
 *       500:
 *         description: Internal server error
 */

router.get("/auth/google",PassAuth)
/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Handle Google OAuth callback
 *     description: Processes the Google OAuth 2.0 authentication response and sets a JWT token in cookies.
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Authentication successful, JWT token set in cookies.
 *       401:
 *         description: Unauthorized, authentication failed.
 *       500:
 *         description: Internal server error.
 */

router.get("/auth/google/callback",passAuthCallback,sendcookie)
/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Log out the user
 *     description: Ends the user session and clears authentication cookies.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *       401:
 *         description: Unauthorized, user not logged in.
 *       500:
 *         description: Internal server error.
 */

router.get("/logout",logout)

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Shorten a URL
 *     tags: [URL Shortener]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 example: "https://example.com/long-url"
 *               customAlias:
 *                 type: string
 *                 example: "custom123"
 *               topic:
 *                 type: string
 *                 example: "marketing"
 *     responses:
 *       201:
 *         description: Short URL created successfully
 *       400:
 *         description: Custom alias already taken
 *       500:
 *         description: Server error
 */
router.post("/api/shorten", limiter,authenticateUser, shortenUrl);

/**
 * @swagger
 * /api/shorten/{alias}:
 *   get:
 *     summary: Redirect to the original URL
 *     tags: [URL Shortener]
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *           example: "abcd1234"
 *     responses:
 *       302:
 *         description: Redirects to the original URL
 *       404:
 *         description: Short URL not found
 *       500:
 *         description: Server error
 */
router.get("/api/shorten/:alias", redirectUrl);
/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     summary: Get overall analytics for the authenticated user
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns overall analytics data
 *       500:
 *         description: Server error
 */
router.get("/api/analytics/overall", limiter ,authenticateUser, getOverallAnalytics);
/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     summary: Get URL Analytics
 *     description: Retrieves analytics data for a shortened URL based on its alias.
 *     tags:
 *       - Analytics
 *     parameters:
 *       - name: alias
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The alias of the shortened URL.
 *     responses:
 *       200:
 *         description: Successful response with analytics data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 alias:
 *                   type: string
 *                   description: The alias of the shortened URL.
 *                 totalClicks:
 *                   type: integer
 *                   description: Total number of clicks on the URL.
 *                 uniqueVisitors:
 *                   type: integer
 *                   description: Number of unique visitors.
 *                 topCountries:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of top countries from where the URL was accessed.
 *                 referrers:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of top referrer sources.
 *       400:
 *         description: Invalid alias provided.
 *       404:
 *         description: No analytics data found for the alias.
 *       500:
 *         description: Internal server error.
 */


router.get("/api/analytics/:alias",limiter,getUrlAnalytics)
/**
 * @swagger
 * /api/analytics/topic/{topic}:
 *   get:
 *     summary: Get analytics for a specific topic
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *           example: "marketing"
 *     responses:
 *       200:
 *         description: Returns topic-based analytics
 *       500:
 *         description: Server error
 */
router.get("/api/analytics/topic/:topic", limiter,authenticateUser, getTopicAnalytics);



export default router;