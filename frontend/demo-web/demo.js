// Builds the repeated parts of every demo screen (caption, sidebar, header buttons), the tables, the charts and the schedule grid.
// All numbers are sample data.

const OWNER_NAV = [
  { group: 'Vận hành' },
  { page: 'thong-ke', label: 'Thống kê', icon: 'chart' },
  { page: 'lich-san', label: 'Lịch sân', icon: 'cal' },
  { page: 'don-dat', label: 'Đơn đặt', icon: 'list', count: 3 },
  { page: 'yeu-cau-huy', label: 'Yêu cầu huỷ', icon: 'cancel', count: 2 },
  { group: 'Cơ sở' },
  { page: 'san-va-gia', label: 'Sân và giá', icon: 'grid' },
  { page: 'dich-vu', label: 'Dịch vụ', icon: 'service' },
  { page: 'thu-chi', label: 'Thu chi', icon: 'wallet' }
];
const ADMIN_NAV = [
  { group: 'Quản trị' },
  { page: 'tong-quan', label: 'Tổng quan', icon: 'dash' },
  { page: 'tai-khoan', label: 'Tài khoản', icon: 'people', count: 3 },
  { page: 'co-so', label: 'Cơ sở và sân', icon: 'store' },
  { page: 'don-dat', label: 'Đơn đặt', icon: 'list' },
  { page: 'thanh-toan', label: 'Thanh toán', icon: 'wallet', count: 6 },
  { page: 'he-thong', label: 'Nhật ký và hệ thống', icon: 'history' }
];

const STATUS_CLASS = {
  'Chờ xác nhận': 'p-new', 'Đã xác nhận': 'p-ok', 'Chờ thanh toán': 'p-pay', 'Đã nhận sân': 'p-in', 'Hoàn thành': 'p-done',
  'Không đến': 'p-bad', 'Đã huỷ': 'p-off', 'Hết hạn': 'p-off', 'Đang hoạt động': 'p-ok', 'Tạm ngừng': 'p-pay', 'Bị ẩn': 'p-off',
  'Đang bán': 'p-ok', 'Ngừng bán': 'p-off', 'Hoạt động': 'p-ok', 'Bị khoá': 'p-bad', 'Đã chấp nhận': 'p-ok', 'Đã từ chối': 'p-off',
  'Thất bại': 'p-bad', 'Cần kiểm tra': 'p-pay', 'Cần duyệt': 'p-pay'
};

const icon = (name, size = '') => `<svg class="ic ${size}"><use href="#i-${name}"/></svg>`;
const pill = (status) => `<span class="pill ${STATUS_CLASS[status] || 'p-off'}">${status}</span>`;
const two = (main, sub) => `<span class="main">${main}</span><span class="sub">${sub}</span>`;
const vnd = (n) => n.toLocaleString('de-DE') + ' ₫';
const decimal = (n, digits = 1) => n.toFixed(digits).replace('.', ',');

function table(id, head, rows, selected = -1) {
  const el = document.getElementById(id);
  if (!el) return;
  const th = head.map(([label, cls = '']) => `<th class="${cls}">${label}</th>`).join('');
  const body = rows.map((cells, i) => `<tr class="${i === selected ? 'sel' : ''}">` +
    cells.map((cell, c) => `<td class="${head[c][1] || ''}">${cell}</td>`).join('') + '</tr>').join('');
  el.innerHTML = `<thead><tr>${th}</tr></thead><tbody>${body}</tbody>`;
}

// ---- Shell: caption, sidebar, header buttons ----
function buildShell() {
  const sheets = [...document.querySelectorAll('.sheet')];
  sheets.forEach((sheet, i) => {
    const portal = sheet.dataset.portal;
    const tag = { owner: ['owner', 'Chủ sân'], admin: ['admin', 'Admin'], both: ['', 'Dùng chung'] }[portal] || ['', 'Anta'];
    const caption = document.createElement('div');
    caption.className = 'caption';
    caption.innerHTML = `<span class="tag ${tag[0]}">${tag[1]}</span><span class="name">${sheet.dataset.name}</span>` +
      `<span class="func">Chức năng: ${sheet.dataset.func}</span><span class="num">Trang ${i + 1} trên ${sheets.length}</span>`;
    sheet.prepend(caption);

    const side = sheet.querySelector('.side');
    if (side) side.innerHTML = sidebar(portal, sheet.dataset.page);
    sheet.querySelectorAll('.band-actions').forEach((actions) => actions.insertAdjacentHTML('beforeend',
      `<span class="hbtn">${icon('bell')}<span class="dot"></span></span>`));

    if (portal) {
      const list = document.getElementById(portal === 'admin' ? 'toc-admin' : 'toc-owner');
      list.insertAdjacentHTML('beforeend', `<li><span>${i + 1}</span><b>${sheet.dataset.name}</b><small>${sheet.dataset.func}</small></li>`);
    }
  });
}

function sidebar(portal, active) {
  const owner = portal === 'owner';
  const nav = (owner ? OWNER_NAV : ADMIN_NAV).map((item) => item.group
    ? `<div class="nav-label">${item.group}</div>`
    : `<a class="${item.page === active ? 'on' : ''}">${icon(item.icon)}<span>${item.label}</span>${item.count ? `<span class="count">${item.count}</span>` : ''}</a>`).join('');
  const venue = owner
    ? `<div class="switch"><span class="thumb"></span><div><b>Anta Arena Thủ Đức</b><small>Cơ sở đang quản lý</small></div>${icon('down', 's')}</div>` : '';
  const me = owner ? ['MT', 'Nguyễn Minh Tâm', 'Chủ sân'] : ['QB', 'Trần Quốc Bảo', 'Quản trị viên'];
  return `<div class="brand"><img src="mark.png" alt=""><div><b>Anta</b><small>${owner ? 'Kênh chủ sân' : 'Quản trị hệ thống'}</small></div></div>` +
    venue + `<nav class="nav">${nav}</nav>` +
    `<div class="me"><span class="avatar">${me[0]}</span><div><b>${me[1]}</b><small>${me[2]}</small></div>${icon('logout')}</div>`;
}

// ---- Charts ----
const RAMP = ['#E3F6F7', '#B3E5E9', '#6FCAD3', '#22A3B1', '#0A6F7B'];
const SERIES = '#0A93A3';

// Columns that grow from one baseline, 4px rounded tops, labels only on the highest and the latest value.
function columns(id, values, { height, max, step, tick, xLabel, label, tip }) {
  const el = document.getElementById(id);
  const width = el.clientWidth;
  const pad = { left: 38, right: 6, top: 18, bottom: 22 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const slot = plotW / values.length;
  const barW = Math.min(18, slot - 4);
  const y = (v) => pad.top + plotH - (v / max) * plotH;
  let svg = `<svg class="chart" width="${width}" height="${height}" role="img">`;
  for (let v = 0; v <= max; v += step) {
    svg += `<line class="grid-line" x1="${pad.left}" x2="${width - pad.right}" y1="${y(v)}" y2="${y(v)}"/>`;
    svg += `<text class="axis" x="${pad.left - 8}" y="${y(v) + 4}" text-anchor="end">${tick(v)}</text>`;
  }
  const top = values.indexOf(Math.max(...values));
  values.forEach((v, i) => {
    const x = pad.left + i * slot + (slot - barW) / 2;
    const yTop = y(v);
    const h = pad.top + plotH - yTop;
    const r = Math.min(4, h);
    svg += `<path fill="${SERIES}" d="M${x},${yTop + h} V${yTop + r} Q${x},${yTop} ${x + r},${yTop} H${x + barW - r} Q${x + barW},${yTop} ${x + barW},${yTop + r} V${yTop + h} Z"><title>${tip(i, v)}</title></path>`;
    if (i === top || i === values.length - 1) svg += `<text class="bar-label" x="${x + barW / 2}" y="${yTop - 5}" text-anchor="middle">${label(v)}</text>`;
    const xl = xLabel(i);
    if (xl) svg += `<text class="axis" x="${x + barW / 2}" y="${height - 6}" text-anchor="middle">${xl}</text>`;
  });
  el.innerHTML = svg + '</svg>';
}

function ownerStats() {
  // 30 days ending Thursday 15/10/2026; weekends earn more.
  const start = new Date(2026, 8, 16);
  const days = [...Array(30)].map((_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  const revenue = days.map((d, i) => {
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const wobble = ((i * 37) % 11) / 10;
    return Math.round(((weekend ? 5.4 : 4.0) + wobble * 0.6) * 100) / 100;
  });
  const dm = (d) => `${d.getDate()}/${d.getMonth() + 1}`;
  columns('chart-revenue', revenue, {
    height: 192, max: 7, step: 2, tick: (v) => `${v} tr`, label: (v) => decimal(v),
    xLabel: (i) => ([0, 7, 14, 21, 29].includes(i) ? dm(days[i]) : ''), tip: (i, v) => `${dm(days[i])}: ${decimal(v, 2)} triệu đồng`
  });

  const courts = [['Sân 3', 214], ['Sân 1', 205], ['Sân 2', 196], ['Sân P1', 188], ['Sân 4', 179], ['Sân P2', 150]];
  document.getElementById('chart-courts').innerHTML = courts.map(([name, hours]) =>
    `<div class="meter" title="${name}: ${hours} giờ trên 510 giờ mở cửa"><span>${name}</span><div class="track"><div class="fill" style="width:${hours / 2.4}%"></div></div><span class="v">${hours} giờ</span></div>`).join('');

  const weekday = [40, 30, 12, 6, 4, 3, 5, 4, 6, 14, 36, 78, 90, 92, 84, 52, 20];
  const weekend = [58, 60, 44, 30, 22, 14, 10, 12, 22, 38, 58, 82, 88, 86, 74, 46, 20];
  const names = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
  const shift = [-4, -2, 0, 1, 5, 0, -3];
  const grid = names.map((_, d) => (d >= 5 ? weekend : weekday).map((v) => Math.max(1, Math.min(99, v + shift[d]))));
  let heat = '<div class="lb"></div>' + weekday.map((_, h) => `<div class="hl">${String(h + 6).padStart(2, '0')}h</div>`).join('');
  grid.forEach((row, d) => {
    heat += `<div class="lb">${names[d]}</div>` + row.map((v, h) =>
      `<div style="background:${RAMP[Math.min(4, Math.floor(v / 20))]}" title="${names[d]}, ${h + 6}:00: lấp ${v}%"></div>`).join('');
  });
  document.getElementById('heatmap').innerHTML = heat;
  document.getElementById('heat-scale').innerHTML = '<span>Vắng</span>' + RAMP.map((c) => `<i style="background:${c}"></i>`).join('') + '<span>Kín sân</span>';

  const peak = grid.flatMap((row) => row.slice(11, 15));
  const peakFill = Math.round(peak.reduce((a, b) => a + b, 0) / peak.length);
  const total = revenue.reduce((a, b) => a + b, 0);
  document.getElementById('owner-tiles').innerHTML = [
    ['Doanh thu', `${decimal(total)} tr ₫`, '<b class="up">+12%</b> so với 30 ngày trước'],
    ['Lượt đặt', '707', '<b class="up">+48</b> lượt'],
    ['Lấp sân giờ cao điểm', `${peakFill}%`, 'Từ 17:00 đến 21:00'],
    ['Đơn huỷ', '38', '<b class="down">5,4%</b> số đơn'],
    ['Đã hoàn cho khách', '3,46 tr ₫', '18 lần hoàn']
  ].map(([l, v, d]) => `<div class="tile"><span class="label">${l}</span><span class="value">${v}</span><span class="delta">${d}</span></div>`).join('');
}

function adminChart() {
  const values = [412, 398, 455, 506, 521, 389, 402, 418, 431, 447, 512, 538, 409, 438];
  const start = new Date(2026, 9, 2);
  const dm = (i) => { const d = new Date(2026, 9, 2 + i); return `${d.getDate()}/${d.getMonth() + 1}`; };
  columns('chart-orders', values, {
    height: 205, max: 600, step: 200, tick: (v) => String(v), label: (v) => String(v),
    xLabel: (i) => (i % 2 === 0 || i === 13 ? dm(i) : ''), tip: (i, v) => `${dm(i)}: ${v} đơn`
  });
  void start;
}

// ---- Schedule grid of one day ----
function schedule() {
  const el = document.getElementById('sched');
  const courts = [['Sân 1', 'Cầu lông'], ['Sân 2', 'Cầu lông'], ['Sân 3', 'Cầu lông'], ['Sân 4', 'Cầu lông'], ['Sân P1', 'Pickleball'], ['Sân P2', 'Pickleball']];
  const OPEN = 6, CLOSE = 23, HEAD = 40, ROW = 29, TIME = 58;
  let html = '<div class="hd"></div>' + courts.map(([n, s]) => `<div class="hd"><b>${n}</b><small>${s}</small></div>`).join('');
  for (let h = OPEN; h < CLOSE; h++) {
    html += `<div class="hr">${String(h).padStart(2, '0')}:00</div>` + courts.map(() => '<div class="cell"></div>').join('');
  }
  el.innerHTML = html;
  const colW = (el.clientWidth - TIME) / courts.length;
  const hh = (h) => `${String(h).padStart(2, '0')}:00`;
  const LABEL = { done: 'Hoàn thành', ok: 'Đã xác nhận', pay: 'Chờ thanh toán', new: 'Chờ xác nhận', in: 'Đang chơi', bad: 'Không đến', lock: 'Đã khoá' };
  const blocks = [
    [0, 6, 7, 'Khách lẻ tại quầy', 'done'], [0, 17, 18, 'Võ Thành Nam', 'ok'], [0, 18, 20, 'Trần Bảo Ngọc', 'ok'], [0, 20, 22, 'CLB Linh Trung', 'ok'],
    [1, 7, 9, 'Lê Minh Quân', 'done'], [1, 16, 18, 'Đặng Ngọc Mai', 'ok'], [1, 19, 21, 'Phan Thị Diệu', 'pay'],
    [2, 6, 8, 'Nhóm sáng thứ Năm', 'done'], [2, 12, 13, 'Trịnh Văn Hậu', 'bad'], [2, 18, 20, 'CLB cầu lông Đông Hoà', 'ok'],
    [3, 6, 8, 'Hoàng Minh Thư', 'done'], [3, 10, 12, 'Bảo trì đèn', 'lock'], [3, 17, 19, 'Đỗ Hữu Phước', 'ok', 'Có yêu cầu huỷ'],
    [4, 8, 10, 'Bùi Thanh Tú', 'done'], [4, 19, 21, 'Phạm Gia Huy', 'new'],
    [5, 14, 15, 'Bùi Quang Khải', 'in'], [5, 16, 17, 'Nguyễn Hoàng Long', 'new'], [5, 20, 22, 'Trần Khánh Vy', 'ok']
  ];
  blocks.forEach(([col, from, to, name, kind, extra]) => {
    const top = HEAD + (from - OPEN) * ROW + 2;
    const sub = to - from > 1 ? `<small>${hh(from)} - ${hh(to)}, ${extra || LABEL[kind]}</small>` : '';
    el.insertAdjacentHTML('beforeend', `<div class="blk ${kind}" title="${name}, ${hh(from)} - ${hh(to)}, ${LABEL[kind]}" style="left:${TIME + col * colW + 4}px;top:${top}px;width:${colW - 8}px;height:${(to - from) * ROW - 4}px"><b>${name}</b>${sub}</div>`);
  });
  const now = HEAD + (14 + 20 / 60 - OPEN) * ROW;
  el.insertAdjacentHTML('beforeend', `<div class="now-line" style="left:${TIME}px;right:0;top:${now}px"></div>`);
  const pickTop = HEAD + (15 - OPEN) * ROW + 1;
  el.insertAdjacentHTML('beforeend', `<div class="pick-cell" style="left:${TIME + 2 * colW + 3}px;top:${pickTop}px;width:${colW - 6}px;height:${ROW - 2}px"></div>`);
  el.insertAdjacentHTML('beforeend', `<div class="pop" style="left:${TIME + 3 * colW + 6}px;top:${HEAD + (12 - OPEN) * ROW + 4}px">
    <div><b>Sân 3, 15:00 đến 16:00</b><br><small>Còn trống, giá 80.000 ₫</small></div>
    <span class="btn sm primary wide">${icon('add', 's')}Tạo đơn tại quầy</span>
    <span class="btn sm outline wide">${icon('lock', 's')}Khoá khung giờ</span></div>`);
}

// ---- Tables ----
function ownerTables() {
  table('owner-bookings', [['Mã đơn'], ['Khách'], ['Sân'], ['Ngày chơi'], ['Giờ'], ['Tổng tiền', 'num'], ['Nguồn'], ['Trạng thái'], ['']], [
    ['AN-1510-0142', 'Lê Thu Hà', '0903 218 447', 'Sân 3', 'Cầu lông', '17/10/2026', '18:00 - 20:00', 290000, 'App Anta', 'Chờ xác nhận'],
    ['AN-1510-0141', 'Phạm Gia Huy', '0938 552 019', 'Sân P1', 'Pickleball', '15/10/2026', '19:00 - 21:00', 300000, 'App Anta', 'Chờ xác nhận'],
    ['AN-1510-0140', 'Nguyễn Hoàng Long', '0907 446 213', 'Sân P2', 'Pickleball', '15/10/2026', '16:00 - 17:00', 150000, 'App Anta', 'Chờ xác nhận'],
    ['AN-1510-0139', 'Võ Thành Nam', '0912 774 305', 'Sân 1', 'Cầu lông', '15/10/2026', '17:00 - 18:00', 120000, 'Tại quầy', 'Đã xác nhận'],
    ['AN-1510-0135', 'Bùi Quang Khải', '0868 905 214', 'Sân P2', 'Pickleball', '15/10/2026', '14:00 - 15:00', 120000, 'App Anta', 'Đã nhận sân'],
    ['AN-1410-0129', 'Ngô Đức Anh', '0936 402 117', 'Sân 1', 'Cầu lông', '16/10/2026', '20:00 - 22:00', 240000, 'App Anta', 'Chờ thanh toán'],
    ['AN-1410-0126', 'Trịnh Hải Yến', '0985 337 901', 'Sân 3', 'Cầu lông', '14/10/2026', '18:00 - 19:00', 120000, 'App Anta', 'Không đến'],
    ['AN-1410-0121', 'Lý Tuấn Kiệt', '0913 228 560', 'Sân P1', 'Pickleball', '14/10/2026', '07:00 - 09:00', 240000, 'App Anta', 'Đã huỷ']
  ].map(([code, name, phone, court, sport, day, time, total, source, status]) =>
    [code, two(name, phone), two(court, sport), day, time, vnd(total), source, pill(status), '<span class="link">Xem</span>']), 0);

  table('courts', [['Sân'], ['Môn'], ['Giá từ', 'num'], ['Trạng thái'], ['']], [
    ['Sân 1', 'Cầu lông', 80000, 'Đang hoạt động'], ['Sân 2', 'Cầu lông', 80000, 'Đang hoạt động'], ['Sân 3', 'Cầu lông', 80000, 'Đang hoạt động'],
    ['Sân 4', 'Cầu lông', 80000, 'Đang hoạt động'], ['Sân 5', 'Cầu lông', 80000, 'Tạm ngừng', 'Thay thảm đến 20/10'],
    ['Sân P1', 'Pickleball', 120000, 'Đang hoạt động'], ['Sân P2', 'Pickleball', 120000, 'Đang hoạt động']
  ].map(([name, sport, price, status, note]) => [`<b>${name}</b>`, `<span class="sport">${sport}</span>`, vnd(price),
    pill(status) + (note ? `<span class="sub" style="margin-top:2px">${note}</span>` : ''),
    `<span class="link">Sửa</span><span class="link" style="margin-left:14px;color:${status === 'Tạm ngừng' ? 'var(--primary)' : 'var(--on-sv)'}">${status === 'Tạm ngừng' ? 'Mở lại' : 'Tạm ngừng'}</span>`]));

  table('services', [['Dịch vụ'], ['Nhóm', 'nw'], ['Giá', 'num'], ['Tính theo'], ['Đã bán tháng này', 'num'], ['Trạng thái'], ['']], [
    ['Nước suối Aquafina', 'Đồ uống', 10000, 'chai', 412, 'Đang bán'], ['Nước tăng lực Sting', 'Đồ uống', 15000, 'chai', 268, 'Đang bán'],
    ['Trà đá', 'Đồ uống', 5000, 'ly', 190, 'Đang bán'], ['Thuê vợt cầu lông', 'Thuê dụng cụ', 30000, 'lượt', 86, 'Đang bán'],
    ['Thuê vợt pickleball', 'Thuê dụng cụ', 50000, 'lượt', 41, 'Đang bán'], ['Ống cầu Thành Công 12 quả', 'Bán lẻ', 280000, 'ống', 23, 'Đang bán'],
    ['Quấn cán vợt', 'Bán lẻ', 25000, 'cuộn', 17, 'Đang bán'], ['Gửi ô tô', 'Tiện ích', 20000, 'lượt', 54, 'Đang bán'],
    ['Khăn lạnh', 'Tiện ích', 3000, 'cái', 0, 'Ngừng bán']
  ].map(([name, group, price, unit, sold, status]) => [`<b>${name}</b>`, group, vnd(price), unit, String(sold), pill(status), '<span class="link">Sửa</span>']));

  table('money', [['Đơn'], ['Ngày chơi', 'nw'], ['Tổng tiền', 'num'], ['Qua app', 'num'], ['Tại sân', 'num'], ['Còn thu', 'num'], ['']], [
    ['AN-1510-0139', 'Võ Thành Nam', '15/10, 17:00', 120000, 0, 0],
    ['AN-1510-0136', 'Anh Tuấn, tại quầy', '15/10, 18:00', 240000, 0, 100000],
    ['AN-1610-0144', 'Nhóm cầu lông Sunrise', '16/10, 18:00', 530000, 200000, 0],
    ['AN-1410-0124', 'Lâm Gia Phúc', '14/10, 19:00', 290000, 240000, 0]
  ].map(([code, name, day, total, app, onsite]) => [two(code, name), day, vnd(total), vnd(app), vnd(onsite),
    `<b>${vnd(total - app - onsite)}</b>`, '<span class="btn sm outline">Ghi nhận thu</span>']), 0);

  const pending = [
    ['KL', 'Đinh Khánh Linh', 'AN-1510-0131', 'Sân 2, 18:00 đến 20:00 thứ Sáu 16/10', 'Cả nhóm bận việc đột xuất', 'Gửi 09:12 hôm nay, trước giờ chơi 32 giờ', 240000, 100],
    ['HP', 'Đỗ Hữu Phước', 'AN-1410-0130', 'Sân 4, 17:00 đến 19:00 hôm nay', 'Trời mưa to, không chạy xe tới được', 'Gửi 13:50 hôm nay, trước giờ chơi 3 giờ', 240000, 50]
  ];
  const done = [
    ['GB', 'Phan Gia Bảo', 'AN-1310-0109', 'Hoàn 100%, 160.000 ₫', 'Đã chấp nhận'],
    ['TN', 'Hồ Thị Ngân', 'AN-1210-0098', 'Khách gửi sau khi đã chơi 1 giờ', 'Đã từ chối'],
    ['QD', 'Tống Quang Định', 'AN-1110-0090', 'Hoàn 50%, 120.000 ₫', 'Đã chấp nhận']
  ];
  document.getElementById('cancel-list').innerHTML = '<div class="list">' + pending.map(([ini, name, code, slot, reason, when, paid, pct]) =>
    `<div class="it"><span class="avatar">${ini}</span><div style="width:300px"><b>${name}, ${code}</b><small>${slot}</small></div>
      <div class="grow"><b style="font-weight:500">"${reason}"</b><small>${when}</small></div>
      <div style="width:220px;text-align:right"><b>Đề xuất hoàn ${pct}%</b><small>${vnd(paid * pct / 100)} trên ${vnd(paid)} đã trả</small></div>
      <div class="end"><span class="btn sm danger">Từ chối</span><span class="btn sm primary">Chấp nhận</span></div></div>`).join('') +
    '<div class="it"><b class="muted" style="font-size:12px;letter-spacing:.06em;text-transform:uppercase">Đã xử lý gần đây</b></div>' +
    done.map(([ini, name, code, note, status]) => `<div class="it"><span class="avatar sm">${ini}</span><div class="grow"><b>${name}, ${code}</b><small>${note}</small></div><div class="end">${pill(status)}</div></div>`).join('') + '</div>';
}

function adminTables() {
  table('top-venues', [['Cơ sở'], ['Chủ sân'], ['Đơn', 'num'], ['Giờ đã bán', 'num'], ['Tiền thu', 'num'], ['Huỷ', 'num']], [
    ['Anta Arena Thủ Đức', 'Nguyễn Minh Tâm', 168, 271, 32.4, 9], ['Sân cầu lông Phú Nhuận Xanh', 'Đỗ Thị Hồng', 151, 244, 26.1, 6],
    ['Pickleball Sky Quận 7', 'Lâm Quốc Việt', 139, 198, 29.7, 4], ['Sân bóng mini Bình Thạnh 79', 'Huỳnh Văn Sang', 122, 183, 41.2, 7]
  ].map(([v, o, n, h, m, c]) => [`<b>${v}</b>`, o, String(n), `${h} giờ`, `${decimal(m)} tr ₫`, String(c)]));

  table('accounts', [['Tài khoản'], ['Đăng nhập bằng'], ['Số đơn', 'num'], ['Huỷ', 'num'], ['Ngày tạo'], ['Trạng thái']], [
    ['GH', 'Phạm Gia Huy', 'giahuy.pham@gmail.com', 'Google', 23, 2, '21/03/2026', 'Hoạt động'],
    ['TH', 'Lê Thu Hà', '0903 218 447', 'Số điện thoại', 12, 1, '02/03/2026', 'Hoạt động'],
    ['KL', 'Đinh Khánh Linh', 'khanhlinh.dinh@gmail.com', 'Email', 8, 1, '17/05/2026', 'Hoạt động'],
    ['VL', 'Trương Văn Lộc', '0939 115 802', 'Số điện thoại', 5, 0, '09/08/2026', 'Hoạt động'],
    ['TV', 'Nguyễn Thanh Vân', 'thanhvan.ng@gmail.com', 'Google', 31, 0, '14/01/2026', 'Hoạt động'],
    ['DM', 'Trần Đức Mạnh', '0977 604 351', 'Số điện thoại', 9, 6, '28/04/2026', 'Bị khoá'],
    ['MT', 'Hoàng Minh Thư', '0909 661 238', 'Số điện thoại', 17, 0, '11/02/2026', 'Hoạt động'],
    ['TN', 'Võ Thành Nam', 'thanhnam.vo@gmail.com', 'Email', 6, 0, '30/06/2026', 'Hoạt động'],
    ['TK', 'Lý Tuấn Kiệt', '0913 228 560', 'Số điện thoại', 3, 1, '02/10/2026', 'Hoạt động']
  ].map(([ini, name, id, login, n, c, created, status]) => [
    `<div style="display:flex;gap:10px;align-items:center"><span class="avatar sm">${ini}</span><div>${two(name, id)}</div></div>`,
    login, String(n), String(c), created, pill(status)]), 0);

  table('venues', [['Cơ sở', 'nw'], ['Môn', 'nw'], ['Sân', 'num'], ['Đơn 30 ngày', 'num'], ['Đánh giá', 'nw'], ['Trạng thái']], [
    ['Anta Arena Thủ Đức', 'Nguyễn Minh Tâm, TP Thủ Đức', ['Cầu lông', 'Pickleball'], 7, 707, '4,8', 'Đang hoạt động'],
    ['Sân cầu lông Phú Nhuận Xanh', 'Đỗ Thị Hồng, Phú Nhuận', ['Cầu lông'], 8, 642, '4,6', 'Đang hoạt động'],
    ['Pickleball Sky Quận 7', 'Lâm Quốc Việt, Quận 7', ['Pickleball'], 6, 588, '4,9', 'Đang hoạt động'],
    ['Sân bóng mini Bình Thạnh 79', 'Huỳnh Văn Sang, Bình Thạnh', ['Bóng đá'], 4, 521, '4,5', 'Đang hoạt động'],
    ['Tennis Gò Vấp Garden', 'Phan Ngọc Ánh, Gò Vấp', ['Quần vợt'], 3, 214, '4,4', 'Đang hoạt động'],
    ['CLB bóng bàn Tân Bình', 'Mạc Văn Thịnh, Tân Bình', ['Bóng bàn'], 10, 198, '4,3', 'Đang hoạt động'],
    ['Sân bóng rổ Quận 3 Center', 'Vũ Hải Long, Quận 3', ['Bóng rổ'], 2, 96, '4,2', 'Tạm ngừng'],
    ['Sân cầu lông Ngôi Sao Bình Tân', 'Chưa có chủ sân, Bình Tân', ['Cầu lông'], 6, 0, '', 'Bị ẩn']
  ].map(([name, sub, sports, courts, orders, rating, status]) => [two(name, sub),
    `<span class="sport">${sports[0]}</span>` + (sports.length > 1 ? ` <span class="muted" style="font-size:12px;font-weight:600">+${sports.length - 1}</span>` : ''), String(courts), String(orders),
    rating ? `<span class="rating">${icon('star')}${rating}</span>` : '<span class="muted">Chưa có</span>', pill(status)]), 0);

  table('admin-bookings', [['Đơn'], ['Cơ sở'], ['Giờ chơi'], ['Số tiền', 'num'], ['Trạng thái']], [
    ['AN-1410-0118', 'Trương Văn Lộc', 'Sân bóng mini Bình Thạnh 79', '16/10, 19:00', 450000, 'Hết hạn', 'Tiền đến muộn'],
    ['AN-1510-0152', 'Mai Anh Thư', 'Pickleball Sky Quận 7', '15/10, 18:00', 300000, 'Đã huỷ', 'Hoàn tiền thất bại'],
    ['AN-1310-0087', 'Đoàn Minh Trí', 'Sân cầu lông Phú Nhuận Xanh', '13/10, 20:00', 160000, 'Đã huỷ', 'Hoàn tiền cần kiểm tra'],
    ['AN-1510-0142', 'Lê Thu Hà', 'Anta Arena Thủ Đức', '17/10, 18:00', 290000, 'Chờ xác nhận'],
    ['AN-1510-0150', 'Châu Ngọc Hân', 'Tennis Gò Vấp Garden', '15/10, 17:00', 360000, 'Đã xác nhận'],
    ['AN-1510-0148', 'Kha Minh Đức', 'CLB bóng bàn Tân Bình', '15/10, 15:00', 90000, 'Đã nhận sân'],
    ['AN-1510-0146', 'Từ Bảo Trâm', 'Pickleball Sky Quận 7', '16/10, 06:00', 240000, 'Chờ thanh toán'],
    ['AN-1410-0115', 'Ông Văn Toàn', 'Sân cầu lông Phú Nhuận Xanh', '14/10, 21:00', 110000, 'Hoàn thành'],
    ['AN-1410-0113', 'La Thị Kim', 'Anta Arena Thủ Đức', '14/10, 18:00', 120000, 'Không đến']
  ].map(([code, name, venue, time, amount, status, issue]) => [two(`<span style="color:var(--primary)">${code}</span>`, name), venue, time, vnd(amount),
    pill(status) + (issue ? `<span class="sub" style="color:var(--error);font-weight:600;margin-top:2px">${issue}</span>` : '')]), 0);

  table('refunds', [['Mã hoàn'], ['Khách'], ['Đơn và cơ sở'], ['Số tiền', 'num'], ['Mức', 'num'], ['Lần thử', 'num'], ['Trạng thái'], ['Thao tác']], [
    ['HT-0412', 'Mai Anh Thư', 'AN-1510-0152', 'Pickleball Sky Quận 7', 300000, 100, 2, 'Thất bại'],
    ['HT-0409', 'Đoàn Minh Trí', 'AN-1310-0087', 'Sân cầu lông Phú Nhuận Xanh', 80000, 50, 3, 'Cần kiểm tra'],
    ['HT-0405', 'Quách Thị Mỹ', 'AN-1210-0074', 'Anta Arena Thủ Đức', 240000, 100, 1, 'Thất bại'],
    ['HT-0401', 'Tạ Quang Vinh', 'AN-1110-0061', 'Sân bóng mini Bình Thạnh 79', 225000, 50, 3, 'Cần kiểm tra']
  ].map(([code, name, order, venue, amount, pct, tries, status]) => [`<b>${code}</b>`, name, two(order, venue), vnd(amount), `${pct}%`, String(tries), pill(status),
    `<span class="btn sm outline">${icon('redo', 's')}Thử lại</span> <span class="btn sm ghost">Đã hoàn tay</span>`]));

  table('late', [['Giao dịch'], ['Khách'], ['Đơn và cơ sở'], ['Số tiền', 'num'], ['Hạn giữ chỗ'], ['Tiền đến lúc'], ['Thao tác']], [
    ['GD-88213', 'Trương Văn Lộc', 'AN-1410-0118', 'Sân bóng mini Bình Thạnh 79', 450000, '19:15, 14/10', '19:16, 14/10'],
    ['GD-88190', 'Kiều Bảo Ngọc', 'AN-1410-0112', 'Sân cầu lông Phú Nhuận Xanh', 240000, '10:30, 14/10', '10:34, 14/10']
  ].map(([code, name, order, venue, amount, due, paid]) => [`<b>${code}</b>`, name, two(order, venue), vnd(amount), due,
    `<span style="color:var(--error);font-weight:600">${paid}</span>`, '<span class="btn sm outline">Giữ đơn cho khách</span> <span class="btn sm primary">Hoàn tiền</span>']));

  table('audit', [['Thời gian', 'nw'], ['Người thực hiện', 'nw'], ['Hành động', 'nw'], ['Đối tượng', 'nw'], ['Chi tiết']], [
    ['14:12', 'Trần Quốc Bảo', 'Quản trị viên', 'Cấp quyền chủ sân', 'Huỳnh Văn Sang', 'Cho Sân bóng mini Bình Thạnh 79'],
    ['13:58', 'Nguyễn Minh Tâm', 'Chủ sân', 'Xác nhận đơn', 'AN-1510-0139', 'Sân 1, 17:00 hôm nay'],
    ['13:40', 'Hệ thống', '', 'Hoàn tiền thất bại', 'HT-0412', 'Cổng thanh toán từ chối, sẽ thử lại'],
    ['11:25', 'Nguyễn Minh Tâm', 'Chủ sân', 'Khoá khung giờ', 'Sân 4', '10:00 đến 12:00, bảo trì đèn'],
    ['10:02', 'Đỗ Thị Hồng', 'Chủ sân', 'Sửa giá sân', 'Sân 2', '100.000 ₫ thành 110.000 ₫'],
    ['09:47', 'Trần Quốc Bảo', 'Quản trị viên', 'Khoá tài khoản', 'Trần Đức Mạnh', 'Huỷ sát giờ 6 lần trong tháng'],
    ['09:15', 'Lê Hải Đăng', 'Hỗ trợ', 'Hoàn tiền tay', 'HT-0398', 'Đã chuyển khoản 120.000 ₫'],
    ['08:30', 'Lâm Quốc Việt', 'Chủ sân', 'Tạm ngừng sân', 'Sân P3', 'Sửa lưới đến 18/10'],
    ['Hôm qua 22:10', 'Hệ thống', '', 'Đơn hết hạn', 'AN-1410-0118', 'Quá hạn giữ chỗ'],
    ['Hôm qua 21:05', 'Trần Quốc Bảo', 'Quản trị viên', 'Ẩn cơ sở', 'Ngôi Sao Bình Tân', 'Chủ sân ngừng kinh doanh']
  ].map(([time, who, role, action, target, detail]) => [`<span style="white-space:nowrap">${time}</span>`, role ? two(who, role) : `<span class="main">${who}</span>`,
    `<b>${action}</b>`, target, `<span class="muted">${detail}</span>`]));
}

function onlyOne() {
  const only = Number(new URLSearchParams(location.search).get('only'));
  if (!only) return;
  document.body.classList.add('single');
  document.querySelectorAll('.sheet').forEach((sheet, i) => { if (i + 1 !== only) sheet.style.display = 'none'; });
}

buildShell();
ownerStats();
schedule();
ownerTables();
adminChart();
adminTables();
onlyOne();
