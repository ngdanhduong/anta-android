// SportBooking Mock Data & Storage Manager
// Faithfully matches Anta App data models (Kotlin / Jetpack Compose)

const DEFAULT_USER = {
  id: "usr_001",
  displayName: "Nguyễn Văn Hùng",
  identifier: "hung.nguyen@sportbooking.vn",
  phone: "0909123456",
  avatar: "H",
  passwordLogin: true
};

const SPORTS_DATA = [
  { id: "sp_all", name: "Tất cả", slug: "all", emoji: "✨", venueCount: 28, color: "#12B5A6" },
  { id: "sp_badminton", name: "Cầu lông", slug: "badminton", emoji: "🏸", venueCount: 12, color: "#5B8DEF" },
  { id: "sp_pickleball", name: "Pickleball", slug: "pickleball", emoji: "🏓", venueCount: 9, color: "#12B5A6" },
  { id: "sp_football", name: "Bóng đá", slug: "football", emoji: "⚽", venueCount: 15, color: "#45B649" },
  { id: "sp_tennis", name: "Tennis", slug: "tennis", emoji: "🎾", venueCount: 6, color: "#9CCB3B" },
  { id: "sp_basketball", name: "Bóng rổ", slug: "basketball", emoji: "🏀", venueCount: 5, color: "#F7931E" },
  { id: "sp_padel", name: "Padel", slug: "padel", emoji: "🎾", venueCount: 3, color: "#26C6DA" },
  { id: "sp_volleyball", name: "Bóng chuyền", slug: "volleyball", emoji: "🏐", venueCount: 4, color: "#FFB74D" },
  { id: "sp_golf", name: "Golf 3D", slug: "golf", emoji: "⛳", venueCount: 3, color: "#66BB6A" }
];

const VENUES_DATA = [
  {
    id: "ven_001",
    name: "CLB Cầu Lông & Pickleball D-Sport",
    address: "215 Hoàng Văn Thụ, Phường 8, Quận Phú Nhuận, TP.HCM",
    lat: 10.7984,
    lng: 106.6712,
    distanceMeters: 850,
    openingHour: 6,
    closingHour: 23,
    rating: 4.9,
    reviewCount: 138,
    minPrice: 120000,
    sports: [
      { slug: "pickleball", name: "Pickleball" },
      { slug: "badminton", name: "Cầu lông" }
    ],
    images: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Cụm sân chuẩn thi đấu với 8 sân Pickleball sàn sơn nhám đạt tiêu chuẩn USA Pickleball và 6 sân Cầu lông thảm Victor cao cấp. Hệ thống chiếu sáng chống chói mắt, phòng thay đồ máy lạnh và quầy nước thể thao giải khát.",
    rules: [
      "Vui lòng mang giày thể thao đế kếp / không để lại vết đen trên mặt sàn.",
      "Có mặt trước giờ đặt sân ít nhất 10 phút để nhận sân đúng giờ.",
      "Không hút thuốc, không xả rác và không mang đồ ăn có mùi vào khu vực thảm đấu.",
      "Giữ gìn vệ sinh chung và bảo quản tư trang cá nhân."
    ],
    services: [
      { name: "Thuê vợt Pickleball carbon", price: 30000 },
      { name: "Thuê vợt cầu lông cao cấp", price: 35000 },
      { name: "Nước khoáng Pocari Sweat / Revive", price: 15000 },
      { name: "Thuê tủ đồ locker có khóa", price: 10000 },
      { name: "Đèn chiếu sáng ban đêm", price: 0 }
    ],
    priceLists: [
      { title: "Giờ thường (Thứ 2 - Thứ 6: 06:00 - 16:00)", slots: ["06:00 - 16:00: 120.000 đ / giờ"] },
      { title: "Giờ vàng (Thứ 2 - Thứ 6: 16:00 - 23:00)", slots: ["16:00 - 23:00: 180.000 đ / giờ"] },
      { title: "Cuối tuần & Ngày lễ (Thứ 7 - CN cả ngày)", slots: ["06:00 - 23:00: 200.000 đ / giờ"] }
    ],
    yards: [
      { id: "yard_001_1", name: "Sân Pickleball 1 (Sân trung tâm)", hourlyPrice: 150000, sportSlug: "pickleball" },
      { id: "yard_001_2", name: "Sân Pickleball 2", hourlyPrice: 140000, sportSlug: "pickleball" },
      { id: "yard_001_3", name: "Sân Cầu lông 1 (Thảm Victor)", hourlyPrice: 130000, sportSlug: "badminton" },
      { id: "yard_001_4", name: "Sân Cầu lông 2 (Thảm Victor)", hourlyPrice: 130000, sportSlug: "badminton" }
    ]
  },
  {
    id: "ven_002",
    name: "Sân Bóng Đá Mini K-Arena Chấn Hưng",
    address: "123 Chấn Hưng, Phường 6, Quận Tân Bình, TP.HCM",
    lat: 10.7891,
    lng: 106.6578,
    distanceMeters: 1400,
    openingHour: 6,
    closingHour: 23,
    rating: 4.8,
    reviewCount: 94,
    minPrice: 250000,
    sports: [
      { slug: "football", name: "Bóng đá" }
    ],
    images: [
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Cụm 4 sân bóng đá cỏ nhân tạo 5 người và 2 sân 7 người đạt chuẩn FIFA 2 sao. Cỏ mềm êm chân, dàn đèn led pha sáng rực ban đêm, bãi gửi xe ô tô và xe máy rộng rãi.",
    rules: [
      "Mang giày đinh dăm TF hoặc AG thích hợp sân cỏ nhân tạo (cấm đinh sắt FG).",
      "Không mang chai thủy tinh, đồ ăn nhậu vào trong sân cỏ.",
      "Tôn trọng trọng tài và đội bạn, thi đấu trên tinh thần fair-play."
    ],
    services: [
      { name: "Thuê bóng thi đấu Molten số 4 / 5", price: 20000 },
      { name: "Áo lưới phân đội (bộ 7 áo)", price: 30000 },
      { name: "Trọng tài bắt trận giao hữu", price: 150000 },
      { name: "Bình trà đá / nước giải khát", price: 20000 }
    ],
    priceLists: [
      { title: "Sáng sớm (06:00 - 14:00)", slots: ["06:00 - 14:00: 250.000 đ / giờ"] },
      { title: "Chiều tối (14:00 - 17:00)", slots: ["14:00 - 17:00: 320.000 đ / giờ"] },
      { title: "Giờ cao điểm tối (17:00 - 22:30)", slots: ["17:00 - 22:30: 420.000 đ / giờ"] }
    ],
    yards: [
      { id: "yard_002_1", name: "Sân 5 người - Sân A", hourlyPrice: 300000, sportSlug: "football" },
      { id: "yard_002_2", name: "Sân 5 người - Sân B", hourlyPrice: 300000, sportSlug: "football" },
      { id: "yard_002_3", name: "Sân 7 người - Sân C (Lớn)", hourlyPrice: 500000, sportSlug: "football" }
    ]
  },
  {
    id: "ven_003",
    name: "Tổ Hợp Thể Thao Star Tennis & Padel Center",
    address: "Số 2 Võ Thị Sáu, Phường Đa Kao, Quận 1, TP.HCM",
    lat: 10.7876,
    lng: 106.6975,
    distanceMeters: 2300,
    openingHour: 5,
    closingHour: 22,
    rating: 4.95,
    reviewCount: 215,
    minPrice: 200000,
    sports: [
      { slug: "tennis", name: "Tennis" },
      { slug: "padel", name: "Padel" }
    ],
    images: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Tổ hợp sân Tennis mặt sân cứng chuẩn US Open cùng sân Padel kính cường lực panorama thời thượng. Có HLV hướng dẫn chuyên nghiệp và câu lạc bộ sinh hoạt thường xuyên.",
    rules: [
      "Mặc trang phục quần vợt chuẩn mực, giày đế phẳng không tạo vệt màu.",
      "Không xô đẩy kính an toàn sân Padel.",
      "Hoàn trả banh và dụng cụ mượn sau khi kết thúc buổi tập."
    ],
    services: [
      { name: "Thuê vợt Tennis Head / Wilson", price: 50000 },
      { name: "Hộp banh Tennis mới 4 quả", price: 120000 },
      { name: "Thuê vợt Padel chuyên dụng", price: 60000 },
      { name: "Dịch vụ nhặt banh (Ballboy / giờ)", price: 60000 }
    ],
    priceLists: [
      { title: "Ban ngày (05:00 - 15:00)", slots: ["05:00 - 15:00: 200.000 đ / giờ"] },
      { title: "Bật đèn đêm (17:00 - 22:00)", slots: ["17:00 - 22:00: 350.000 đ / giờ"] }
    ],
    yards: [
      { id: "yard_003_1", name: "Sân Tennis 1 (Trung tâm)", hourlyPrice: 280000, sportSlug: "tennis" },
      { id: "yard_003_2", name: "Sân Tennis 2", hourlyPrice: 250000, sportSlug: "tennis" },
      { id: "yard_003_3", name: "Sân Padel Kính Panorama", hourlyPrice: 320000, sportSlug: "padel" }
    ]
  },
  {
    id: "ven_004",
    name: "Sân Cầu Lông Victor Pro Tân Bình",
    address: "45/18 Nguyễn Thái Bình, Phường 4, Quận Tân Bình, TP.HCM",
    lat: 10.7952,
    lng: 106.6621,
    distanceMeters: 620,
    openingHour: 6,
    closingHour: 23,
    rating: 4.7,
    reviewCount: 82,
    minPrice: 90000,
    sports: [
      { slug: "badminton", name: "Cầu lông" }
    ],
    images: [
      "https://images.unsplash.com/photo-1613918431703-aa6321c1f7a0?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Nhà thi đấu 10 sân cầu lông trần cao 11m, gió nhẹ, thảm vân kim cương cao cấp bám chân tốt. Có hệ thống căng vợt điện tử lấy ngay.",
    rules: [
      "Sử dụng giày cầu lông chuyên dụng.",
      "Không mang thức ăn vào sân đấu.",
      "Tuân thủ quy định giờ giấc đặt chỗ."
    ],
    services: [
      { name: "Căng cước vợt cầu lông điện tử", price: 100000 },
      { name: "Ống cầu lông Thành Công 12 quả", price: 230000 },
      { name: "Thuê vợt Yonex", price: 30000 }
    ],
    priceLists: [
      { title: "Giờ hành chính (08:00 - 16:00)", slots: ["08:00 - 16:00: 90.000 đ / giờ"] },
      { title: "Giờ cao điểm (17:00 - 22:00)", slots: ["17:00 - 22:00: 140.000 đ / giờ"] }
    ],
    yards: [
      { id: "yard_004_1", name: "Sân Cầu Lông 1", hourlyPrice: 120000, sportSlug: "badminton" },
      { id: "yard_004_2", name: "Sân Cầu Lông 2", hourlyPrice: 120000, sportSlug: "badminton" },
      { id: "yard_004_3", name: "Sân Cầu Lông 3", hourlyPrice: 120000, sportSlug: "badminton" },
      { id: "yard_004_4", name: "Sân Cầu Lông 4", hourlyPrice: 120000, sportSlug: "badminton" }
    ]
  },
  {
    id: "ven_005",
    name: "Saigon Dunkers Basketball & Multi-Sport",
    address: "38 Thảo Điền, Phường Thảo Điền, TP. Thủ Đức, TP.HCM",
    lat: 10.8045,
    lng: 106.7351,
    distanceMeters: 4500,
    openingHour: 6,
    closingHour: 22,
    rating: 4.88,
    reviewCount: 167,
    minPrice: 180000,
    sports: [
      { slug: "basketball", name: "Bóng rổ" },
      { slug: "volleyball", name: "Bóng chuyền" }
    ],
    images: [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Sân bóng rổ sàn gỗ phong chuyên nghiệp trong nhà máy lạnh tiêu chuẩn NBA. Trụ rổ lò xo chịu lực có thể điều chỉnh độ cao từ 2.6m đến 3.05m cho cả người lớn và thiếu nhi.",
    rules: [
      "Bắt buộc mang giày bóng rổ trong nhà sạch đế.",
      "Không đu người hoặc đu mạnh trên vành rổ.",
      "Dọn dẹp bóng vào rổ chứa sau khi chơi xong."
    ],
    services: [
      { name: "Thuê bóng Spalding TF-1000", price: 30000 },
      { name: "Bảng điểm điện tử có remote", price: 50000 },
      { name: "Thuê áo thi đấu số 1 - 12", price: 60000 }
    ],
    priceLists: [
      { title: "Nửa sân 3x3 (06:00 - 17:00)", slots: ["06:00 - 17:00: 180.000 đ / giờ"] },
      { title: "Nguyên sân 5x5 (17:00 - 22:00)", slots: ["17:00 - 22:00: 450.000 đ / giờ"] }
    ],
    yards: [
      { id: "yard_005_1", name: "Sân Bóng rổ Full Court A", hourlyPrice: 400000, sportSlug: "basketball" },
      { id: "yard_005_2", name: "Sân Bóng rổ Half Court B (3x3)", hourlyPrice: 220000, sportSlug: "basketball" },
      { id: "yard_005_3", name: "Sân Bóng chuyền thảm Taraflex", hourlyPrice: 300000, sportSlug: "volleyball" }
    ]
  },
  {
    id: "ven_006",
    name: "The Eagle 3D Golf & Lounge",
    address: "Tầng 3 TTTM Pearl Plaza, 561A Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    lat: 10.7997,
    lng: 106.7188,
    distanceMeters: 3100,
    openingHour: 8,
    closingHour: 23,
    rating: 4.96,
    reviewCount: 52,
    minPrice: 350000,
    sports: [
      { slug: "golf", name: "Golf 3D" }
    ],
    images: [
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Phòng golf giả lập 3D với công nghệ cảm biến Bravo Golf và Trackman cao cấp, mô phỏng hơn 100 sân golf nổi tiếng thế giới. Không gian riêng tư, phục vụ đồ uống và đồ ăn nhẹ sang trọng.",
    rules: [
      "Sử dụng gậy có đầu bọc sạch và bóng do trung tâm cung cấp.",
      "Mỗi phòng tối đa 4 người cùng lúc.",
      "Đặt trước 1 tiếng để được setup phần mềm chuẩn xác."
    ],
    services: [
      { name: "Thuê bộ gậy Titleist / TaylorMade", price: 100000 },
      { name: "HLV phân tích cú swing 45 phút", price: 400000 },
      { name: "Trà thảo mộc & đồ ăn nhẹ", price: 60000 }
    ],
    priceLists: [
      { title: "Buổi sáng & Trưa (08:00 - 15:00)", slots: ["08:00 - 15:00: 350.000 đ / giờ"] },
      { title: "Buổi tối & Cuối tuần (15:00 - 23:00)", slots: ["15:00 - 23:00: 500.000 đ / giờ"] }
    ],
    yards: [
      { id: "yard_006_1", name: "Phòng VIP Trackman 1", hourlyPrice: 450000, sportSlug: "golf" },
      { id: "yard_006_2", name: "Phòng Standard 2", hourlyPrice: 350000, sportSlug: "golf" }
    ]
  }
];

// Seed initial bookings
const INITIAL_BOOKINGS = [
  {
    id: "BK-98A721",
    branchId: "ven_001",
    branchName: "CLB Cầu Lông & Pickleball D-Sport",
    branchAddress: "215 Hoàng Văn Thụ, Phường 8, Quận Phú Nhuận, TP.HCM",
    branchImage: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400&auto=format&fit=crop",
    yardName: "Sân Pickleball 1 (Sân trung tâm)",
    dateString: "2026-11-06",
    startTime: "18:00",
    endTime: "20:00",
    hoursCount: 2,
    amount: 300000,
    status: "PENDING_PAYMENT", // PENDING_PAYMENT, CONFIRMED, CANCELLED, EXPIRED
    createdAt: Date.now() - 5 * 60 * 1000,
    paymentExpiresAt: Date.now() + 10 * 60 * 1000
  },
  {
    id: "BK-45F209",
    branchId: "ven_002",
    branchName: "Sân Bóng Đá Mini K-Arena Chấn Hưng",
    branchAddress: "123 Chấn Hưng, Phường 6, Quận Tân Bình, TP.HCM",
    branchImage: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=400&auto=format&fit=crop",
    yardName: "Sân 5 người - Sân A",
    dateString: "2026-11-04",
    startTime: "19:00",
    endTime: "21:00",
    hoursCount: 2,
    amount: 600000,
    status: "CONFIRMED",
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
    paymentExpiresAt: null
  },
  {
    id: "BK-11C833",
    branchId: "ven_004",
    branchName: "Sân Cầu Lông Victor Pro Tân Bình",
    branchAddress: "45/18 Nguyễn Thái Bình, Phường 4, Quận Tân Bình, TP.HCM",
    branchImage: "https://images.unsplash.com/photo-1613918431703-aa6321c1f7a0?q=80&w=400&auto=format&fit=crop",
    yardName: "Sân Cầu Lông 2",
    dateString: "2026-10-28",
    startTime: "17:00",
    endTime: "19:00",
    hoursCount: 2,
    amount: 240000,
    status: "CONFIRMED",
    createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    paymentExpiresAt: null
  }
];

// LocalStorage Helper
const Storage = {
  get(key, fallback) {
    try {
      const item = localStorage.getItem("sportbooking_" + key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem("sportbooking_" + key, JSON.stringify(val));
    } catch (e) {
      console.warn("Storage set error:", e);
    }
  }
};

// Global Store State
window.SportStore = {
  user: (() => {
    try {
      if (typeof sessionStorage !== "undefined") {
        const sess = sessionStorage.getItem("currentUser");
        if (sess) {
          const parsed = JSON.parse(sess);
          if (parsed && (parsed.hoVaTen || parsed.email)) {
            return {
              id: "usr_session",
              displayName: parsed.hoVaTen || "Người dùng",
              identifier: parsed.email || "user@sportbooking.vn",
              phone: parsed.soDienThoai || "0909123456",
              avatar: (parsed.hoVaTen ? parsed.hoVaTen.charAt(0) : "U").toUpperCase(),
              passwordLogin: true
            };
          }
        }
      }
    } catch (e) {}
    return Storage.get("user", DEFAULT_USER);
  })(),
  favorites: new Set(Storage.get("favorites", ["ven_001", "ven_003"])),
  bookings: Storage.get("bookings", INITIAL_BOOKINGS),
  recentSearches: Storage.get("recentSearches", ["Pickleball Phú Nhuận", "Cầu lông", "Sân cỏ nhân tạo"]),

  saveUser(user) {
    this.user = user;
    Storage.set("user", user);
  },

  toggleFavorite(venueId) {
    if (this.favorites.has(venueId)) {
      this.favorites.delete(venueId);
    } else {
      this.favorites.add(venueId);
    }
    Storage.set("favorites", Array.from(this.favorites));
    return this.favorites.has(venueId);
  },

  isFavorite(venueId) {
    return this.favorites.has(venueId);
  },

  addBooking(booking) {
    this.bookings.unshift(booking);
    Storage.set("bookings", this.bookings);

    // Đồng bộ đơn đặt lên Backend API
    try {
      const apiBase = (window.location.origin && window.location.origin.includes('localhost'))
        ? window.location.origin + '/api'
        : 'http://localhost:8080/api';
      fetch(`${apiBase}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: this.user?.id || "TK003",
          courtId: booking.yardName || "S001",
          date: booking.dateString || new Date().toISOString().slice(0, 10),
          start: booking.startTime || "18:00",
          end: booking.endTime || "19:00"
        })
      }).then(r => r.ok ? r.json() : null).then(data => {
        if (data && data.orderId) {
          booking.backendOrderId = data.orderId;
        }
      }).catch(() => {});
    } catch (_) {}

    return booking;
  },

  updateBookingStatus(id, newStatus) {
    const bk = this.bookings.find(b => b.id === id);
    if (bk) {
      bk.status = newStatus;
      Storage.set("bookings", this.bookings);
    }
    return bk;
  },

  addRecentSearch(term) {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    this.recentSearches = [clean, ...this.recentSearches.filter(t => t.toLowerCase() !== clean.toLowerCase())].slice(0, 10);
    Storage.set("recentSearches", this.recentSearches);
  },

  clearRecentSearches() {
    this.recentSearches = [];
    Storage.set("recentSearches", []);
  },

  getSports() {
    return SPORTS_DATA;
  },

  getVenues(sportSlug = null, searchQuery = null, sort = "rating") {
    let list = [...VENUES_DATA];

    if (sportSlug && sportSlug !== "all") {
      list = list.filter(v => v.sports.some(s => s.slug === sportSlug));
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.address.toLowerCase().includes(q) ||
        v.sports.some(s => s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q))
      );
    }

    if (sort === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === "price") {
      list.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
    } else if (sort === "distance") {
      list.sort((a, b) => (a.distanceMeters || 999999) - (b.distanceMeters || 999999));
    }

    return list;
  },

  getVenueById(id) {
    return VENUES_DATA.find(v => v.id === id) || null;
  },

  // Generate Slots for a venue on a given date (14 days available)
  generateSlots(venue, dateObj) {
    const dateStr = dateObj.toISOString().split("T")[0];
    const isToday = new Date().toDateString() === dateObj.toDateString();
    const currentHour = new Date().getHours();

    const open = venue.openingHour || 6;
    const close = venue.closingHour || 23;
    const yards = venue.yards || [];

    // Deterministic pseudo-randomness based on date and yard
    const seedString = `${venue.id}_${dateStr}`;
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = (hash << 5) - hash + seedString.charCodeAt(i);
      hash |= 0;
    }

    const yardSlots = yards.map((yard, yIndex) => {
      const slots = [];
      for (let h = open; h < close; h++) {
        // Pseudo check if slot is booked
        const slotSeed = Math.abs((hash + yIndex * 17 + h * 31) % 100);
        const isPast = isToday && h <= currentHour;
        const isBooked = isPast || (slotSeed < 38); // ~38% slots booked for realistic feel

        // Price can be higher during peak hours (17-21)
        const isPeak = h >= 17 && h < 21;
        const price = yard.hourlyPrice * (isPeak ? 1.25 : 1.0);

        slots.push({
          yardId: yard.id,
          yardName: yard.name,
          hour: h,
          startHour: `${h < 10 ? '0' : ''}${h}:00`,
          endHour: `${h + 1 < 10 ? '0' : ''}${h + 1}:00`,
          price: Math.round(price / 10000) * 10000,
          available: !isBooked
        });
      }
      return {
        yard,
        slots
      };
    });

    return yardSlots;
  }
};
