import rateLimit from 'express-rate-limit'
import { ApiError } from '../utils/ApiError'

// Create different rate limiters for different endpoints
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (_req, _res) => {
    throw new ApiError(429, 'Too many requests')
  },
  skip: (req) => {
    // Skip rate limiting for authenticated premium users
    const authReq = req as any
    return authReq.user?.role === 'admin'
  },
})

// Stricter rate limiter for auth endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (_req, _res) => {
    throw new ApiError(429, 'Too many authentication attempts')
  },
})

// API key rate limiter (higher limits)
export const apiKeyRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 500, // Limit each API key to 500 requests per minute
  keyGenerator: (req) => {
    // Use API key as identifier instead of IP
    return (req.headers['x-api-key'] as string) || req.ip || 'anonymous'
  },
  handler: (_req, _res) => {
    throw new ApiError(429, 'API rate limit exceeded')
  },
})