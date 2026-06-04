import multer from 'multer'

const upload = multer({
  // memoryStorage lưu file vào RAM thay vì disk
  // Phù hợp vì ta sẽ stream thẳng lên Cloudinary, không cần lưu file tạm
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB — chặn file quá lớn trước khi upload
  },

  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận ảnh
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)  // null = không lỗi, true = chấp nhận file
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh'), false)
    }
  },
})

export default upload