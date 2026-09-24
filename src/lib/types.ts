export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "EDITOR_IN_CHIEF"
  | "EDITOR"
  | "DISTRICT_EDITOR"
  | "REPORTER"
  | "VIDEO_EDITOR"
  | "PHOTOGRAPHER"
  | "SOCIAL_MEDIA_MANAGER"
  | "SEO_MANAGER"
  | "AD_MANAGER"
  | "VIEWER"
  | "CITIZEN_CONTRIBUTOR";

export type Permission =
  | "VIEW_DASHBOARD"
  | "CREATE_NEWS"
  | "PUBLISH_NEWS"
  | "APPROVE_NEWS"
  | "REJECT_NEWS"
  | "DELETE_NEWS"
  | "ASSIGN_STORIES"
  | "MANAGE_SOCIAL"
  | "MANAGE_LIVE_TV"
  | "MANAGE_VIDEOS"
  | "MANAGE_GALLERY"
  | "MANAGE_ADS"
  | "MANAGE_NOTIFICATIONS"
  | "MANAGE_CITIZEN_REPORTS"
  | "VIEW_ANALYTICS"
  | "VIEW_AUDIT_LOGS"
  | "MANAGE_SETTINGS"
  | "MANAGE_USERS";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  district?: string;
  phone?: string;
  bio?: string;
  status?: "active" | "inactive";
  department?: string;
  permissions?: Permission[];
  createdAt?: string;
}

export type ArticleStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "NEEDS_CHANGES"
  | "APPROVED"
  | "SCHEDULED"
  | "PUBLISHED"
  | "ARCHIVED"
  | "REJECTED";

export interface ArticleSource {
  id: string;
  title: string;
  url?: string;
  sourceType: "press_release" | "official_document" | "reporter_notes" | "url" | "audio" | "citizen_tip";
  verificationStatus: "verified" | "unverified" | "flagged";
  confidenceScore?: number;
  extractedClaims?: string[];
}

export interface HeadlineVariants {
  standard?: string;
  breaking?: string;
  seo?: string;
  mobile?: string;
  social?: string;
  youtube?: string;
  push?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  imageUrl: string;
  imageCaption?: string;
  youtubeId?: string;
  isBreaking: boolean;
  isLeadStory: boolean;
  views: number;
  author: string;
  createdAt: string;
  tags: string[];

  // Master Prompt Enterprise Fields
  subtitle?: string;
  status?: ArticleStatus;
  state?: string;
  district?: string;
  city?: string;
  locationId?: string;
  authorId?: string;
  reporterId?: string;
  reporterName?: string;
  editorId?: string;
  editorName?: string;
  aiGenerated?: boolean;
  aiDraftPrompt?: string;
  needsVerification?: boolean;
  sources?: ArticleSource[];
  scheduledAt?: string;
  publishedAt?: string;
  rejectionReason?: string;
  editorialNotes?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  headlineVariants?: HeadlineVariants;
  language?: "hi" | "en";
  hindiVersionId?: string;
  englishVersionId?: string;
  likes?: number;
  shares?: number;
  verificationAudit?: VerificationAudit;
  distributionRecords?: DistributionRecord[];
}

export interface VerificationAudit {
  verifiedBy: string;
  verifiedAt: string;
  checklist: { claim: string; verified: boolean }[];
  evidenceNotes: string;
  evidenceUrls?: string[];
}

export interface DistributionRecord {
  platform: string;
  status: "published" | "queued" | "failed";
  timestamp: string;
  externalLink?: string;
}

export interface Category {
  id: string;
  name: string;
  nameHi?: string;
  slug: string;
  count?: number;
  description?: string;
  displayOrder?: number;
  parentId?: string;
  isPrimary?: boolean;
}

export interface LocationNode {
  id: string;
  name: string;
  nameHi: string;
  slug: string;
  type: "country" | "state" | "division" | "district" | "tehsil" | "city" | "village";
  parentId?: string;
  district?: string;
  state?: string;
  newsCount?: number;
}

export interface BreakingItem {
  id: string;
  title: string;
  url: string;
  category: string;
  isLive?: boolean;
  expiresAt?: string;
  priority?: "high" | "urgent" | "normal";
}

export interface EPaperPage {
  pageNumber: number;
  imageUrl: string;
  title: string;
}

export interface EPaperEdition {
  id: string;
  date: string;
  formattedDate: string;
  editionName: string;
  editionSlug?: string;
  district?: string;
  pages: EPaperPage[];
  pdfUrl?: string;
}

export interface EditorialAssignment {
  id: string;
  title: string;
  description: string;
  reporterId: string;
  reporterName: string;
  editorId: string;
  editorName: string;
  status: "assigned" | "in_progress" | "submitted" | "completed";
  dueDate: string;
  location: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: string;
  entityType: "article" | "social_post" | "user" | "location" | "setting" | "stream" | "system" | "notification";
  entityId: string;
  details: string;
  timestamp: string;
}

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "twitter"
  | "youtube"
  | "whatsapp"
  | "telegram"
  | "linkedin";

export interface SocialPost {
  id: string;
  articleId?: string;
  platform: SocialPlatform;
  content: string;
  mediaUrl?: string;
  status: "draft" | "scheduled" | "published" | "failed";
  scheduledFor?: string;
  publishedAt?: string;
  likes?: number;
  shares?: number;
  comments?: number;
  externalPostId?: string;
  error?: string;
}

export interface CitizenReport {
  id: string;
  citizenName: string;
  phone: string;
  email?: string;
  district: string;
  locationDetails: string;
  category: string;
  headline: string;
  description: string;
  mediaUrls?: string[];
  status: "pending_triage" | "assigned_to_reporter" | "verified" | "converted_to_draft" | "rejected";
  aiClassification?: {
    category: string;
    urgencyScore: number;
    duplicateSuspect?: boolean;
    summary: string;
  };
  assignedReporterId?: string;
  createdAt: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  youtubeId?: string;
  videoUrl?: string;
  thumbnailUrl: string;
  duration: string;
  category: string;
  location?: string;
  format: "16:9" | "9:16" | "1:1";
  isShort?: boolean;
  views: number;
  createdAt: string;
}

export interface LiveStreamData {
  id: string;
  channelName: string;
  isLive: boolean;
  streamUrl: string;
  streamType: "youtube" | "hls" | "custom";
  currentProgram: string;
  currentHost: string;
  upcomingProgram: string;
  viewerCount: number;
  crawlTickerText: string;
}

export interface AdCampaign {
  id: string;
  advertiserName: string;
  campaignTitle: string;
  placement: "header_leaderboard" | "in_article" | "sidebar_sticky" | "footer_banner";
  imageUrl: string;
  targetUrl: string;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  status: "active" | "scheduled" | "paused" | "completed";
  districtTarget?: string;
}

export interface PhotoAlbum {
  id: string;
  title: string;
  slug: string;
  description: string;
  photographerName: string;
  location: string;
  coverImageUrl: string;
  photos: {
    id: string;
    url: string;
    caption: string;
  }[];
  createdAt: string;
}

export interface PushAlert {
  id: string;
  title: string;
  message: string;
  targetUrl: string;
  category: string;
  district?: string;
  isBreaking?: boolean;
  sentAt: string;
  sentBy: string;
  deliveredCount: number;
}

export interface PushSubscription {
  id: string;
  endpoint: string;
  createdAt: string;
}


