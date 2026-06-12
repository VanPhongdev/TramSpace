import cloudinary from 'cloudinary'
import prisma from '../../lib/prisma.js'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Select chung cho các query trả về user info
const USER_SELECT = {
  id: true,
  email: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  coverUrl: true,
  gender: true,
  dateOfBirth: true,
  followersCount: true,
  followingCount: true,
  postsCount: true,
  createdAt: true,
}

// GET /api/users/me — lấy thông tin người dùng hiện tại theo id
export const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_SELECT
  })
  if (!user) throw { status: 404, message: 'Không tìm thấy user' }
  return user
}

// GET /api/users/:id — xem profile bất kỳ theo id
export const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_SELECT
  })
  if (!user) throw { status: 404, message: 'Không tìm thấy user' }
  return user
}

export const updateProfile = async (userId, data) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: USER_SELECT
  })
}

export const uploadAvatar = async (userId, fileBuffer) => {
  const result = await new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { folder: 'tramspace/avatars', transformation: [{ width: 200, height: 200, crop: 'fill' }] },
      (err, res) => err ? reject(err) : resolve(res)
    ).end(fileBuffer)
  })
  // Lưu cloudinary_public_id để có thể xóa ảnh cũ sau này
  return updateProfile(userId, {
    avatarUrl: result.secure_url,
  })
}