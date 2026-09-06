# AIO Memory Trainer (DeepMemory)

Ứng dụng luyện trí nhớ và phản xạ nhận diện đa lĩnh vực phong cách game (Universal Brain & Memory Training Platform).

## 🚀 Tính năng nổi bật

- **Kiến trúc Universal Engine**: Quiz Engine và Learning Engine hoàn toàn phổ quát, không hardcode hay phụ thuộc vào bất kỳ module cụ thể nào.
- **Module #1: Nhớ số 00–99**:
  - Trọn bộ 100 hình ảnh liên tưởng (Major System / Mnemonic Number Shape) chuẩn xác.
  - 13 nhóm luyện tập phân cấp: 10 nhóm hàng chục, 00-49, 50-99, trọn bộ 100 số.
  - 2 chế độ luyện tập: **Hình ảnh ➔ Số** và **Số ➔ Hình ảnh**.
  - Bàn phím tắt nhanh 1-2-3-4 trên desktop, giao diện 2x2 siêu nhạy trên mobile.
- **Luyện tập phản xạ (<100ms)**:
  - Chuyển câu tức thì, không popup chặn luồng thi đấu.
  - Thuật toán Spaced Repetition phân cấp thành thạo: *New (0–24)*, *Learning (25–49)*, *Familiar (50–79)*, *Mastered (80–100)*.
  - Bảng kỷ lục tốc độ (Personal Best) và phát hiện các mục còn yếu (Weak Items).
- **Hệ thống Lưu trữ Hybrid (Offline-First + Cloud Sync)**:
  - Lưu trữ IndexedDB cục bộ với Dexie giúp tốc độ phản hồi <5ms.
  - Đồng bộ tự động hai chiều với **Supabase Cloud Database**.
- **Progressive Web App (PWA)**: Hỗ trợ cài đặt trên điện thoại và máy tính, chạy mượt mà ngay cả khi mất mạng.

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Zustand, Lucide Icons, Canvas Confetti.
- **Database & Storage**: Supabase (PostgreSQL, Row Level Security, Storage Buckets) & IndexedDB (Dexie).
- **Quality**: Vitest, Oxlint, PWA Plugin.

## 📦 Cài đặt & Chạy ứng dụng

```bash
# Cài đặt dependencies
npm install

# Thiết lập biến môi trường
cp .env.example .env

# Chạy môi trường phát triển
npm run dev

# Chạy kiểm thử tự động
npm run test

# Build ứng dụng
npm run build
```

## 🗄️ Cấu trúc Database Supabase

Khởi tạo cơ sở dữ liệu trên Supabase thông qua file script:
```bash
supabase/schema.sql
```
Bao gồm các bảng: `modules`, `module_groups`, `module_items`, `training_sessions`, `item_progress`, `module_progress`, `best_times`, `user_settings`.

---
© 2026 DeepMemory - All rights reserved.
