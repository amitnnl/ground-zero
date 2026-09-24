# MASTER PROMPT — AI-POWERED DIGITAL NEWS MEDIA & SOCIAL MEDIA AUTOMATION PLATFORM

## 1. PROJECT VISION

Build a production-ready, scalable, modern **AI-powered Digital News Media Platform** inspired by the functionality of leading regional digital news portals, but with completely original branding, UI, code, database structure and content.

The platform must combine:

1. Modern News Website
2. AI Newsroom
3. AI News Generation Agent
4. Reporter Management
5. Editorial Workflow
6. Video News
7. Live TV
8. E-Paper
9. Photo Gallery
10. Social Media Automation
11. AI Social Media Content Generation
12. AI Video/Shorts Generation
13. SEO Automation
14. Advertisement Management
15. Analytics
16. Android/Mobile-ready APIs
17. Complete Admin Dashboard
18. Role-Based Access Control
19. Multilingual/Hindi + English support
20. Citizen News Submission
21. Notifications
22. AI-powered newsroom assistance

The system must be designed as a real commercial news-media management platform rather than a simple blog.

---

# 2. IMPORTANT DEVELOPMENT RULE

Do NOT clone or copy the design, source code, text, images, logo, branding or proprietary implementation of any existing news website.

Use existing news portals only as functional inspiration.

Create a completely original:

* Brand identity
* UI/UX
* Design system
* Components
* Database
* APIs
* Code
* Layout
* Content structure

---

# 3. RECOMMENDED TECHNOLOGY STACK

Build the application using:

## Frontend

React
Vite
TypeScript
Tailwind CSS
React Router
Framer Motion
Lucide React

Use a component-based architecture.

## Backend

Laravel PHP REST API.

Use:

* Laravel
* PHP 8.3+
* REST APIs
* Laravel Sanctum
* Laravel Queues
* Laravel Scheduler
* Laravel Events
* Laravel Notifications

## Database

MySQL 8+

Use proper:

* foreign keys
* indexes
* relationships
* soft deletes
* timestamps
* migrations
* seeders

## Cache / Queue

Redis.

Use Redis for:

* queues
* background jobs
* caching
* AI processing
* social publishing jobs
* notifications

## Storage

Create an abstraction layer supporting:

* Local storage
* Amazon S3
* Cloudflare R2

## Search

Implement a search abstraction that can initially use MySQL FULLTEXT and later support Elasticsearch/OpenSearch.

## Authentication

Implement:

* Admin login
* Editor login
* Reporter login
* Social Media Manager
* Video Editor
* Photographer
* Viewer
* Citizen/Contributor

Use secure authentication and authorization.

---

# 4. RESPONSIVE DESIGN

The complete application must work on:

* Desktop
* Laptop
* Tablet
* Mobile

Design mobile-first.

Create a premium news-media visual identity.

Suggested design:

* modern newspaper + technology aesthetic
* clean typography
* strong headlines
* image-driven cards
* breaking-news ticker
* dark/light mode
* smooth animations
* responsive navigation
* sticky mobile navigation
* professional newsroom dashboard

Do not make the UI look like a generic admin template.

---

# 5. PUBLIC WEBSITE

Create the following pages.

## Home

Sections:

* Breaking News
* Latest News
* Trending News
* Featured News
* Editor's Picks
* District News
* State News
* National News
* International News
* Politics
* Crime
* Education
* Jobs
* Business
* Agriculture
* Sports
* Technology
* Health
* Entertainment
* Lifestyle
* Government Schemes
* Videos
* Shorts
* Photo Gallery
* Live TV
* E-Paper

Allow admin to reorder homepage sections.

---

# 6. LOCATION-BASED NEWS

Create hierarchical locations:

Country
State
Division
District
Tehsil
City
Village

Example:

India
→ Haryana
→ Mahendergarh
→ Narnaul
→ Local Area

Each news article can be associated with one or more locations.

Create location landing pages.

Example:

/haryana
/mahendergarh
/narnaul
/rewari

---

# 7. NEWS ARTICLE SYSTEM

Every article must support:

* headline
* slug
* subtitle
* summary
* content
* featured image
* image gallery
* video
* audio
* category
* subcategory
* location
* author
* reporter
* editor
* tags
* source/reference
* published date
* updated date
* status
* views
* reactions
* comments
* related articles

Statuses:

DRAFT
SUBMITTED
UNDER_REVIEW
NEEDS_CHANGES
APPROVED
SCHEDULED
PUBLISHED
ARCHIVED
REJECTED

---

# 8. AI NEWSROOM AGENT

Create a central AI Newsroom Agent.

Name it:

"AI News Desk"

The agent must be capable of assisting editors and reporters.

User can enter:

Example:

"Create a news article about the new government scheme for farmers in Haryana."

The AI agent should generate:

1. Suggested headline
2. Alternative headlines
3. Short headline
4. Summary
5. Full article draft
6. Key points
7. SEO title
8. SEO description
9. SEO keywords
10. Tags
11. Suggested category
12. Suggested location
13. Social media captions
14. Hashtags
15. Push notification
16. Video script
17. Short/Reel script
18. Thumbnail text
19. Image prompt
20. Related story suggestions

IMPORTANT:

AI-generated content must enter the editorial workflow.

Never automatically publish AI-generated factual news without configurable editorial approval.

Display:

"AI Generated Draft — Human Verification Required"

---

# 9. AI NEWS GENERATION MODES

Support multiple modes.

## Mode A — Topic

Input:

"New railway project announced in Narnaul"

Generate a draft.

## Mode B — Source Text

User pastes:

* press release
* government notification
* speech
* announcement
* article notes

AI converts it into structured news.

## Mode C — Uploaded Document

Support:

PDF
DOCX
TXT
Images

Extract text and create a news draft.

## Mode D — URL

Allow authorized users to provide a URL.

Fetch permitted public content and create a draft with source attribution.

Do not copy copyrighted articles verbatim.

## Mode E — Reporter Notes

Reporter enters raw notes.

AI converts notes into a structured article.

## Mode F — Audio

Reporter uploads audio.

System:

Audio
→ transcription
→ summary
→ article draft
→ social content

---

# 10. FACT-CHECK / SOURCE ASSISTANT

Create an AI-assisted verification workflow.

For every AI-generated story show:

* Source material
* Claims extracted
* Statements requiring verification
* Missing information
* Conflicting information
* Publication date
* Source links
* Confidence indicators

Do NOT represent AI confidence as proof of factual accuracy.

Human editor must approve factual publication.

---

# 11. AI HEADLINE ENGINE

Generate multiple headline formats:

* Standard
* Breaking
* SEO
* Mobile
* Social
* YouTube
* Push Notification

Allow editor to select/edit.

---

# 12. AI SOCIAL MEDIA ENGINE

This is a major module.

After an article is approved, the AI should automatically generate platform-specific content.

Supported channels:

* Facebook
* Instagram
* X/Twitter
* YouTube
* WhatsApp
* Telegram
* LinkedIn
* Threads
* Pinterest, where appropriate

Create separate content for every platform.

Do NOT simply post the same text everywhere.

---

# 13. SOCIAL MEDIA AUTOMATION

Workflow:

NEWS APPROVED
↓
AI SOCIAL CONTENT GENERATION
↓
EDITOR REVIEW
↓
SCHEDULE
↓
PUBLISH
↓
COLLECT ANALYTICS

Allow:

* Publish now
* Schedule
* Queue
* Auto publish
* Manual approval
* Retry failed post
* Cancel scheduled post

Create a social-media calendar.

---

# 14. SOCIAL MEDIA CONTENT GENERATION

For each news article generate:

## Facebook

Headline
Caption
Short summary
Hashtags
Link

## Instagram

Caption
Hashtags
Carousel text
Reel caption

## X/Twitter

Short post
Thread if necessary
Hashtags
Link

## YouTube

Video title
Description
Tags
Chapters
Thumbnail text

## WhatsApp

Short news message
Headline
Summary
Link

## Telegram

Headline
Summary
Source
Link

## LinkedIn

Professional version where relevant.

---

# 15. SOCIAL MEDIA ACCOUNT MANAGEMENT

Admin can connect social accounts through official platform APIs/OAuth.

Store encrypted credentials/tokens.

Never store passwords in plain text.

Support multiple accounts.

Example:

Facebook:

* Main News Page
* District News Page
* City News Page

Instagram:

* Main account
* Regional account

YouTube:

* Main channel
* Shorts channel

---

# 16. SOCIAL MEDIA AUTOMATION ENGINE

Create:

SocialAccount
SocialPost
SocialPostVariant
SocialSchedule
SocialPublishJob
SocialAnalytics
SocialMediaTemplate

Each post should track:

* platform
* account
* article
* content
* media
* scheduled time
* status
* published time
* external post ID
* error
* retry count

---

# 17. AI SOCIAL MEDIA AGENT

Create a dedicated AI agent:

"Social Media Manager AI"

It should:

* monitor newly approved stories
* create platform-specific content
* recommend posting times based on historical analytics
* create hashtags
* create content variations
* identify stories suitable for reels
* identify stories suitable for carousel posts
* suggest follow-up posts
* summarize performance
* recommend content ideas

All recommendations must remain reviewable by humans.

---

# 18. AI VIDEO NEWS SYSTEM

Create:

Article
↓
AI Script
↓
Voice/Presenter
↓
Images/Video
↓
Captions
↓
Vertical Short
↓
YouTube Video
↓
Social Clips

Allow video editors to modify the generated script before rendering.

Support:

* 16:9
* 9:16
* 1:1

---

# 19. AI VIDEO FEATURES

Generate:

* News bulletin
* 30-second short
* 60-second short
* 3-minute news video
* YouTube video
* Instagram Reel
* Facebook Reel
* YouTube Short

Generate:

* script
* scene list
* subtitles
* headline overlays
* lower thirds
* thumbnail text

Use external AI video/voice providers through adapters so providers can be changed later.

---

# 20. LIVE TV

Create Live TV module.

Features:

* live stream URL
* HLS support
* stream status
* current program
* upcoming program
* schedule
* previous broadcasts
* video archive

Admin dashboard:

Live TV
→ Stream
→ Program Schedule
→ Playlist
→ Advertisements
→ Analytics

---

# 21. VIDEO CMS

Create video library.

Fields:

* title
* description
* video URL/file
* thumbnail
* duration
* category
* reporter
* location
* tags
* platform
* status

Support:

* YouTube
* Vimeo
* uploaded video
* HLS
* external video source

---

# 22. CITIZEN REPORTER SYSTEM

Create public "Send News" feature.

Form:

Name
Mobile
Email
District
Location
Category
Headline
Description
Photos
Videos
Documents

Submission workflow:

Citizen
↓
Submission
↓
AI Pre-Classification
↓
Reporter Review
↓
Verification
↓
Editor
↓
Publish

---

# 23. REPORTER MOBILE WORKFLOW

Reporter should be able to:

* login
* create article
* upload photo
* upload video
* record audio
* record video
* submit breaking news
* save drafts
* view assignments
* see editorial feedback

Design APIs so an Android app can later use the same backend.

---

# 24. EDITORIAL WORKFLOW

Create:

Assignment
Draft
Review
Fact Check
Edit
Approval
Scheduling
Publishing

Editor dashboard must show:

* pending submissions
* pending approval
* breaking news
* scheduled stories
* AI drafts
* rejected stories
* corrections

---

# 25. BREAKING NEWS SYSTEM

Create breaking-news mode.

Admin can mark an article:

BREAKING

Display:

* website ticker
* homepage banner
* mobile notification
* social media alert
* optional WhatsApp/Telegram alert

Allow expiry time.

---

# 26. PUSH NOTIFICATIONS

Create notification engine.

Support:

* breaking news
* category notifications
* district notifications
* personalized notifications

Example:

User follows:

Mahendergarh

Send relevant notifications.

Use Firebase Cloud Messaging for future Android support.

---

# 27. E-PAPER

Create E-Paper module.

Features:

* upload PDF
* date
* edition
* page viewer
* archive
* search
* download permission
* subscription option

---

# 28. PHOTO GALLERY

Create:

Albums
Photos
Captions
Credits
Locations
Tags

Support:

* gallery pages
* slideshow
* sharing
* SEO

---

# 29. SEARCH ENGINE

Global search:

News
Videos
Photos
Authors
Locations
Categories

Filters:

Date
Location
Category
Author
Content type

---

# 30. SEO AUTOMATION

Automatically generate:

SEO title
Meta description
Keywords
Slug
Canonical URL
OpenGraph title
OpenGraph description
OpenGraph image
Twitter/X card
NewsArticle schema
Breadcrumb schema
Organization schema
VideoObject schema

Generate:

robots.txt
sitemap.xml
news sitemap

---

# 31. AI SEO AGENT

Create:

"SEO Agent"

It should analyze every article and suggest:

* SEO headline
* keyword opportunities
* internal links
* related stories
* metadata
* schema information
* readability improvements

Allow editor to accept/reject suggestions.

---

# 32. ADVERTISEMENT MANAGEMENT

Create complete advertising system.

Ad types:

* homepage banner
* article banner
* sidebar
* video ads
* popup
* native ads
* sponsored content

Manage:

Advertiser
Campaign
Creative
Placement
Start Date
End Date
Budget
Clicks
Impressions

Create advertising analytics.

---

# 33. ANALYTICS

Dashboard metrics:

Users
Sessions
Page views
Articles
Views/article
Trending stories
Top categories
Top locations
Top reporters
Video views
Watch time
Social shares
Social engagement
CTR
Ad impressions
Ad revenue

Create charts.

---

# 34. AI ANALYTICS AGENT

Create:

"News Intelligence Agent"

It analyzes:

* top-performing stories
* declining topics
* regional interest
* reader behavior
* social engagement
* video performance

It can produce reports such as:

"Today's newsroom performance"

"Weekly content report"

"Top stories"

"Topics gaining attention"

"Stories requiring follow-up"

Do not fabricate analytics.

---

# 35. ADMIN DASHBOARD

Dashboard cards:

Total News
Published
Pending Review
AI Drafts
Breaking News
Videos
Live TV
Social Posts
Scheduled Posts
Failed Posts
Users
Reporters
Views

Include:

* charts
* activity feed
* alerts
* publishing queue
* AI assistant

---

# 36. ROLE MANAGEMENT

Roles:

SUPER ADMIN
ADMIN
EDITOR-IN-CHIEF
EDITOR
DISTRICT EDITOR
REPORTER
VIDEO EDITOR
PHOTOGRAPHER
SOCIAL MEDIA MANAGER
SEO MANAGER
AD MANAGER
VIEWER
CITIZEN CONTRIBUTOR

Implement granular permissions.

Example:

Reporter:

CREATE_NEWS
EDIT_OWN_NEWS
UPLOAD_MEDIA
SUBMIT_NEWS

Editor:

REVIEW_NEWS
EDIT_NEWS
APPROVE_NEWS
PUBLISH_NEWS

Social Manager:

CREATE_SOCIAL_POST
SCHEDULE_POST
PUBLISH_SOCIAL

---

# 37. DATABASE DESIGN

Create normalized MySQL tables including:

users
roles
permissions
role_permissions
user_roles

articles
article_categories
categories
subcategories
article_tags
tags

locations
states
districts
cities
villages

authors
reporters
assignments

article_revisions
article_sources
article_corrections

media
media_folders
images
videos
audio

video_categories
video_playlists

live_streams
live_programs
live_schedule

breaking_news

citizen_submissions

ai_jobs
ai_generations
ai_prompts
ai_usage

social_accounts
social_posts
social_post_variants
social_schedules
social_publish_jobs
social_analytics

notifications
notification_subscriptions

comments
reactions
bookmarks

epapers
epaper_editions

advertisers
campaigns
advertisements
ad_placements
ad_analytics

seo_metadata

analytics_events

audit_logs

settings

translations

subscriptions

plans

payments

Create migrations and relationships.

---

# 38. AI ARCHITECTURE

Do not hard-code a single AI provider.

Create an AI provider abstraction:

AIProviderInterface

Providers can include:

OpenAI
Anthropic
Google
Local LLM
Other compatible providers

Configuration:

AI_PROVIDER
AI_MODEL
AI_API_KEY

Create separate services:

NewsGenerationService
HeadlineService
SEOService
SocialContentService
VideoScriptService
FactCheckService
TranslationService
SummarizationService

---

# 39. AI AGENT ORCHESTRATION

Create an AI agent workflow:

USER REQUEST
↓
INTENT DETECTION
↓
SOURCE COLLECTION
↓
CONTENT ANALYSIS
↓
NEWS DRAFT
↓
FACT/CITATION CHECK
↓
SEO GENERATION
↓
SOCIAL GENERATION
↓
VIDEO SCRIPT
↓
EDITOR REVIEW
↓
PUBLISHING

Every AI action must be logged.

Store:

* prompt
* model
* input
* output
* timestamp
* user
* token usage
* status

---

# 40. MULTILINGUAL SYSTEM

Support:

Hindi
English

Design database for additional languages.

AI should support:

Hindi → English
English → Hindi

Allow editor to create language versions.

Never blindly translate names, locations or official titles without allowing editorial correction.

---

# 41. WHATSAPP / MESSAGING AUTOMATION

Where official APIs permit, support:

WhatsApp Business API
Telegram Bot API

Features:

* breaking news alerts
* daily digest
* category digest
* district digest
* article sharing

Use official APIs and respect platform policies.

---

# 42. SOCIAL AUTOMATION SAFETY

Never use browser automation to bypass platform restrictions.

Use official APIs/OAuth wherever available.

Respect:

* rate limits
* platform policies
* access permissions
* user consent
* copyright
* privacy

Provide clear failure messages when an API rejects a post.

---

# 43. CONTENT COPYRIGHT / SOURCE ATTRIBUTION

When creating AI-generated content from external sources:

* retain source URL
* retain source name
* store source date
* avoid copying protected articles verbatim
* create original reporting where possible
* display attribution when required

Create article source management.

---

# 44. COMMENTS & COMMUNITY

Support:

Comments
Replies
Likes
Reports
Moderation
Blocked users

AI can assist moderation but must not be the sole decision-maker for important moderation actions.

---

# 45. USER FEATURES

Visitors can:

Register
Login
Follow categories
Follow locations
Bookmark articles
Like/react
Comment
Share
Subscribe to notifications

User profile:

Name
Email
Mobile
Preferred language
Followed locations
Followed categories
Bookmarks
Notification settings

---

# 46. NEWSLETTER

Create:

Newsletter templates
Daily newsletter
Weekly newsletter
Breaking-news newsletter

Allow automated generation using AI.

---

# 47. ADMIN SETTINGS

Create settings for:

Website
Brand
Logo
Favicon
Social accounts
SEO
AI
Email
SMS
WhatsApp
Notifications
Advertisements
Analytics
Live TV
Storage
Security
Languages

---

# 48. SECURITY

Implement:

CSRF protection
XSS protection
SQL injection protection
Rate limiting
Secure headers
Input validation
File validation
MIME validation
Authentication throttling
2FA for administrators
Audit logs
Encrypted tokens
Encrypted secrets

Never expose API keys to frontend.

---

# 49. API ARCHITECTURE

Create clean REST APIs.

Example:

/api/v1/auth
/api/v1/articles
/api/v1/categories
/api/v1/locations
/api/v1/videos
/api/v1/live
/api/v1/social
/api/v1/ai
/api/v1/reporters
/api/v1/media
/api/v1/notifications
/api/v1/search
/api/v1/analytics

Use API versioning.

Return consistent JSON responses.

---

# 50. CRON / QUEUE AUTOMATION

Create scheduled jobs for:

AI processing
Social publishing
Breaking news
Newsletters
Notifications
Analytics aggregation
Video processing
SEO generation
Sitemap generation
Cleanup jobs

Use Laravel Scheduler + Redis Queue.

---

# 51. UI PAGES — ADMIN

Create:

/admin/dashboard
/admin/news
/admin/news/create
/admin/news/edit
/admin/news/review
/admin/ai-newsroom
/admin/reporters
/admin/assignments
/admin/categories
/admin/locations
/admin/media
/admin/videos
/admin/live-tv
/admin/social
/admin/social/calendar
/admin/social/accounts
/admin/seo
/admin/analytics
/admin/ads
/admin/users
/admin/roles
/admin/notifications
/admin/epaper
/admin/settings
/admin/audit-logs

---

# 52. AI NEWSROOM UI

Create a powerful AI workspace.

Layout:

LEFT:
Source/Input

CENTER:
AI Generated Draft

RIGHT:
AI Tools

Tools:

Generate
Rewrite
Summarize
Translate
Headline
SEO
Social
Video Script
Fact Check
Related Stories

Bottom:

Save Draft
Send to Editor
Schedule
Publish

---

# 53. SOCIAL MEDIA COMMAND CENTER

Create a visual social-media dashboard.

Show:

Facebook
Instagram
X
YouTube
WhatsApp
Telegram
LinkedIn

For every platform show:

Connected
Scheduled
Published
Failed
Engagement

Calendar view:

MON
TUE
WED
THU
FRI
SAT
SUN

Drag and drop scheduled posts.

---

# 54. AUTOMATED NEWS PIPELINE

Implement:

Topic entered
↓
AI research/source collection
↓
Draft
↓
Human review
↓
Approval
↓
SEO
↓
Social content
↓
Video script
↓
Schedule
↓
Website publish
↓
Social publish
↓
Notification
↓
Analytics

Every stage must be independently configurable.

---

# 55. "ONE TOPIC → COMPLETE NEWS PACKAGE"

Create a special feature.

User enters:

"New government hospital announced in Mahendergarh"

System creates:

1. News article
2. 5 headline options
3. SEO metadata
4. Hindi version
5. English version
6. Facebook post
7. Instagram caption
8. X post
9. WhatsApp message
10. Telegram post
11. YouTube title
12. YouTube description
13. 60-second video script
14. 30-second reel script
15. Thumbnail text
16. Push notification
17. Related-news suggestions
18. Newsletter entry

Show everything in one workspace.

Human editor can modify each item before publication.

---

# 56. AI DAILY NEWSROOM

Create a daily AI assistant.

Every morning it can provide:

Today's important topics
Pending stories
Breaking stories
Scheduled stories
Follow-up opportunities
Social schedule
Video opportunities
SEO opportunities

The AI must clearly distinguish:

SOURCE-BASED INFORMATION
EDITORIAL SUGGESTION
AI-GENERATED CONTENT

---

# 57. PERFORMANCE REQUIREMENTS

Optimize for:

Fast page loading
Image lazy loading
Responsive images
WebP/AVIF
Caching
CDN
Database indexes
API pagination
Redis caching
Queue-based processing

Target:

Excellent Core Web Vitals.

---

# 58. PWA

Make the public website installable as a Progressive Web App.

Support:

* offline shell
* push notifications
* mobile install
* responsive UI

---

# 59. ANDROID APP READY

Do not build the Android application initially unless required.

Instead build APIs that support:

Reader App
Reporter App
Editor App

Later these can be built using:

React Native / Flutter / native Android.

---

# 60. TESTING

Create:

Unit tests
Feature tests
API tests
Authentication tests
Permission tests
AI workflow tests
Social publishing tests
Queue tests

Test all critical workflows.

---

# 61. SEED DATA

Create realistic demo data for:

Haryana
Mahendergarh
Narnaul
Rewari
Bhiwani
Nuh
Gurugram
Faridabad

Create:

demo articles
demo reporters
demo categories
demo videos
demo social posts
demo analytics

Do not use real people's private data.

---

# 62. DEPLOYMENT

Prepare production deployment documentation for:

Ubuntu VPS
Nginx
PHP-FPM
MySQL
Redis
Supervisor
SSL
Queue workers
Cron
Storage
Backups

Environment variables must be documented in:

.env.example

Never commit real API keys.

---

# 63. PROJECT STRUCTURE

Use clean architecture.

Frontend:

/src
/components
/pages
/layouts
/hooks
/services
/api
/store
/types
/utils
/features

Backend:

app/Models
app/Services
app/Http/Controllers
app/Jobs
app/Events
app/Listeners
app/Notifications
app/Policies

Keep business logic out of controllers where possible.

---

# 64. DOCUMENTATION

Generate:

README.md
INSTALLATION.md
API.md
DATABASE.md
AI_ARCHITECTURE.md
SOCIAL_MEDIA_SETUP.md
DEPLOYMENT.md
SECURITY.md
ADMIN_GUIDE.md
REPORTER_GUIDE.md

---

# 65. DEVELOPMENT PHASES

Build in the following stages.

PHASE 1
Project foundation
Authentication
Database
Roles
Admin dashboard

PHASE 2
News CMS
Categories
Locations
Reporters
Editorial workflow

PHASE 3
Public website
SEO
Search
Homepage
Article pages

PHASE 4
Media
Video
Gallery
E-Paper

PHASE 5
AI Newsroom
AI article generation
AI headlines
AI SEO
AI translation

PHASE 6
Social Media Engine
Social accounts
Content generation
Scheduling
Publishing
Analytics

PHASE 7
AI Video
Scripts
Shorts
Captions
Thumbnails

PHASE 8
Live TV
Streaming
Programs
Schedules

PHASE 9
Citizen Reporter
Assignments
Mobile reporter APIs

PHASE 10
Notifications
WhatsApp
Telegram
Newsletter

PHASE 11
Advanced analytics
AI newsroom intelligence
Advertising

PHASE 12
Security
Performance
Testing
Production deployment

---

# 66. CRITICAL AI RULES

The AI must NEVER be treated as an unquestionable authority.

For news content:

AI generates drafts.

Human editors verify facts.

Human editors approve publication.

Clearly store source information.

Do not fabricate:

* quotes
* statistics
* government announcements
* people
* locations
* events
* citations
* sources

If information cannot be verified, mark it for editorial review.

---

# 67. FINAL PRODUCT

The finished system should feel like a professional:

DIGITAL NEWSROOM
+
NEWS WEBSITE
+
AI CONTENT STUDIO
+
SOCIAL MEDIA COMMAND CENTER
+
VIDEO NEWS PLATFORM
+
LIVE TV
+
REPORTER MANAGEMENT SYSTEM
+
ANALYTICS PLATFORM

It must be scalable from a small regional news organization to a multi-district/state-level digital media network.

---

# 68. IMPLEMENTATION INSTRUCTION TO THE CODING AGENT

Do NOT attempt to generate the entire application in one giant file.

Build the application module-by-module.

For every phase:

1. Explain the architecture.
2. Create database migrations.
3. Create models.
4. Create API endpoints.
5. Create services.
6. Create authentication/permissions.
7. Create frontend pages.
8. Create reusable components.
9. Add validation.
10. Add error handling.
11. Add loading states.
12. Add empty states.
13. Add tests.
14. Add seed/demo data.
15. Update documentation.

After completing each phase, verify that existing modules still work.

Never delete working functionality merely to simplify implementation.

Use reusable components and services.

Write production-quality code.

The final application must be deployable and maintainable, not a prototype or static mockup.

One important improvement I'd make to your idea

Don't make it “AI automatically creates and publishes news from just a topic.” Make it:

Topic → AI newsroom draft → source/evidence → human verification → approval → automatic multi-platform distribution.