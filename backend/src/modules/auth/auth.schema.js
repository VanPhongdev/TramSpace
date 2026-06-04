import { z } from 'zod'

export const registerSchema = z.object({
  // .trim() loại bỏ khoảng trắng 2 đầu — tránh username "  admin  "
  email: z.string()
    .trim()
    .email('Email không hợp lệ'),

  username: z.string()
    .trim()
    .min(3, 'Username tối thiểu 3 ký tự')
    .max(20, 'Username tối đa 20 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username chỉ chứa chữ, số và dấu gạch dưới'),
    // Regex này chặn username có dấu cách, ký tự đặc biệt

  password: z.string()
    .min(6, 'Mật khẩu tối thiểu 6 ký tự')
    .max(100, 'Mật khẩu tối đa 100 ký tự'),
    // max(100) để tránh bcrypt DoS attack:
    // bcrypt xử lý chuỗi rất dài sẽ tốn CPU cực nhiều

  name: z.string()
    .trim()
    .min(1, 'Tên không được để trống')
    .max(50, 'Tên tối đa 50 ký tự'),
})

export const loginSchema = z.object({
  email: z.string()
    .trim()
    .email('Email không hợp lệ'),

  password: z.string()
    .min(1, 'Vui lòng nhập mật khẩu'),
    // Login chỉ cần min(1) — không validate độ phức tạp
    // vì đó là việc của register
})

// updateProfileSchema dùng .partial() — tất cả field đều optional
// User có thể chỉ cập nhật name mà không cần gửi bio
export const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(50).optional(),
  bio:  z.string().trim().max(200, 'Bio tối đa 200 ký tự').optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Cần ít nhất một field để cập nhật' }
  // .refine() là custom validation — chặn request body rỗng {}
)