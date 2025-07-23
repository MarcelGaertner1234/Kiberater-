import request from 'supertest'
import { app } from '../../server'
import { prisma } from '../../utils/prisma'
import { hash } from 'bcryptjs'

// Mock user data
const mockUser = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  name: 'Test User',
  companyName: 'Test Company',
  companySize: 'small',
  industry: 'Technology'
}

describe('Auth API', () => {
  beforeEach(async () => {
    // Clean database
    await prisma.user.deleteMany({})
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(mockUser)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe(mockUser.email)
      expect(response.body.data.user.name).toBe(mockUser.name)
      expect(response.body.data.tokens.accessToken).toBeDefined()
      expect(response.body.data.tokens.refreshToken).toBeDefined()
    })

    it('should reject duplicate email registration', async () => {
      // Create user first
      await prisma.user.create({
        data: {
          email: mockUser.email,
          name: mockUser.name,
          passwordHash: await hash(mockUser.password, 10),
          role: 'user'
        }
      })

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(mockUser)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error.message).toContain('existiert bereits')
    })

    it('should validate password requirements', async () => {
      const weakPassword = { ...mockUser, password: 'weak' }
      
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(weakPassword)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error.message).toContain('Validation failed')
    })
  })

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await prisma.user.create({
        data: {
          email: mockUser.email,
          name: mockUser.name,
          passwordHash: await hash(mockUser.password, 10),
          role: 'user',
          emailVerified: true
        }
      })
    })

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: mockUser.email,
          password: mockUser.password
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe(mockUser.email)
      expect(response.body.data.tokens.accessToken).toBeDefined()
      expect(response.body.data.tokens.refreshToken).toBeDefined()
    })

    it('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: mockUser.email,
          password: 'WrongPassword123!'
        })
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.error.message).toContain('Ungültige E-Mail oder Passwort')
    })

    it('should reject non-existent user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: mockUser.password
        })
        .expect(401)

      expect(response.body.success).toBe(false)
    })
  })

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh tokens with valid refresh token', async () => {
      // First login to get tokens
      const user = await prisma.user.create({
        data: {
          email: mockUser.email,
          name: mockUser.name,
          passwordHash: await hash(mockUser.password, 10),
          role: 'user'
        }
      })

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: mockUser.email,
          password: mockUser.password
        })

      const { refreshToken } = loginResponse.body.data.tokens

      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.tokens.accessToken).toBeDefined()
      expect(response.body.data.tokens.refreshToken).toBeDefined()
    })

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401)

      expect(response.body.success).toBe(false)
    })
  })

  describe('POST /api/v1/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain('abgemeldet')
    })
  })

  describe('POST /api/v1/auth/forgot-password', () => {
    it('should accept password reset request', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: mockUser.email })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain('Anweisungen')
    })

    it('should not reveal if email exists', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain('Anweisungen')
    })
  })
})