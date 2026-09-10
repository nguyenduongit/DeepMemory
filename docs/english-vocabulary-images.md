# Ảnh cho module Từ vựng tiếng Anh

Module hoạt động hoàn chỉnh bằng văn bản khi chưa có ảnh. Mỗi mục đã dành sẵn
`imagePath` theo định dạng `vocab-001.webp` đến `vocab-100.webp`.

## Quy trình dành cho coding agent

1. Chuẩn bị ảnh trong một thư mục, đặt tên theo `imagePath` trong `data.ts`.
2. Nên dùng WebP vuông, kích thước 768 × 768 px, dung lượng dưới 500 KB.
3. Kiểm tra trước mà chưa upload:

   ```bash
   npm run upload:vocabulary-images -- --source ./vocabulary-images --dry-run
   ```

4. Cấp `SUPABASE_URL` và `SUPABASE_SERVICE_ROLE_KEY` trong môi trường riêng của
   agent, sau đó chạy:

   ```bash
   npm run upload:vocabulary-images -- --source ./vocabulary-images
   ```

Script sẽ tự tạo public bucket `english-vocabulary-images` nếu chưa tồn tại,
upload/upsert ảnh và sinh lại `image-manifest.generated.ts`. Tuyệt đối không đưa
service-role key vào source code, file ảnh hoặc biến môi trường phía trình duyệt.

Sau khi có ảnh, coding agent có thể bật biến thể flashcard và chế độ luyện tập
bằng hình ảnh dựa trực tiếp trên trường `imageUrl`; dữ liệu từ vựng không cần đổi ID.
