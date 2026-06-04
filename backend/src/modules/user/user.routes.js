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
// Phải đặt TRƯỚC /:username vì Express match từ trên xuống
// Nếu đặt sau, /me sẽ bị hiểu là username = "me"
router.get('/me', authenticate, getMeHandler)

// GET /api/users/:username — xem profile bất kỳ (không cần auth)
router.get('/:username', getProfileHandler)

// PATCH /api/users/me — cập nhật profile (cần auth + validate)
router.patch('/me', authenticate, validate(updateProfileSchema), updateProfileHandler)

// POST /api/users/me/avatar — upload ảnh đại diện
// upload.single('avatar') là multer middleware — nhận file từ form-data field 'avatar'
router.post('/me/avatar', authenticate, upload.single('avatar'), uploadAvatarHandler)

export default router