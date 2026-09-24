"use client";

import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  UserPlus,
  KeyRound,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ExternalLink,
  Lock,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useLanguage } from "@/lib/languageContext";
import { Role, Permission, User } from "@/lib/types";
import { ROLE_PERMISSIONS } from "@/lib/permissions";
import PermissionGuard from "@/components/PermissionGuard";

export default function AdminUsersPage() {
  const { currentUser, allUsers, switchUser, switchRole, refreshUsers } = useAuth();
  const { b, lang } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"directory" | "matrix">("directory");
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New User Form State
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<Role>("REPORTER");
  const [newUserDistrict, setNewUserDistrict] = useState("महेंद्रगढ़ / Mahendergarh");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserDepartment, setNewUserDepartment] = useState("Editorial");
  const [submitting, setSubmitting] = useState(false);

  const rolesList: { role: Role; label: string; desc: string }[] = [
    { role: "SUPER_ADMIN", label: "Super Admin", desc: b("Full platform control & configuration", "पूर्ण नियंत्रण एवं प्लेटफ़ॉर्म कॉन्फ़िगरेशन") },
    { role: "EDITOR_IN_CHIEF", label: "Editor-in-Chief", desc: b("Chief editorial & publishing authority", "मुख्य संपादकीय व प्रकाशन प्राधिकारी") },
    { role: "DISTRICT_EDITOR", label: "District Editor", desc: b("District bureau review & approvals", "ज़िला ब्यूरो समीक्षा व अनुमोदन") },
    { role: "REPORTER", label: "Reporter", desc: b("Field coverage & story drafting", "फ़ील्ड कवरेज व समाचार ड्राफ्टिंग") },
    { role: "VIDEO_EDITOR", label: "Video Editor", desc: b("Live TV & video bulletin desk", "लाइव टीवी व वीडियो बुलेटिन प्रबंधन") },
    { role: "PHOTOGRAPHER", label: "Photographer", desc: b("Photo gallery & albums management", "फ़ोटो एल्बम व गैलरी प्रबंधन") },
    { role: "SOCIAL_MEDIA_MANAGER", label: "Social Media Manager", desc: b("Multi-platform syndication", "मल्टी-प्लेटफ़ॉर्म सोशल सिंडिकेशन") },
    { role: "AD_MANAGER", label: "Ad Manager", desc: b("Commercial ads & revenue campaigns", "वाणिज्यिक विज्ञापन व राजस्व अभियान") },
    { role: "SEO_MANAGER", label: "SEO Manager", desc: b("Search rankings & metadata", "खोज इंजन रैंकिंग व मेटा-डेटा") },
    { role: "CITIZEN_CONTRIBUTOR", label: "Citizen Contributor", desc: b("Citizen tips & local reporting", "नागरिक पत्रकारिता व स्थानीय टिप्स") },
  ];

  const permissionsList: { id: Permission; name: string; category: string }[] = [
    { id: "VIEW_DASHBOARD", name: b("Newsroom Dashboard Access", "न्यूज़रूम डैशबोर्ड पहुंच"), category: "Core" },
    { id: "CREATE_NEWS", name: b("Create & Draft News Stories", "समाचार आलेख ड्राफ्ट करना"), category: "Editorial" },
    { id: "PUBLISH_NEWS", name: b("Direct Publishing & Live Broadcast", "सीधा प्रकाशन व लाइव ब्रॉडकास्ट"), category: "Editorial" },
    { id: "APPROVE_NEWS", name: b("Editorial Queue Approval", "संपादकीय कतार में अनुमोदन"), category: "Editorial" },
    { id: "REJECT_NEWS", name: b("Reject / Request Revision", "आलेख अस्वीकार / संशोधन मांगना"), category: "Editorial" },
    { id: "DELETE_NEWS", name: b("Permanently Delete News", "समाचार स्थायी रूप से हटाना"), category: "Editorial" },
    { id: "ASSIGN_STORIES", name: b("Assign Field Stories", "रिपोर्टर टास्क असाइनमेंट"), category: "Editorial" },
    { id: "MANAGE_SOCIAL", name: b("Social Publishing & Syndication", "सोशल मीडिया पोस्टिंग व शेड्यूल"), category: "Syndication" },
    { id: "MANAGE_LIVE_TV", name: b("Live TV & Ticker Control", "लाइव टीवी स्ट्रीम व टिकर नियंत्रण"), category: "Broadcast" },
    { id: "MANAGE_VIDEOS", name: b("Video Bulletins & Shorts", "वीडियो बुलेटिन व 9:16 रील्स"), category: "Media" },
    { id: "MANAGE_GALLERY", name: b("Photo Galleries & Albums", "फ़ोटो गैलरी व एल्बम"), category: "Media" },
    { id: "MANAGE_ADS", name: b("Ad Campaigns & Monetization", "विज्ञापन अभियान व राजस्व डेस्क"), category: "Commercial" },
    { id: "MANAGE_NOTIFICATIONS", name: b("Push Breaking Alerts", "वेब पुश ब्रेकिंग अलर्ट्स भेजना"), category: "Distribution" },
    { id: "MANAGE_CITIZEN_REPORTS", name: b("Citizen Tips Triage", "नागरिक पत्रकारिता टिप्स समीक्षा"), category: "Community" },
    { id: "VIEW_ANALYTICS", name: b("Traffic & Revenue Intelligence", "ट्रैफिक व राजस्व इंटेलिजेंस"), category: "Intelligence" },
    { id: "VIEW_AUDIT_LOGS", name: b("Security & Compliance Audit", "सिस्टम ऑडिट व सुरक्षा लॉग"), category: "Security" },
    { id: "MANAGE_SETTINGS", name: b("Platform Branding & Policies", "प्लेटफ़ॉर्म ब्रैंडिंग व नीतियां"), category: "Administration" },
    { id: "MANAGE_USERS", name: b("Staff & RBAC Permissions", "स्टाफ प्रबंधन व भूमिका असाइनमेंट"), category: "Administration" },
  ];

  const filteredUsers = allUsers.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.district || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = selectedRoleFilter === "all" || user.role === selectedRoleFilter;
    return matchSearch && matchRole;
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      alert("कृपया नाम और ईमेल दर्ज करें।");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUserName.trim(),
          email: newUserEmail.trim(),
          role: newUserRole,
          district: newUserDistrict,
          phone: newUserPhone.trim(),
          department: newUserDepartment,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotification(`नया सदस्य "${data.user.name}" सफलतापूर्वक जोड़ा गया!`);
        setShowAddModal(false);
        setNewUserName("");
        setNewUserEmail("");
        setNewUserPhone("");
        await refreshUsers();
        setTimeout(() => setNotification(null), 4000);
      } else {
        alert(data.error || "सदस्य जोड़ने में त्रुटि आई।");
      }
    } catch {
      alert("सर्वर से संपर्क करने में असमर्थ।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PermissionGuard
      permission="MANAGE_USERS"
      fallbackTitle={b("Staff & RBAC management is restricted to Administrators", "टीम एवं RBAC प्रबंधन केवल व्यवस्थापक के लिए उपलब्ध है")}
      fallbackMessage={b("According to Ground Zero Newsroom security policies, only Super Admin or Admin roles can view or modify staff permissions.", "ग्राउंड ज़ीरो न्यूज़रूम सुरक्षा नीतियों के अनुसार, केवल Super Admin या Admin ही टीम सदस्यों की अनुमतियां देख व बदल सकते हैं।")}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <Users className="text-red-600 dark:text-red-500" />
              {b("Newsroom Staff & RBAC Management", "न्यूज़रूम टीम एवं भूमिका-आधारित पहुंच (Staff & RBAC)")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {b("13 specialized roles, 18 permissions with direct server-side enforcement and live role simulation", "13 विशेष भूमिकाएं, 18 अनुमतियों का प्रत्यक्ष सर्वर-साइड प्रवर्तन एवं सक्रिय भूमिका सिमुलेशन")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-900/20 transition-all cursor-pointer hover:scale-105"
            >
              <UserPlus size={15} />
              <span>{b("+ Onboard New Member", "नया सदस्य जोड़ें")}</span>
            </button>
          </div>
        </div>

        {notification && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>{notification}</span>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {b("Total Active Staff", "कुल सक्रिय सदस्य")}
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {allUsers.length}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 block">
              {b("100% Verified Accounts", "100% सत्यापित खाते")}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {b("Configured Roles", "निर्धारित भूमिकाएं")}
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              13
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 block">
              Granular RBAC Levels
            </span>
          </div>

          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {b("Publishing Authority", "प्रकाशन प्राधिकारी")}
            </span>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
              5
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 block">
              Super Admin, Chief & Editors
            </span>
          </div>

          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {b("Current Active Role", "वर्तमान सत्र भूमिका")}
            </span>
            <div className="text-lg font-black text-blue-600 dark:text-blue-400 mt-1 truncate">
              {currentUser.role}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 block truncate">
              {currentUser.name}
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("directory")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "directory"
                ? "bg-red-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Users size={14} />
            <span>{b("Staff Directory", "टीम डायरेक्टरी")} ({allUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "matrix"
                ? "bg-red-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck size={14} />
            <span>{b("RBAC Permission Matrix (18 Permissions)", "RBAC अनुमति मैट्रिक्स (18 Permissions)")}</span>
          </button>
        </div>

        {/* TAB 1: DIRECTORY */}
        {activeTab === "directory" && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder={b("Search name, email or district...", "नाम, ईमेल या ज़िला खोजें...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="all">{b("All Roles", "सभी भूमिकाएं (All Roles)")}</option>
                  {rolesList.map((r) => (
                    <option key={r.role} value={r.role}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">{b("Member / Name", "सदस्य / नाम")}</th>
                      <th className="p-3.5">{b("Role", "पद / भूमिका (Role)")}</th>
                      <th className="p-3.5">{b("District / Bureau", "ज़िला / ब्यूरो")}</th>
                      <th className="p-3.5">{b("Contact", "संपर्क")}</th>
                      <th className="p-3.5">{b("Status", "स्थिति")}</th>
                      <th className="p-3.5 text-right">{b("Role Simulation", "सत्र सिमुलेशन")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                    {filteredUsers.map((user) => {
                      const isCurrent = currentUser.id === user.id;

                      return (
                        <tr
                          key={user.id}
                          className={`hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors ${
                            isCurrent ? "bg-red-50/40 dark:bg-red-950/20" : ""
                          }`}
                        >
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                                alt={user.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                              />
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <span>{user.name}</span>
                                  {isCurrent && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-red-600 text-white">
                                      {b("Active", "सक्रिय (Active)")}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400">{user.email}</div>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                              {user.role}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                              <MapPin size={12} className="text-red-500" />
                              <span>{user.district || b("Haryana", "हरियाणा")}</span>
                            </div>
                          </td>

                          <td className="p-3.5 text-slate-500 dark:text-slate-400">
                            {user.phone ? (
                              <div className="flex items-center gap-1">
                                <Phone size={12} />
                                <span>{user.phone}</span>
                              </div>
                            ) : (
                              <span>—</span>
                            )}
                          </td>

                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {b("Active", "Active")}
                            </span>
                          </td>

                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => switchUser(user.id)}
                              disabled={isCurrent}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                                isCurrent
                                  ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                                  : "bg-red-50 hover:bg-red-600 text-red-700 hover:text-white dark:bg-red-950/60 dark:text-red-300 dark:hover:bg-red-600 border border-red-200 dark:border-red-900 shadow-xs"
                              }`}
                            >
                              {isCurrent ? b("Current Role", "वर्तमान भूमिका") : b("Switch to this role ›", "इस पद पर स्विच करें ›")}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RBAC MATRIX */}
        {activeTab === "matrix" && (
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  {b("Ground Zero 18-Point Permissions & Master RBAC Matrix", "ग्राउंड ज़ीरो 18-बिंदु अनुमतियां एवं भूमिका मैट्रिक्स (Master RBAC Table)")}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {b("This matrix is enforced on backend API routes. Unauthorized requests receive HTTP 403 Forbidden.", "यह मैट्रिक्स सीधे बैकएंड API रूट पर लागू होता है। अनधिकृत अनुरोध स्वतः 403 Forbidden के साथ अस्वीकार होते हैं।")}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-black uppercase tracking-wider">
                  <tr>
                    <th className="p-3 min-w-[200px]">{b("Permission / Privilege", "विशेषाधिकार (Permission)")}</th>
                    <th className="p-3 text-center">Super Admin</th>
                    <th className="p-3 text-center">Editor-in-Chief</th>
                    <th className="p-3 text-center">Dist. Editor</th>
                    <th className="p-3 text-center">Reporter</th>
                    <th className="p-3 text-center">Video Editor</th>
                    <th className="p-3 text-center">Social Mgr</th>
                    <th className="p-3 text-center">Ad Mgr</th>
                    <th className="p-3 text-center">Citizen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                  {permissionsList.map((perm) => {
                    const checkHas = (r: Role) => ROLE_PERMISSIONS[r]?.includes(perm.id);

                    return (
                      <tr key={perm.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                        <td className="p-3">
                          <div className="font-bold text-slate-900 dark:text-white">{perm.name}</div>
                          <div className="font-mono text-[10px] text-slate-400">{perm.id}</div>
                        </td>

                        <td className="p-3 text-center">
                          <CheckCircle2 size={16} className="mx-auto text-emerald-500" />
                        </td>

                        <td className="p-3 text-center">
                          {checkHas("EDITOR_IN_CHIEF") ? (
                            <CheckCircle2 size={16} className="mx-auto text-emerald-500" />
                          ) : (
                            <XCircle size={16} className="mx-auto text-slate-300 dark:text-slate-700" />
                          )}
                        </td>

                        <td className="p-3 text-center">
                          {checkHas("DISTRICT_EDITOR") ? (
                            <CheckCircle2 size={16} className="mx-auto text-emerald-500" />
                          ) : (
                            <XCircle size={16} className="mx-auto text-slate-300 dark:text-slate-700" />
                          )}
                        </td>

                        <td className="p-3 text-center">
                          {checkHas("REPORTER") ? (
                            <CheckCircle2 size={16} className="mx-auto text-emerald-500" />
                          ) : (
                            <XCircle size={16} className="mx-auto text-slate-300 dark:text-slate-700" />
                          )}
                        </td>

                        <td className="p-3 text-center">
                          {checkHas("VIDEO_EDITOR") ? (
                            <CheckCircle2 size={16} className="mx-auto text-emerald-500" />
                          ) : (
                            <XCircle size={16} className="mx-auto text-slate-300 dark:text-slate-700" />
                          )}
                        </td>

                        <td className="p-3 text-center">
                          {checkHas("SOCIAL_MEDIA_MANAGER") ? (
                            <CheckCircle2 size={16} className="mx-auto text-emerald-500" />
                          ) : (
                            <XCircle size={16} className="mx-auto text-slate-300 dark:text-slate-700" />
                          )}
                        </td>

                        <td className="p-3 text-center">
                          {checkHas("AD_MANAGER") ? (
                            <CheckCircle2 size={16} className="mx-auto text-emerald-500" />
                          ) : (
                            <XCircle size={16} className="mx-auto text-slate-300 dark:text-slate-700" />
                          )}
                        </td>

                        <td className="p-3 text-center">
                          {checkHas("CITIZEN_CONTRIBUTOR") ? (
                            <CheckCircle2 size={16} className="mx-auto text-emerald-500" />
                          ) : (
                            <XCircle size={16} className="mx-auto text-slate-300 dark:text-slate-700" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: ADD STAFF MEMBER */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4">
              <div className="p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-red-600 dark:text-red-500" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {b("Onboard New Newsroom Staff", "नया टीम सदस्य जोड़ें (Add Staff Member)")}
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddUser} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    {b("Full Name *", "पूरा नाम (Full Name) *")}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={b("e.g. Kuldeep Singh", "उदा. कुलदीप सिंह (Kuldeep Singh)")}
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      {b("Official Email *", "ईमेल पता (Official Email) *")}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="kuldeep@groundzero.media"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      {b("Mobile Phone", "फ़ोन नंबर (Mobile Phone)")}
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98120 XXXXX"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      {b("Assigned Role *", "पद एवं भूमिका (Assigned Role) *")}
                    </label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as Role)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-red-500 font-bold"
                    >
                      {rolesList.map((r) => (
                        <option key={r.role} value={r.role}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      {b("District / Bureau Jurisdiction", "ज़िला / ब्यूरो क्षेत्राधिकार")}
                    </label>
                    <select
                      value={newUserDistrict}
                      onChange={(e) => setNewUserDistrict(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-red-500"
                    >
                      <option value="महेंद्रगढ़ / Mahendergarh">महेंद्रगढ़ (नारनौल / अटेली / कनीना)</option>
                      <option value="रेवाड़ी / Rewari">रेवाड़ी (बावल / धारूहेड़ा / कोसली)</option>
                      <option value="गुरुग्राम / Gurugram">गुरुग्राम (मानेसर / सोहना / पटौदी)</option>
                      <option value="फरीदाबाद / Faridabad">फरीदाबाद (बल्लभगढ़ / बड़खल)</option>
                      <option value="नूह / Nuh">नूह / मेवात (तावडू / पुन्हाना)</option>
                      <option value="पलवल / Palwal">पलवल (होडल / हथीन)</option>
                      <option value="झज्जर / Jhajjar">झज्जर (बहादुरगढ़ / बेरी)</option>
                      <option value="चरखी दादरी / Charkhi Dadri">चरखी दादरी (बाढड़ा)</option>
                      <option value="साउथ हरियाणा (HQ)">साउथ हरियाणा मुख्यालय</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                  >
                    {b("Cancel", "रद्द करें")}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer shadow-md shadow-red-900/30 disabled:opacity-50"
                  >
                    {submitting ? b("Creating...", "जोड़ा जा रहा है...") : b("Create Account & Grant Permissions", "खाता बनाएं एवं अनुमति दें")}
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
