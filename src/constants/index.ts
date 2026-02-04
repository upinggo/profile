// API Constants
export const API_ENDPOINTS = {
  PROFILE: '/api/profile',
  TECH_STACK: '/api/tech-stack'
} as const;

// Navigation Links
export const EXTERNAL_LINKS = {
  GITHUB: 'https://github.com/upinggo',
  LEETCODE_EN: 'https://leetcode.com/u/uping_s/',
  LEETCODE_CN: 'https://leetcode.cn/u/wo-shi-dou-bi-ni-xin-ma/'
} as const;

// Image Constants
export const IMAGE_CONFIG = {
  AVATAR_PLACEHOLDER: '/default-avatar.png',
  ERROR_IMAGE: '/error-image.png'
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  PROFILE_TTL: 60, // seconds
  TECH_STACK_TTL: 300 // seconds
} as const;

// Retry Configuration
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  EXPONENTIAL_BACKOFF: true
} as const;

// Animation Durations
export const ANIMATION_DURATIONS = {
  TRANSITION_FAST: '150ms',
  TRANSITION_NORMAL: '300ms',
  TRANSITION_SLOW: '500ms'
} as const;