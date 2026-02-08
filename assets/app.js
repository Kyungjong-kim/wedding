// ===== 설정 (assets/config.js에서 수정) =====
const cfg = typeof CONFIG !== 'undefined' ? CONFIG : {
  wedding: { dateTime: '2027-03-00T12:00:00+09:00', address: '', groomName: '', brideName: '', venue: '' },
  parents: { groom: { father: '', mother: '' }, bride: { father: '', mother: '' } },
  venue: { place: '', address: '', phone: '', transit: '', parking: '', kakaoMapKey: '', lat: null, lng: null, kakaoUrl: '', naverUrl: '' },
  account: { show: true, groom: {}, bride: {} },
  bgm: { src: './assets/bgm.mp3', autoPlayAttempt: false },
  gallery: [],
  galleryTitle: '갤러리',
  rsvp: { deadline: '', formUrl: '' },
  heroHint: '',
  heroPhrase: '우리, 결혼합니다',
  heroCoverImage: '',
  heroFlowers: true,
  heroImages: { groom: '', bride: '' },
};

// ===== BGM 초기화 (config 기반) =====
const bgmEl = document.getElementById('bgm');
if (bgmEl && cfg.bgm) {
  bgmEl.src = cfg.bgm.src;
  if (cfg.bgm.autoPlayAttempt) {
    bgmEl.play().catch(() => {}); // 모바일: 대부분 차단됨
  }
}

// ===== 결혼 정보 DOM 반영 (config → HTML) =====
function applyWeddingConfig() {
  const w = cfg.wedding;
  if (!w) return;
  const set = (sel, text) => { const el = document.querySelector(sel); if (el) el.textContent = text ?? ''; };
  set('#heroNames', `${w.groomName} & ${w.brideName}`);
  set('#heroPhrase', cfg.heroPhrase ?? '우리, 결혼합니다');
  if (w.dateTime) {
    const d = new Date(w.dateTime);
    const week = '일월화수목금토'[d.getDay()];
    const dateStr = `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(d.getDate()).padStart(2, '0')} (${week})`;
    const timeStr = `오후 ${d.getHours()}시 ${String(d.getMinutes()).padStart(2, '0')}분`;
    set('#heroDate', `${dateStr} ${timeStr}`);
  }
  set('#heroVenue', w.venue);
  set('.names .name-row:nth-child(1) .value', w.groomName);
  set('.names .name-row:nth-child(2) .value', w.brideName);
}
applyWeddingConfig();

function applyParentsConfig() {
  const p = cfg.parents;
  if (!p) return;
  const set = (sel, text) => { const el = document.querySelector(sel); if (el) el.textContent = text ?? ''; };
  if (p.groom && p.bride) set('#heroParents', `신랑 ${p.groom.father} · ${p.groom.mother}의 아들 · 신부 ${p.bride.father} · ${p.bride.mother}의 딸`);
  if (p.groom) set('#inviteGroomParents', `${p.groom.father} · ${p.groom.mother}의 아들`);
  if (p.bride) set('#inviteBrideParents', `${p.bride.father} · ${p.bride.mother}의 딸`);
}
applyParentsConfig();

function applyVenueConfig() {
  const v = cfg.venue;
  if (!v) return;
  const set = (sel, text) => { const el = document.querySelector(sel); if (el) el.textContent = text ?? ''; };
  set('#venuePlace', v.place);
  set('#venueAddr', v.address);
  set('#venueTransit', v.transit);
  set('#venueParking', v.parking);
  const phoneEl = document.getElementById('venuePhone');
  if (phoneEl) {
    phoneEl.textContent = v.phone || '-';
    phoneEl.href = v.phone ? `tel:${v.phone.replace(/-/g, '')}` : '#';
  }
  document.getElementById('btnKakaoMap')?.setAttribute('href', v.kakaoUrl || 'https://map.kakao.com/');
  document.getElementById('btnNaverMap')?.setAttribute('href', v.naverUrl || 'https://map.naver.com/');
  document.getElementById('venuePhoneRow')?.classList.toggle('hidden', !v.phone);
  document.getElementById('venueTransitRow')?.classList.toggle('hidden', !v.transit);
  document.getElementById('venueParkingRow')?.classList.toggle('hidden', !v.parking);
}
applyVenueConfig();

// ===== 카카오 지도 SDK (kakaoMapKey 입력 시 활성화) =====
function initKakaoMap() {
  const key = cfg.venue?.kakaoMapKey?.trim();
  const container = document.getElementById('mapContainer');
  const wrapper = container?.closest('.map-wrapper');

  if (!key || !container || !wrapper) return;

  const loadMap = (lat, lng) => {
    const options = {
      center: new kakao.maps.LatLng(lat, lng),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
    const markerPos = new kakao.maps.LatLng(lat, lng);
    const marker = new kakao.maps.Marker({ position: markerPos });
    marker.setMap(map);
    container.classList.add('active');
    wrapper.classList.add('has-map');
    container.setAttribute('aria-hidden', 'false');
  };

  const tryInit = () => {
    const lat = cfg.venue?.lat;
    const lng = cfg.venue?.lng;
    if (typeof lat === 'number' && typeof lng === 'number') {
      loadMap(lat, lng);
      return;
    }
    const addr = cfg.venue?.address;
    if (addr && typeof kakao?.maps?.services !== 'undefined') {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(addr, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          loadMap(Number(result[0].y), Number(result[0].x));
        }
      });
      return;
    }
    loadMap(37.5665, 126.978); // 서울 시청 기본값
  };

  if (typeof kakao !== 'undefined' && kakao.maps) {
    tryInit();
    return;
  }

  const script = document.createElement('script');
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&libraries=services&autoload=false`;
  script.async = true;
  script.onload = () => {
    kakao.maps.load(tryInit);
  };
  script.onerror = () => {
    console.warn('카카오 지도 SDK 로드 실패. 키와 도메인 설정을 확인하세요.');
  };
  document.head.appendChild(script);
}
initKakaoMap();

function applyAccountConfig() {
  const a = cfg.account;
  if (!a) return;
  const section = document.getElementById('accountSection');
  if (a.show === false && section) {
    section.style.display = 'none';
    return;
  }
  const set = (sel, text) => { const el = document.querySelector(sel); if (el) el.textContent = text ?? ''; };
  if (a.groom) {
    set('#groomBank', a.groom.bank);
    set('#groomAcct', a.groom.account);
    set('#groomHolder', a.groom.holder);
  }
  if (a.bride) {
    set('#brideBank', a.bride.bank);
    set('#brideAcct', a.bride.account);
    set('#brideHolder', a.bride.holder);
  }
}
applyAccountConfig();

function applyHeroConfig() {
  const hint = document.getElementById('heroHint');
  if (hint) hint.textContent = cfg.heroHint ?? '';
  if (!cfg.heroHint) hint?.classList.add('hidden');

  const coverImg = cfg.heroCoverImage?.trim();
  const hero = document.querySelector('.hero');
  const heroCover = document.getElementById('heroCover');
  const heroProfiles = document.querySelector('.hero-profiles');

  if (coverImg && heroCover && hero) {
    heroCover.style.backgroundImage = `url(${coverImg})`;
    heroCover.classList.add('has-img');
    hero.classList.add('has-cover');
    heroProfiles?.classList.add('hidden');
  } else {
    const imgs = cfg.heroImages || {};
    const groomImg = document.getElementById('heroGroomImg');
    const brideImg = document.getElementById('heroBrideImg');
    if (imgs.groom && groomImg) { groomImg.style.backgroundImage = `url(${imgs.groom})`; groomImg.classList.add('has-img'); }
    if (imgs.bride && brideImg) { brideImg.style.backgroundImage = `url(${imgs.bride})`; brideImg.classList.add('has-img'); }
  }
  const flowersEl = document.querySelector('.hero-flowers');
  if (flowersEl) flowersEl.classList.toggle('hidden', cfg.heroFlowers === false);
}
applyHeroConfig();

function applyGalleryTitle() {
  const el = document.getElementById('galleryTitle');
  if (el && cfg.galleryTitle) el.textContent = cfg.galleryTitle;
}
applyGalleryTitle();

function applyRsvpDeadline() {
  const el = document.getElementById('rsvpDeadline');
  if (!el) return;
  const deadline = cfg.rsvp?.deadline;
  if (!deadline) {
    el.classList.add('hidden');
    return;
  }
  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) {
    el.classList.add('hidden');
    return;
  }
  el.textContent = `${d.getMonth() + 1}월 ${d.getDate()}일까지 참석 여부를 알려주세요`;
  el.classList.remove('hidden');
}
applyRsvpDeadline();
const els = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }
  },
  { threshold: 0.15 }
);
els.forEach((el) => io.observe(el));

// ===== D-DAY =====
function getDdayTarget() {
  const custom = cfg.dday?.targetDateTime?.trim();
  return custom || cfg.wedding?.dateTime || '';
}

function updateDday() {
  const targetStr = getDdayTarget();
  const target = targetStr ? new Date(targetStr).getTime() : NaN;
  const now = Date.now();
  const diff = target - now;

  const dEl = document.getElementById('ddayDays');
  const hEl = document.getElementById('ddayHours');
  const mEl = document.getElementById('ddayMins');
  const bigEl = document.getElementById('ddayBig');

  if (!dEl || !hEl || !mEl || !bigEl) return;

  const invalidText = cfg.dday?.invalidText || '?? ?? ??';
  const doneText = cfg.dday?.doneText || 'D-DAY';

  if (Number.isNaN(target)) {
    bigEl.textContent = invalidText;
    return;
  }

  if (diff <= 0) {
    bigEl.textContent = doneText;
    dEl.textContent = '0';
    hEl.textContent = '0';
    mEl.textContent = '0';
    return;
  }

  const totalMins = Math.floor(diff / 60000);
  const days = Math.floor(totalMins / (60 * 24));
  const hours = Math.floor((totalMins - days * 60 * 24) / 60);
  const mins = totalMins % 60;

  bigEl.textContent = `D-${String(days).padStart(3, '0')}`;
  dEl.textContent = String(days);
  hEl.textContent = String(hours);
  mEl.textContent = String(mins);
}
updateDday();
const ddayInterval = Number(cfg.dday?.updateIntervalMs) || 30000;
setInterval(updateDday, ddayInterval);

// ===== 복사 유틸 =====
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast('복사됨');
  } catch {
    // iOS 일부/권한 문제 fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    toast('복사됨');
  }
}

function toast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.position = 'fixed';
  t.style.left = '50%';
  t.style.bottom = '22px';
  t.style.transform = 'translateX(-50%)';
  t.style.padding = '10px 12px';
  t.style.borderRadius = '999px';
  t.style.border = '1px solid rgba(139,115,115,.2)';
  t.style.background = 'rgba(255,252,252,.95)';
  t.style.backdropFilter = 'blur(10px)';
  t.style.color = '#3d3232';
  t.style.boxShadow = '0 8px 24px rgba(139,100,100,.15)';
  t.style.fontSize = '13px';
  t.style.zIndex = '999';
  t.style.opacity = '0';
  t.style.transition = 'opacity .25s ease, transform .25s ease';
  document.body.appendChild(t);

  requestAnimationFrame(() => {
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(-6px)';
  });

  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => t.remove(), 300);
  }, 1200);
}

// ===== 링크/주소 복사 =====
document.getElementById('btnCopyLink')?.addEventListener('click', () => {
  copyText(location.href);
});
document.getElementById('btnCopyAddr')?.addEventListener('click', () => {
  copyText(cfg.venue?.address || cfg.wedding?.address || '');
});
document.querySelectorAll('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const sel = btn.getAttribute('data-copy');
    const el = sel ? document.querySelector(sel) : null;
    if (el) copyText(el.textContent.trim());
  });
});

// ===== BGM 토글 =====
const bgm = bgmEl || document.getElementById('bgm');
const btnMusic = document.getElementById('btnMusic');
const musicLabel = document.getElementById('musicLabel');

let musicOn = false;

btnMusic?.addEventListener('click', async () => {
  if (!bgm) return;
  try {
    if (!musicOn) {
      await bgm.play(); // 모바일은 사용자 제스처 후에만 가능
      musicOn = true;
      btnMusic.setAttribute('aria-pressed', 'true');
      musicLabel.textContent = '브금 ON';
      toast('브금 재생');
    } else {
      bgm.pause();
      musicOn = false;
      btnMusic.setAttribute('aria-pressed', 'false');
      musicLabel.textContent = '브금 OFF';
      toast('브금 정지');
    }
  } catch {
    toast('브금 재생이 차단됨(모바일 정책). 버튼 다시 눌러줘.');
  }
});

// ===== 갤러리 라이트박스 =====
const lightbox = document.getElementById('lightbox');
const lbContent = document.getElementById('lbContent');
const lbClose = document.getElementById('lbClose');
const galleryPaths = cfg.gallery || [];

document.querySelectorAll('.g-item').forEach((btn, idx) => {
  const imgPath = galleryPaths[idx];
  if (imgPath) {
    btn.style.backgroundImage = `url(${imgPath})`;
    btn.style.backgroundSize = 'cover';
    btn.style.backgroundPosition = 'center';
  }
  btn.addEventListener('click', () => {
    if (!lightbox || !lbContent) return;
    lbContent.style.backgroundImage = '';
    lbContent.style.filter = '';
    lbContent.innerHTML = '';
    if (imgPath) {
      const img = document.createElement('img');
      img.src = imgPath;
      img.alt = `갤러리 ${idx + 1}`;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      lbContent.appendChild(img);
    } else {
      lbContent.style.filter = `hue-rotate(${idx * 25}deg)`;
    }
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

lbClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// ===== 아코디언 토글 =====
document.querySelectorAll('.acc-head').forEach((btn) => {
  btn.addEventListener('click', () => {
    const acc = btn.closest('.accordion');
    const isOpen = acc?.classList.contains('open');
    document.querySelectorAll('.accordion').forEach((a) => a.classList.remove('open'));
    document.querySelectorAll('.acc-head').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    if (!isOpen) {
      acc?.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ===== RSVP =====
const rsvpForm = document.getElementById('rsvpForm');
const countSelect = rsvpForm?.querySelector('[name="count"]');
rsvpForm?.querySelectorAll('[name="attend"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    if (!countSelect) return;
    const isAttend = radio.value === 'yes';
    countSelect.required = isAttend;
    countSelect.disabled = !isAttend;
    if (!isAttend) countSelect.value = '';
  });
});
rsvpForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const formUrl = cfg.rsvp?.formUrl;
  if (formUrl) {
    const params = new URLSearchParams(new FormData(e.target));
    window.open(`${formUrl}?${params.toString()}`, '_blank');
    toast('참석 폼으로 이동합니다.');
  } else {
    toast('제출 완료(데모). formUrl 연결 시 폼 제출됩니다.');
  }
});
