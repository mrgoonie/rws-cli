/**
 * API response types for ReviewWeb.site API
 */

export interface ApiResponse<T = unknown> {
  status: number;
  data?: T;
  message?: string;
  error?: string;
}

export interface Review {
  id: string;
  url: string;
  status: string;
  instructions?: string;
  createdAt: string;
  updatedAt: string;
  result?: ReviewResult;
}

export interface ReviewResult {
  summary?: string;
  content?: string;
  images?: string[];
  links?: string[];
}

export interface ReviewListResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
}

export interface MarkdownConversionResponse {
  url: string;
  markdown: string;
  title?: string;
}

export interface ExtractedData {
  url: string;
  data: Record<string, unknown>;
}

export interface ScrapedContent {
  url: string;
  html: string;
  text?: string;
  title?: string;
}

export interface ExtractedLinks {
  url: string;
  links: LinkInfo[];
}

export interface LinkInfo {
  href: string;
  text?: string;
  type?: string;
  statusCode?: number;
}

export interface SummaryResponse {
  url: string;
  summary: string;
}

export interface UrlCheckResponse {
  url: string;
  isAlive: boolean;
  statusCode?: number;
  redirectUrl?: string;
}

export interface KeywordIdeasResponse {
  keyword: string;
  ideas: KeywordIdea[];
}

export interface KeywordIdea {
  keyword: string;
  searchVolume?: number;
  cpc?: number;
  competition?: string;
}

export interface KeywordDifficultyResponse {
  keyword: string;
  difficulty: number;
  searchVolume?: number;
}

export interface TrafficResponse {
  domain: string;
  traffic: number;
  organicKeywords?: number;
  backlinks?: number;
}

export interface BacklinksResponse {
  domain: string;
  backlinks: BacklinkInfo[];
  total: number;
}

export interface BacklinkInfo {
  sourceUrl: string;
  targetUrl: string;
  anchorText?: string;
  domainAuthority?: number;
}

export interface ScreenshotResponse {
  url: string;
  imageUrl: string;
  width?: number;
  height?: number;
}

export interface ApiKeyInfo {
  id: string;
  name: string;
  key?: string;
  createdAt: string;
  expiresAt?: string;
  lastUsedAt?: string;
}

export interface ProfileResponse {
  id: string;
  email: string;
  name?: string;
  plan?: string;
  usage?: UsageInfo;
}

export interface UsageInfo {
  requests: number;
  limit: number;
  resetAt?: string;
}

export interface HealthResponse {
  status: string;
  version?: string;
  timestamp?: string;
}
