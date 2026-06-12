import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string()
    .trim()
    .email('Email không hợp lệ'),

  password: z.string()
    .min(6, 'Mật khẩu tối thiểu 6 ký tự')
    .max(100, 'Mật khẩu tối đa 100 ký tự'),

  displayName: z.string()
    .trim()
    .min(1, 'Tên hiển thị không được để trống')
    .max(100, 'Tên hiển thị tối đa 100 ký tự')
    .optional(),
})

export const loginSchema = z.object({
  email: z.string()
    .trim()
    .email('Email không hợp lệ'),

  password: z.string()
    .min(1, 'Vui lòng nhập mật khẩu'),
  // Login chỉ cần min(1) — không validate độ phức tạp
})

// updateProfileSchema dùng .partial() — tất cả field đều optional
// User có thể chỉ cập nhật displayName mà không cần gửi bio
export const updateProfileSchema = z.object({
  displayName: z.string().trim().min(1).max(100).optional(),
  bio: z.string().trim().max(500, 'Bio tối đa 500 ký tự').optional(),
  gender: z.number().int().min(0).max(2).optional(),
  dateOfBirth: z.string().datetime({ offset: true }).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Cần ít nhất một field để cập nhật' }
  // .refine() là custom validation — chặn request body rỗng {}
)
