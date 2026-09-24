import { NextResponse } from "next/server";
import {
  getArticles,
  getAssignments,
  getCitizenReports,
  getSocialPosts,
  getAuditLogs,
  getUsers,
} from "@/lib/db";

export async function GET() {
  try {
    const allArticles = await getArticles({ status: "all" });
    const assignments = await getAssignments();
    const citizenReports = await getCitizenReports();
    const socialPosts = await getSocialPosts();
    const auditLogs = await getAuditLogs();
    const users = await getUsers();

    const publishedCount = allArticles.filter((a) => (a.status || "PUBLISHED") === "PUBLISHED").length;
    const underReviewCount = allArticles.filter((a) => a.status === "UNDER_REVIEW").length;
    const submittedCount = allArticles.filter((a) => a.status === "SUBMITTED").length;
    const aiDraftsCount = allArticles.filter((a) => a.aiGenerated).length;
    const breakingCount = allArticles.filter((a) => a.isBreaking).length;
    const totalViews = allArticles.reduce((acc, a) => acc + (a.views || 0), 0);

    const pendingCitizenReports = citizenReports.filter((c) => c.status === "pending_triage").length;
    const activeAssignments = assignments.filter((asg) => asg.status === "in_progress" || asg.status === "assigned").length;
    const scheduledSocialPosts = socialPosts.filter((sp) => sp.status === "scheduled").length;

    return NextResponse.json({
      success: true,
      stats: {
        totalArticles: allArticles.length,
        publishedCount,
        underReviewCount,
        submittedCount,
        aiDraftsCount,
        breakingCount,
        totalViews,
        pendingCitizenReports,
        activeAssignments,
        scheduledSocialPosts,
        totalReporters: users.filter((u) => u.role === "REPORTER" || u.role === "DISTRICT_EDITOR").length,
      },
      recentArticles: allArticles.slice(0, 6),
      publishingQueue: allArticles.filter((a) => a.status === "APPROVED" || a.status === "SCHEDULED" || a.status === "UNDER_REVIEW").slice(0, 5),
      recentCitizenReports: citizenReports.slice(0, 3),
      recentLogs: auditLogs.slice(0, 5),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
