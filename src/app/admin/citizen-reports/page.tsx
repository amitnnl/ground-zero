"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Phone,
  FileEdit,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import { CitizenReport } from "@/lib/types";
import { useAuth } from "@/lib/authContext";
import { useLanguage } from "@/lib/languageContext";
import PermissionGuard from "@/components/PermissionGuard";

export default function AdminCitizenReportsPage() {
  const { allUsers, hasPermission } = useAuth();
  const { lang, b } = useLanguage();
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const reporters = allUsers.filter(
    (u) => u.role === "REPORTER" || u.role === "DISTRICT_EDITOR"
  );

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/citizen-reports");
      if (res.ok) {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const data = await res.json();
          if (data?.success) {
            setReports(data.reports);
          }
        }
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    status: CitizenReport["status"],
    assignedReporterId?: string
  ) => {
    try {
      const res = await fetch("/api/citizen-reports", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, assignedReporterId }),
      });
      if (res.ok) {
        fetchReports();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = reports.filter((r) => {
    if (selectedStatus !== "all" && r.status !== selectedStatus) return false;
    return true;
  });

  return (
    <PermissionGuard permission="MANAGE_CITIZEN_REPORTS">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <ShieldAlert className="text-orange-500" />
            {b("Citizen Journalism Triage Desk", "नागरिक पत्रकारिता ट्रायज डेस्क (Citizen Journalism Triage)")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {b(
              "AI pre-classification and reporter verification for citizen tips, events, and community alerts",
              "जनता द्वारा भेजी गई शिकायतों, घटनाओं व सुझावों की AI प्री-क्लासिफिकेशन व रिपोर्टर सत्यापन"
            )}
          </p>
        </div>

        <Link
          href="/send-news"
          target="_blank"
          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <span>{b("View Public Submission Form", "पब्लिक सबमिशन फॉर्म देखें")}</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl">
        <button
          onClick={() => setSelectedStatus("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            selectedStatus === "all" ? "bg-orange-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          {b("All Tips", "सभी सूचनाएं")} ({reports.length})
        </button>
        <button
          onClick={() => setSelectedStatus("pending_triage")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            selectedStatus === "pending_triage" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          {b("Pending Triage", "लंबित जांच (Pending)")}
        </button>
        <button
          onClick={() => setSelectedStatus("assigned_to_reporter")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            selectedStatus === "assigned_to_reporter" ? "bg-cyan-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          {b("Assigned to Reporter", "रिपोर्टर को सौंपी गई")}
        </button>
        <button
          onClick={() => setSelectedStatus("verified")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            selectedStatus === "verified" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          {b("Verified", "सत्यापित (Verified)")}
        </button>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">{b("Loading reports...", "लोड हो रहा है...")}</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 text-xs">
          {b("No reports found.", "कोई सूचना नहीं मिली।")}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((report) => (
            <div
              key={report.id}
              className="bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition space-y-3.5 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30">
                    {report.district}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{report.category}</span>
                  {report.aiClassification && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                      AI Urgency: {report.aiClassification.urgencyScore}%
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  {new Date(report.createdAt).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{report.headline}</h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{report.description}</p>
                {report.locationDetails && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                    <MapPin size={12} className="text-rose-500" />
                    {b("Exact Location:", "सटीक स्थान:")} <span className="text-slate-800 dark:text-slate-300 font-medium">{report.locationDetails}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                  <span>
                    {b("Citizen:", "नागरिक:")} <strong className="text-slate-900 dark:text-slate-200">{report.citizenName}</strong>
                  </span>
                  <span className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Phone size={12} />
                    {report.phone}
                  </span>
                </div>

                {/* Triage Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {report.status === "pending_triage" && (
                    <div className="flex items-center gap-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleUpdateStatus(report.id, "assigned_to_reporter", e.target.value);
                          }
                        }}
                        defaultValue=""
                        className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-300 focus:outline-hidden"
                      >
                        <option value="" disabled>
                          {b("Assign to Reporter...", "रिपोर्टर को सौंपें...")}
                        </option>
                        {reporters.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.district || "Bureau"})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {report.status !== "verified" && (
                    <button
                      onClick={() => handleUpdateStatus(report.id, "verified")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <CheckCircle2 size={13} />
                      {b("Mark Verified", "सत्यापित चिह्नित करें")}
                    </button>
                  )}

                  <Link
                    href={`/admin/new?title=${encodeURIComponent(report.headline)}&excerpt=${encodeURIComponent(report.description)}`}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-600/30 hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 hover:text-white border border-indigo-200 dark:border-indigo-500/40 font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <FileEdit size={13} />
                    {b("Convert to Story", "समाचार ड्राफ्ट बनाएं")}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </PermissionGuard>
  );
}
