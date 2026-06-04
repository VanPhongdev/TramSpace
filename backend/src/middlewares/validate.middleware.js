export const validate = (schema) => (req, res, next) => {
  // schema.safeParse() không throw error — trả về { success, data, error }
  // Khác với schema.parse() sẽ throw exception nếu lỗi
  const result = schema.safeParse(req.body)

  if (!result.success) {
    // result.error.errors là mảng lỗi của từng field
    // flatten() chuyển thành object { fieldErrors: { email: [...], password: [...] } }
    const { fieldErrors } = result.error.flatten()

    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: fieldErrors,
      // Ví dụ output:
      // { email: ['Email không hợp lệ'], password: ['Mật khẩu tối thiểu 6 ký tự'] }
    })
  }

  // Gán data đã được clean (trim, coerce...) vào req.body
  // Từ đây về sau dùng req.body là dữ liệu đã validate
  req.body = result.data
  next()
}