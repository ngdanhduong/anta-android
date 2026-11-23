// ==========================================================================
// SPORTBOOKING - Application Controller & Interaction Logic
// ==========================================================================

let currentVenueId = null;
let currentBooking = null;
let selectedSportSlug = "all";
let selectedDateObj = new Date();
let selectedSlotState = null; // { yardId, yardName, hours: [], prices: [] }
let countdownInterval = null;
let leafletMap = null;
let mapMarkers = [];

// Formatters
const Format = {
  price(amount) {
    if (amount == null) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  },
  shortPrice(amount) {
    if (amount == null) return "Liên hệ";
    if (amount >= 1000) {
      return (amount / 1000) + "K";
    }
    return amount + " đ";
  },
  distance(meters) {
    if (meters == null) return "";
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  },
  hours(open, close) {
    if (open == null || close == null) return "Mở cả ngày";
    const pad = n => (n < 10 ? '0' : '') + n;
    return `${pad(open)}:00 - ${pad(close)}:00`;
  },
  date(dateObj) {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const d = dateObj.getDate();
    const m = dateObj.getMonth() + 1;
    const dayName = days[dateObj.getDay()];
    return `${dayName}, ${d < 10 ? '0' : ''}${d}/${m < 10 ? '0' : ''}${m}`;
  }
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  updateUserUI();
  renderSportChips();
  renderHomeVenues();
  renderExploreScreen();
  renderBookingsScreen();

  // Route based on URL hash if provided
  const hash = window.location.hash.replace("#", "");
  if (hash) {
    navigateTo(hash);
  } else {
    navigateTo("home");
  }

  window.addEventListener("resize", () => {
    if (leafletMap) leafletMap.invalidateSize();
  });
});

// ==========================================================================
// NAVIGATION & ROUTING
// ==========================================================================

function navigateTo(screenId, params = {}) {
  // Hide all screens
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));

  // Show target screen
  const target = document.getElementById(`screen-${screenId}`);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "instant" });
    const screenCont = document.getElementById("screen-container");
    if (screenCont) screenCont.scrollTop = 0;
  }

  // Update Bottom Nav
  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === screenId);
  });

  // Update Desktop Nav
  document.querySelectorAll(".desktop-nav-item").forEach(item => {
    item.classList.toggle("active", item.dataset.nav === screenId);
  });

  // Screen specific hooks
  if (screenId === "map") {
    initLeafletMap();
  } else if (screenId === "bookings") {
    renderBookingsScreen();
  } else if (screenId === "account") {
    updateUserUI();
  } else if (screenId === "favorites") {
    renderFavoritesScreen();
  } else if (screenId === "search") {
    renderSearchScreen();
    setTimeout(() => {
      const inp = document.getElementById("search-input-field");
      if (inp) inp.focus();
    }, 200);
  }
}

// ==========================================================================
// HOME SCREEN
// ==========================================================================

function renderSportChips() {
  const container = document.getElementById("home-sport-chips");
  const mapContainer = document.getElementById("map-sport-chips");
  if (!container) return;

  const sports = SportStore.getSports();

  const html = sports.map(sp => `
    <div class="sport-chip ${sp.slug === selectedSportSlug ? 'active' : ''}" 
         onclick="handleSportSelect('${sp.slug}', this)">
      <span>${sp.emoji}</span>
      <span>${sp.name}</span>
    </div>
  `).join("");

  container.innerHTML = html;
  if (mapContainer) mapContainer.innerHTML = html;
}

function handleSportSelect(slug, element) {
  selectedSportSlug = slug;
  document.querySelectorAll(".sport-chip").forEach(el => {
    if (el.textContent.includes(slug === "all" ? "Tất cả" : slug)) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });

  renderHomeVenues();
  if (leafletMap) {
    updateMapMarkers();
  }
}

function renderHomeVenues() {
  const featuredContainer = document.getElementById("home-featured-cards");
  const nearbyContainer = document.getElementById("home-venue-list");
  if (!featuredContainer || !nearbyContainer) return;

  const venues = SportStore.getVenues(selectedSportSlug, null, "rating");
  const nearbyVenues = SportStore.getVenues(selectedSportSlug, null, "distance");

  // Render Sân Nổi Bật (Tall Cards Carousel)
  if (venues.length === 0) {
    featuredContainer.innerHTML = `<div style="padding: 20px; color: var(--on-surface-variant);">Chưa có sân phù hợp với môn này.</div>`;
  } else {
    featuredContainer.innerHTML = venues.slice(0, 8).map(v => `
      <div class="venue-tall-card" onclick="navigateToVenueDetail('${v.id}')">
        <div class="tall-card-image-wrap">
          <img src="${v.images[0]}" alt="${v.name}" loading="lazy">
          <div class="card-badge-rating">
            <span class="star-icon">★</span>
            <span>${v.rating.toFixed(1)}</span>
            <span style="opacity: 0.8; font-size: 10.5px;">(${v.reviewCount})</span>
          </div>
          <div class="card-badge-dist">${Format.distance(v.distanceMeters)}</div>
          <button class="card-favorite-btn ${SportStore.isFavorite(v.id) ? 'active' : ''}" 
                  onclick="handleFavoriteClick(event, '${v.id}', this)" title="Lưu yêu thích">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
        <div class="tall-card-info">
          <h3 class="tall-card-title">${v.name}</h3>
          <div class="card-address-line">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="color: var(--primary);"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <span>${v.address}</span>
          </div>
          <div class="card-bottom-row">
            <div style="display: flex; gap: 4px; overflow: hidden;">
              ${v.sports.map(s => `<span class="sport-tag">${s.name}</span>`).join("")}
            </div>
            <div class="card-price-from">
              từ <b>${Format.shortPrice(v.minPrice)}</b>/h
            </div>
          </div>
        </div>
      </div>
    `).join("");
  }

  // Render Sân Gần Bạn (Vertical Row Cards)
  renderRowCards(nearbyVenues, nearbyContainer);
}

function renderRowCards(list, container) {
  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="grid-column: 1 / -1;">
        <div class="empty-emoji-circle">🔍</div>
        <div class="empty-title">Chưa có sân phù hợp</div>
        <div class="empty-subtitle">Thử chọn môn thể thao khác hoặc bỏ lọc để xem toàn bộ danh sách sân.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(v => `
    <div class="venue-row-card" onclick="navigateToVenueDetail('${v.id}')">
      <div class="row-card-img-wrap">
        <img src="${v.images[0]}" alt="${v.name}" loading="lazy">
        <button class="card-favorite-btn ${SportStore.isFavorite(v.id) ? 'active' : ''}" 
                onclick="handleFavoriteClick(event, '${v.id}', this)" title="Lưu yêu thích" style="bottom: 4px; right: 4px; width: 28px; height: 28px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div class="row-card-content">
        <div>
          <h3 class="row-card-name">${v.name}</h3>
          <div class="row-card-details">
            <div class="row-card-icon-line">
              <span style="color: var(--primary);">📍</span>
              <span>${v.distanceMeters ? Format.distance(v.distanceMeters) + ' · ' : ''}${v.address}</span>
            </div>
            <div class="row-card-icon-line">
              <span>🕒</span>
              <span>${Format.hours(v.openingHour, v.closingHour)}</span>
            </div>
          </div>
        </div>
        <div class="row-card-footer">
          <div style="display: flex; align-items: center; gap: 6px;">
            <div class="card-badge-rating" style="position: static; padding: 2px 6px; font-size: 11.5px; background: var(--tertiary-container); color: var(--on-tertiary-container);">
              <span class="star-icon">★</span>
              <span>${v.rating.toFixed(1)}</span>
            </div>
            <span class="sport-tag">${v.sports[0]?.name || 'Thể thao'}</span>
          </div>
          <div class="card-price-from">
            từ <b>${Format.shortPrice(v.minPrice)}</b>/h
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

function handleSortChange(sortVal) {
  const container = document.getElementById("home-venue-list");
  const list = SportStore.getVenues(selectedSportSlug, null, sortVal);
  renderRowCards(list, container);
}

function handleFavoriteClick(event, venueId, buttonEl) {
  event.stopPropagation();
  const isFav = SportStore.toggleFavorite(venueId);
  buttonEl.classList.toggle("active", isFav);
  showToast(isFav ? "Đã lưu vào sân yêu thích ❤️" : "Đã xoá khỏi sân yêu thích");
  updateUserUI();
}

function showAllVenues(sort) {
  const sel = document.getElementById("sort-selector");
  if (sel) sel.value = sort;
  handleSortChange(sort);
  const nearbyEl = document.getElementById("home-nearby-title");
  if (nearbyEl) nearbyEl.scrollIntoView({ behavior: "smooth" });
}

// ==========================================================================
// EXPLORE SCREEN
// ==========================================================================

function renderExploreScreen() {
  const gridContainer = document.getElementById("explore-sports-grid");
  const ratedContainer = document.getElementById("explore-rated-cards");
  const pricedContainer = document.getElementById("explore-priced-cards");
  if (!gridContainer) return;

  const sports = SportStore.getSports().filter(s => s.slug !== "all");

  // Sports Categories Grid
  gridContainer.innerHTML = sports.map(sp => `
    <div style="background: #fff; border-radius: var(--radius-md); padding: 14px 10px; border: 1px solid var(--outline-variant); text-align: center; cursor: pointer; transition: all 0.2s;" 
         onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--outline-variant)'"
         onclick="selectedSportSlug='${sp.slug}'; navigateTo('home'); renderSportChips(); renderHomeVenues();">
      <div style="font-size: 28px; margin-bottom: 4px;">${sp.emoji}</div>
      <div style="font-weight: 700; font-size: 13.5px; color: var(--on-surface);">${sp.name}</div>
      <div style="font-size: 11.5px; color: var(--on-surface-variant);">${sp.venueCount} sân</div>
    </div>
  `).join("");

  // Ranked Venues (Top rated)
  const ranked = SportStore.getVenues(null, null, "rating").slice(0, 5);
  ratedContainer.innerHTML = ranked.map((v, idx) => `
    <div class="venue-tall-card" onclick="navigateToVenueDetail('${v.id}')" style="width: 240px;">
      <div class="tall-card-image-wrap" style="aspect-ratio: 4/3;">
        <img src="${v.images[0]}" alt="${v.name}" loading="lazy">
        <div style="position: absolute; top: 10px; left: 10px; background: var(--gradient); color: #fff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; box-shadow: var(--shadow-sm);">
          #${idx + 1}
        </div>
        <div class="card-badge-rating" style="left: auto; right: 10px;">
          <span class="star-icon">★</span>
          <span>${v.rating.toFixed(1)}</span>
        </div>
      </div>
      <div class="tall-card-info" style="padding: 12px;">
        <h3 class="tall-card-title">${v.name}</h3>
        <div class="card-address-line">${v.address}</div>
        <div class="card-bottom-row">
          <span class="sport-tag">${v.sports[0]?.name}</span>
          <div class="card-price-from">từ <b>${Format.shortPrice(v.minPrice)}</b>/h</div>
        </div>
      </div>
    </div>
  `).join("");

  // Best Priced Venues
  const priced = SportStore.getVenues(null, null, "price").slice(0, 4);
  renderRowCards(priced, pricedContainer);
}

// ==========================================================================
// VENUE DETAILS SCREEN
// ==========================================================================

function navigateToVenueDetail(venueId) {
  const venue = SportStore.getVenueById(venueId);
  if (!venue) return;

  currentVenueId = venueId;

  // Populate Hero Image
  const heroImg = document.getElementById("detail-hero-img");
  if (heroImg) heroImg.src = venue.images[0] || "";

  const photoCount = document.getElementById("detail-photo-count");
  if (photoCount) photoCount.textContent = `1/${venue.images.length} ảnh`;

  // Heart button
  const heartBtn = document.getElementById("detail-heart-btn");
  if (heartBtn) heartBtn.classList.toggle("active", SportStore.isFavorite(venue.id));

  // Meta Facts
  document.getElementById("detail-venue-name").textContent = venue.name;
  document.getElementById("detail-venue-rating").textContent = venue.rating.toFixed(1);
  document.getElementById("detail-venue-reviews").textContent = `(${venue.reviewCount} đánh giá)`;
  document.getElementById("detail-venue-hours").textContent = `Mở cửa: ${Format.hours(venue.openingHour, venue.closingHour)}`;
  document.getElementById("detail-venue-address").textContent = venue.address;
  document.getElementById("detail-venue-desc").textContent = venue.description;
  document.getElementById("detail-footer-price").textContent = `từ ${Format.price(venue.minPrice)}/giờ`;

  // Sports Tags
  const sportsContainer = document.getElementById("detail-sports-tags");
  if (sportsContainer) {
    sportsContainer.innerHTML = venue.sports.map(s => `
      <span class="sport-tag" style="font-size: 12.5px; padding: 4px 12px;">${s.name}</span>
    `).join("");
  }

  // Price Lists Tab
  const priceListsContainer = document.getElementById("detail-price-lists");
  if (priceListsContainer) {
    priceListsContainer.innerHTML = venue.priceLists.map(pl => `
      <div class="price-table-card">
        <div class="price-table-title">${pl.title}</div>
        <div style="font-size: 13.5px; color: var(--on-surface); font-weight: 600;">${pl.slots.join(" · ")}</div>
      </div>
    `).join("");
  }

  // Photos Tab Grid
  const photosGrid = document.getElementById("detail-photos-grid");
  if (photosGrid) {
    photosGrid.innerHTML = venue.images.map((img, i) => `
      <div style="border-radius: var(--radius-md); overflow: hidden; aspect-ratio: 4/3; cursor: pointer;" 
           onclick="document.getElementById('detail-hero-img').src='${img}'">
        <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;" alt="Photo ${i+1}">
      </div>
    `).join("");
  }

  // Services Tab
  const servicesList = document.getElementById("detail-services-list");
  if (servicesList) {
    servicesList.innerHTML = venue.services.map(s => `
      <div class="service-item-row">
        <span style="font-size: 14px; font-weight: 500;">${s.name}</span>
        <span style="font-size: 14px; font-weight: 700; color: var(--tertiary);">${s.price === 0 ? 'Miễn phí' : Format.price(s.price)}</span>
      </div>
    `).join("");
  }

  // Rules Tab
  const rulesList = document.getElementById("detail-rules-list");
  if (rulesList) {
    rulesList.innerHTML = venue.rules.map((r, i) => `
      <div class="rule-item-row">
        <span class="rule-number">${i + 1}.</span>
        <span style="font-size: 14px; color: var(--on-surface);">${r}</span>
      </div>
    `).join("");
  }

  // Default to Prices tab
  switchDetailTab('prices', document.querySelector(".venue-tab-item"));

  navigateTo("venue-detail");
}

function switchDetailTab(tabId, element) {
  document.querySelectorAll(".venue-tab-item").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".venue-tab-pane").forEach(p => p.classList.remove("active"));

  if (element) element.classList.add("active");
  const pane = document.getElementById(`tab-pane-${tabId}`);
  if (pane) pane.classList.add("active");
}

function toggleCurrentVenueFavorite() {
  if (!currentVenueId) return;
  const isFav = SportStore.toggleFavorite(currentVenueId);
  const heartBtn = document.getElementById("detail-heart-btn");
  if (heartBtn) heartBtn.classList.toggle("active", isFav);
  showToast(isFav ? "Đã lưu vào sân yêu thích ❤️" : "Đã xoá khỏi sân yêu thích");
  updateUserUI();
}

// ==========================================================================
// SLOT PICKER SCREEN (14 Days & Booking Timetable)
// ==========================================================================

function openSlotPickerForCurrentVenue() {
  if (!currentVenueId) return;
  selectedDateObj = new Date();
  selectedSlotState = null;

  render14DatePicker();
  renderYardSlots();
  updateSlotSelectionSummary();

  navigateTo("slot-picker");
}

function render14DatePicker() {
  const container = document.getElementById("slot-date-picker");
  const venue = SportStore.getVenueById(currentVenueId);
  if (!container || !venue) return;

  document.getElementById("slot-picker-venue-name").textContent = venue.name;

  const daysHtml = [];
  const today = new Date();
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const isSelected = d.toDateString() === selectedDateObj.toDateString();
    const dayLabel = i === 0 ? "Hôm nay" : dayNames[d.getDay()];
    const dateNum = d.getDate();

    daysHtml.push(`
      <div class="date-pill-btn ${isSelected ? 'active' : ''}" onclick="pickDate(${i}, this)">
        <span class="date-day-label">${dayLabel}</span>
        <span class="date-num-label">${dateNum}</span>
      </div>
    `);
  }

  container.innerHTML = daysHtml.join("");
}

function pickDate(dayOffset, element) {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  selectedDateObj = d;

  document.querySelectorAll(".date-pill-btn").forEach(b => b.classList.remove("active"));
  if (element) element.classList.add("active");

  selectedSlotState = null;
  renderYardSlots();
  updateSlotSelectionSummary();
}

function renderYardSlots() {
  const container = document.getElementById("slot-yards-container");
  const venue = SportStore.getVenueById(currentVenueId);
  if (!container || !venue) return;

  const yardSlots = SportStore.generateSlots(venue, selectedDateObj);

  container.innerHTML = yardSlots.map(item => `
    <div class="yard-card-group">
      <div class="yard-card-title">
        <span>${item.yard.name}</span>
        <span class="yard-hourly-rate">${Format.price(item.yard.hourlyPrice)}/giờ</span>
      </div>
      <div class="slots-grid">
        ${item.slots.map(s => {
          const isSelected = selectedSlotState && selectedSlotState.yardId === item.yard.id && selectedSlotState.hours.includes(s.hour);
          const isDisabled = !s.available;
          return `
            <button class="slot-btn ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" 
                    ${isDisabled ? 'disabled' : ''} 
                    onclick="handleSlotTap('${item.yard.id}', '${item.yard.name}', ${s.hour}, ${s.price}, this)">
              <span class="slot-time">${s.startHour}</span>
              <span class="slot-price">${Format.shortPrice(s.price)}</span>
            </button>
          `;
        }).join("")}
      </div>
    </div>
  `).join("");
}

// Consecutive Slot Selection Rules (1-8 hours on same court)
function handleSlotTap(yardId, yardName, hour, price) {
  if (!selectedSlotState || selectedSlotState.yardId !== yardId) {
    // Start fresh selection on this yard
    selectedSlotState = {
      yardId,
      yardName,
      hours: [hour],
      prices: [price]
    };
  } else {
    const hours = selectedSlotState.hours;
    const minH = Math.min(...hours);
    const maxH = Math.max(...hours);

    if (hours.length === 1 && hours[0] === hour) {
      // Deselect single slot
      selectedSlotState = null;
    } else if (hour === minH - 1 && hours.length < 8) {
      // Prepend previous hour
      selectedSlotState.hours.unshift(hour);
      selectedSlotState.prices.unshift(price);
    } else if (hour === maxH + 1 && hours.length < 8) {
      // Append next hour
      selectedSlotState.hours.push(hour);
      selectedSlotState.prices.push(price);
    } else if (hour === minH) {
      // Remove first hour
      selectedSlotState.hours.shift();
      selectedSlotState.prices.shift();
    } else if (hour === maxH) {
      // Remove last hour
      selectedSlotState.hours.pop();
      selectedSlotState.prices.pop();
    } else {
      // Restart from tapped hour
      selectedSlotState = {
        yardId,
        yardName,
        hours: [hour],
        prices: [price]
      };
    }
  }

  renderYardSlots();
  updateSlotSelectionSummary();
}

function updateSlotSelectionSummary() {
  const courtEl = document.getElementById("summary-court-name");
  const timeEl = document.getElementById("summary-time-range");
  const priceEl = document.getElementById("summary-total-price");
  const btn = document.getElementById("btn-proceed-booking");

  if (!selectedSlotState || selectedSlotState.hours.length === 0) {
    courtEl.textContent = "Chưa chọn giờ";
    timeEl.textContent = "Nhấn chọn khung giờ trên bảng";
    priceEl.textContent = "0 đ";
    btn.disabled = true;
    return;
  }

  const hours = selectedSlotState.hours;
  const startH = Math.min(...hours);
  const endH = Math.max(...hours) + 1;
  const totalHours = hours.length;
  const totalPrice = selectedSlotState.prices.reduce((a, b) => a + b, 0);

  courtEl.textContent = selectedSlotState.yardName;
  timeEl.textContent = `${Format.date(selectedDateObj)} · ${startH}:00 - ${endH}:00 (${totalHours} giờ)`;
  priceEl.textContent = Format.price(totalPrice);
  btn.disabled = false;
}

function confirmBookingFromSelection() {
  if (!selectedSlotState || selectedSlotState.hours.length === 0) return;

  const venue = SportStore.getVenueById(currentVenueId);
  const hours = selectedSlotState.hours;
  const startH = Math.min(...hours);
  const endH = Math.max(...hours) + 1;
  const totalAmount = selectedSlotState.prices.reduce((a, b) => a + b, 0);

  const newBooking = {
    id: "BK-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    branchId: venue.id,
    branchName: venue.name,
    branchAddress: venue.address,
    branchImage: venue.images[0],
    yardName: selectedSlotState.yardName,
    dateString: selectedDateObj.toISOString().split("T")[0],
    startTime: `${startH < 10 ? '0' : ''}${startH}:00`,
    endTime: `${endH < 10 ? '0' : ''}${endH}:00`,
    hoursCount: hours.length,
    amount: totalAmount,
    status: "PENDING_PAYMENT",
    createdAt: Date.now(),
    paymentExpiresAt: Date.now() + 15 * 60 * 1000 // 15 mins hold
  };

  SportStore.addBooking(newBooking);
  showToast("Giữ chỗ thành công! Vui lòng hoàn tất thanh toán.");
  openBookingDetail(newBooking.id);
}

// ==========================================================================
// BOOKING DETAIL & CHECKOUT
// ==========================================================================

function openBookingDetail(bookingId) {
  const bk = SportStore.bookings.find(b => b.id === bookingId);
  if (!bk) return;

  currentBooking = bk;

  document.getElementById("booking-venue-name").textContent = bk.branchName;
  document.getElementById("booking-venue-addr").textContent = bk.branchAddress;
  document.getElementById("booking-venue-img").src = bk.branchImage || "";
  document.getElementById("booking-fact-yard").textContent = bk.yardName;
  document.getElementById("booking-fact-date").textContent = bk.dateString;
  document.getElementById("booking-fact-time").textContent = `${bk.startTime} - ${bk.endTime} (${bk.hoursCount} giờ)`;
  document.getElementById("booking-fact-code").textContent = bk.id;
  document.getElementById("booking-fact-amount").textContent = Format.price(bk.amount);

  updateBookingStatusBanner(bk);

  navigateTo("booking-detail");
}

function updateBookingStatusBanner(bk) {
  const banner = document.getElementById("booking-detail-banner");
  const emoji = document.getElementById("booking-banner-emoji");
  const title = document.getElementById("booking-banner-title");
  const desc = document.getElementById("booking-banner-desc");
  const paymentActions = document.getElementById("booking-payment-actions");
  const confirmedCard = document.getElementById("booking-confirmed-card");

  if (countdownInterval) clearInterval(countdownInterval);

  if (bk.status === "PENDING_PAYMENT") {
    banner.className = "booking-status-banner pending";
    emoji.textContent = "⏳";
    title.textContent = "Chờ thanh toán";
    desc.innerHTML = `Giữ chỗ còn <b id="booking-countdown-val">15:00</b>`;
    paymentActions.style.display = "block";
    confirmedCard.style.display = "none";

    // Countdown logic
    const tick = () => {
      const remainingMs = Math.max(0, (bk.paymentExpiresAt || (Date.now() + 600000)) - Date.now());
      const mins = Math.floor(remainingMs / 60000);
      const secs = Math.floor((remainingMs % 60000) / 1000);
      const valEl = document.getElementById("booking-countdown-val");
      if (valEl) {
        valEl.textContent = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }
      if (remainingMs <= 0) {
        clearInterval(countdownInterval);
        SportStore.updateBookingStatus(bk.id, "EXPIRED");
        updateBookingStatusBanner(bk);
      }
    };
    tick();
    countdownInterval = setInterval(tick, 1000);

  } else if (bk.status === "PENDING_OWNER_CONFIRMATION") {
    banner.className = "booking-status-banner pending";
    emoji.textContent = "⏳";
    title.textContent = "Chờ chủ sân xác nhận";
    desc.textContent = "Đã thanh toán thành công. Đang chờ chủ sân duyệt lịch đặt.";
    paymentActions.style.display = "none";
    confirmedCard.style.display = "none";

  } else if (bk.status === "CONFIRMED") {
    banner.className = "booking-status-banner confirmed";
    emoji.textContent = "✅";
    title.textContent = "Đặt lịch thành công!";
    desc.textContent = "Hẹn gặp bạn tại sân đúng giờ. Chúc bạn chơi vui vẻ!";
    paymentActions.style.display = "none";
    confirmedCard.style.display = "block";

  } else if (bk.status === "CANCELLED") {
    banner.className = "booking-status-banner cancelled";
    emoji.textContent = "🚫";
    title.textContent = "Lịch đặt đã huỷ";
    desc.textContent = "Khung giờ này đã được giải phóng trả lại hệ thống.";
    paymentActions.style.display = "none";
    confirmedCard.style.display = "none";
  }
}

function selectPaymentMethod(element) {
  document.querySelectorAll(".payment-option-card").forEach(c => c.classList.remove("selected"));
  element.classList.add("selected");
}

function processPayment() {
  if (!currentBooking) return;

  showToast("Đang xác nhận giao dịch…");
  setTimeout(() => {
    SportStore.updateBookingStatus(currentBooking.id, "CONFIRMED");
    currentBooking.status = "CONFIRMED";
    updateBookingStatusBanner(currentBooking);
    showToast("🎉 Thanh toán thành công! Sân đã được đặt.");
    updateUserUI();
  }, 1000);
}

function confirmCancelBooking() {
  openModal("modal-cancel-booking");
}

function doCancelBooking() {
  closeModal("modal-cancel-booking");
  if (!currentBooking) return;

  SportStore.updateBookingStatus(currentBooking.id, "CANCELLED");
  currentBooking.status = "CANCELLED";
  updateBookingStatusBanner(currentBooking);
  showToast("Đã huỷ lịch đặt thành công.");
  updateUserUI();
}

// ==========================================================================
// BOOKINGS SCREEN
// ==========================================================================

function filterBookings(status, element) {
  document.querySelectorAll("#bookings-status-filter .sport-chip").forEach(c => c.classList.remove("active"));
  if (element) element.classList.add("active");

  renderBookingsScreen(status);
}

function renderBookingsScreen(statusFilter = "ALL") {
  const container = document.getElementById("bookings-list-container");
  if (!container) return;

  let bookings = SportStore.bookings;
  if (statusFilter !== "ALL") {
    bookings = bookings.filter(b => b.status === statusFilter);
  }

  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box">
        <div class="empty-emoji-circle">📅</div>
        <div class="empty-title">Chưa có lịch đặt sân</div>
        <div class="empty-subtitle">Các lượt đặt sân của bạn sẽ xuất hiện tại đây để theo dõi và thanh toán.</div>
        <button class="btn-primary-gradient" onclick="navigateTo('home')" style="margin-top: 14px;">
          Đặt sân ngay
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = bookings.map(b => {
    let badgeClass = "pending";
    let badgeLabel = "⏳ Chờ thanh toán";
    if (b.status === "PENDING_OWNER_CONFIRMATION") {
      badgeClass = "pending";
      badgeLabel = "⌛ Chờ duyệt";
    } else if (b.status === "CONFIRMED") {
      badgeClass = "confirmed";
      badgeLabel = "✅ Đã xác nhận";
    } else if (b.status === "CANCELLED") {
      badgeClass = "cancelled";
      badgeLabel = "🚫 Đã huỷ";
    }

    return `
      <div class="booking-item-card" onclick="openBookingDetail('${b.id}')">
        <div style="display: flex; gap: 12px; align-items: center;">
          <img src="${b.branchImage}" style="width: 58px; height: 58px; border-radius: var(--radius-md); object-fit: cover;" alt="Venue">
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 700; font-size: 15px; color: var(--on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${b.branchName}</div>
            <div style="font-size: 12.5px; color: var(--on-surface-variant);">${b.yardName}</div>
          </div>
          <span class="sport-tag" style="font-size: 11px;">#${b.id.substring(0, 8)}</span>
        </div>
        <div style="height: 1px; background: var(--outline-variant); margin: 2px 0;"></div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 13.5px; font-weight: 600; color: var(--on-surface);">${b.dateString}</div>
            <div style="font-size: 12px; color: var(--on-surface-variant);">${b.startTime} - ${b.endTime} (${b.hoursCount} giờ)</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 15px; font-weight: 800; color: var(--tertiary);">${Format.price(b.amount)}</div>
            <div style="font-size: 11.5px; font-weight: 700; margin-top: 2px;">
              ${badgeLabel}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// ==========================================================================
// INTERACTIVE MAP SCREEN (Leaflet & OpenStreetMap)
// ==========================================================================

function initLeafletMap() {
  if (leafletMap) return;

  const mapEl = document.getElementById("leaflet-map");
  if (!mapEl) return;

  // Center on TP.HCM (or first venue)
  leafletMap = L.map('leaflet-map').setView([10.795, 106.67], 13);

  // OpenStreetMap standard tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(leafletMap);

  updateMapMarkers();
}

function updateMapMarkers() {
  if (!leafletMap) return;

  // Clear existing markers
  mapMarkers.forEach(m => leafletMap.removeLayer(m));
  mapMarkers = [];

  const venues = SportStore.getVenues(selectedSportSlug);

  venues.forEach(v => {
    const customIcon = L.divIcon({
      className: 'custom-venue-pin',
      html: `
        <div style="background: var(--brand-teal); color: #fff; padding: 4px 8px; border-radius: var(--radius-pill); font-weight: 700; font-size: 12px; box-shadow: 0 3px 10px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 4px; border: 2px solid #fff; white-space: nowrap;">
          <span>★ ${v.rating.toFixed(1)}</span>
        </div>
      `,
      iconSize: [60, 30],
      iconAnchor: [30, 30]
    });

    const marker = L.marker([v.lat, v.lng], { icon: customIcon }).addTo(leafletMap);

    marker.on("click", () => {
      showMapVenuePreview(v);
    });

    mapMarkers.push(marker);
  });
}

function showMapVenuePreview(v) {
  const preview = document.getElementById("map-venue-preview");
  if (!preview) return;

  preview.style.display = "block";
  preview.innerHTML = `
    <div class="venue-row-card" style="box-shadow: var(--shadow-lg); border: 2px solid var(--primary);" onclick="navigateToVenueDetail('${v.id}')">
      <div class="row-card-img-wrap" style="width: 80px; height: 80px;">
        <img src="${v.images[0]}" alt="${v.name}">
      </div>
      <div class="row-card-content">
        <h4 style="font-size: 14.5px; font-weight: 700; color: var(--on-surface);">${v.name}</h4>
        <div style="font-size: 12px; color: var(--on-surface-variant); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${v.address}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
          <span style="font-size: 12px; font-weight: 700; color: var(--tertiary);">từ ${Format.shortPrice(v.minPrice)}/h</span>
          <button class="btn-primary-gradient" style="padding: 4px 12px; font-size: 12px; border-radius: 6px;">Xem sân</button>
        </div>
      </div>
    </div>
  `;
}

function recenterMap() {
  if (leafletMap) {
    leafletMap.setView([10.795, 106.67], 13);
    showToast("Đã căn lại bản đồ theo vị trí của bạn.");
  }
}

// ==========================================================================
// SEARCH SCREEN
// ==========================================================================

function renderSearchScreen() {
  const recentContainer = document.getElementById("search-recent-chips");
  if (recentContainer) {
    const list = SportStore.recentSearches;
    if (list.length === 0) {
      recentContainer.innerHTML = `<span style="font-size: 12.5px; color: var(--on-surface-variant);">Chưa có tìm kiếm nào.</span>`;
    } else {
      recentContainer.innerHTML = list.map(item => `
        <div class="sport-chip" onclick="applySearchTerm('${item}')" style="padding: 6px 12px; font-size: 13px;">
          <span>🔍</span>
          <span>${item}</span>
        </div>
      `).join("");
    }
  }

  // Preload suggestions
  handleLiveSearch("");
}

function handleLiveSearch(query) {
  const container = document.getElementById("search-results-list");
  const title = document.getElementById("search-results-title");
  if (!container) return;

  const results = SportStore.getVenues(null, query, "rating");

  if (title) {
    title.textContent = query.trim() ? `Kết quả tìm kiếm (${results.length})` : "Gợi ý cho bạn";
  }

  renderRowCards(results, container);

  if (query.trim().length > 2) {
    SportStore.addRecentSearch(query);
  }
}

function applySearchTerm(term) {
  const inp = document.getElementById("search-input-field");
  if (inp) inp.value = term;
  handleLiveSearch(term);
}

function clearSearchInput() {
  const inp = document.getElementById("search-input-field");
  if (inp) inp.value = "";
  handleLiveSearch("");
}

function clearSearchHistory() {
  SportStore.clearRecentSearches();
  renderSearchScreen();
  showToast("Đã xoá lịch sử tìm kiếm.");
}

// ==========================================================================
// FAVORITES SCREEN
// ==========================================================================

function renderFavoritesScreen() {
  const container = document.getElementById("favorites-list-container");
  if (!container) return;

  const favIds = Array.from(SportStore.favorites);
  const list = SportStore.getVenues().filter(v => favIds.includes(v.id));

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box">
        <div class="empty-emoji-circle">❤️</div>
        <div class="empty-title">Chưa có sân yêu thích</div>
        <div class="empty-subtitle">Nhấn vào biểu tượng trái tim ở bất kỳ sân nào để lưu lại danh sách yêu thích của bạn.</div>
      </div>
    `;
    return;
  }

  renderRowCards(list, container);
}

// ==========================================================================
// PROFILE & ACCOUNT MODALS
// ==========================================================================

function updateUserUI() {
  const user = SportStore.user;

  // Header & Profile Card
  const greeting = document.getElementById("home-greeting-name");
  if (greeting) greeting.textContent = `Chào ${user.displayName} 👋`;

  const avatarInitial = user.displayName ? user.displayName.trim().charAt(0).toUpperCase() : "U";

  const homeAvatar = document.getElementById("home-avatar-btn");
  if (homeAvatar) homeAvatar.textContent = avatarInitial;

  const deskAvatar = document.getElementById("desktop-user-avatar");
  if (deskAvatar) deskAvatar.textContent = avatarInitial;

  const deskName = document.getElementById("desktop-user-name");
  if (deskName) deskName.textContent = user.displayName;

  const accAvatar = document.getElementById("account-avatar-large");
  if (accAvatar) accAvatar.textContent = avatarInitial;

  const accName = document.getElementById("account-name-text");
  if (accName) accName.textContent = user.displayName;

  const accIdent = document.getElementById("account-identifier-text");
  if (accIdent) accIdent.textContent = user.identifier;

  // Stats Counters
  const bkCount = document.getElementById("stat-bookings-count");
  if (bkCount) bkCount.textContent = SportStore.bookings.length;

  const favCount = document.getElementById("stat-favorites-count");
  if (favCount) favCount.textContent = SportStore.favorites.size;
}

function openEditProfileModal() {
  const user = SportStore.user;
  document.getElementById("input-edit-name").value = user.displayName;
  document.getElementById("input-edit-phone").value = user.phone || "";
  openModal("modal-edit-profile");
}

function saveUserProfile() {
  const name = document.getElementById("input-edit-name").value.trim();
  const phone = document.getElementById("input-edit-phone").value.trim();

  if (!name) {
    alert("Vui lòng nhập tên hiển thị");
    return;
  }

  const updated = {
    ...SportStore.user,
    displayName: name,
    phone
  };

  SportStore.saveUser(updated);
  updateUserUI();
  closeModal("modal-edit-profile");
  showToast("Đã cập nhật thông tin thành công!");
}

function handleLogout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
    try { sessionStorage.removeItem("currentUser"); } catch (e) {}
    window.location.href = "login.html";
  }
}

// Modal & Toast Helpers
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("active");
}

let toastTimer = null;
function showToast(msg) {
  const toastBox = document.getElementById("toast-box");
  const toastMsg = document.getElementById("toast-message");
  if (!toastBox || !toastMsg) return;

  toastMsg.textContent = msg;
  toastBox.style.display = "flex";

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastBox.style.display = "none";
  }, 2600);
}
