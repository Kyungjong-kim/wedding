/**
 * ============================================
 * 결혼식 모바일 청첩장 - 설정 파일
 * ============================================
 * 더미 데이터로 구성. 실제 운영 시 값만 교체하면 됨.
 */

const CONFIG = {
  // ─── BGM ─────────────────────────────────────
  bgm: {
    src: './assets/bgm.mp3',
    autoPlayAttempt: false,
  },

  // ─── 결혼 정보 ────────────────────────────────
  wedding: {
    dateTime: '2027-03-28T11:00:00+09:00',
    groomName: '김경종',
    brideName: '김부선',
    venue: '브라이튼 하우스',
    address: '경기 과천시 죽바위로 37-24 1층',
  },

  // D-DAY countdown settings
  dday: {
    // Use this if you want a custom target. If empty, wedding.dateTime is used.
    targetDateTime: '',
    updateIntervalMs: 30000,
    doneText: 'D-DAY',
    invalidText: 'DATE TBD',
  },

  // ─── 양가 부모님 성함 ──────────────────────────
  parents: {
    groom: { father: '김용섭', mother: '박예자' }, // 신랑 000의 아들 00
    bride: { father: '김문수', mother: '안애란' }, // 신부 000의 딸 00
  },

  /**
   * 첫 화면 커플 스튜디오 사진 (대표 커버 이미지)
   * 빈 문자열이면 그라디언트 배경. 경로 입력 시 큰 배경으로 표시.
   */
  heroCoverImage: './assets/images/main_bg.png', // './assets/cover-couple.jpg'

  /**
   * 첫 화면 꽃 데코 (3월 봄 분위기). false면 숨김.
   * true: 기본 SVG 꽃 표시. 이미지로 교체 시 아래 경로 배열 사용.
   */
  heroFlowers: true,
  /** 생성형 AI로 만든 꽃 이미지로 교체 시 (예: ['./assets/flower-1.png', ...]) */
  heroFlowerImages: [], // 비어있으면 SVG 사용

  // ─── HERO 프로필 사진 (heroCoverImage 없을 때만 표시) ─
  heroImages: {
    groom: '', // './assets/hero-groom.jpg'
    bride: '', // './assets/hero-bride.jpg'
  },

  // ─── 오시는 길 (지도 URL은 해당 장소 검색 링크) ─
  venue: {
    place: '브라이튼하우스 강남',
    address: '경기 과천시 죽바위로 37-24 1층',
    phone: '02-503-8007',
    transit: '양재시민의숲 역 셔틀 운행',
    parking: '건물 내 발렛 진행',
    /**
     * 카카오 지도 SDK 키 (비어있으면 placeholder 표시)
     * 1. https://developers.kakao.com → 앱 생성 → 플랫폼 키 → JavaScript 키 복사
     * 2. 동일 페이지에서 JavaScript SDK 도메인 등록 (예: http://localhost:3000, 운영 도메인)
     */
    kakaoMapKey: '',
    /** 지도 중심 좌표. 카카오맵(map.kakao.com)에서 장소 우클릭 → 좌표 복사. lat/lng 없으면 address로 검색 시도 */
    lat: 37.4292,
    lng: 127.0052,
    /** 카카오맵: https://map.kakao.com 에서 장소 검색 후 URL 복사 */
    kakaoUrl:
      'https://map.kakao.com/?q=%22%EB%B8%8C%EB%9D%BC%EC%9D%B4%ED%8A%BC%ED%95%98%EC%9A%B0%EC%8A%A4%20%EA%B0%95%EB%82%A8%22',
    /** 네이버: https://map.naver.com 에서 장소 검색 후 URL 복사 */
    naverUrl:
      'https://map.naver.com/p/search/%EB%B8%8C%EB%9D%BC%EC%9D%B4%ED%8A%BC%ED%95%98%EC%9A%B0%EC%8A%A4%20%EA%B0%95%EB%82%A8/place/1702459676?c=15.00,0,0,0,dh&isCorrectAnswer=true&placePath=/home?from=map&from=map&fromPanelNum=1&additionalHeight=76&timestamp=202602082040&locale=ko&svcName=map_pcv5&searchText=%EB%B8%8C%EB%9D%BC%EC%9D%B4%ED%8A%BC%ED%95%98%EC%9A%B0%EC%8A%A4%20%EA%B0%95%EB%82%A8&fromPanelNum=1&additionalHeight=76&timestamp=202602082039&locale=ko&svcName=map_pcv5&searchText=%EB%B8%8C%EB%9D%BC%EC%9D%B4%ED%8A%BC%ED%95%98%EC%9A%B0%EC%8A%A4%20%EA%B0%95%EB%82%A8',
  },

  // ─── 계좌 (show: false면 섹션 숨김) ───────────
  account: {
    show: true,
    groom: { bank: '국민은행', account: '123456-78-901234', holder: '김경종' },
    bride: { bank: '신한은행', account: '110-123-456789', holder: '김부선' },
  },

  // ─── 갤러리 ───────────────────────────────────
  gallery: [],
  galleryTitle: '갤러리',

  // ─── RSVP 참석 여부 ───────────────────────────
  rsvp: {
    deadline: '2027-03-01', // YYYY-MM-DD, 마감일 표시용
    formUrl: '', // Google Form 등 URL (비어있으면 데모)
  },

  /** 첫 화면 감성 문구 (예: "우리, 결혼합니다") ─ */
  heroPhrase: '우리, 결혼합니다',

  // ─── HERO 힌트 (빈 문자열이면 숨김) ───────────
  heroHint: '',
};
