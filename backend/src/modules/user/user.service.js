import cloudinary from 'cloudinary'
import prisma from '../../lib/prisma.js'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const getProfile = async (username) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true, username: true, name: true,
      bio: true, avatar: true, createdAt: true,
      _count: { select: { posts: true, followers: true, following: true } }
    }
  })
  if (!user) throw { status: 404, message: 'Không tìm thấy user' }
  return user
}

export const updateProfile = async (userId, data) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, username: true, name: true, bio: true, avatar: true }
  })
}

export const uploadAvatar = async (userId, fileBuffer) => {
  const result = await new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { folder: 'tramspace/avatars', transformation: [{ width: 200, height: 200, crop: 'fill' }] },
      (err, res) => err ? reject(err) : resolve(res)
    ).end(fileBuffer)
  })
  return updateProfile(userId, { avatar: result.secure_url })
}