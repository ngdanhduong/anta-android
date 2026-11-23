(() => {
  'use strict';
  const KEY = 'sportbooking-demo-v1';
  const page = document.body.dataset.page || 'schedule';
  const ownerId = 'CS001';

  // =========================================================================
  // KIỂM TRA PHÂN QUYỀN ĐĂNG NHẬP (ROLE-BASED ACCESS CONTROL - RBAC)
  // =========================================================================
  let currentUser = null;
  try {
    currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
  } catch (_) {}

  const isAdminSection = page === 'admin' || page === 'accounts';

  // 1. Tự động cấp quyền Demo nếu truy cập trực tiếp để trải nghiệm ngay giao diện
  if (!currentUser || !currentUser.vaiTro || currentUser.vaiTro === 'Khách hàng') {
    if (isAdminSection) {
      currentUser = { id: 'TK001', hoVaTen: 'Quản trị viên', email: 'admin', vaiTro: 'Admin' };
    } else {
      currentUser = { id: 'TK002', hoVaTen: 'Nguyễn Hoàng Anh', email: 'chusan@gmail.com', vaiTro: 'Chủ sân' };
    }
    try { sessionStorage.setItem('currentUser', JSON.stringify(currentUser)); } catch (_) {}
  } else {
    // Tự động đồng bộ vai trò khi chuyển đổi giữa cổng Admin và Chủ sân
    if (currentUser.vaiTro === 'Admin' && !isAdminSection) {
      currentUser = { id: 'TK002', hoVaTen: 'Nguyễn Hoàng Anh', email: 'chusan@gmail.com', vaiTro: 'Chủ sân' };
      try { sessionStorage.setItem('currentUser', JSON.stringify(currentUser)); } catch (_) {}
    } else if (currentUser.vaiTro === 'Chủ sân' && isAdminSection) {
      currentUser = { id: 'TK001', hoVaTen: 'Quản trị viên', email: 'admin', vaiTro: 'Admin' };
      try { sessionStorage.setItem('currentUser', JSON.stringify(currentUser)); } catch (_) {}
    }
  }

  const $ = (selector) => document.querySelector(selector);
  const pad = (n) => String(n).padStart(2, '0');
  const localISO = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const dateOffset = (n) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n); return localISO(d); };
  const today = dateOffset(0);
  const money = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + ' ₫';
  const shortDate = (s) => s ? `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}` : '—';
  const stamp = (s) => s ? new Date(s).toLocaleString('vi-VN', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—';
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (x) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));

  const seed = () => ({
    courts: [
      {id:'S001',name:'Sân bóng đá 7 người A',facility:'Cơ sở Thảo Điền',address:'32 Quốc Hương, TP. Thủ Đức',type:'Bóng đá 7 người',price:520000,open:'06:00',close:'22:00',operational:'Đang hoạt động',visible:true,ownerId:'CS001',owner:'Nguyễn Hoàng Anh',description:'Sân cỏ nhân tạo đạt chuẩn FIFA, hệ thống đèn chiếu sáng hiện đại, bãi đỗ xe rộng rãi.',image:'san_cg_1.jpg'},
      {id:'S002',name:'Sân cầu lông B2',facility:'Cơ sở Thảo Điền',address:'32 Quốc Hương, TP. Thủ Đức',type:'Cầu lông',price:150000,open:'06:00',close:'22:00',operational:'Đang hoạt động',visible:true,ownerId:'CS001',owner:'Nguyễn Hoàng Anh',description:'Sân thảm tiêu chuẩn thi đấu, chống trơn trượt, điều hòa mát mẻ.',image:'san_cl_md.jpg'},
      {id:'S003',name:'Sân bóng rổ C1',facility:'Cơ sở Phú Nhuận',address:'18 Hoa Sứ, Phú Nhuận',type:'Bóng rổ',price:260000,open:'06:00',close:'22:00',operational:'Đang hoạt động',visible:true,ownerId:'CS001',owner:'Nguyễn Hoàng Anh',description:'Sân trong nhà sàn gỗ chất lượng cao, bảng kính cường lực tiêu chuẩn NBA.',image:'san_br_1.jpg'},
      {id:'S004',name:'Sân bóng đá 5 người D1',facility:'Cơ sở Bình Thạnh',address:'45 Điện Biên Phủ, Bình Thạnh',type:'Bóng đá 5 người',price:340000,open:'06:00',close:'22:00',operational:'Đang hoạt động',visible:false,ownerId:'CS002',owner:'Lê Quốc Bảo',description:'Sân cỏ mới thay, phục vụ nước uống và tủ đồ miễn phí.',image:'san_bd_5.jpg'}
    ],
    accounts: [
      {id:'TK001',name:'Quản trị viên',email:'admin@sportbooking.vn',phone:'0901234567',role:'Admin',status:'Hoạt động'},
      {id:'TK002',name:'Nguyễn Hoàng Anh',email:'chusan@gmail.com',phone:'0912345678',role:'Chủ sân',status:'Hoạt động'},
      {id:'TK003',name:'Trần Văn Khách',email:'khachhang1@gmail.com',phone:'0923456789',role:'Khách hàng',status:'Hoạt động'},
      {id:'TK004',name:'Lê Thị Hoa',email:'khachhang2@gmail.com',phone:'0934567890',role:'Khách hàng',status:'Hoạt động'},
      {id:'TK005',name:'Phạm Gia Minh',email:'giaminh@gmail.com',phone:'0988112233',role:'Khách hàng',status:'Hoạt động'}
    ],
    bookings: [
      {id:'D001',account:'TK003',customer:'Trần Văn Khách',courtId:'S001',date:today,start:'18:00',end:'19:00',rent:520000,service:0,deposit:100000,status:'Chờ xử lý',reason:'',created:today},
      {id:'D002',account:'TK004',customer:'Lê Thị Hoa',courtId:'S001',date:today,start:'19:00',end:'20:00',rent:520000,service:40000,deposit:200000,status:'Đã xác nhận',reason:'',created:today},
      {id:'D003',account:'TK005',customer:'Phạm Gia Minh',courtId:'S002',date:today,start:'17:00',end:'18:00',rent:150000,service:0,deposit:0,status:'Đã xác nhận',reason:'',created:today},
      {id:'D004',account:'TK003',customer:'Trần Văn Khách',courtId:'S003',date:dateOffset(-1),start:'18:00',end:'19:00',rent:260000,service:0,deposit:100000,status:'Đã hủy',reason:'Khách thay đổi kế hoạch',created:dateOffset(-2)},
      {id:'D005',account:'TK004',customer:'Lê Thị Hoa',courtId:'S003',date:dateOffset(-1),start:'19:00',end:'20:00',rent:260000,service:0,deposit:0,status:'Hoàn thành',reason:'',created:dateOffset(-3)},
      {id:'D006',account:'TK005',customer:'Phạm Gia Minh',courtId:'S004',date:today,start:'16:00',end:'17:00',rent:340000,service:0,deposit:0,status:'Đã xác nhận',reason:'',created:dateOffset(-1)}
    ],
    transactions: [
      {id:'G001',bookingId:'D001',type:'Thu tiền',amount:100000,method:'Chuyển khoản',date:today,by:'Nguyễn Hoàng Anh'},
      {id:'G002',bookingId:'D002',type:'Thu tiền',amount:200000,method:'Chuyển khoản',date:today,by:'Nguyễn Hoàng Anh'},
      {id:'G003',bookingId:'D003',type:'Thu tiền',amount:150000,method:'Tiền mặt',date:today,by:'Nguyễn Hoàng Anh'},
      {id:'G004',bookingId:'D004',type:'Thu tiền',amount:100000,method:'Chuyển khoản',date:dateOffset(-1),by:'Nguyễn Hoàng Anh'},
      {id:'G005',bookingId:'D005',type:'Thu tiền',amount:260000,method:'Tiền mặt',date:dateOffset(-1),by:'Nguyễn Hoàng Anh'}
    ],
    history: [{courtId:'S004',action:'Ẩn sân',reason:'Kiểm tra thông tin niêm yết',date:dateOffset(-1),by:'Quản trị viên'}]
  });

  const load = () => { 
    try { 
      const raw = JSON.parse(localStorage.getItem(KEY)); 
      if (raw && Array.isArray(raw.courts) && Array.isArray(raw.bookings) && Array.isArray(raw.transactions)) {
        if (!Array.isArray(raw.accounts)) raw.accounts = seed().accounts;
        return raw; 
      }
    } catch (_) {} 
    return seed(); 
  };

  const API_BASE = (window.location.origin && window.location.origin.includes('localhost'))
    ? window.location.origin + '/api'
    : 'http://localhost:8080/api';

  let state = load();
  if (!localStorage.getItem(KEY)) localStorage.setItem(KEY, JSON.stringify(state));

  async function syncFromBackend() {
    try {
      const [resCourts, resUsers] = await Promise.all([
        fetch(`${API_BASE}/owner/courts`).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(`${API_BASE}/admin/users`).then(r => r.ok ? r.json() : null).catch(() => null)
      ]);
      let changed = false;
      if (resCourts && Array.isArray(resCourts)) {
        resCourts.forEach(c => {
          const idx = state.courts.findIndex(sc => sc.id === c.id);
          if (idx >= 0) {
            state.courts[idx] = { ...state.courts[idx], ...c };
          } else {
            state.courts.push(c);
            changed = true;
          }
        });
      }
      if (resUsers && Array.isArray(resUsers)) {
        resUsers.forEach(u => {
          const idx = state.accounts.findIndex(sa => sa.id === u.id);
          if (idx >= 0) {
            state.accounts[idx] = { ...state.accounts[idx], ...u };
          } else {
            state.accounts.push(u);
            changed = true;
          }
        });
      }
      if (changed) {
        save();
        render();
      }
    } catch (_) {}
  }

  const ui = {
    scheduleDate: today,
    scheduleCourt: 'all',
    paymentTab: 'orders',
    paymentSearch: '',
    reportFrom: dateOffset(-6),
    reportTo: today,
    reportCourt: 'all',
    adminTab: 'courts',
    adminSearch: '',
    adminFacility: 'all',
    adminStatus: 'all',
    adminFrom: dateOffset(-7),
    adminTo: dateOffset(7),
    accountSearch: '',
    accountRole: 'all',
    courtSearch: ''
  };

  const save = () => localStorage.setItem(KEY, JSON.stringify(state));
  const court = (id) => state.courts.find(c => c.id === id);
  const booking = (id) => state.bookings.find(b => b.id === id);
  const account = (id) => state.accounts.find(a => a.id === id);
  const ownerCourts = () => state.courts.filter(c => c.ownerId === ownerId);
  const ownerBookings = () => state.bookings.filter(b => court(b.courtId)?.ownerId === ownerId);
  const total = (b) => b.rent + b.service;
  const paid = (b) => state.transactions.filter(t => t.bookingId === b.id && t.type === 'Thu tiền').reduce((n,t) => n + t.amount,0);
  const refunded = (b) => state.transactions.filter(t => t.bookingId === b.id && t.type === 'Hoàn tiền').reduce((n,t) => n + t.amount,0);
  const due = (b) => Math.max(0,total(b) - paid(b));
  const refundable = (b) => Math.max(0,paid(b) - refunded(b));
  const paymentStatus = (b) => b.status === 'Đã hủy' ? (refundable(b) ? 'Chờ hoàn tiền' : refunded(b) ? 'Đã hoàn tiền' : 'Không cần hoàn tiền') : due(b) === 0 ? 'Đã thanh toán' : paid(b) ? 'Thanh toán một phần' : 'Chưa thanh toán';
  const statusClass = (s) => ({'Chờ xử lý':'wait','Đã xác nhận':'good','Đã nhận sân':'blue','Hoàn thành':'good','Không đến':'muted','Đã hủy':'bad','Đã từ chối':'bad','Đã thanh toán':'good','Thanh toán một phần':'blue','Chưa thanh toán':'wait','Chờ hoàn tiền':'wait','Đã hoàn tiền':'muted','Đang hoạt động':'good','Tạm ngưng':'bad','Hoạt động':'good','Khóa':'bad','Đang hiển thị':'good','Đang ẩn':'bad'}[s] || 'muted');
  const pill = (s) => `<span class="pill ${statusClass(s)}">${esc(s)}</span>`;
  const timeN = (s) => Number(s.slice(0,2)) * 60 + Number(s.slice(3,5));
  const duration = (b) => (timeN(b.end) - timeN(b.start)) / 60;
  
  const available = (courtId,date,start,end,exceptId='') => {
    const c = court(courtId);
    if (!c) return 'Vui lòng chọn sân hợp lệ.';
    if (!date || !start || !end || timeN(start) >= timeN(end)) return 'Giờ kết thúc phải sau giờ bắt đầu.';
    if (timeN(start) < timeN(c.open) || timeN(end) > timeN(c.close)) return `Giờ đặt phải nằm trong giờ hoạt động ${c.open}–${c.close}.`;
    const conflict = state.bookings.some(b => b.id !== exceptId && b.courtId === courtId && b.date === date && !['Đã hủy','Đã từ chối'].includes(b.status) && timeN(start) < timeN(b.end) && timeN(end) > timeN(b.start));
    return conflict ? 'Khung giờ này trùng với một đơn còn hiệu lực. Vui lòng chọn thời gian khác.' : '';
  };

  // THANH ĐIỀU HƯỚNG SIDEBAR THEO VAI TRÒ (RBAC NAVIGATION)
  const nav = isAdminSection 
    ? `<div class="side-label">Quản trị hệ thống</div>
       <nav>
         <a class="nav-link ${page==='accounts'?'active':''}" href="quan-ly-tai-khoan.html"><span class="nav-icon">👥</span>Quản lý tài khoản</a>
         <a class="nav-link ${page==='admin'?'active':''}" href="giam-sat.html"><span class="nav-icon">◉</span>Giám sát toàn hệ thống</a>
       </nav>
       <div class="side-label">Chuyển vai trò</div>
       <nav>
         <a class="nav-link" href="quan-ly-san.html"><span class="nav-icon">🏸</span>Kênh Chủ sân</a>
         <a class="nav-link" href="../index.html"><span class="nav-icon">🏠</span>Trang chủ Khách hàng</a>
       </nav>
       <div class="side-label">Tài khoản</div>
       <nav>
         <a class="nav-link" href="#" id="btnLogoutAction"><span class="nav-icon">🚪</span>Đăng xuất</a>
       </nav>`
    : `<div class="side-label">Quản lý cơ sở</div>
       <nav>
         <a class="nav-link ${page==='courts'?'active':''}" href="quan-ly-san.html"><span class="nav-icon">⛳</span>Quản lý sân</a>
         <a class="nav-link ${page==='schedule'?'active':''}" href="index.html"><span class="nav-icon">▦</span>Lịch và đơn đặt</a>
         <a class="nav-link ${page==='payments'?'active':''}" href="thanh-toan-bao-cao.html"><span class="nav-icon">◫</span>Thanh toán và báo cáo</a>
       </nav>
       <div class="side-label">Chuyển vai trò</div>
       <nav>
         <a class="nav-link" href="quan-ly-tai-khoan.html"><span class="nav-icon">🛡️</span>Cổng Quản trị Admin</a>
         <a class="nav-link" href="../index.html"><span class="nav-icon">🏠</span>Trang chủ Khách hàng</a>
       </nav>
       <div class="side-label">Tài khoản</div>
       <nav>
         <a class="nav-link" href="#" id="btnLogoutAction"><span class="nav-icon">🚪</span>Đăng xuất</a>
       </nav>`;

  const pageTitleMap = {
    courts: 'Quản lý sân thể thao',
    schedule: 'Quản lý lịch và đơn đặt',
    payments: 'Thanh toán và báo cáo',
    accounts: 'Quản lý tài khoản',
    admin: 'Giám sát sân và đơn đặt'
  };

  const displayName = (currentUser && currentUser.hoVaTen) || (isAdminSection ? 'Quản trị viên' : 'Chủ sân');
  const displayRole = (currentUser && currentUser.vaiTro) || (isAdminSection ? 'Admin' : 'Chủ sân');
  const displaySub = isAdminSection ? 'Toàn hệ thống' : 'Chủ sân · CS001';
  const avatarText = isAdminSection ? 'QT' : (displayName ? displayName.trim().charAt(0).toUpperCase() : 'CS');

  $('#app').innerHTML = `
    <div class="shell ${isAdminSection ? 'admin' : ''}">
      <aside class="sidebar">
        <div class="brand">
          <span class="brand-mark" aria-hidden="true"></span>
          <div>sportbooking<span>QUẢN LÝ SÂN THỂ THAO</span></div>
        </div>
        ${nav}
        <div class="sidebar-footer">
          <div class="profile">
            <span class="avatar ${isAdminSection ? 'top-avatar' : ''}">${esc(avatarText)}</span>
            <span>${esc(displayName)}<small>${esc(displaySub)}</small></span>
          </div>
        </div>
      </aside>
      <div class="main">
        <header class="topbar">
          <div class="breadcrumb">SportBooking / <strong>${pageTitleMap[page] || 'Hệ thống'}</strong></div>
          <div class="top-right">
            <span><i class="live-dot"></i>Hệ thống đang hoạt động</span>
            <span class="avatar top-avatar">${esc(avatarText)}</span>
          </div>
        </header>
        <main class="content" id="pageContent"></main>
      </div>
    </div>
    <div id="overlay"></div>
    <div id="toastRegion" aria-live="polite"></div>
  `;

  // Gắn sự kiện Đăng xuất
  const btnLogout = document.getElementById('btnLogoutAction');
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
        sessionStorage.removeItem('currentUser');
        window.location.replace('../login.html');
      }
    });
  }

  let toastTimer;
  function toast(message, error=false){
    const el = $('#toastRegion');
    el.innerHTML = `<div class="toast ${error?'error':''}">${esc(message)}</div>`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.innerHTML='', 3900);
  }

  function modal(title, subtitle, body, footer, wide=false){
    $('#overlay').innerHTML = `
      <div class="modal-backdrop" data-action="backdrop">
        <div class="modal ${wide?'wide':''}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
          <div class="modal-head">
            <div><h2>${esc(title)}</h2><p>${esc(subtitle)}</p></div>
            <button class="icon-btn" type="button" data-action="close-modal" aria-label="Đóng">×</button>
          </div>
          <div class="modal-body">${body}</div>
          <div class="modal-foot">${footer}</div>
        </div>
      </div>
    `;
    setTimeout(() => $('#overlay input:not([readonly]), #overlay select, #overlay button')?.focus(), 20);
  }

  const closeModal = () => $('#overlay').innerHTML = '';
  const field = (label, name, type='text', value='', extra='') => `<div class="field"><label for="f_${name}">${label}</label><input id="f_${name}" name="${name}" type="${type}" value="${esc(value)}" ${extra}></div>`;
  const select = (label, name, options, selected) => `<div class="field"><label for="f_${name}">${label}</label><select id="f_${name}" name="${name}">${options.map(([v,t]) => `<option value="${esc(v)}" ${v===selected?'selected':''}>${esc(t)}</option>`).join('')}</select></div>`;
  const courtOptions = (all=false) => [...(all?[['all','Tất cả sân']]:[]), ...ownerCourts().map(c=>[c.id, `${c.id} · ${c.name}`])];
  const actionFooter = (label, formName, blue=false) => `<button class="btn" type="button" data-action="close-modal">Hủy bỏ</button><button class="btn ${blue?'btn-blue':'btn-primary'}" type="submit" form="${formName}">${label}</button>`;

  // =========================================================================
  // BỘ ĐIỀU HƯỚNG TRANG (ROUTER)
  // =========================================================================
  function render(){
    if (page === 'courts') renderCourts();
    else if (page === 'schedule') renderSchedule();
    else if (page === 'payments') renderPayments();
    else if (page === 'accounts') renderAccounts();
    else if (page === 'admin') renderAdmin();
  }

  // =========================================================================
  // QUẢN LÝ SÂN THỂ THAO (Chủ sân)
  // =========================================================================
  function renderCourts(){
    const list = ownerCourts().filter(c => (c.id + ' ' + c.name + ' ' + c.type + ' ' + c.address).toLowerCase().includes(ui.courtSearch.toLowerCase()));
    $('#pageContent').innerHTML = `
      <div class="page-head">
        <div>
          <div class="eyebrow">Quản lý cơ sở</div>
          <h1>Quản lý sân thể thao</h1>
          <p>Xem, thêm, sửa, xóa thông tin các sân thuộc quyền quản lý của bạn.</p>
        </div>
        <div class="head-actions">
          <button class="btn btn-primary" data-action="new-court">＋ Thêm sân mới</button>
          <button class="btn" data-action="reset-demo">Đặt lại dữ liệu mẫu</button>
        </div>
      </div>

      <div class="stats">
        <div class="stat"><span>Sân thuộc quản lý</span><strong>${ownerCourts().length}</strong><small>Tổng số sân</small></div>
        <div class="stat blue-bg"><span>Đang hoạt động</span><strong>${ownerCourts().filter(c => c.operational==='Đang hoạt động').length}</strong><small>Sẵn sàng cho thuê</small></div>
        <div class="stat"><span>Đang hiển thị</span><strong>${ownerCourts().filter(c => c.visible).length}</strong><small>Khách hàng tìm thấy</small></div>
        <div class="stat"><span>Giá thuê bình quân</span><strong>${money(Math.round(ownerCourts().reduce((s,c)=>s+c.price,0)/(ownerCourts().length||1)))}</strong><small>Mỗi giờ sử dụng</small></div>
      </div>

      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Danh sách sân thuộc quyền quản lý</h2>
            <p>Chọn sân để xem chi tiết, chỉnh sửa hoặc xóa.</p>
          </div>
          <div class="filters">
            <input id="courtSearch" class="search" style="max-width:280px" type="search" value="${esc(ui.courtSearch)}" placeholder="Tìm theo mã, tên sân, loại sân...">
          </div>
        </div>

        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Mã sân</th>
                <th>Tên sân</th>
                <th>Cơ sở</th>
                <th>Giờ hoạt động</th>
                <th>Giá thuê / giờ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(c => `
                <tr>
                  <td><strong class="mono">${c.id}</strong></td>
                  <td><strong>${esc(c.name)}</strong><small>${esc(c.address)}</small></td>
                  <td>${esc(c.facility)}</td>
                  <td>${c.open} – ${c.close}</td>
                  <td class="money">${money(c.price)}</td>
                  <td>${pill(c.operational)}</td>
                  <td>
                    <div style="display:flex;gap:5px">
                      <button class="btn btn-sm" data-action="open-court-detail" data-id="${c.id}">Chi tiết</button>
                      <button class="btn btn-sm" data-action="edit-court" data-id="${c.id}">Sửa</button>
                      <button class="btn btn-sm btn-danger" data-action="delete-court" data-id="${c.id}">Xóa</button>
                    </div>
                  </td>
                </tr>
              `).join('') || `<tr><td colspan="7" class="empty">Không tìm thấy sân nào.</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function openCourtDetail(id){
    const c = court(id);
    if (!c) return;
    modal(`Chi tiết sân ${c.id}`, esc(c.name), `
      <div class="detail-title">Thông tin sân</div>
      <div class="kv"><span>Mã sân</span><strong class="mono">${c.id}</strong></div>
      <div class="kv"><span>Tên sân</span><strong>${esc(c.name)}</strong></div>
      <div class="kv"><span>Địa chỉ</span><strong>${esc(c.address)}</strong></div>
      <div class="kv"><span>Loại sân</span><strong>${esc(c.type)}</strong></div>
      <div class="kv"><span>Giá thuê</span><strong class="money">${money(c.price)} / giờ</strong></div>
      <div class="kv"><span>Giờ hoạt động</span><strong>${c.open} – ${c.close}</strong></div>
      <div class="kv"><span>Cơ sở</span><strong>${esc(c.facility)}</strong></div>
      <div class="kv"><span>Mô tả</span><strong>${esc(c.description || 'Chưa có mô tả chi tiết')}</strong></div>
      <div class="kv"><span>Trạng thái hoạt động</span><strong>${pill(c.operational)}</strong></div>
      <div class="kv"><span>Hiển thị trên web</span><strong>${pill(c.visible ? 'Đang hiển thị' : 'Đang ẩn')}</strong></div>
    `, `<button class="btn" data-action="close-modal">Đóng</button>`, true);
  }

  function newCourtModal(){
    const nextId = 'S' + String(state.courts.reduce((n,c) => Math.max(n, Number(c.id.slice(1)) || 0), 0) + 1).padStart(3, '0');
    modal('Thêm sân mới', 'Nhập đầy đủ thông tin để tạo sân thể thao mới.', `
      <form id="courtForm" data-form="create-court" class="form-grid">
        ${field('Mã sân', 'id', 'text', nextId, 'required')}
        ${field('Tên sân', 'name', 'text', '', 'required placeholder="VD: Sân bóng đá 7 người A"')}
        ${field('Địa chỉ', 'address', 'text', '32 Quốc Hương, TP. Thủ Đức', 'required placeholder="Nhập địa chỉ sân"')}
        ${field('Loại sân', 'type', 'text', 'Bóng đá', 'required placeholder="VD: Bóng đá, Cầu lông, Pickleball"')}
        ${field('Giá thuê / giờ (VNĐ)', 'price', 'number', '300000', 'required min="10000" step="10000"')}
        ${field('Cơ sở', 'facility', 'text', 'Cơ sở Thảo Điền', 'required')}
        ${field('Giờ mở cửa', 'open', 'time', '06:00', 'required')}
        ${field('Giờ đóng cửa', 'close', 'time', '22:00', 'required')}
        ${select('Trạng thái hoạt động', 'operational', [['Đang hoạt động','Đang hoạt động'],['Tạm ngưng','Tạm ngưng']], 'Đang hoạt động')}
        <div class="field full">
          <label for="f_description">Mô tả và dịch vụ</label>
          <textarea id="f_description" name="description" placeholder="Thông tin mặt cỏ, đèn chiếu sáng, tiện ích..."></textarea>
        </div>
      </form>
    `, actionFooter('Lưu sân mới', 'courtForm'), true);
  }

  function editCourtModal(id){
    const c = court(id);
    if (!c) return;
    modal(`Sửa thông tin sân ${c.id}`, esc(c.name), `
      <form id="courtEditForm" data-form="edit-court" class="form-grid">
        <input type="hidden" name="id" value="${c.id}">
        <div class="field">
          <label>Mã sân</label>
          <input type="text" value="${c.id}" readonly style="background:#f5f8f8">
        </div>
        ${field('Tên sân', 'name', 'text', c.name, 'required')}
        ${field('Địa chỉ', 'address', 'text', c.address, 'required')}
        ${field('Loại sân', 'type', 'text', c.type, 'required')}
        ${field('Giá thuê / giờ (VNĐ)', 'price', 'number', c.price, 'required min="10000" step="10000"')}
        ${field('Cơ sở', 'facility', 'text', c.facility, 'required')}
        ${field('Giờ mở cửa', 'open', 'time', c.open, 'required')}
        ${field('Giờ đóng cửa', 'close', 'time', c.close, 'required')}
        ${select('Trạng thái hoạt động', 'operational', [['Đang hoạt động','Đang hoạt động'],['Tạm ngưng','Tạm ngưng']], c.operational)}
        <div class="field full">
          <label for="f_description">Mô tả</label>
          <textarea id="f_description" name="description">${esc(c.description || '')}</textarea>
        </div>
      </form>
    `, actionFooter('Lưu cập nhật', 'courtEditForm'), true);
  }

  function deleteCourtModal(id){
    const c = court(id);
    if (!c) return;
    modal('Xác nhận xóa sân', `Bạn có chắc chắn muốn xóa sân ${c.id} – ${esc(c.name)}?`, `
      <form id="deleteCourtForm" data-form="delete-court">
        <input type="hidden" name="id" value="${c.id}">
        <div class="notice error">
          <strong>Cảnh báo:</strong> Thao tác này sẽ xóa sân khỏi hệ thống. Nếu sân đang có đơn đặt trong tương lai, bạn nên hủy hoặc chuyển lịch trước khi xóa.
        </div>
      </form>
    `, `<button class="btn" type="button" data-action="close-modal">Hủy</button><button class="btn btn-danger" type="submit" form="deleteCourtForm">Xác nhận xóa</button>`);
  }

  // =========================================================================
  // QUẢN LÝ TÀI KHOẢN (Quản trị viên)
  // =========================================================================
  function renderAccounts(){
    const term = ui.accountSearch.toLowerCase();
    const list = state.accounts.filter(a => {
      const matchRole = ui.accountRole === 'all' || a.role === ui.accountRole;
      const matchText = (a.id + ' ' + a.name + ' ' + a.email + ' ' + a.phone + ' ' + a.role).toLowerCase().includes(term);
      return matchRole && matchText;
    });

    $('#pageContent').innerHTML = `
      <div class="page-head">
        <div>
          <div class="eyebrow">Quản trị hệ thống</div>
          <h1>Quản lý tài khoản</h1>
          <p>Xem, tìm kiếm, cấp quyền và xóa tài khoản khách hàng, chủ sân trên toàn hệ thống.</p>
        </div>
        <div class="head-actions">
          <button class="btn btn-primary" data-action="new-account">＋ Thêm tài khoản</button>
          <button class="btn" data-action="reset-demo">Đặt lại dữ liệu mẫu</button>
        </div>
      </div>

      <div class="stats">
        <div class="stat"><span>Tổng tài khoản</span><strong>${state.accounts.length}</strong><small>Người dùng hệ thống</small></div>
        <div class="stat blue-bg"><span>Chủ sân</span><strong>${state.accounts.filter(a=>a.role==='Chủ sân').length}</strong><small>Quản lý cơ sở</small></div>
        <div class="stat"><span>Khách hàng</span><strong>${state.accounts.filter(a=>a.role==='Khách hàng').length}</strong><small>Người đặt sân</small></div>
        <div class="stat"><span>Quản trị viên</span><strong>${state.accounts.filter(a=>a.role==='Admin').length}</strong><small>Toàn quyền</small></div>
      </div>

      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Kết quả tra cứu tài khoản</h2>
            <p>Tìm theo mã tài khoản, họ và tên, email hoặc số điện thoại.</p>
          </div>
          <div class="filters">
            <input id="accountSearch" class="search" style="max-width:280px" type="search" value="${esc(ui.accountSearch)}" placeholder="Mã TK, họ tên, email, SĐT...">
            <select id="accountRole" style="max-width:160px">
              <option value="all">Tất cả vai trò</option>
              <option value="Chủ sân" ${ui.accountRole==='Chủ sân'?'selected':''}>Chủ sân</option>
              <option value="Khách hàng" ${ui.accountRole==='Khách hàng'?'selected':''}>Khách hàng</option>
              <option value="Admin" ${ui.accountRole==='Admin'?'selected':''}>Quản trị viên</option>
            </select>
          </div>
        </div>

        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(a => `
                <tr>
                  <td><strong class="mono">${a.id}</strong></td>
                  <td><strong>${esc(a.name)}</strong></td>
                  <td>${esc(a.email)}</td>
                  <td>${esc(a.phone)}</td>
                  <td><span class="pill ${a.role==='Admin'?'bad':a.role==='Chủ sân'?'blue':'good'}">${a.role}</span></td>
                  <td>${pill(a.status || 'Hoạt động')}</td>
                  <td>
                    <div style="display:flex;gap:5px">
                      <button class="btn btn-sm" data-action="open-account-detail" data-id="${a.id}">Chi tiết</button>
                      ${a.role !== 'Admin' ? `<button class="btn btn-sm btn-danger" data-action="delete-account" data-id="${a.id}">Xóa</button>` : ''}
                    </div>
                  </td>
                </tr>
              `).join('') || `<tr><td colspan="7" class="empty">Không tìm thấy tài khoản phù hợp!</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function openAccountDetail(id){
    const a = account(id);
    if (!a) return;
    modal(`Chi tiết tài khoản ${a.id}`, a.name, `
      <div class="detail-title">Thông tin tài khoản</div>
      <div class="kv"><span>Mã tài khoản</span><strong class="mono">${a.id}</strong></div>
      <div class="kv"><span>Họ và tên đầy đủ</span><strong>${esc(a.name)}</strong></div>
      <div class="kv"><span>Địa chỉ Email</span><strong>${esc(a.email)}</strong></div>
      <div class="kv"><span>Số điện thoại</span><strong>${esc(a.phone)}</strong></div>
      <div class="kv"><span>Vai trò tài khoản</span><strong><span class="pill ${a.role==='Admin'?'bad':a.role==='Chủ sân'?'blue':'good'}">${a.role}</span></strong></div>
      <div class="kv"><span>Trạng thái tài khoản</span><strong>${pill(a.status || 'Hoạt động')}</strong></div>
    `, `<button class="btn" data-action="close-modal">Đóng</button>`);
  }

  function newAccountModal(){
    const nextId = 'TK' + String(state.accounts.reduce((n,a) => Math.max(n, Number(a.id.slice(2)) || 0), 0) + 1).padStart(3, '0');
    modal('Thêm tài khoản mới', 'Nhập thông tin tài khoản cần cấp mới trên hệ thống.', `
      <form id="accountForm" data-form="create-account" class="form-grid">
        ${field('Mã tài khoản', 'id', 'text', nextId, 'required readonly style="background:#f5f8f8"')}
        ${field('Họ và tên đầy đủ', 'name', 'text', '', 'required placeholder="VD: Nguyễn Minh Anh"')}
        ${field('Địa chỉ Email', 'email', 'email', '', 'required placeholder="VD: minhanh@gmail.com"')}
        ${field('Số điện thoại', 'phone', 'tel', '', 'required placeholder="VD: 0912345678"')}
        ${field('Mật khẩu ban đầu', 'password', 'password', '12345678', 'required minlength="8"')}
        ${select('Vai trò tài khoản', 'role', [['Chủ sân','Chủ sân'],['Khách hàng','Khách hàng'],['Admin','Quản trị viên']], 'Chủ sân')}
        <div class="full notice">Quản trị viên cung cấp thông tin đăng nhập ban đầu cho người dùng theo phương thức an toàn.</div>
      </form>
    `, actionFooter('Thêm tài khoản', 'accountForm'));
  }

  function deleteAccountModal(id){
    const a = account(id);
    if (!a) return;
    modal('Xác nhận xóa tài khoản', `Bạn có chắc chắn muốn xóa tài khoản ${a.id} – ${esc(a.name)}?`, `
      <form id="deleteAccountForm" data-form="delete-account">
        <input type="hidden" name="id" value="${a.id}">
        <div class="notice error">
          <strong>Lưu ý:</strong> Tài khoản này sẽ bị xóa khỏi bảng TAIKHOAN và không thể khôi phục lại.
        </div>
      </form>
    `, `<button class="btn" type="button" data-action="close-modal">Hủy</button><button class="btn btn-danger" type="submit" form="deleteAccountForm">Xác nhận xóa</button>`);
  }

  // =========================================================================
  // QUẢN LÝ LỊCH VÀ ĐƠN ĐẶT (Chủ sân)
  // =========================================================================
  function renderSchedule(){
    const list = ownerBookings().filter(b => b.date === ui.scheduleDate && (ui.scheduleCourt === 'all' || b.courtId === ui.scheduleCourt)).sort((a,b) => a.start.localeCompare(b.start));
    const effective = list.filter(b => !['Đã hủy','Đã từ chối'].includes(b.status));
    const cats = ownerCourts().filter(c => ui.scheduleCourt === 'all' || c.id === ui.scheduleCourt);

    $('#pageContent').innerHTML = `
      <div class="page-head">
        <div>
          <div class="eyebrow">Điều hành cơ sở</div>
          <h1>Quản lý lịch và đơn đặt</h1>
          <p>Theo dõi lịch sân, tạo đơn trực tiếp, duyệt đơn, thay đổi giờ và hủy đơn.</p>
        </div>
        <div class="head-actions">
          <button class="btn btn-primary" data-action="new-booking">＋ Tạo đơn trực tiếp</button>
        </div>
      </div>
      <div class="stats">
        <div class="stat"><span>Đơn trong ngày</span><strong>${list.length}</strong><small>Trên ${cats.length} sân đang xem</small></div>
        <div class="stat"><span>Chờ xử lý</span><strong>${list.filter(b=>b.status==='Chờ xử lý').length}</strong><small>Cần xác nhận hoặc từ chối</small></div>
        <div class="stat blue-bg"><span>Đã xác nhận</span><strong>${list.filter(b=>b.status==='Đã xác nhận').length}</strong><small>Lịch đã được giữ chỗ</small></div>
        <div class="stat"><span>Giá trị đơn hiệu lực</span><strong>${money(effective.reduce((n,b)=>n+total(b),0))}</strong><small>Chưa trừ hoàn tiền</small></div>
      </div>
      <section class="panel">
        <div class="panel-head">
          <div><h2>Lịch sân theo ngày</h2><p>Chọn một khối trên lịch để xem chi tiết đơn.</p></div>
          <div class="legend">
            <span><i style="background:#e9aa41"></i>Chờ xử lý</span>
            <span><i style="background:#26ad73"></i>Đã xác nhận</span>
            <span><i style="background:#428ec2"></i>Đang sử dụng</span>
          </div>
        </div>
        <div class="filter-strip filters">
          <div class="field"><label for="scheduleDate">Ngày sử dụng</label><input type="date" id="scheduleDate" value="${ui.scheduleDate}"></div>
          <div class="field"><label for="scheduleCourt">Sân</label><select id="scheduleCourt">${courtOptions(true).map(([v,t])=>`<option value="${v}" ${ui.scheduleCourt===v?'selected':''}>${esc(t)}</option>`).join('')}</select></div>
        </div>
        <div class="court-list">
          ${cats.map(c => `
            <div class="court-row">
              <div class="court-name"><strong>${esc(c.name)}</strong><small>${esc(c.id)} · ${esc(c.facility)}</small></div>
              <div class="timeline" aria-label="Lịch ${esc(c.name)}">
                ${effective.filter(b=>b.courtId===c.id).map(b => {
                  const left = (timeN(b.start)-360)/960*100;
                  const width = (timeN(b.end)-timeN(b.start))/960*100;
                  return `<button class="slot ${statusClass(b.status)}" style="left:${left}%;width:${width}%" title="${esc(b.id)} · ${b.start}–${b.end} · ${esc(b.status)}" data-action="open-booking" data-id="${b.id}">${esc(b.id)}</button>`;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="time-axis"><span>06:00</span><span>10:00</span><span>14:00</span><span>18:00</span><span>22:00</span></div>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div><h2>Danh sách đơn đặt</h2><p>${shortDate(ui.scheduleDate)} · ${list.length} đơn phù hợp</p></div>
          <button class="btn btn-sm" data-action="reset-demo">Đặt lại dữ liệu mẫu</button>
        </div>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr><th>Mã đơn / khách hàng</th><th>Sân / địa chỉ</th><th>Ngày & giờ</th><th>Tổng tiền</th><th>Trạng thái</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              ${list.map(b => `
                <tr>
                  <td><strong class="mono">${b.id}</strong><small>${esc(b.account)} · ${esc(b.customer)}</small></td>
                  <td><strong>${esc(court(b.courtId)?.name)}</strong><small>${esc(court(b.courtId)?.address)}</small></td>
                  <td><strong>${shortDate(b.date)}</strong><small>${b.start}–${b.end}</small></td>
                  <td class="money">${money(total(b))}</td>
                  <td>${pill(b.status)}</td>
                  <td><button class="btn btn-sm" data-action="open-booking" data-id="${b.id}">Xem / xử lý</button></td>
                </tr>
              `).join('') || `<tr><td colspan="6" class="empty">Không có đơn đặt trong ngày và sân đã chọn.</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function openBooking(id){
    const b = booking(id);
    if (!b) return;
    const c = court(b.courtId);
    const actions = (page === 'schedule' || page === 'courts') ? `
      <div class="action-row">
        ${b.status==='Chờ xử lý' ? `<button class="btn btn-primary" data-action="confirm-booking" data-id="${id}">Xác nhận</button><button class="btn btn-danger" data-action="reject-booking" data-id="${id}">Từ chối</button>` : ''}
        ${!['Đã hủy','Đã từ chối','Hoàn thành','Không đến'].includes(b.status) ? `<button class="btn" data-action="reschedule" data-id="${id}">Thay đổi lịch</button><button class="btn btn-danger" data-action="cancel-booking" data-id="${id}">Hủy đơn</button>` : ''}
        ${['Đã xác nhận','Đã nhận sân'].includes(b.status) ? `<button class="btn btn-blue" data-action="usage-booking" data-id="${id}">Cập nhật sử dụng</button>` : ''}
      </div>
    ` : '';
    modal(`Đơn đặt ${id}`, `${esc(c?.name)} · ${shortDate(b.date)}`, `
      <div class="detail-title">Thông tin đơn đặt</div>
      <div class="kv"><span>Tài khoản khách hàng</span><strong>${esc(b.account)} · ${esc(b.customer)}</strong></div>
      <div class="kv"><span>Sân và cơ sở</span><strong>${esc(c?.name)} · ${esc(c?.facility)}</strong></div>
      <div class="kv"><span>Thời gian</span><strong>${shortDate(b.date)} · ${b.start}–${b.end}</strong></div>
      <div class="kv"><span>Tổng tiền</span><strong>${money(total(b))}</strong></div>
      <div class="kv"><span>Trạng thái đơn</span><strong>${pill(b.status)}</strong></div>
      <div class="kv"><span>Thanh toán</span><strong>${pill(paymentStatus(b))}</strong></div>
      ${b.reason ? `<div class="kv"><span>Lý do xử lý</span><strong>${esc(b.reason)}</strong></div>` : ''}
      ${actions}
    `, `<button class="btn" data-action="close-modal">Đóng</button>`, true);
  }

  function newBooking(){
    const opts = courtOptions();
    modal('Tạo đơn đặt trực tiếp', 'Nhập thông tin khách hàng và thời gian sử dụng sân.', `
      <form id="createForm" data-form="create" class="form-grid">
        ${field('Mã tài khoản khách hàng', 'account', 'text', 'TK003', 'required placeholder="VD: TK003"')}
        ${field('Họ tên khách hàng', 'customer', 'text', 'Trần Văn Khách', 'required placeholder="Nhập họ tên"')}
        ${select('Sân', 'courtId', opts, opts[0][0])}
        ${field('Ngày sử dụng', 'date', 'date', ui.scheduleDate, 'required')}
        ${field('Giờ bắt đầu', 'start', 'time', '18:00', 'required')}
        ${field('Giờ kết thúc', 'end', 'time', '19:00', 'required')}
        <div class="full notice">Hệ thống kiểm tra giờ hoạt động và đơn còn hiệu lực trước khi lưu. Đơn mới ở trạng thái Chờ xử lý.</div>
      </form>
    `, actionFooter('Lưu đơn', 'createForm'), true);
  }

  function reasonModal(action, id){
    const b = booking(id);
    const title = action === 'reject' ? 'Từ chối đơn đặt' : 'Hủy đơn đặt';
    modal(title, `${id} · ${esc(court(b.courtId)?.name)}`, `
      <form id="reasonForm" data-form="${action}" class="form-grid">
        <input type="hidden" name="id" value="${id}">
        <div class="field full">
          <label for="reason">Lý do ${action==='reject'?'từ chối':'hủy'}</label>
          <textarea id="reason" name="reason" required minlength="3" placeholder="Nhập lý do để ghi nhận vào đơn"></textarea>
        </div>
      </form>
    `, actionFooter(action==='reject'?'Xác nhận từ chối':'Xác nhận hủy', 'reasonForm'));
  }

  function freeSlots(courtId, date, exceptId){
    const c = court(courtId);
    if (!c) return '';
    const choices = [];
    for(let hour = timeN(c.open)/60; hour < timeN(c.close)/60; hour++){
      const start = `${pad(hour)}:00`, end = `${pad(hour+1)}:00`;
      if (!available(courtId, date, start, end, exceptId)){
        choices.push(`<button class="btn btn-sm" type="button" data-action="select-slot" data-start="${start}" data-end="${end}">${start}–${end}</button>`);
      }
    }
    return choices.join('') || '<span class="tiny">Không có khung giờ trống trong ngày này.</span>';
  }

  function reschedule(id){
    const b = booking(id);
    modal('Thay đổi sân hoặc thời gian', `${id} · ${esc(b.customer)}`, `
      <form id="rescheduleForm" data-form="reschedule" class="form-grid">
        <input type="hidden" name="id" value="${id}">
        ${select('Sân mới', 'courtId', courtOptions(), b.courtId)}
        ${field('Ngày sử dụng', 'date', 'date', b.date, 'required')}
        <div class="field full"><label>Gợi ý khung giờ còn trống</label><div class="slot-options" id="slotSuggestions">${freeSlots(b.courtId, b.date, id)}</div></div>
        ${field('Giờ bắt đầu', 'start', 'time', b.start, 'required')}
        ${field('Giờ kết thúc', 'end', 'time', b.end, 'required')}
      </form>
    `, actionFooter('Lưu thay đổi', 'rescheduleForm'), true);
  }

  function usage(id){
    modal('Cập nhật trạng thái sử dụng', `${id} · ${esc(booking(id)?.customer)}`, `
      <form id="usageForm" data-form="usage" class="form-grid">
        <input type="hidden" name="id" value="${id}">
        <div class="full">
          ${select('Trạng thái mới', 'status', booking(id)?.status==='Đã nhận sân' ? [['Hoàn thành','Hoàn thành'],['Không đến','Không đến']] : [['Đã nhận sân','Đã nhận sân'],['Hoàn thành','Hoàn thành'],['Không đến','Không đến']], 'Đã nhận sân')}
        </div>
      </form>
    `, actionFooter('Cập nhật', 'usageForm'));
  }

  // =========================================================================
  // THANH TOÁN VÀ BÁO CÁO (Chủ sân)
  // =========================================================================
  function renderPayments(){
    const list = ownerBookings().filter(b => (b.id + ' ' + b.customer + ' ' + court(b.courtId)?.name).toLowerCase().includes(ui.paymentSearch.toLowerCase())).sort((a,b)=>b.date.localeCompare(a.date));
    const tx = state.transactions.filter(t => ownerBookings().some(b => b.id === t.bookingId));
    const collected = tx.filter(t => t.type === 'Thu tiền').reduce((n,t) => n + t.amount, 0);
    const returned = tx.filter(t => t.type === 'Hoàn tiền').reduce((n,t) => n + t.amount, 0);

    $('#pageContent').innerHTML = `
      <div class="page-head">
        <div>
          <div class="eyebrow">Tài chính cơ sở</div>
          <h1>Thanh toán và báo cáo</h1>
          <p>Ghi nhận tiền thu, hoàn tiền cho đơn đã hủy và theo dõi kết quả kinh doanh.</p>
        </div>
        <div class="head-actions">
          <button class="btn" data-action="reset-demo">Đặt lại dữ liệu mẫu</button>
        </div>
      </div>
      <div class="stats">
        <div class="stat"><span>Tổng tiền đã thu</span><strong>${money(collected)}</strong><small>Tất cả giao dịch thu</small></div>
        <div class="stat blue-bg"><span>Đã hoàn tiền</span><strong>${money(returned)}</strong><small>Giao dịch hoàn</small></div>
        <div class="stat"><span>Còn phải thu</span><strong>${money(ownerBookings().filter(b=>!['Đã hủy','Đã từ chối'].includes(b.status)).reduce((n,b)=>n+due(b),0))}</strong><small>Đơn còn hiệu lực</small></div>
        <div class="stat"><span>Đơn đã hủy</span><strong>${ownerBookings().filter(b=>b.status==='Đã hủy').length}</strong><small>Có thể hoàn tiền</small></div>
      </div>
      <section class="panel">
        <div class="tabs">
          <button class="tab ${ui.paymentTab==='orders'?'active':''}" data-action="payment-tab" data-tab="orders">Danh sách thanh toán</button>
          <button class="tab ${ui.paymentTab==='report'?'active':''}" data-action="payment-tab" data-tab="report">Báo cáo doanh thu</button>
        </div>
        ${ui.paymentTab==='orders' ? `
          <div class="filter-strip filters">
            <div class="field" style="max-width:360px">
              <label for="paymentSearch">Tìm đơn đặt, khách hàng hoặc sân</label>
              <input id="paymentSearch" class="search" type="search" value="${esc(ui.paymentSearch)}" placeholder="VD: D001 hoặc tên khách hàng">
            </div>
          </div>
          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr><th>Đơn / khách hàng</th><th>Sân & thời gian</th><th>Tổng tiền</th><th>Đã thu</th><th>Còn phải thu</th><th>Thanh toán</th><th></th></tr>
              </thead>
              <tbody>
                ${list.map(b => `
                  <tr>
                    <td><strong class="mono">${b.id}</strong><small>${esc(b.customer)}</small></td>
                    <td><strong>${esc(court(b.courtId)?.name)}</strong><small>${shortDate(b.date)} · ${b.start}–${b.end}</small></td>
                    <td class="money">${money(total(b))}</td>
                    <td class="money">${money(paid(b))}</td>
                    <td class="money">${b.status==='Đã hủy'?'—':money(due(b))}</td>
                    <td>${pill(paymentStatus(b))}</td>
                    <td><button class="btn btn-sm" data-action="open-payment" data-id="${b.id}">Chi tiết</button></td>
                  </tr>
                `).join('') || `<tr><td colspan="7" class="empty">Không tìm thấy đơn phù hợp.</td></tr>`}
              </tbody>
            </table>
          </div>
        ` : reportHTML()}
      </section>
    `;
  }

  function openPayment(id){
    const b = booking(id);
    if (!b) return;
    const c = court(b.courtId);
    const active = !['Đã hủy','Đã từ chối'].includes(b.status);
    modal(`Thanh toán đơn ${id}`, `${esc(c.name)} · ${shortDate(b.date)}`, `
      <div class="detail-title">Chi tiết thanh toán</div>
      <div class="kv"><span>Khách hàng</span><strong>${esc(b.account)} · ${esc(b.customer)}</strong></div>
      <div class="kv"><span>Thời gian đặt</span><strong>${shortDate(b.date)} · ${b.start}–${b.end}</strong></div>
      <div class="kv"><span>Trạng thái đơn</span><strong>${pill(b.status)}</strong></div>
      <div class="summary-box">
        <div class="summary-line"><span>Tiền thuê sân</span><strong>${money(b.rent)}</strong></div>
        <div class="summary-line"><span>Phí dịch vụ</span><strong>${money(b.service)}</strong></div>
        <div class="summary-line"><span>Tiền cọc dự kiến</span><strong>${money(b.deposit)}</strong></div>
        <div class="summary-line"><span>Đã thanh toán</span><strong>${money(paid(b))}</strong></div>
        <div class="summary-line"><span>Đã hoàn</span><strong>${money(refunded(b))}</strong></div>
        <div class="summary-line total"><span>${b.status==='Đã hủy'?'Còn có thể hoàn':'Còn phải thu'}</span><strong>${money(b.status==='Đã hủy'?refundable(b):due(b))}</strong></div>
      </div>
      <div class="action-row">
        ${active && due(b) > 0 ? `<button class="btn btn-primary" data-action="pay-booking" data-id="${id}">＋ Ghi nhận thu tiền</button>` : ''}
        ${b.status === 'Đã hủy' && refundable(b) > 0 ? `<button class="btn btn-blue" data-action="refund-booking" data-id="${id}">↩ Ghi nhận hoàn tiền</button>` : ''}
      </div>
      <div class="detail-title">Lịch sử giao dịch</div>
      <ul class="history">
        ${state.transactions.filter(t=>t.bookingId===id).map(t=>`<li>${esc(t.type)} · ${money(t.amount)} · ${esc(t.method)} · ${stamp(t.at || t.date+'T10:00:00')} · ${esc(t.by)}</li>`).join('') || '<li>Chưa có giao dịch.</li>'}
      </ul>
    `, `<button class="btn" data-action="close-modal">Đóng</button>`, true);
  }

  function transactionModal(type, id){
    const b = booking(id);
    const isRefund = type === 'refund';
    const limit = isRefund ? refundable(b) : due(b);
    modal(isRefund ? 'Ghi nhận hoàn tiền' : 'Ghi nhận thu tiền', `${id} · ${esc(b.customer)}`, `
      <form id="transactionForm" data-form="transaction" class="form-grid">
        <input type="hidden" name="id" value="${id}">
        <input type="hidden" name="type" value="${type}">
        <div class="full notice">${isRefund?'Số tiền còn đủ điều kiện hoàn':'Khoản còn phải thu'}: <strong>${money(limit)}</strong>.</div>
        ${field(isRefund?'Số tiền hoàn':'Số tiền nhận', 'amount', 'number', limit, `required min="1" max="${limit}" step="1"`)}
        ${select(isRefund?'Phương thức hoàn':'Phương thức thanh toán', 'method', [['Chuyển khoản','Chuyển khoản QR'],['Tiền mặt','Tiền mặt'],['Ví điện tử','Ví điện tử']], 'Chuyển khoản')}
      </form>
    `, actionFooter(isRefund?'Xác nhận hoàn tiền':'Xác nhận thu tiền', 'transactionForm', isRefund));
  }

  function reportData(){
    const from = ui.reportFrom, to = ui.reportTo;
    const cs = ownerCourts().filter(c => ui.reportCourt === 'all' || ui.reportCourt === c.id);
    const ids = new Set(cs.map(c => c.id));
    const orders = ownerBookings().filter(b => ids.has(b.courtId) && b.date >= from && b.date <= to);
    const ts = state.transactions.filter(t => t.date >= from && t.date <= to && ids.has(court(booking(t.bookingId)?.courtId)?.id));
    const income = ts.filter(t => t.type === 'Thu tiền').reduce((n,t) => n + t.amount, 0);
    const refunds = ts.filter(t => t.type === 'Hoàn tiền').reduce((n,t) => n + t.amount, 0);
    const days = Math.max(1, Math.min(366, Math.round((new Date(to+'T12:00') - new Date(from+'T12:00')) / 86400000) + 1));
    const hours = orders.filter(b => !['Đã hủy','Đã từ chối'].includes(b.status)).reduce((n,b) => n + duration(b), 0);
    const capacity = cs.reduce((n,c) => n + (timeN(c.close) - timeN(c.open)) / 60 * days, 0);
    return {cs, orders, ts, income, refunds, days, util: capacity ? Math.round(hours / capacity * 100) : 0};
  }

  function reportHTML(){
    const r = reportData(), noData = r.orders.length === 0 && r.ts.length === 0;
    let dates = [];
    for(let i=0; i<Math.min(7, r.days); i++){
      const d = new Date(ui.reportTo + 'T12:00');
      d.setDate(d.getDate() - (Math.min(7, r.days) - 1 - i));
      dates.push(localISO(d));
    }
    const values = dates.map(d => r.ts.filter(t => t.date === d).reduce((n,t) => n + (t.type==='Thu tiền'?t.amount:-t.amount), 0));
    const max = Math.max(1, ...values.map(v => Math.abs(v)));

    return `
      <div class="filter-strip filters">
        <div class="field"><label for="reportFrom">Từ ngày</label><input type="date" id="reportFrom" value="${ui.reportFrom}"></div>
        <div class="field"><label for="reportTo">Đến ngày</label><input type="date" id="reportTo" value="${ui.reportTo}"></div>
        <div class="field"><label for="reportCourt">Sân cần thống kê</label><select id="reportCourt">${courtOptions(true).map(([v,t])=>`<option value="${v}" ${ui.reportCourt===v?'selected':''}>${esc(t)}</option>`).join('')}</select></div>
      </div>
      ${ui.reportFrom > ui.reportTo ? `<div class="empty">Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.</div>` : noData ? `<div class="empty"><span class="empty-icon">◫</span>Không có dữ liệu báo cáo trong khoảng thời gian đã chọn.</div>` : `
        <div class="report-layout" style="padding:0 20px">
          <div class="panel report-card" style="margin:0">
            <h3>Doanh thu theo ngày</h3>
            <p>Tiền đã thu trừ khoản hoàn trong khoảng ngày đã chọn.</p>
            <div class="chart">${dates.map((d,i) => `<div class="bar-wrap" title="${shortDate(d)}: ${money(values[i])}"><div class="bar" style="height:${Math.max(3,Math.abs(values[i])/max*160)}px"></div><label>${d.slice(8,10)}/${d.slice(5,7)}</label></div>`).join('')}</div>
          </div>
          <div class="report-metrics">
            <div class="metric-mini"><span>Doanh thu</span><strong>${money(r.income - r.refunds)}</strong></div>
            <div class="metric-mini"><span>Khoản hoàn</span><strong>${money(r.refunds)}</strong></div>
            <div class="metric-mini"><span>Lượt đặt</span><strong>${r.orders.length}</strong></div>
            <div class="metric-mini"><span>Đơn hủy</span><strong>${r.orders.filter(b=>b.status==='Đã hủy').length}</strong></div>
            <div class="metric-mini" style="grid-column:1/-1"><span>Tỷ lệ sử dụng sân</span><strong>${r.util}%</strong></div>
          </div>
        </div>
      `}
    `;
  }

  // =========================================================================
  // GIÁM SÁT SÂN VÀ ĐƠN ĐẶT TOÀN HỆ THỐNG (Admin)
  // =========================================================================
  function renderAdmin(){
    const facilities = [...new Set(state.courts.map(c => c.facility))];
    const term = ui.adminSearch.toLowerCase();
    let courts = state.courts.filter(c => (ui.adminFacility==='all'||c.facility===ui.adminFacility)&&(ui.adminStatus==='all'||(ui.adminStatus==='shown'?c.visible:!c.visible))&&(c.id+' '+c.name+' '+c.facility).toLowerCase().includes(term));
    let orders = state.bookings.filter(b => (ui.adminFacility==='all'||court(b.courtId)?.facility===ui.adminFacility)&&b.date>=ui.adminFrom&&b.date<=ui.adminTo&&(ui.adminStatus==='all'||b.status===ui.adminStatus)&&(b.id+' '+b.account+' '+b.customer+' '+court(b.courtId)?.name).toLowerCase().includes(term)).sort((a,b)=>b.date.localeCompare(a.date));

    $('#pageContent').innerHTML = `
      <div class="page-head">
        <div>
          <div class="eyebrow">Bảng điều khiển quản trị</div>
          <h1>Giám sát sân và đơn đặt toàn hệ thống</h1>
          <p>Tra cứu dữ liệu toàn hệ thống, đối chiếu thanh toán và ẩn/khôi phục hiển thị sân.</p>
        </div>
        <div class="head-actions"><button class="btn" data-action="reset-demo">Đặt lại dữ liệu mẫu</button></div>
      </div>
      <div class="stats">
        <div class="stat"><span>Tổng số sân</span><strong>${state.courts.length}</strong><small>${facilities.length} cơ sở thể thao</small></div>
        <div class="stat"><span>Sân đang hiển thị</span><strong>${state.courts.filter(c=>c.visible).length}</strong><small>Khách hàng có thể nhìn thấy</small></div>
        <div class="stat blue-bg"><span>Đơn đặt toàn hệ thống</span><strong>${state.bookings.length}</strong><small>Bao gồm mọi trạng thái</small></div>
        <div class="stat"><span>Đơn chờ xử lý</span><strong>${state.bookings.filter(b=>b.status==='Chờ xử lý').length}</strong><small>Chủ sân cần phản hồi</small></div>
      </div>
      <section class="panel">
        <div class="tabs">
          <button class="tab ${ui.adminTab==='courts'?'active':''}" data-action="admin-tab" data-tab="courts">Sân thể thao</button>
          <button class="tab ${ui.adminTab==='orders'?'active':''}" data-action="admin-tab" data-tab="orders">Đơn đặt sân</button>
        </div>
        <div class="filter-strip filters">
          <div class="field" style="max-width:280px"><label for="adminSearch">Tìm kiếm</label><input id="adminSearch" type="search" placeholder="Mã, tên sân, tài khoản..." value="${esc(ui.adminSearch)}"></div>
          <div class="field"><label for="adminFacility">Cơ sở</label><select id="adminFacility"><option value="all">Tất cả cơ sở</option>${facilities.map(f=>`<option value="${esc(f)}" ${ui.adminFacility===f?'selected':''}>${esc(f)}</option>`).join('')}</select></div>
          <div class="field"><label for="adminStatus">${ui.adminTab==='courts'?'Hiển thị':'Trạng thái đơn'}</label><select id="adminStatus">${(ui.adminTab==='courts'?[['all','Tất cả'],['shown','Đang hiển thị'],['hidden','Đang ẩn']]:[['all','Tất cả'],['Chờ xử lý','Chờ xử lý'],['Đã xác nhận','Đã xác nhận'],['Đã nhận sân','Đã nhận sân'],['Hoàn thành','Hoàn thành'],['Đã hủy','Đã hủy'],['Đã từ chối','Đã từ chối']]).map(([v,t])=>`<option value="${esc(v)}" ${ui.adminStatus===v?'selected':''}>${esc(t)}</option>`).join('')}</select></div>
          ${ui.adminTab==='orders' ? `<div class="field"><label for="adminFrom">Từ ngày</label><input id="adminFrom" type="date" value="${ui.adminFrom}"></div><div class="field"><label for="adminTo">Đến ngày</label><input id="adminTo" type="date" value="${ui.adminTo}"></div>` : ''}
        </div>
        ${ui.adminTab==='courts' ? `
          <div class="table-scroll">
            <table class="data-table">
              <thead><tr><th>Mã sân / tên sân</th><th>Cơ sở / địa chỉ</th><th>Loại sân</th><th>Giá thuê / giờ</th><th>Hoạt động</th><th>Hiển thị</th><th>Thao tác</th></tr></thead>
              <tbody>
                ${courts.map(c => `
                  <tr>
                    <td><strong class="mono">${c.id}</strong><small>${esc(c.name)}</small></td>
                    <td><strong>${esc(c.facility)}</strong><small>${esc(c.address)}</small></td>
                    <td>${esc(c.type)}</td>
                    <td class="money">${money(c.price)}</td>
                    <td>${pill(c.operational)}</td>
                    <td>${pill(c.visible?'Đang hiển thị':'Đang ẩn')}</td>
                    <td><button class="btn btn-sm" data-action="open-court" data-id="${c.id}">Xem chi tiết</button></td>
                  </tr>
                `).join('') || `<tr><td colspan="7" class="empty">Không tìm thấy kết quả.</td></tr>`}
              </tbody>
            </table>
          </div>
        ` : `
          <div class="table-scroll">
            <table class="data-table">
              <thead><tr><th>Mã đơn / tài khoản</th><th>Khách hàng</th><th>Sân / cơ sở</th><th>Ngày / giờ</th><th>Tổng tiền</th><th>Trạng thái đơn</th><th>Thao tác</th></tr></thead>
              <tbody>
                ${orders.map(b => `
                  <tr>
                    <td><strong class="mono">${b.id}</strong><small>${esc(b.account)}</small></td>
                    <td>${esc(b.customer)}</td>
                    <td><strong>${esc(court(b.courtId)?.name)}</strong><small>${esc(court(b.courtId)?.facility)}</small></td>
                    <td><strong>${shortDate(b.date)}</strong><small>${b.start}–${b.end}</small></td>
                    <td class="money">${money(total(b))}</td>
                    <td>${pill(b.status)}</td>
                    <td><button class="btn btn-sm" data-action="open-admin-booking" data-id="${b.id}">Đối chiếu thanh toán</button></td>
                  </tr>
                `).join('') || `<tr><td colspan="7" class="empty">Không tìm thấy kết quả.</td></tr>`}
              </tbody>
            </table>
          </div>
        `}
      </section>
    `;
  }

  function openCourt(id){
    const c = court(id);
    if (!c) return;
    const logs = state.history.filter(h => h.courtId === id).slice().reverse();
    modal(`Chi tiết sân ${id}`, esc(c.name), `
      <div class="detail-title">Thông tin sân và cơ sở</div>
      <div class="kv"><span>Tên sân / loại sân</span><strong>${esc(c.name)} · ${esc(c.type)}</strong></div>
      <div class="kv"><span>Cơ sở / địa chỉ</span><strong>${esc(c.facility)} · ${esc(c.address)}</strong></div>
      <div class="kv"><span>Chủ sân</span><strong>${esc(c.ownerId)} · ${esc(c.owner)}</strong></div>
      <div class="kv"><span>Giá và giờ hoạt động</span><strong>${money(c.price)} / giờ · ${c.open}–${c.close}</strong></div>
      <div class="kv"><span>Trạng thái hoạt động</span><strong>${pill(c.operational)}</strong></div>
      <div class="kv"><span>Hiển thị với khách hàng</span><strong>${pill(c.visible ? 'Đang hiển thị' : 'Đang ẩn')}</strong></div>
      <div class="action-row">
        <button class="btn ${c.visible ? 'btn-danger' : 'btn-primary'}" data-action="toggle-court" data-id="${id}">${c.visible ? 'Ẩn sân' : 'Khôi phục hiển thị'}</button>
      </div>
      <div class="detail-title">Lịch sử xử lý hiển thị</div>
      <ul class="history">${logs.map(h => `<li>${esc(h.action)} · ${stamp(h.at || h.date+'T10:00:00')} · ${esc(h.by)}${h.reason ? ' — ' + esc(h.reason) : ''}</li>`).join('') || '<li>Chưa có thao tác.</li>'}</ul>
    `, `<button class="btn" data-action="close-modal">Đóng</button>`, true);
  }

  function toggleCourt(id){
    const c = court(id), hide = c.visible;
    modal(hide ? 'Ẩn sân' : 'Khôi phục sân', `${id} · ${esc(c.name)}`, `
      <form id="courtVisibilityForm" data-form="court-visibility" class="form-grid">
        <input type="hidden" name="id" value="${id}">
        ${hide ? `<div class="field full"><label for="reason">Lý do ẩn sân</label><textarea id="reason" name="reason" required minlength="3" placeholder="Nhập lý do ẩn sân khỏi khách hàng..."></textarea></div>` : ''}
        <div class="full notice ${hide?'warn':''}">${hide ? 'Sân sẽ không xuất hiện với khách hàng. Đơn đặt và giao dịch đã phát sinh vẫn được bảo toàn.' : 'Sân sẽ xuất hiện lại với khách hàng trên toàn hệ thống.'}</div>
      </form>
    `, actionFooter(hide ? 'Đồng ý ẩn' : 'Đồng ý khôi phục', 'courtVisibilityForm', !hide));
  }

  // =========================================================================
  // XỬ LÝ SỰ KIỆN CLICK & INTERACTION
  // =========================================================================
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action="select-slot"]');
    if (!t) return;
    $('#f_start').value = t.dataset.start;
    $('#f_end').value = t.dataset.end;
    $('#slotSuggestions').querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === t));
  });

  document.addEventListener('change', (e) => {
    if (!e.target.closest('#rescheduleForm') || !['f_courtId', 'f_date'].includes(e.target.id)) return;
    const f = $('#rescheduleForm');
    $('#slotSuggestions').innerHTML = freeSlots(f.elements.courtId.value, f.elements.date.value, f.elements.id.value);
  });

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const a = t.dataset.action, id = t.dataset.id;
    if (a === 'backdrop' && e.target !== t) return;
    if (a === 'close-modal' || a === 'backdrop') { closeModal(); return; }

    if (a === 'reset-demo') {
      if (confirm('Đặt lại toàn bộ dữ liệu minh họa về ban đầu?')) {
        state = seed(); save(); closeModal(); render(); toast('Đã đặt lại dữ liệu mẫu.');
      }
      return;
    }

    // Tab chuyển đổi
    if (a === 'payment-tab') { ui.paymentTab = t.dataset.tab; render(); return; }
    if (a === 'admin-tab') { ui.adminTab = t.dataset.tab; ui.adminStatus = 'all'; render(); return; }

    // Chức năng UC 3: Quản lý sân
    if (a === 'new-court') newCourtModal();
    if (a === 'open-court-detail') openCourtDetail(id);
    if (a === 'edit-court') editCourtModal(id);
    if (a === 'delete-court') deleteCourtModal(id);

    // Chức năng UC 4: Quản lý tài khoản
    if (a === 'new-account') newAccountModal();
    if (a === 'open-account-detail') openAccountDetail(id);
    if (a === 'delete-account') deleteAccountModal(id);

    // Chức năng UC 5: Quản lý lịch & đơn đặt
    if (a === 'new-booking') newBooking();
    if (a === 'open-booking') openBooking(id);
    if (a === 'confirm-booking') {
      const b = booking(id);
      if (!b || b.status !== 'Chờ xử lý') return;
      const error = available(b.courtId, b.date, b.start, b.end, b.id);
      if (error) { toast(error, true); return; }
      b.status = 'Đã xác nhận'; save(); closeModal(); render(); toast(`Đã xác nhận đơn ${id}.`);
    }
    if (a === 'reject-booking') reasonModal('reject', id);
    if (a === 'cancel-booking') reasonModal('cancel', id);
    if (a === 'reschedule') reschedule(id);
    if (a === 'usage-booking') usage(id);

    // Chức năng UC 6: Thanh toán & Báo cáo
    if (a === 'open-payment') openPayment(id);
    if (a === 'pay-booking') transactionModal('pay', id);
    if (a === 'refund-booking') transactionModal('refund', id);

    // Chức năng UC 7: Giám sát toàn hệ thống
    if (a === 'open-court') openCourt(id);
    if (a === 'open-admin-booking') openBooking(id);
    if (a === 'toggle-court') toggleCourt(id);
  });

  document.addEventListener('change', (e) => {
    const t = e.target;
    if (!t.id) return;
    const map = {
      scheduleDate: 'scheduleDate', scheduleCourt: 'scheduleCourt',
      reportFrom: 'reportFrom', reportTo: 'reportTo', reportCourt: 'reportCourt',
      adminFacility: 'adminFacility', adminStatus: 'adminStatus', adminFrom: 'adminFrom', adminTo: 'adminTo',
      accountRole: 'accountRole'
    };
    if (map[t.id]) { ui[map[t.id]] = t.value; render(); }
  });

  document.addEventListener('input', (e) => {
    const t = e.target;
    if (t.id === 'paymentSearch' || t.id === 'adminSearch' || t.id === 'accountSearch' || t.id === 'courtSearch') {
      ui[t.id] = t.value;
      const caret = t.selectionStart;
      render();
      const fresh = document.getElementById(t.id);
      fresh?.focus();
      try { fresh?.setSelectionRange(caret, caret); } catch (_) {}
    }
  });

  // =========================================================================
  // XỬ LÝ SUBMIT FORM
  // =========================================================================
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('[data-form]');
    if (!form) return;
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form)), type = form.dataset.form;
    let message = '';

    // Thêm sân mới (UC 3)
    if (type === 'create-court') {
      if (state.courts.some(c => c.id.toLowerCase() === d.id.trim().toLowerCase())) {
        message = 'Mã sân đã tồn tại, vui lòng nhập mã khác!';
      } else {
        const newCourtData = {
          id: d.id.trim(),
          name: d.name.trim(),
          facility: d.facility.trim(),
          address: d.address.trim(),
          type: d.type.trim(),
          price: Number(d.price),
          open: d.open,
          close: d.close,
          operational: d.operational,
          visible: true,
          ownerId: ownerId,
          owner: 'Nguyễn Hoàng Anh',
          description: d.description || ''
        };
        state.courts.push(newCourtData);
        fetch(`${API_BASE}/owner/courts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCourtData)
        }).catch(() => {});
        toast('Thêm sân thành công!');
      }
    }

    // Sửa sân (UC 3)
    if (type === 'edit-court') {
      const c = court(d.id);
      if (!c) message = 'Không tìm thấy sân cần sửa.';
      else {
        c.name = d.name.trim();
        c.address = d.address.trim();
        c.type = d.type.trim();
        c.price = Number(d.price);
        c.facility = d.facility.trim();
        c.open = d.open;
        c.close = d.close;
        c.operational = d.operational;
        c.description = d.description || '';
        toast('Cập nhật thông tin sân thành công!');
      }
    }

    // Xóa sân (UC 3)
    if (type === 'delete-court') {
      state.courts = state.courts.filter(c => c.id !== d.id);
      toast('Xóa sân thành công!');
    }

    // Thêm tài khoản (UC 4)
    if (type === 'create-account') {
      if (state.accounts.some(a => a.email.toLowerCase() === d.email.trim().toLowerCase())) {
        message = 'Email đã tồn tại trong hệ thống!';
      } else if (state.accounts.some(a => a.phone === d.phone.trim())) {
        message = 'Số điện thoại đã tồn tại trong hệ thống!';
      } else {
        const newAccData = {
          id: d.id.trim(),
          name: d.name.trim(),
          email: d.email.trim(),
          phone: d.phone.trim(),
          role: d.role,
          status: 'Hoạt động'
        };
        state.accounts.push(newAccData);
        fetch(`${API_BASE}/admin/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAccData)
        }).catch(() => {});
        toast('Thêm tài khoản thành công!');
      }
    }

    // Xóa tài khoản (UC 4)
    if (type === 'delete-account') {
      state.accounts = state.accounts.filter(a => a.id !== d.id);
      toast('Xóa tài khoản thành công!');
    }

    // Tạo đơn trực tiếp (UC 5)
    if (type === 'create') {
      if (!d.account.trim() || !d.customer.trim()) message = 'Vui lòng nhập tài khoản và họ tên khách hàng.';
      else message = available(d.courtId, d.date, d.start, d.end);
      if (!message) {
        const c = court(d.courtId);
        const id = 'D' + String(state.bookings.reduce((n,b) => Math.max(n, Number(b.id.slice(1)) || 0), 0) + 1).padStart(3, '0');
        const hours = (timeN(d.end) - timeN(d.start)) / 60;
        state.bookings.unshift({
          id, account: d.account.trim(), customer: d.customer.trim(),
          courtId: d.courtId, date: d.date, start: d.start, end: d.end,
          rent: Math.round(c.price * hours), service: 0, deposit: 0,
          status: 'Chờ xử lý', reason: '', created: today
        });
        fetch(`${API_BASE}/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accountId: d.account.trim(),
            courtId: d.courtId,
            date: d.date,
            start: d.start,
            end: d.end
          })
        }).catch(() => {});
        ui.scheduleDate = d.date;
        ui.scheduleCourt = d.courtId;
        toast(`Đã tạo đơn ${id}.`);
      }
    }

    // Từ chối / Hủy đơn (UC 5)
    if (type === 'reject' || type === 'cancel') {
      const b = booking(d.id);
      if (!b) message = 'Không tìm thấy đơn.';
      else if (!d.reason.trim()) message = 'Vui lòng nhập lý do.';
      else {
        b.status = type === 'reject' ? 'Đã từ chối' : 'Đã hủy';
        b.reason = d.reason.trim();
        toast(type === 'reject' ? `Đã từ chối đơn ${d.id}.` : `Đã hủy đơn ${d.id}.`);
      }
    }

    // Thay đổi lịch (UC 5)
    if (type === 'reschedule') {
      const b = booking(d.id);
      if (!b) message = 'Không tìm thấy đơn.';
      else message = available(d.courtId, d.date, d.start, d.end, d.id);
      if (!message) {
        b.courtId = d.courtId; b.date = d.date; b.start = d.start; b.end = d.end;
        b.rent = Math.round(court(d.courtId).price * (timeN(d.end) - timeN(d.start)) / 60);
        ui.scheduleDate = d.date; ui.scheduleCourt = d.courtId;
        toast(`Đã đổi lịch đơn ${d.id}.`);
      }
    }

    // Cập nhật trạng thái sử dụng (UC 5)
    if (type === 'usage') {
      const b = booking(d.id);
      if (b) { b.status = d.status; toast(`Đã cập nhật đơn ${d.id} thành “${d.status}”.`); }
    }

    // Giao dịch thanh toán / hoàn tiền (UC 6)
    if (type === 'transaction') {
      const b = booking(d.id), amount = Number(d.amount), refund = d.type === 'refund';
      const limit = b ? (refund ? refundable(b) : due(b)) : 0;
      if (!b || !Number.isFinite(amount) || amount <= 0 || amount > limit) {
        message = `Số tiền phải lớn hơn 0 và không vượt quá ${money(limit)}.`;
      } else {
        const id = 'G' + String(state.transactions.reduce((n,t) => Math.max(n, Number(t.id.slice(1)) || 0), 0) + 1).padStart(3, '0');
        state.transactions.push({
          id, bookingId: b.id, type: refund ? 'Hoàn tiền' : 'Thu tiền',
          amount, method: d.method, date: today, at: new Date().toISOString(), by: 'Nguyễn Hoàng Anh'
        });
        toast(`Đã ghi nhận giao dịch ${id}.`);
      }
    }

    // Ẩn / Khôi phục sân (UC 7)
    if (type === 'court-visibility') {
      const c = court(d.id);
      if (!c) message = 'Không tìm thấy sân.';
      else if (c.visible && !d.reason?.trim()) message = 'Vui lòng nhập lý do ẩn sân.';
      else {
        const wasVisible = c.visible;
        c.visible = !c.visible;
        state.history.push({
          courtId: c.id, action: wasVisible ? 'Ẩn sân' : 'Khôi phục hiển thị',
          reason: wasVisible ? d.reason.trim() : '', date: today,
          at: new Date().toISOString(), by: 'Quản trị viên'
        });
        toast(wasVisible ? `Đã ẩn sân ${c.id}.` : `Đã khôi phục sân ${c.id}.`);
      }
    }

    if (message) { toast(message, true); return; }
    save();
    closeModal();
    render();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && $('#overlay').innerHTML) closeModal();
  });

  render();
  syncFromBackend();
})();
