"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MapPin,
  Tag,
  Shield,
  Send,
} from "lucide-react";
import { EditorialAssignment, User } from "@/lib/types";
import { useAuth } from "@/lib/authContext";
import { useLanguage } from "@/lib/languageContext";
import PermissionGuard from "@/components/PermissionGuard";

export default function ReporterAssignmentsPage() {
  const { currentUser, allUsers, hasPermission } = useAuth();
  const { lang, b } = useLanguage();
  const [assignments, setAssignments] = useState<EditorialAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New assignment form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reporterId, setReporterId] = useState("");
  const [location, setLocation] = useState("महेंद्रगढ़ / Mahendergarh");
  const [category, setCategory] = useState("साउथ हरियाणा");
  const [priority, setPriority] = useState<EditorialAssignment["priority"]>("medium");
  const [dueDate, setDueDate] = useState("");

  const reporters = allUsers.filter(
    (u) => u.role === "REPORTER" || u.role === "DISTRICT_EDITOR"
  );

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/assignments");
      if (res.ok) {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const data = await res.json();
          if (data?.success) {
            setAssignments(data.assignments);
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
    fetchAssignments();
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    const assignedReporter = allUsers.find((u) => u.id === reporterId);

    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          reporterId: reporterId || reporters[0]?.id || "usr-reporter-narnaul",
          reporterName: assignedReporter?.name || "नवीन शर्मा (Narnaul)",
          editorId: currentUser.id,
          editorName: currentUser.name,
          location,
          category,
          priority,
          dueDate: dueDate || new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          status: "assigned",
        }),
      });
      if (res.ok) {
        setShowCreateModal(false);
        setTitle("");
        setDescription("");
        fetchAssignments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: EditorialAssignment["status"]) => {
    try {
      const res = await fetch("/api/assignments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        fetchAssignments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = assignments.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    return true;
  });

  const getPriorityBadge = (p: EditorialAssignment["priority"]) => {
    switch (p) {
      case "urgent":
        return <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">{b("Urgent", "अति आवश्यक (Urgent)")}</span>;
      case "high":
        return <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">{b("High", "उच्च (High)")}</span>;
      default:
        return <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">{b("Normal", "सामान्य (Normal)")}</span>;
    }
  };

  return (
    <PermissionGuard permission="ASSIGN_STORIES">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="text-cyan-500" />
            {b("Reporter Field Assignments & Beat Desk", "रिपोर्टर असाइनमेंट एवं बीट डेस्क (Reporter Desk)")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {b("Assign story leads, field coverage, and investigative tasks to reporters", "संपादक द्वारा रिपोर्टरों को बीट, ग्राउंड कवरेज और विशेष जांच के कार्य सौंपें")}
          </p>
        </div>

        {hasPermission("ASSIGN_STORIES") && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>{b("Create New Assignment", "नया असाइनमेंट बनाएं")}</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            statusFilter === "all" ? "bg-cyan-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          {b("All Assignments", "सभी असाइनमेंट")} ({assignments.length})
        </button>
        <button
          onClick={() => setStatusFilter("in_progress")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            statusFilter === "in_progress" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          {b("In Progress", "प्रगति पर (In Progress)")}
        </button>
        <button
          onClick={() => setStatusFilter("submitted")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            statusFilter === "submitted" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          {b("Draft Submitted", "रिपोर्ट प्राप्त (Submitted)")}
        </button>
        <button
          onClick={() => setStatusFilter("completed")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            statusFilter === "completed" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          {b("Completed", "पूर्ण (Completed)")}
        </button>
      </div>

      {/* Assignment List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">{b("Loading assignments...", "लोड हो रहा है...")}</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 text-xs">
          {b("No assignments found.", "कोई असाइनमेंट नहीं मिला।")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between gap-4 shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(item.priority)}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <Calendar size={12} />
                    {b("Due:", "अंतिम तिथि:")} {new Date(item.dueDate).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US")}
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">{item.description}</p>

                <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-rose-500" />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag size={12} className="text-blue-500" />
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                <div>
                  <div className="text-[10px] text-slate-500">{b("Assigned Reporter:", "सौंपा गया रिपोर्टर:")}</div>
                  <div className="font-bold text-slate-900 dark:text-slate-200">{item.reporterName}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.status === "assigned" && (
                    <button
                      onClick={() => handleStatusChange(item.id, "in_progress")}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-600/30 hover:bg-amber-600 text-amber-700 dark:text-amber-300 hover:text-white border border-amber-200 dark:border-amber-500/40 text-xs font-bold transition cursor-pointer"
                    >
                      {b("Accept", "स्वीकार करें")}
                    </button>
                  )}
                  {item.status === "in_progress" && (
                    <button
                      onClick={() => handleStatusChange(item.id, "submitted")}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-600/30 hover:bg-blue-600 text-blue-700 dark:text-blue-300 hover:text-white border border-blue-200 dark:border-blue-500/40 text-xs font-bold transition cursor-pointer"
                    >
                      {b("Submit Draft", "ड्राफ्ट जमा करें")}
                    </button>
                  )}
                  {item.status === "submitted" && (
                    <button
                      onClick={() => handleStatusChange(item.id, "completed")}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      {b("Mark Completed", "पूर्ण चिह्नित करें")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="text-cyan-500" />
                {b("Create New Field Assignment", "नया रिपोर्टर असाइनमेंट बनाएं")}
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-400 font-semibold mb-1">
                  {b("Assignment Title / Subject:", "असाइनमेंट शीर्षक / विषय:")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={b("e.g. Investigation of safety arrangements at Narnaul Court", "उदा. नारनौल कोर्ट परिसर में सुरक्षा व्यवस्था की पड़ताल")}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-400 font-semibold mb-1">
                  {b("Select Reporter:", "रिपोर्टर चुनें:")}
                </label>
                <select
                  value={reporterId}
                  onChange={(e) => setReporterId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                >
                  {reporters.map((rep) => (
                    <option key={rep.id} value={rep.id}>
                      {rep.name} ({rep.district || rep.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 font-semibold mb-1">
                    {b("Location / Bureau:", "स्थान (Location):")}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 font-semibold mb-1">
                    {b("Priority:", "प्राथमिकता (Priority):")}
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="low">{b("Low", "सामान्य (Low)")}</option>
                    <option value="medium">{b("Medium", "मध्यम (Medium)")}</option>
                    <option value="high">{b("High", "उच्च (High)")}</option>
                    <option value="urgent">{b("Urgent", "अति आवश्यक (Urgent)")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-400 font-semibold mb-1">
                  {b("Detailed Coverage Instructions:", "विस्तृत कवरेज निर्देश:")}
                </label>
                <textarea
                  rows={3}
                  placeholder={b("Key questions, contacts, and required photos/videos...", "रिपोर्टर के लिए मुख्य बिंदु, सवाल और आवश्यक तस्वीरें...")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  {b("Cancel", "रद्द करें")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md cursor-pointer"
                >
                  {b("Issue Assignment", "असाइनमेंट जारी करें")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </PermissionGuard>
  );
}
