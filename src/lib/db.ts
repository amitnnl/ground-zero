import fs from "fs";
import path from "path";
import {
  Article,
  Category,
  BreakingItem,
  EPaperEdition,
  User,
  LocationNode,
  EditorialAssignment,
  SocialPost,
  CitizenReport,
  LiveStreamData,
  AuditLog,
  ArticleStatus,
  AdCampaign,
  VideoItem,
  PhotoAlbum,
  PushAlert,
  PushSubscription,
  PasswordResetRequest,
  SiteSettings,
} from "./types";
import {
  initialArticles,
  initialCategories,
  sampleEPaperEditions,
  demoUsers,
  haryanaLocations,
  sampleAssignments,
  sampleSocialPosts,
  sampleCitizenReports,
  defaultLiveStream,
  sampleAds,
  sampleVideos,
  samplePhotoAlbums,
  initialPushAlerts,
} from "./seedData";

const DATA_DIR = path.join(process.cwd(), "data");
const ARTICLES_FILE = path.join(DATA_DIR, "articles.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
const EPAPER_FILE = path.join(DATA_DIR, "epaper.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const LOCATIONS_FILE = path.join(DATA_DIR, "locations.json");
const ASSIGNMENTS_FILE = path.join(DATA_DIR, "assignments.json");
const SOCIAL_POSTS_FILE = path.join(DATA_DIR, "social_posts.json");
const CITIZEN_REPORTS_FILE = path.join(DATA_DIR, "citizen_reports.json");
const LIVE_STREAM_FILE = path.join(DATA_DIR, "live_stream.json");
const AUDIT_LOGS_FILE = path.join(DATA_DIR, "audit_logs.json");
const ADS_FILE = path.join(DATA_DIR, "ads.json");
const VIDEOS_FILE = path.join(DATA_DIR, "videos.json");
const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");
const NOTIFICATIONS_FILE = path.join(DATA_DIR, "notifications.json");
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, "subscriptions.json");
const PASSWORD_REQUESTS_FILE = path.join(DATA_DIR, "password_requests.json");
const SITE_SETTINGS_FILE = path.join(DATA_DIR, "site_settings.json");

let isDataDirEnsured = false;
const memoryCache = new Map<string, any>();
const fileMtimes = new Map<string, number>();
const pendingWrites = new Map<string, NodeJS.Timeout>();

function ensureFile<T>(filePath: string, defaultData: T) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), "utf-8");
  }
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  ensureFile(ARTICLES_FILE, initialArticles);
  ensureFile(CATEGORIES_FILE, initialCategories);
  ensureFile(EPAPER_FILE, sampleEPaperEditions);
  ensureFile(USERS_FILE, demoUsers);
  ensureFile(LOCATIONS_FILE, haryanaLocations);
  ensureFile(ASSIGNMENTS_FILE, sampleAssignments);
  ensureFile(SOCIAL_POSTS_FILE, sampleSocialPosts);
  ensureFile(CITIZEN_REPORTS_FILE, sampleCitizenReports);
  ensureFile(LIVE_STREAM_FILE, defaultLiveStream);
  ensureFile(AUDIT_LOGS_FILE, []);
  ensureFile(ADS_FILE, sampleAds);
  ensureFile(VIDEOS_FILE, sampleVideos);
  ensureFile(GALLERY_FILE, samplePhotoAlbums);
  ensureFile(NOTIFICATIONS_FILE, initialPushAlerts);
  ensureFile(SUBSCRIPTIONS_FILE, []);
  ensureFile(PASSWORD_REQUESTS_FILE, []);
}

function readJson<T>(filePath: string, fallback: T): T {
  if (!isDataDirEnsured) {
    ensureDataDir();
    isDataDirEnsured = true;
  }

  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const mtime = stats.mtimeMs;

      // Return cached object if file has not been modified on disk
      if (memoryCache.has(filePath) && fileMtimes.get(filePath) === mtime) {
        return memoryCache.get(filePath) as T;
      }

      const raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
      const parsed = JSON.parse(raw) as T;
      memoryCache.set(filePath, parsed);
      fileMtimes.set(filePath, mtime);
      return parsed;
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }

  memoryCache.set(filePath, fallback);
  return fallback;
}

function writeJson<T>(filePath: string, data: T, asyncDisk = true): void {
  // Update in-memory cache immediately for 0ms read latency
  memoryCache.set(filePath, data);

  if (!isDataDirEnsured) {
    ensureDataDir();
    isDataDirEnsured = true;
  }

  if (!asyncDisk) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
      fileMtimes.set(filePath, fs.statSync(filePath).mtimeMs);
    } catch (err) {
      console.error(`Error writing synchronously to ${filePath}:`, err);
    }
    return;
  }

  // Debounced asynchronous non-blocking disk persistence
  if (pendingWrites.has(filePath)) {
    clearTimeout(pendingWrites.get(filePath)!);
  }

  const timer = setTimeout(async () => {
    pendingWrites.delete(filePath);
    try {
      await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
      try {
        fileMtimes.set(filePath, (await fs.promises.stat(filePath)).mtimeMs);
      } catch {}
    } catch (err) {
      console.error(`Async write error for ${filePath}:`, err);
    }
  }, 100);

  pendingWrites.set(filePath, timer);
}


/* =========================================================
   ARTICLES & EDITORIAL
========================================================= */

export async function getArticles(filter?: {
  categorySlug?: string;
  isBreaking?: boolean;
  search?: string;
  status?: ArticleStatus | "all";
  district?: string;
  state?: string;
  city?: string;
}): Promise<Article[]> {
  const articles = readJson<Article[]>(ARTICLES_FILE, initialArticles);
  let filtered = [...articles];

  // Default to published articles for public view unless explicitly asking for a status or "all"
  if (filter?.status && filter.status !== "all") {
    filtered = filtered.filter((a) => (a.status || "PUBLISHED") === filter.status);
  } else if (!filter?.status) {
    // Public queries without status parameter only see PUBLISHED
    filtered = filtered.filter((a) => (a.status || "PUBLISHED") === "PUBLISHED");
  }

  if (filter?.categorySlug && filter.categorySlug !== "top") {
    filtered = filtered.filter(
      (a) => a.categorySlug.toLowerCase() === filter.categorySlug?.toLowerCase()
    );
  }

  if (filter?.isBreaking !== undefined) {
    filtered = filtered.filter((a) => a.isBreaking === filter.isBreaking);
  }

  if (filter?.district) {
    const d = filter.district.toLowerCase();
    filtered = filtered.filter(
      (a) => a.district?.toLowerCase().includes(d) || a.tags?.some((t) => t.toLowerCase().includes(d))
    );
  }

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  return filtered.sort((a, b) => {
    // 1. Editorial Spotlight Priority: Lead Stories (isLeadStory: true) always float to the top
    if (a.isLeadStory && !b.isLeadStory) return -1;
    if (!a.isLeadStory && b.isLeadStory) return 1;

    // 2. Breaking News urgency boost within same priority tier
    if (a.isBreaking && !b.isBreaking) return -1;
    if (!a.isBreaking && b.isBreaking) return 1;

    // 3. Chronological: newest publishedAt or createdAt first
    const timeA = new Date(a.publishedAt || a.createdAt).getTime();
    const timeB = new Date(b.publishedAt || b.createdAt).getTime();
    return timeB - timeA;
  });
}

export async function getArticleByIdOrSlug(idOrSlug: string): Promise<Article | null> {
  const articles = readJson<Article[]>(ARTICLES_FILE, initialArticles);
  const article = articles.find((a) => a.id === idOrSlug || a.slug === idOrSlug);
  return article || null;
}

export async function createArticle(
  articleData: Omit<Article, "id" | "views" | "createdAt"> & { id?: string }
): Promise<Article> {
  const articles = readJson<Article[]>(ARTICLES_FILE, initialArticles);

  const slug =
    (articleData.slug || articleData.title)
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 60) || `news-${Date.now()}`;

  const newArticle: Article = {
    ...articleData,
    id: articleData.id || `art-${Date.now()}`,
    slug: slug,
    status: articleData.status || "DRAFT",
    views: 0,
    createdAt: new Date().toISOString(),
    tags: articleData.tags || [],
  };

  articles.unshift(newArticle);
  writeJson(ARTICLES_FILE, articles);

  await addAuditLog({
    userId: "current-user",
    userName: articleData.author || "News Desk",
    userRole: "REPORTER",
    action: "CREATE_ARTICLE",
    entityType: "article",
    entityId: newArticle.id,
    details: `Created article "${newArticle.title.substring(0, 40)}..." in status ${newArticle.status}`,
  });

  return newArticle;
}

export async function updateArticle(
  id: string,
  articleData: Partial<Article>
): Promise<Article | null> {
  const articles = readJson<Article[]>(ARTICLES_FILE, initialArticles);
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const oldArticle = articles[index];
  articles[index] = {
    ...oldArticle,
    ...articleData,
  };

  writeJson(ARTICLES_FILE, articles);

  if (articleData.status && articleData.status !== oldArticle.status) {
    await addAuditLog({
      userId: "current-user",
      userName: "Editorial Desk",
      userRole: "EDITOR",
      action: "UPDATE_STATUS",
      entityType: "article",
      entityId: id,
      details: `Status changed from ${oldArticle.status || "PUBLISHED"} to ${articleData.status}`,
    });
  }

  return articles[index];
}

export async function deleteArticle(id: string): Promise<boolean> {
  const articles = readJson<Article[]>(ARTICLES_FILE, initialArticles);
  const filtered = articles.filter((a) => a.id !== id);
  if (filtered.length === articles.length) return false;

  writeJson(ARTICLES_FILE, filtered);
  return true;
}

export async function incrementArticleViews(id: string): Promise<void> {
  const articles = readJson<Article[]>(ARTICLES_FILE, initialArticles);
  const article = articles.find((a) => a.id === id || a.slug === id);
  if (article) {
    article.views = (article.views || 0) + 1;
    writeJson(ARTICLES_FILE, articles);
  }
}

/* =========================================================
   CATEGORIES & BREAKING
========================================================= */

export async function getCategories(): Promise<Category[]> {
  const categories = readJson<Category[]>(CATEGORIES_FILE, initialCategories);
  const articles = await getArticles({ status: "all" });

  return categories.map((cat) => ({
    ...cat,
    count:
      cat.slug === "top"
        ? articles.length
        : articles.filter((a) => a.categorySlug === cat.slug).length,
  }));
}

export async function getBreakingItems(): Promise<BreakingItem[]> {
  const articles = await getArticles({ isBreaking: true });
  return articles.map((a) => ({
    id: a.id,
    title: a.title,
    url: `/article/${a.slug}`,
    category: a.category,
    isLive: true,
  }));
}

/* =========================================================
   LOCATIONS
========================================================= */

export async function getLocations(): Promise<LocationNode[]> {
  return readJson<LocationNode[]>(LOCATIONS_FILE, haryanaLocations);
}

export async function getLocationBySlug(slug: string): Promise<LocationNode | null> {
  const locations = await getLocations();
  return locations.find((l) => l.slug.toLowerCase() === slug.toLowerCase()) || null;
}

/* =========================================================
   USERS & RBAC
========================================================= */

export async function getUsers(): Promise<User[]> {
  return readJson<User[]>(USERS_FILE, demoUsers);
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.id === id) || null;
}

/* =========================================================
   EDITORIAL ASSIGNMENTS
========================================================= */

export async function getAssignments(): Promise<EditorialAssignment[]> {
  return readJson<EditorialAssignment[]>(ASSIGNMENTS_FILE, sampleAssignments);
}

export async function createAssignment(
  assignmentData: Omit<EditorialAssignment, "id" | "createdAt">
): Promise<EditorialAssignment> {
  const assignments = await getAssignments();
  const newAssignment: EditorialAssignment = {
    ...assignmentData,
    id: `asg-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  assignments.unshift(newAssignment);
  writeJson(ASSIGNMENTS_FILE, assignments);
  return newAssignment;
}

export async function updateAssignmentStatus(
  id: string,
  status: EditorialAssignment["status"]
): Promise<EditorialAssignment | null> {
  const assignments = await getAssignments();
  const item = assignments.find((a) => a.id === id);
  if (!item) return null;
  item.status = status;
  writeJson(ASSIGNMENTS_FILE, assignments);
  return item;
}

/* =========================================================
   SOCIAL MEDIA AUTOMATION
========================================================= */

export async function getSocialPosts(): Promise<SocialPost[]> {
  return readJson<SocialPost[]>(SOCIAL_POSTS_FILE, sampleSocialPosts);
}

export async function createSocialPost(
  postData: Omit<SocialPost, "id">
): Promise<SocialPost> {
  const posts = await getSocialPosts();
  const newPost: SocialPost = {
    ...postData,
    id: `sp-${Date.now()}`,
    publishedAt: postData.status === "published" ? new Date().toISOString() : undefined,
  };
  posts.unshift(newPost);
  writeJson(SOCIAL_POSTS_FILE, posts);
  return newPost;
}

export async function deleteSocialPost(id: string): Promise<boolean> {
  const posts = await getSocialPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;
  writeJson(SOCIAL_POSTS_FILE, filtered);
  return true;
}

/* =========================================================
   CITIZEN JOURNALISM
========================================================= */

export async function getCitizenReports(): Promise<CitizenReport[]> {
  return readJson<CitizenReport[]>(CITIZEN_REPORTS_FILE, sampleCitizenReports);
}

export async function createCitizenReport(
  reportData: Omit<CitizenReport, "id" | "createdAt">
): Promise<CitizenReport> {
  const reports = await getCitizenReports();
  const newReport: CitizenReport = {
    ...reportData,
    id: `cit-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  reports.unshift(newReport);
  writeJson(CITIZEN_REPORTS_FILE, reports);
  return newReport;
}

export async function updateCitizenReportStatus(
  id: string,
  status: CitizenReport["status"],
  assignedReporterId?: string
): Promise<CitizenReport | null> {
  const reports = await getCitizenReports();
  const report = reports.find((r) => r.id === id);
  if (!report) return null;
  report.status = status;
  if (assignedReporterId) {
    report.assignedReporterId = assignedReporterId;
  }
  writeJson(CITIZEN_REPORTS_FILE, reports);
  return report;
}

/* =========================================================
   LIVE TV
========================================================= */

export async function getLiveStream(): Promise<LiveStreamData> {
  return readJson<LiveStreamData>(LIVE_STREAM_FILE, defaultLiveStream);
}

export async function updateLiveStream(
  data: Partial<LiveStreamData>
): Promise<LiveStreamData> {
  const current = await getLiveStream();
  const updated = { ...current, ...data };
  writeJson(LIVE_STREAM_FILE, updated);
  return updated;
}

/* =========================================================
   E-PAPER
========================================================= */

export async function getEPaperEditions(): Promise<EPaperEdition[]> {
  return readJson<EPaperEdition[]>(EPAPER_FILE, sampleEPaperEditions);
}

export async function getEPaperToday(): Promise<EPaperEdition | null> {
  const editions = await getEPaperEditions();
  return editions[0] || null;
}

export async function getEPaperBySlug(slug: string): Promise<EPaperEdition | null> {
  const editions = await getEPaperEditions();
  return editions.find((e) => e.editionSlug === slug) || editions[0] || null;
}

/* =========================================================
   ADS & REVENUE MANAGEMENT
========================================================= */

export async function getAds(): Promise<AdCampaign[]> {
  return readJson<AdCampaign[]>(ADS_FILE, sampleAds);
}

export async function getActiveAdsByPlacement(
  placement: AdCampaign["placement"],
  district?: string
): Promise<AdCampaign[]> {
  const ads = await getAds();
  return ads.filter((ad) => {
    if (ad.status !== "active") return false;
    if (ad.placement !== placement) return false;
    if (district && ad.districtTarget && ad.districtTarget !== "Haryana") {
      return ad.districtTarget.toLowerCase().includes(district.toLowerCase());
    }
    return true;
  });
}

export async function createAd(
  adData: Omit<AdCampaign, "id" | "impressions" | "clicks">
): Promise<AdCampaign> {
  const ads = await getAds();
  const newAd: AdCampaign = {
    ...adData,
    id: `ad-${Date.now()}`,
    impressions: 0,
    clicks: 0,
  };
  ads.unshift(newAd);
  writeJson(ADS_FILE, ads);
  return newAd;
}

export async function updateAd(
  id: string,
  data: Partial<AdCampaign>
): Promise<AdCampaign | null> {
  const ads = await getAds();
  const ad = ads.find((a) => a.id === id);
  if (!ad) return null;
  Object.assign(ad, data);
  writeJson(ADS_FILE, ads);
  return ad;
}

export async function deleteAd(id: string): Promise<boolean> {
  const ads = await getAds();
  const filtered = ads.filter((a) => a.id !== id);
  if (filtered.length === ads.length) return false;
  writeJson(ADS_FILE, filtered);
  return true;
}

export async function trackAdImpression(id: string): Promise<void> {
  const ads = await getAds();
  const ad = ads.find((a) => a.id === id);
  if (ad) {
    ad.impressions = (ad.impressions || 0) + 1;
    writeJson(ADS_FILE, ads);
  }
}

export async function trackAdClick(id: string): Promise<void> {
  const ads = await getAds();
  const ad = ads.find((a) => a.id === id);
  if (ad) {
    ad.clicks = (ad.clicks || 0) + 1;
    writeJson(ADS_FILE, ads);
  }
}

/* =========================================================
   VIDEOS & REELS / SHORTS
========================================================= */

export async function getVideos(filter?: {
  format?: string;
  isShort?: boolean;
  category?: string;
}): Promise<VideoItem[]> {
  let videos = readJson<VideoItem[]>(VIDEOS_FILE, sampleVideos);
  if (filter?.isShort !== undefined) {
    videos = videos.filter((v) => Boolean(v.isShort) === filter.isShort);
  }
  if (filter?.format) {
    videos = videos.filter((v) => v.format === filter.format);
  }
  if (filter?.category) {
    videos = videos.filter((v) => v.category === filter.category);
  }
  return videos;
}

export async function getVideoById(id: string): Promise<VideoItem | null> {
  const videos = await getVideos();
  return videos.find((v) => v.id === id) || null;
}

export async function createVideo(
  videoData: Omit<VideoItem, "id" | "views" | "createdAt">
): Promise<VideoItem> {
  const videos = await getVideos();
  const newVid: VideoItem = {
    ...videoData,
    id: `vid-${Date.now()}`,
    views: 0,
    createdAt: new Date().toISOString(),
  };
  videos.unshift(newVid);
  writeJson(VIDEOS_FILE, videos);
  return newVid;
}

export async function deleteVideo(id: string): Promise<boolean> {
  const videos = await getVideos();
  const filtered = videos.filter((v) => v.id !== id);
  if (filtered.length === videos.length) return false;
  writeJson(VIDEOS_FILE, filtered);
  return true;
}

/* =========================================================
   PHOTO GALLERIES & ALBUMS
========================================================= */

export async function getPhotoAlbums(): Promise<PhotoAlbum[]> {
  return readJson<PhotoAlbum[]>(GALLERY_FILE, samplePhotoAlbums);
}

export async function getPhotoAlbumBySlug(slug: string): Promise<PhotoAlbum | null> {
  const albums = await getPhotoAlbums();
  return albums.find((a) => a.slug === slug || a.id === slug) || null;
}

export async function createPhotoAlbum(
  albumData: Omit<PhotoAlbum, "id" | "createdAt">
): Promise<PhotoAlbum> {
  const albums = await getPhotoAlbums();
  const newAlbum: PhotoAlbum = {
    ...albumData,
    id: `album-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  albums.unshift(newAlbum);
  writeJson(GALLERY_FILE, albums);
  return newAlbum;
}

export async function deletePhotoAlbum(id: string): Promise<boolean> {
  const albums = await getPhotoAlbums();
  const filtered = albums.filter((a) => a.id !== id);
  if (filtered.length === albums.length) return false;
  writeJson(GALLERY_FILE, filtered);
  return true;
}

/* =========================================================
   AUDIT LOGS
========================================================= */

export async function getAuditLogs(): Promise<AuditLog[]> {
  return readJson<AuditLog[]>(AUDIT_LOGS_FILE, []);
}

export async function addAuditLog(log: Omit<AuditLog, "id" | "timestamp">): Promise<AuditLog> {
  const logs = await getAuditLogs();
  const newLog: AuditLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
  };
  logs.unshift(newLog);
  // Keep last 200 logs
  writeJson(AUDIT_LOGS_FILE, logs.slice(0, 200));
  return newLog;
}

/* =========================================================
   PUSH NOTIFICATIONS & BREAKING ALERTS
========================================================= */

export async function getPushAlerts(): Promise<PushAlert[]> {
  return readJson<PushAlert[]>(NOTIFICATIONS_FILE, initialPushAlerts);
}

export async function createPushAlert(
  alertData: Omit<PushAlert, "id" | "sentAt" | "deliveredCount">
): Promise<PushAlert> {
  const alerts = await getPushAlerts();
  const subs = await getPushSubscriptions();
  const newAlert: PushAlert = {
    ...alertData,
    id: `alert-${Date.now()}`,
    sentAt: new Date().toISOString(),
    deliveredCount: Math.max(subs.length, 34200), // realistic simulation base count
  };
  alerts.unshift(newAlert);
  writeJson(NOTIFICATIONS_FILE, alerts);
  return newAlert;
}

export async function getPushSubscriptions(): Promise<PushSubscription[]> {
  return readJson<PushSubscription[]>(SUBSCRIPTIONS_FILE, []);
}

export async function registerPushSubscription(endpoint: string): Promise<PushSubscription> {
  const subs = await getPushSubscriptions();
  const existing = subs.find((s) => s.endpoint === endpoint);
  if (existing) return existing;

  const newSub: PushSubscription = {
    id: `sub-${Date.now()}`,
    endpoint,
    createdAt: new Date().toISOString(),
  };
  subs.push(newSub);
  writeJson(SUBSCRIPTIONS_FILE, subs);
  return newSub;
}

/* =========================================================
   USER & RBAC MUTATIONS
========================================================= */

export async function createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
  const users = await getUsers();
  const newUser: User = {
    ...userData,
    id: `usr-${Date.now()}`,
    status: userData.status || "active",
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  writeJson(USERS_FILE, users);
  return newUser;
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User | null> {
  const users = await getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...userData,
  };
  writeJson(USERS_FILE, users);
  return users[index];
}

export async function deleteUser(id: string): Promise<boolean> {
  const users = await getUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  writeJson(USERS_FILE, filtered);
  return true;
}

/* =========================================================
   PASSWORD RESET REQUESTS (ADMIN GATED)
========================================================= */

export async function getPasswordRequests(): Promise<PasswordResetRequest[]> {
  return readJson<PasswordResetRequest[]>(PASSWORD_REQUESTS_FILE, []);
}

export async function createPasswordRequest(
  requestData: Omit<PasswordResetRequest, "id" | "requestedAt" | "status">
): Promise<PasswordResetRequest> {
  const requests = await getPasswordRequests();
  const newRequest: PasswordResetRequest = {
    ...requestData,
    id: `pwd-req-${Date.now()}`,
    requestedAt: new Date().toISOString(),
    status: "PENDING",
  };
  requests.unshift(newRequest);
  writeJson(PASSWORD_REQUESTS_FILE, requests);
  return newRequest;
}

export async function updatePasswordRequest(
  id: string,
  updates: Partial<PasswordResetRequest>
): Promise<PasswordResetRequest | null> {
  const requests = await getPasswordRequests();
  const index = requests.findIndex((r) => r.id === id);
  if (index === -1) return null;
  requests[index] = { ...requests[index], ...updates };
  writeJson(PASSWORD_REQUESTS_FILE, requests);
  return requests[index];
}

/* =========================================================
   SITE SETTINGS (MANAGE_SETTINGS GATED)
========================================================= */

const defaultSiteSettings: SiteSettings = {
  site_name: "Ground Zero News",
  site_tagline: "हरियाणा की आवाज़",
  site_description: "South Haryana's leading digital news network. Real-time updates, breaking news, live blogs and local reporting.",
  site_logo: null,
  site_favicon: null,
  contact_email: "gznarnaul@gmail.com",
  contact_phone: "+91 9217070880",
  contact_address: "Media Tower, Nizampur Road, Narnaul, India, 123001",
  default_meta_title: "Ground Zero News - Haryana Hindi News, ब्रेकिंग न्यूज़",
  default_meta_description: "ग्राउंड ज़ीरो न्यूज़ पर पढ़ें हरियाणा, देश और दुनिया की ताज़ा हिंदी खबरें, ब्रेकिंग न्यूज़ और विश्लेषण।",
  default_meta_keywords: "ground zero news, haryana news, hindi news, breaking news haryana, ग्राउंड ज़ीरो न्यूज़, हरियाणा न्यूज़",
  google_search_console_verification: null,
  bing_webmaster_verification: null,
  og_image: null,
  og_site_name: "Ground Zero News",
  robots_txt: "User-agent: *\nAllow: /\n\nSitemap: https://www.groundzeronews.com/sitemap.xml\nSitemap: https://www.groundzeronews.com/news-sitemap.xml",
  sitemap_enabled: true,
  facebook_url: "https://facebook.com/groundzeronewshry",
  twitter_url: "https://twitter.com/groundzeronewshry",
  youtube_url: "https://youtube.com/c/groundzeronewshry",
  instagram_url: null,
  whatsapp_channel_url: null,
  telegram_url: null,
  koo_url: null,
  sharechat_url: null,
  gtm_id: "GTM-MJQ5P6C4",
  ga4_id: null,
  clarity_id: null,
  facebook_pixel_id: null,
  adsense_publisher_id: null,
  adsense_enabled: false,
  ads_enabled: true,
  ads_between_paragraphs: true,
  web_push_enabled: false,
  onesignal_app_id: null,
  onesignal_enabled: false,
  vapid_public_key: null,
  primary_color: "#DC2626",
  secondary_color: "#1F2937",
  accent_color: "#F59E0B",
  dark_mode_enabled: true,
  dark_mode_default: false,
  homepage_breaking_news_enabled: true,
  homepage_featured_enabled: true,
  homepage_trending_enabled: true,
  homepage_videos_enabled: true,
  homepage_articles_per_page: 12,
  homepage_trending_count: 6,
  homepage_breaking_count: 5,
  comments_enabled_globally: true,
  related_articles_enabled: true,
  related_articles_count: 5,
  reading_time_enabled: true,
  author_bio_enabled: true,
  image_watermark_enabled: false,
  watermark_text: "© Ground Zero News",
  play_store_url: null,
  app_store_url: null,
  app_download_banner_enabled: false,
  maintenance_mode: false,
  maintenance_message: "We are performing scheduled maintenance. We'll be back shortly.",
  maintenance_end_time: null,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  return readJson<SiteSettings>(SITE_SETTINGS_FILE, defaultSiteSettings);
}

export async function updateSiteSettings(
  updates: Partial<SiteSettings>
): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const updated: SiteSettings = {
    ...current,
    ...updates,
  };
  writeJson(SITE_SETTINGS_FILE, updated);
  await addAuditLog({
    userId: "current-user",
    userName: "Administrator",
    userRole: "SUPER_ADMIN",
    action: "UPDATE_SETTINGS",
    entityType: "system",
    entityId: "site_settings",
    details: `Updated site settings: ${Object.keys(updates).join(", ")}`,
  });
  return updated;
}



