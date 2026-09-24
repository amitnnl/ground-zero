"use client";

import React, { useState, useEffect } from "react";
import { FileClock, RefreshCw, Shield, Search, Filter } from "lucide-react";
import { AuditLog } from "@/lib/types";
import PermissionGuard from "@/components/PermissionGuard";
import { useLanguage } from "@/lib/languageContext";

export default function AuditLogsPage() {
  const { b, lang } = useLanguage();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/audit-logs");
      if (res.ok) {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const data = await res.json();
          if (data?.success) {
            setLogs(data.logs);
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
    fetchLogs();
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PermissionGuard permission="VIEW_AUDIT_LOGS">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileClock className="text-slate-500 dark:text-slate-400" />
            {b("Newsroom Audit & Security Logs", "न्यूज़रूम ऑडिट व सुरक्षा लॉग")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {b(
              "Immutable trail of article creation, state transitions, AI generation, social syndication, and staff operations",
              "समाचार निर्माण, स्थिति परिवर्तन, AI जनरेशन, सोशल पब्लिशिंग एवं भूमिका क्रियाकलापों का अपरिवर्तनीय रिकॉर्ड"
            )}
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-xs transition flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-rose-500" : ""} />
          <span>{b("Refresh Logs", "रिफ्रेश लॉग्स")}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search size={14} className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder={b("Search by user, action or article ID...", "उपयोगकर्ता, कार्रवाई या समाचार ID से खोजें...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">{b("Timestamp", "समय (Timestamp)")}</th>
                <th className="p-3.5">{b("User", "उपयोगकर्ता")}</th>
                <th className="p-3.5">{b("Role", "भूमिका (Role)")}</th>
                <th className="p-3.5">{b("Action", "कार्रवाई (Action)")}</th>
                <th className="p-3.5">{b("Audit Details", "विवरण (Audit Details)")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 text-xs">
                    {b("Loading audit trail...", "लोड हो रहा है...")}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 text-xs">
                    {b("No audit logs match your search criteria.", "कोई लॉग रिकॉर्ड नहीं मिला।")}
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                    <td className="p-3.5 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString(lang === "hi" ? "hi-IN" : "en-US")}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">{log.userName}</td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 max-w-md">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </PermissionGuard>
  );
}
