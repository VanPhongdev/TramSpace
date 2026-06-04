import bcrypt from 'bcryptjs'
import prisma from '../../lib/prisma.js'
import redis from '../../lib/redis.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.js'

export const register = async ({ email, username, password, name }) => {
  const exists = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] }
  })
  if (exists) throw { status: 409, message: 'Email hoặc username đã tồn tại' }

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { email, username, password: hashed, name },
    select: { id: true, email: true, username: true, name: true }
  })
  return user
}

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw { status: 401, message: 'Email hoặc mật khẩu không đúng' }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw { status: 401, message: 'Email hoặc mật khẩu không đúng' }

  const accessToken = signAccessToken(user.id)
  const refreshToken = signRefreshToken(user.id)

  // Lưu refresh token vào Redis, TTL 7 ngày
  await redis.setEx(`rt:${user.id}`, 60 * 60 * 24 * 7, refreshToken)

  return { accessToken, refreshToken, user: { id: user.id, email: user.email, username: user.username, name: user.name } }
}

export const refresh = async (token) => {
  const { userId } = verifyRefreshToken(token)
  const stored = await redis.get(`rt:${userId}`)
  if (!stored || stored !== token) throw { status: 401, message: 'Refresh token không hợp lệ' }

  const accessToken = signAccessToken(userId)
  return { accessToken }
}

export const logout = async (userId) => {
  await redis.del(`rt:${userId}`)
}