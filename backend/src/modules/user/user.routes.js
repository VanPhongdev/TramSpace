import { Router } from 'express'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { updateProfileSchema } from '../auth/auth.schema.js'
import upload from '../../middlewares/upload.middleware.js'
import {
  getProfileHandler,
  updateProfileHandler,
  uploadAvatarHandler,
  getMeHandler,
} from './user.controller.js'

const router = Router()

// GET /api/users/me — lấy thông tin chính mình (cần auth)
// Phải đặt TRƯỚC /:id vì Express match từ trên xuống
router.get('/me', authenticate, getMeHandler)

// GET /api/users/:id — xem profile bất kỳ theo UUID (không cần auth)
router.get('/:id', getProfileHandler)

// PATCH /api/users/me — cập nhật profile (cần auth + validate)
router.patch('/me', authenticate, validate(updateProfileSchema), updateProfileHandler)

// POST /api/users/me/avatar — upload ảnh đại diện
// upload.single('avatar') là multer middleware — nhận file từ form-data field 'avatar'
router.post('/me/avatar', authenticate, upload.single('avatar'), uploadAvatarHandler)

export default router