export type GuideResourceType = "설정" | "체크리스트" | "협약서" | "활동지" | "대처";

export type GuideResource = {
  id: string;
  categoryId: string;
  group: string;
  type: GuideResourceType;
  title: string;
  url: string;
};

const ARCHIVE_RESOURCE_BASE_URL =
  "https://whyme-media-archive.vercel.app/resources";

function resourceUrl(slug: string) {
  return `${ARCHIVE_RESOURCE_BASE_URL}/${slug}`;
}

export const guideResources: GuideResource[] = [
  {
    id: "youtube-shorts-hide-30days",
    categoryId: "time_control",
    group: "유튜브 사용 조절",
    type: "설정",
    title: "유튜브 쇼츠 30일간 숨기기",
    url: resourceUrl("youtube-shorts-hide-30days"),
  },
  {
    id: "youtube-shorts-feed-limit",
    categoryId: "time_control",
    group: "유튜브 사용 조절",
    type: "설정",
    title: "유튜브 쇼츠 피드 제한",
    url: resourceUrl("youtube-shorts-feed-limit"),
  },
  {
    id: "home-smartphone-charging-zone",
    categoryId: "time_control",
    group: "생활 루틴",
    type: "활동지",
    title: "우리집 스마트폰존(충전존) 만들기",
    url: resourceUrl("smartphone-charging-zone"),
  },
  {
    id: "wmqi-content-evaluation-sheet",
    categoryId: "content_quality",
    group: "콘텐츠 평가",
    type: "체크리스트",
    title: "WMQI 콘텐츠 평가표",
    url: resourceUrl("wmqi-content-evaluation-sheet"),
  },
  {
    id: "youtube-restricted-mode",
    categoryId: "content_quality",
    group: "시청 환경",
    type: "설정",
    title: "유튜브 제한모드 설정",
    url: resourceUrl("youtube-restricted-mode"),
  },
  {
    id: "ad-blocker-install",
    categoryId: "content_quality",
    group: "시청 환경",
    type: "설정",
    title: "광고 차단 프로그램 설치",
    url: resourceUrl("browser-ad-blocker-install"),
  },
  {
    id: "instagram-private-account",
    categoryId: "social_safety",
    group: "인스타그램",
    type: "설정",
    title: "인스타그램 비공개 계정 설정",
    url: resourceUrl("instagram-private-account"),
  },
  {
    id: "instagram-tag-mention-limit",
    categoryId: "social_safety",
    group: "인스타그램",
    type: "설정",
    title: "인스타그램 태그 및 언급 제한",
    url: resourceUrl("instagram-tag-mention-limit"),
  },
  {
    id: "instagram-comment-filter",
    categoryId: "social_safety",
    group: "인스타그램",
    type: "설정",
    title: "인스타그램 원치 않는 댓글 숨기기",
    url: resourceUrl("instagram-comment-filter"),
  },
  {
    id: "kakao-talk-siren",
    categoryId: "social_safety",
    group: "카카오톡",
    type: "설정",
    title: "카카오톡 톡사이렌",
    url: resourceUrl("kakao-talk-siren"),
  },
  {
    id: "kakao-profile-visibility",
    categoryId: "social_safety",
    group: "카카오톡",
    type: "설정",
    title: "카카오톡 프로필 공개 범위 설정",
    url: resourceUrl("kakao-profile-photo-visibility"),
  },
  {
    id: "kakao-photo-private",
    categoryId: "social_safety",
    group: "카카오톡",
    type: "설정",
    title: "카카오톡 사진 나만 보기 전환",
    url: resourceUrl("kakao-profile-photo-private-only"),
  },
  {
    id: "kakao-groupchat-safety-settings",
    categoryId: "social_safety",
    group: "카카오톡",
    type: "설정",
    title: "카카오톡 단톡방 안전 설정 2가지",
    url: resourceUrl("kakao-groupchat-safety-settings"),
  },
  {
    id: "kakao-phone-number-friend-add-block",
    categoryId: "social_safety",
    group: "카카오톡",
    type: "설정",
    title: "카카오톡 전화번호로 친구추가 차단",
    url: resourceUrl("kakao-phone-number-friend-block"),
  },
  {
    id: "kakao-multi-profile",
    categoryId: "social_safety",
    group: "카카오톡",
    type: "설정",
    title: "카카오톡 멀티프로필 생성",
    url: resourceUrl("kakao-multi-profile-create"),
  },
  {
    id: "kakao-chat-capture-export",
    categoryId: "social_safety",
    group: "카카오톡",
    type: "대처",
    title: "카카오톡 캡처 및 대화 내보내기",
    url: resourceUrl("kakao-chat-capture-export"),
  },
  {
    id: "kakao-chat-input-lock",
    categoryId: "social_safety",
    group: "카카오톡",
    type: "설정",
    title: "카카오톡 채팅방 입력창 잠금 설정",
    url: resourceUrl("kakao-chat-input-lock"),
  },
  {
    id: "kakao-quiet-chatroom",
    categoryId: "social_safety",
    group: "카카오톡",
    type: "설정",
    title: "카카오톡 조용한 채팅방 설정",
    url: resourceUrl("kakao-quiet-chatroom-setting"),
  },
  {
    id: "discord-sensitive-content-filter",
    categoryId: "social_safety",
    group: "디스코드",
    type: "설정",
    title: "디스코드 민감한 콘텐츠 필터",
    url: resourceUrl("discord-sensitive-content-filter"),
  },
  {
    id: "discord-dm-filtering",
    categoryId: "social_safety",
    group: "디스코드",
    type: "설정",
    title: "디스코드 DM 필터링",
    url: resourceUrl("discord-dm-filtering"),
  },
  {
    id: "gaslighting-checklist",
    categoryId: "social_safety",
    group: "관계 안전 체크리스트",
    type: "체크리스트",
    title: "가스라이팅 체크리스트",
    url: resourceUrl("gaslighting-checklist"),
  },
  {
    id: "grooming-checklist",
    categoryId: "social_safety",
    group: "관계 안전 체크리스트",
    type: "체크리스트",
    title: "그루밍 체크리스트",
    url: resourceUrl("grooming-checklist"),
  },
  {
    id: "school-violence-checklist",
    categoryId: "social_safety",
    group: "관계 안전 체크리스트",
    type: "체크리스트",
    title: "학폭 체크리스트",
    url: resourceUrl("school-violence-checklist"),
  },
  {
    id: "school-violence-victim-response-guide",
    categoryId: "social_safety",
    group: "피해 대처 가이드",
    type: "대처",
    title: "학폭 피해자 대처법 단계별 가이드",
    url: resourceUrl("school-violence-victim-guide"),
  },
  {
    id: "game-minimum-checklist",
    categoryId: "game_spending",
    group: "게임 규칙",
    type: "체크리스트",
    title: "게임 최소 조건 체크리스트",
    url: resourceUrl("game-minimum-checklist"),
  },
  {
    id: "gambling-warning-signs-checklist",
    categoryId: "game_spending",
    group: "위험 신호",
    type: "체크리스트",
    title: "도박 징후 체크리스트",
    url: resourceUrl("gambling-warning-checklist"),
  },
  {
    id: "online-spending-rule-contract",
    categoryId: "game_spending",
    group: "결제 규칙",
    type: "협약서",
    title: "온라인 현질 규칙 협약서",
    url: resourceUrl("online-spending-rule-contract"),
  },
  {
    id: "recommendation-feedback-actions",
    categoryId: "digital_judgment",
    group: "알고리즘 조절",
    type: "설정",
    title: "관심없음·신고·싫어요·추천안함 활용",
    url: resourceUrl("youtube-feedback-controls"),
  },
  {
    id: "youtube-watch-history-reset",
    categoryId: "digital_judgment",
    group: "알고리즘 조절",
    type: "설정",
    title: "유튜브 시청기록 삭제 및 중단",
    url: resourceUrl("youtube-watch-history-reset"),
  },
  {
    id: "content-three-line-journal",
    categoryId: "digital_judgment",
    group: "기록과 성찰",
    type: "활동지",
    title: "오늘 본 콘텐츠 3줄 일지",
    url: resourceUrl("three-line-media-journal"),
  },
  {
    id: "family-media-rule-contract",
    categoryId: "family_communication",
    group: "가족 규칙",
    type: "협약서",
    title: "미디어 규칙 협약서",
    url: resourceUrl("family-media-rule-contract"),
  },
  {
    id: "chosen-youtuber-list",
    categoryId: "family_communication",
    group: "함께 고르기",
    type: "활동지",
    title: "우리가 함께 고른 유튜버",
    url: resourceUrl("wmqi-youtuber-selection"),
  },
  {
    id: "media-yellow-list",
    categoryId: "family_communication",
    group: "함께 고르기",
    type: "활동지",
    title: "미디어 옐로우리스트",
    url: resourceUrl("media-yellow-list"),
  },
];

export function getGuideResourcesForCategory(categoryId: string) {
  return guideResources.filter((guide) => guide.categoryId === categoryId);
}
