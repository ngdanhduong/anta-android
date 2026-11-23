# PHÂN HỆ GIAO DIỆN WEB (FRONTEND) - ANTA SPORTS PLATFORM

Thư mục `frontend/` chứa toàn bộ các giao diện người dùng trên nền tảng Web của hệ sinh thái Anta.

---

## 📂 Cấu trúc thư mục

```
frontend/
├── index.html                   # Trang điều hướng tập trung vào các cổng Web
├── sportbooking/                # Bộ mã nguồn Web Admin, Chủ Sân & Khách Hàng
│   ├── admin.html               # Cổng Quản trị Hệ thống (Admin Portal)
│   ├── owner.html               # Cổng Dành cho Chủ Sân (Owner Portal)
│   ├── index.html               # Trang đặt sân trực tuyến dành cho khách hàng
│   ├── login.html               # Trang đăng nhập phân hệ đối tác
│   ├── css/                     # Toàn bộ CSS giao diện & theme
│   ├── js/                      # Logic điều khiển, data mockup & kết nối API
│   └── assets/                  # Hình ảnh, logo, icon, phông chữ
└── demo-web/                    # Landing Page giới thiệu nền tảng & tải ứng dụng
    ├── index.html               # Trang giới thiệu ứng dụng
    ├── demo.css                 # Style trang landing page
    └── demo.js                  # Hiệu ứng trang landing page
```

---

## 🚀 Hướng dẫn mở và trải nghiệm

1. **Cách nhanh nhất**: Mở trực tiếp file `frontend/index.html` bằng trình duyệt (Chrome, Edge, Firefox).
2. Chọn cổng giao diện cần làm việc:
   - **Admin Portal**: Quản lý cơ sở sân, doanh thu tổng, phân quyền tài khoản.
   - **Owner Portal**: Giám sát lịch đặt sân thực tế, duyệt đơn, check-in tại sân.
   - **Customer Portal**: Xem danh mục sân bãi, chọn khung giờ trống và đặt chỗ.
   - **Demo Web**: Trang giới thiệu tổng quan hệ sinh thái Anta.

---

## 🌐 Kết nối API Backend (Microservices)

Tất cả các trang Web khi kết nối dữ liệu động sẽ gọi qua **API Gateway** tại địa chỉ:
* **API Gateway URL**: `http://localhost:8080/api/v1`
