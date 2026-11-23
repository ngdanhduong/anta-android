SPORTBOOKING - BA GIAO DIỆN HTML

1. index.html: Quản lý lịch và đơn đặt (Chủ sân)
2. thanh-toan-bao-cao.html: Thanh toán và báo cáo (Chủ sân)
3. giam-sat.html: Giám sát sân và đơn đặt (Quản trị viên)

Cách chạy: Giải nén, giữ các tệp trong cùng một thư mục, rồi mở index.html bằng trình duyệt. Dùng menu bên trái để chuyển giữa ba trang.

Để dữ liệu minh họa được đồng bộ giữa các trang, nên chạy một máy chủ cục bộ tại thư mục này:
  python -m http.server 8000
Sau đó mở http://localhost:8000/ trên trình duyệt.

Tất cả thao tác chỉ dùng dữ liệu mẫu và localStorage trong trình duyệt; chưa kết nối máy chủ hoặc cơ sở dữ liệu. Nút “Đặt lại dữ liệu mẫu” khôi phục dữ liệu ban đầu.
