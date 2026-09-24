"use client";

import React, { useState, useEffect } from "react";
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
  Edit3,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  Check,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useLanguage } from "@/lib/languageContext";
import { Role, Permission, User, PasswordResetRequest } from "@/lib/types";
import { ROLE_PERMISSIONS } from "@/lib/permissions";
import PermissionGuard from "@/components/PermissionGuard";

export default function AdminUsersPage() {
  const { currentUser, allUsers, switchUser, switchRole, refreshUsers } = useAuth();
  const { b, lang } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"directory" | "requests" | "matrix">("directory");
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

  // Edit User & Role Modal State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<Role>("REPORTER");
  const [editDistrict, setEditDistrict] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");
  const [editPassword, setEditPassword] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Direct Change Password Modal State (Admin Only)
  const [passwordTargetUser, setPasswordTargetUser] = useState<User | null>(null);
  const [newDirectPassword, setNewDirectPassword] = useState("");
  const [showDirectPassword, setShowDirectPassword] = useState(false);
  const [copiedDirectPassword, setCopiedDirectPassword] = useState(false);

  // Password Requests State
  const [passwordRequests, setPasswordRequests] = useState<PasswordResetRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestFilter, setRequestFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [approvingRequest, setApprovingRequest] = useState<PasswordResetRequest | null>(null);
  const [approvalPassword, setApprovalPassword] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [showApprovalPassword, setShowApprovalPassword] = useState(false);
  const [copiedApprovalPassword, setCopiedApprovalPassword] = useState(false);

  const rolesList: { role: Role; label: string; desc: string }[] = [
    { role: "SUPER_ADMIN", label: "Super Admin", desc: b("Full platform control & configuration", "पूर्ण नियंत्रण एवं प्लेटफ़ॉर्म कॉन्फ़िगरेशन") },
    { role: "ADMIN", label: "Admin", desc: b("Administrative access & user oversight", "प्रशासनिक पहुंच एवं उपयोगकर्ता निगरानी") },
    { role: "EDITOR_IN_CHIEF", label: "Editor-in-Chief", desc: b("Chief editorial & publishing authority", "मुख्य संपादकीय व प्रकाशन प्राधिकारी") },
    { role: "EDITOR", label: "Editor", desc: b("Editorial review & publishing queue", "संपादकीय समीक्षा व प्रकाशन डेस्क") },
    { role: "DISTRICT_EDITOR", label: "District Editor", desc: b("District bureau review & approvals", "ज़िला ब्यूरो समीक्षा व अनुमोदन") },
    { role: "REPORTER", label: "Reporter", desc: b("Field coverage & story drafting", "फ़ील्ड कवरेज व समाचार ड्राफ्टिंग") },
    { role: "VIDEO_EDITOR", label: "Video Editor", desc: b("Live TV & video bulletin desk", "लाइव टीवी व वीडियो बुलेटिन प्रबंधन") },
    { role: "PHOTOGRAPHER", label: "Photographer", desc: b("Photo gallery & albums management", "फ़ोटो एल्बम व गैलरी प्रबंधन") },
    { role: "SOCIAL_MEDIA_MANAGER", label: "Social Media Manager", desc: b("Multi-platform syndication", "मल्टी-प्लेटफ़ॉर्म सोशल सिंडिकेशन") },
    { role: "AD_MANAGER", label: "Ad Manager", desc: b("Commercial ads & revenue campaigns", "वाणिज्यिक विज्ञापन व राजस्व अभियान") },
    { role: "SEO_MANAGER", label: "SEO Manager", desc: b("Search rankings & metadata", "खोज इंजन रैंकिंग व मेटा-डेटा") },
    { role: "VIEWER", label: "Viewer", desc: b("Read-only subscriber access", "केवल पढ़ने हेतु सदस्य पहुंच") },
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

  // Helper to generate strong passwords
  const generateStrongPassword = () => {
    const prefixes = ["GZNews", "SouthHar", "Rewari", "Narnaul", "Gurugram", "Ahirwal", "Mahendergarh", "Khabar"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(100 + Math.random() * 900);
    const symbols = ["@", "#", "$", "!", "&"];
    const sym = symbols[Math.floor(Math.random() * symbols.length)];
    return `${prefix}${sym}${num}`;
  };

  // Fetch Password Requests
  const fetchPasswordRequests = async () => {
    try {
      setLoadingRequests(true);
      const res = await fetch("/api/users/password-requests");
      const data = await res.json();
      if (res.ok && data?.success) {
        setPasswordRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Error fetching password requests:", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchPasswordRequests();
  }, []);

  const pendingRequestsCount = passwordRequests.filter((r) => r.status === "PENDING").length;

  const filteredUsers = allUsers.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.district || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = selectedRoleFilter === "all" || user.role === selectedRoleFilter;
    return matchSearch && matchRole;
  });

  const filteredRequests = passwordRequests.filter((req) => {
    if (requestFilter === "ALL") return true;
    return req.status === requestFilter;
  });

  // Handler: Add New User
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

  // Handler: Open Edit User Modal
  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditDistrict(user.district || "हरियाणा");
    setEditPhone(user.phone || "");
    setEditBio(user.bio || "");
    setEditDepartment(user.department || "Editorial");
    setEditStatus(user.status || "active");
    setEditPassword("");
    setShowEditPassword(false);
  };

  // Handler: Save Edited User & Role
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSubmitting(true);
    try {
      const payload: Record<string, any> = {
        name: editName.trim(),
        email: editEmail.trim(),
        role: editRole,
        district: editDistrict.trim(),
        phone: editPhone.trim(),
        bio: editBio.trim(),
        department: editDepartment.trim(),
        status: editStatus,
      };

      if (editPassword.trim()) {
        payload.password = editPassword.trim();
      }

      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotification(data.message || `सदस्य "${editName}" का विवरण सफलतापूर्वक अपडेट किया गया!`);
        setEditingUser(null);
        await refreshUsers();
        setTimeout(() => setNotification(null), 4000);
      } else {
        alert(data.error || "अपडेट करने में त्रुटि आई।");
      }
    } catch {
      alert("सर्वर से संपर्क करने में असमर्थ।");
    } finally {
      setSubmitting(false);
    }
  };

  // Handler: Open Direct Password Change Modal
  const handleOpenChangePassword = (user: User) => {
    setPasswordTargetUser(user);
    const pwd = generateStrongPassword();
    setNewDirectPassword(pwd);
    setShowDirectPassword(true);
    setCopiedDirectPassword(false);
  };

  // Handler: Save Direct Password Change
  const handleSaveDirectPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordTargetUser) return;

    if (!newDirectPassword.trim() || newDirectPassword.trim().length < 4) {
      alert("कृपया कम से कम 4 अक्षरों का पासवर्ड दर्ज करें।");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/users/${passwordTargetUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: newDirectPassword.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotification(`सदस्य "${passwordTargetUser.name}" का पासवर्ड सफलतापूर्वक अपडेट कर दिया गया!`);
        setPasswordTargetUser(null);
        setNewDirectPassword("");
        await refreshUsers();
        setTimeout(() => setNotification(null), 4000);
      } else {
        alert(data.error || "पासवर्ड बदलने में त्रुटि आई।");
      }
    } catch {
      alert("सर्वर से संपर्क करने में असमर्थ।");
    } finally {
      setSubmitting(false);
    }
  };

  // Handler: Open Approve Request Modal
  const handleOpenApproveRequest = (req: PasswordResetRequest) => {
    setApprovingRequest(req);
    const pwd = generateStrongPassword();
    setApprovalPassword(pwd);
    setShowApprovalPassword(true);
    setCopiedApprovalPassword(false);
    setApprovalNotes(`व्यवस्थापक द्वारा नया पासवर्ड जारी किया गया: ${new Date().toLocaleDateString("hi-IN")}`);
  };

  // Handler: Submit Approve Request
  const handleSubmitApproveRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingRequest) return;

    if (!approvalPassword.trim() || approvalPassword.trim().length < 4) {
      alert("कृपया कम से कम 4 अक्षरों का पासवर्ड दर्ज करें।");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/users/password-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: approvingRequest.id,
          action: "APPROVE",
          newPassword: approvalPassword.trim(),
          adminNotes: approvalNotes.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotification(`पासवर्ड अनुरोध स्वीकृत! ${approvingRequest.userName} का नया पासवर्ड निर्धारित कर दिया गया है।`);
        setApprovingRequest(null);
        setApprovalPassword("");
        setApprovalNotes("");
        await fetchPasswordRequests();
        await refreshUsers();
        setTimeout(() => setNotification(null), 4000);
      } else {
        alert(data.error || "अनुरोध प्रोसेस करने में त्रुटि आई।");
      }
    } catch {
      alert("सर्वर से संपर्क करने में असमर्थ।");
    } finally {
      setSubmitting(false);
    }
  };

  // Handler: Reject Request
  const handleRejectRequest = async (req: PasswordResetRequest) => {
    const reason = prompt(
      b(
        `Enter rejection reason for ${req.userName}:`,
        `"${req.userName}" का पासवर्ड अनुरोध अस्वीकार करने का कारण दर्ज करें:`
      ),
      "Security verification failed / Unverified request"
    );
    if (reason === null) return;

    try {
      const res = await fetch("/api/users/password-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: req.id,
          action: "REJECT",
          adminNotes: reason,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotification(`अनुरोध अस्वीकार कर दिया गया।`);
        await fetchPasswordRequests();
        setTimeout(() => setNotification(null), 4000);
      } else {
        alert(data.error || "त्रुटि आई।");
      }
    } catch {
      alert("सर्वर से संपर्क करने में असमर्थ।");
    }
  };

  return (
    <PermissionGuard
      permission="MANAGE_USERS"
      fallbackTitle={b("Staff & RBAC management is restricted to Administrators", "टीम एवं RBAC प्रबंधन केवल व्यवस्थापक के लिए उपलब्ध है")}
      fallbackMessage={b("According to Ground Zero Newsroom security policies, only Super Admin or Admin roles can view or modify staff permissions and reset passwords.", "ग्राउंड ज़ीरो न्यूज़रूम सुरक्षा नीतियों के अनुसार, केवल Super Admin या Admin ही टीम सदस्यों की अनुमतियां, भूमिकाएं और पासवर्ड बदल सकते हैं।")}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <Users className="text-red-600 dark:text-red-500" />
              {b("Newsroom Staff, Roles & Access Control", "न्यूज़रूम टीम, भूमिकाएं एवं पासवर्ड नियंत्रण (Staff & RBAC)")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {b(
                "Edit staff roles, district bureaus, and manage password changes directly or via user request queue.",
                "स्टाफ सदस्यों की भूमिका, ज़िला ब्यूरो संपादित करें एवं पासवर्ड सीधे या यूज़र अनुरोध कतार द्वारा बदलें।"
              )}
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
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {b("Total Staff Members", "कुल टीम सदस्य")}
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {allUsers.length}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 block">
              {b("Active Accounts", "सक्रिय खाते")}
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
              {b("Granular RBAC Levels", "विस्तृत RBAC स्तर")}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {b("Password Requests", "लंबित पासवर्ड अनुरोध")}
            </span>
            <div className={`text-2xl font-black mt-1 ${pendingRequestsCount > 0 ? "text-amber-500 animate-pulse" : "text-slate-700 dark:text-slate-300"}`}>
              {pendingRequestsCount}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 block">
              {pendingRequestsCount > 0 ? b("Requires Admin Review", "व्यवस्थापक समीक्षा आवश्यक") : b("All Resolved", "सभी निपटाए गए")}
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
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
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
            onClick={() => {
              setActiveTab("requests");
              fetchPasswordRequests();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer relative ${
              activeTab === "requests"
                ? "bg-red-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <KeyRound size={14} />
            <span>{b("Password Requests", "पासवर्ड अनुरोध")}</span>
            {pendingRequestsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                {pendingRequestsCount} {b("pending", "लंबित")}
              </span>
            )}
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

        {/* =========================================================================
            TAB 1: STAFF DIRECTORY (EDIT USERS, ROLES & PASSWORDS)
        ========================================================================= */}
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
                      <th className="p-3.5">{b("Role & Bureau", "पद / भूमिका (Role)")}</th>
                      <th className="p-3.5">{b("District Jurisdiction", "ज़िला / ब्यूरो क्षेत्राधिकार")}</th>
                      <th className="p-3.5">{b("Contact", "संपर्क")}</th>
                      <th className="p-3.5">{b("Status", "स्थिति")}</th>
                      <th className="p-3.5 text-right">{b("Admin Actions", "व्यवस्थापक कार्य")}</th>
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
                                      {b("Active", "सक्रिय")}
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
                              <MapPin size={12} className="text-red-500 shrink-0" />
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
                            {user.status === "inactive" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700">
                                {b("Inactive", "निष्क्रिय")}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {b("Active", "सक्रिय")}
                              </span>
                            )}
                          </td>

                          {/* Action Buttons: Edit, Change Password, Switch Role */}
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* 1. Edit User Profile & Role */}
                              <button
                                onClick={() => handleOpenEdit(user)}
                                title={b("Edit User Details & Role", "प्रोफ़ाइल एवं भूमिका संपादित करें")}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 transition cursor-pointer shadow-2xs"
                              >
                                <Edit3 size={13} />
                                <span className="hidden sm:inline">{b("Edit Role", "संपादित")}</span>
                              </button>

                              {/* 2. Direct Admin Password Change */}
                              <button
                                onClick={() => handleOpenChangePassword(user)}
                                title={b("Admin Change Password (Direct)", "सीधे पासवर्ड बदलें (Admin Only)")}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-600 hover:text-white dark:bg-amber-950/40 dark:hover:bg-amber-600 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 transition cursor-pointer shadow-2xs"
                              >
                                <KeyRound size={13} />
                                <span className="hidden sm:inline">{b("Password", "पासवर्ड")}</span>
                              </button>

                              {/* 3. Role Simulation Switcher */}
                              <button
                                onClick={() => switchUser(user.id)}
                                disabled={isCurrent}
                                title={isCurrent ? "वर्तमान सक्रिय सत्र" : `${user.role} के रूप में सत्र सिमुलेट करें`}
                                className={`px-2.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                                  isCurrent
                                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                                    : "bg-red-50 hover:bg-red-600 text-red-700 hover:text-white dark:bg-red-950/60 dark:text-red-300 dark:hover:bg-red-600 border border-red-200 dark:border-red-900 shadow-xs"
                                }`}
                              >
                                {isCurrent ? b("Current", "सक्रिय") : b("Simulate ›", "सिमुलेट ›")}
                              </button>
                            </div>
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

        {/* =========================================================================
            TAB 2: PASSWORD CHANGE REQUESTS QUEUE
        ========================================================================= */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            {/* Header / Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <KeyRound size={16} className="text-amber-500" />
                  {b("Staff Password Reset & Change Requests Queue", "स्टाफ पासवर्ड रीसेट एवं परिवर्तन अनुरोध कतार")}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {b(
                    "Only Administrators can set and approve passwords. Review user requests below to generate and issue new passwords.",
                    "केवल व्यवस्थापक ही पासवर्ड बदल सकते हैं। उपयोगकर्ताओं द्वारा भेजे गए अनुरोधों की समीक्षा कर नया पासवर्ड जारी करें।"
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchPasswordRequests}
                  disabled={loadingRequests}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="ताज़ा करें (Refresh)"
                >
                  <RefreshCw size={13} className={loadingRequests ? "animate-spin" : ""} />
                  <span>{b("Refresh", "ताज़ा करें")}</span>
                </button>

                <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-bold">
                  {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setRequestFilter(status)}
                      className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                        requestFilter === status
                          ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {status === "ALL" && b("All", "सभी")}
                      {status === "PENDING" && b("Pending", "लंबित")}
                      {status === "APPROVED" && b("Approved", "स्वीकृत")}
                      {status === "REJECTED" && b("Rejected", "अस्वीकृत")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              {filteredRequests.length === 0 ? (
                <div className="p-12 text-center">
                  <KeyRound size={36} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                  <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                    {b("No password requests found", "कोई पासवर्ड अनुरोध नहीं मिला")}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    {b(
                      "When staff members submit password change requests from the login screen or newsroom, they will appear here for admin approval.",
                      "जब टीम के सदस्य लॉगिन स्क्रीन या न्यूज़रूम से पासवर्ड बदलने का अनुरोध भेजेंगे, तो वे व्यवस्थापक की स्वीकृति हेतु यहां प्रदर्शित होंगे।"
                    )}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">{b("Staff Member", "स्टाफ सदस्य")}</th>
                        <th className="p-3.5">{b("Role", "भूमिका")}</th>
                        <th className="p-3.5">{b("Requested At", "अनुरोध समय")}</th>
                        <th className="p-3.5">{b("Reason / Note", "कारण / टिप्पणी")}</th>
                        <th className="p-3.5">{b("Status", "स्थिति")}</th>
                        <th className="p-3.5">{b("Resolution / Details", "व्यवस्थापक कार्यवाही")}</th>
                        <th className="p-3.5 text-right">{b("Action", "कार्यवाही")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                      {filteredRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900 dark:text-white">{req.userName}</div>
                            <div className="text-[11px] text-slate-400">{req.userEmail}</div>
                          </td>

                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {req.userRole}
                            </span>
                          </td>

                          <td className="p-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Clock size={12} className="text-slate-400" />
                              <span>
                                {new Date(req.requestedAt).toLocaleDateString("hi-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {new Date(req.requestedAt).toLocaleTimeString("hi-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </td>

                          <td className="p-3.5 max-w-xs text-slate-700 dark:text-slate-300">
                            <p className="line-clamp-2">{req.reason || b("Password reset requested", "पासवर्ड रीसेट अनुरोध")}</p>
                          </td>

                          <td className="p-3.5">
                            {req.status === "PENDING" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                {b("Pending", "लंबित (Pending)")}
                              </span>
                            )}
                            {req.status === "APPROVED" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                <CheckCircle2 size={11} className="text-emerald-600" />
                                {b("Approved", "स्वीकृत")}
                              </span>
                            )}
                            {req.status === "REJECTED" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                                <XCircle size={11} className="text-rose-600" />
                                {b("Rejected", "अस्वीकृत")}
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 text-slate-600 dark:text-slate-400">
                            {req.status === "APPROVED" && (
                              <div className="space-y-0.5">
                                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                  {b("Resolved by", "स्वीकर्ता")}: {req.resolvedBy || "Admin"}
                                </div>
                                {req.temporaryPassword && (
                                  <div className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded inline-block">
                                    पासवर्ड: <span className="font-bold text-slate-900 dark:text-white">{req.temporaryPassword}</span>
                                  </div>
                                )}
                              </div>
                            )}
                            {req.status === "REJECTED" && (
                              <div className="text-[11px] text-rose-500 italic">
                                {req.adminNotes || "व्यवस्थापक द्वारा अस्वीकार किया गया"}
                              </div>
                            )}
                            {req.status === "PENDING" && (
                              <span className="text-[11px] text-amber-500 font-medium">
                                {b("Awaiting admin review", "स्वीकृति की प्रतीक्षा में")}
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 text-right whitespace-nowrap">
                            {req.status === "PENDING" ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenApproveRequest(req)}
                                  className="px-3 py-1.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition cursor-pointer"
                                >
                                  {b("Approve & Set Password", "स्वीकृत करें व पासवर्ड बनाएं")}
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(req)}
                                  className="px-2.5 py-1.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 dark:bg-slate-800 dark:hover:bg-rose-950/60 dark:hover:text-rose-300 transition cursor-pointer"
                                >
                                  {b("Reject", "अस्वीकार")}
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400 font-medium">
                                {b("Closed", "पूर्ण")}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: RBAC MATRIX
        ========================================================================= */}
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
                    <th className="p-3 text-center">Admin</th>
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
                          {checkHas("ADMIN") ? (
                            <CheckCircle2 size={16} className="mx-auto text-emerald-500" />
                          ) : (
                            <XCircle size={16} className="mx-auto text-slate-300 dark:text-slate-700" />
                          )}
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

        {/* =========================================================================
            MODAL 1: ADD NEW STAFF MEMBER
        ========================================================================= */}
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

        {/* =========================================================================
            MODAL 2: EDIT USER & ROLE MODAL (ADMIN ONLY)
        ========================================================================= */}
        {editingUser && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
              <div className="p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {b("Edit Staff Member & Role", "स्टाफ सदस्य एवं भूमिका संपादित करें")}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      ID: {editingUser.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      {b("Full Name *", "पूरा नाम *")}
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      {b("Official Email *", "ईमेल पता *")}
                    </label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Assigned Role */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      {b("Role / Designation *", "पद / भूमिका (Role) *")}
                    </label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as Role)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500 font-bold"
                    >
                      {rolesList.map((r) => (
                        <option key={r.role} value={r.role}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Account Status */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      {b("Account Status", "खाता स्थिति (Status)")}
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as "active" | "inactive")}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500 font-medium"
                    >
                      <option value="active">सक्रिय (Active)</option>
                      <option value="inactive">निष्क्रिय / निलंबित (Inactive)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* District / Bureau */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      {b("District Bureau", "ज़िला ब्यूरो क्षेत्राधिकार")}
                    </label>
                    <input
                      type="text"
                      value={editDistrict}
                      onChange={(e) => setEditDistrict(e.target.value)}
                      placeholder="e.g. रेवाड़ी / Rewari"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      {b("Contact Phone", "संपर्क फ़ोन नंबर")}
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+91 98XXX XXXXX"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Bio / Designation Notes */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    {b("Bio / Newsroom Designation", "न्यूज़रूम पदनाम व संक्षिप्त परिचय")}
                  </label>
                  <input
                    type="text"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Field Reporter / Senior Bureau Chief"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                {/* Optional Direct Password Override */}
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-amber-900 dark:text-amber-300 font-bold flex items-center gap-1.5">
                      <KeyRound size={13} />
                      <span>{b("Change User Password (Optional Admin Override)", "पासवर्ड बदलें (वैकल्पिक Admin Override)")}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const pwd = generateStrongPassword();
                        setEditPassword(pwd);
                        setShowEditPassword(true);
                      }}
                      className="text-[11px] text-amber-700 dark:text-amber-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles size={11} />
                      <span>{b("Generate Password", "पासवर्ड बनाएं")}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showEditPassword ? "text" : "password"}
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder={b("Leave blank to keep existing password unchanged", "वर्तमान पासवर्ड को यथावत रखने हेतु इसे खाली छोड़ें")}
                      className="w-full p-2.5 pr-10 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800/80 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showEditPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-amber-800/80 dark:text-amber-400/80">
                    {b(
                      "Security Rule: Regular staff cannot change their password directly. They must submit a request or admin sets it here.",
                      "सुरक्षा नियम: सामान्य स्टाफ सीधे अपना पासवर्ड नहीं बदल सकते; वे अनुरोध भेजते हैं या व्यवस्थापक यहां से निर्धारित करता है।"
                    )}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                  >
                    {b("Cancel", "रद्द करें")}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md shadow-blue-900/30 disabled:opacity-50"
                  >
                    {submitting ? b("Saving Changes...", "सहेजा जा रहा है...") : b("Save Changes & Role", "परिवर्तन सहेजें")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL 3: DIRECT ADMIN PASSWORD CHANGE MODAL
        ========================================================================= */}
        {passwordTargetUser && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl space-y-4">
              <div className="p-5 bg-amber-500/10 border-b border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {b("Set / Change Staff Password", "स्टाफ पासवर्ड निर्धारित / बदलें")}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {passwordTargetUser.name} ({passwordTargetUser.role})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPasswordTargetUser(null)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveDirectPassword} className="p-5 space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-slate-700 dark:text-slate-300 font-bold">
                      {b("New Password", "नया पासवर्ड")}
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const pwd = generateStrongPassword();
                          setNewDirectPassword(pwd);
                        }}
                        className="text-[11px] text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles size={11} />
                        <span>{b("Generate Strong", "सुरक्षित पासवर्ड बनाएं")}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (newDirectPassword) {
                            navigator.clipboard.writeText(newDirectPassword);
                            setCopiedDirectPassword(true);
                            setTimeout(() => setCopiedDirectPassword(false), 2000);
                          }
                        }}
                        className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        {copiedDirectPassword ? <Check size={11} /> : <Copy size={11} />}
                        <span>{copiedDirectPassword ? b("Copied!", "कॉपी हुआ!") : b("Copy", "कॉपी")}</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type={showDirectPassword ? "text" : "password"}
                      required
                      value={newDirectPassword}
                      onChange={(e) => setNewDirectPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full p-2.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDirectPassword(!showDirectPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showDirectPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {b("Target User Details:", "सदस्य विवरण:")}
                  </div>
                  <div>ईमेल: <span className="font-mono text-slate-900 dark:text-white">{passwordTargetUser.email}</span></div>
                  <div>ज़िला: <span className="text-slate-900 dark:text-white">{passwordTargetUser.district || "South Haryana"}</span></div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPasswordTargetUser(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                  >
                    {b("Cancel", "रद्द करें")}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer shadow-md shadow-amber-900/30 disabled:opacity-50"
                  >
                    {submitting ? b("Updating...", "अपडेट हो रहा है...") : b("Set Password Now", "पासवर्ड सेट करें")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL 4: APPROVE PASSWORD REQUEST & SET NEW PASSWORD
        ========================================================================= */}
        {approvingRequest && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl space-y-4">
              <div className="p-5 bg-emerald-500/10 border-b border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {b("Approve Request & Issue Password", "अनुरोध स्वीकृत करें व नया पासवर्ड जारी करें")}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {approvingRequest.userName} ({approvingRequest.userEmail})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setApprovingRequest(null)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitApproveRequest} className="p-5 space-y-4 text-xs">
                {/* Request Reason Note */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {b("User Request Note / Reason:", "यूज़र द्वारा भेजा गया कारण:")}
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    {approvingRequest.reason || b("Password reset requested", "पासवर्ड रीसेट अनुरोध")}
                  </p>
                </div>

                {/* Password Input + Generator */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-slate-700 dark:text-slate-300 font-bold">
                      {b("New Password to Issue *", "जारी किया जाने वाला नया पासवर्ड *")}
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const pwd = generateStrongPassword();
                          setApprovalPassword(pwd);
                        }}
                        className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles size={11} />
                        <span>{b("Generate", "नया बनाएं")}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (approvalPassword) {
                            navigator.clipboard.writeText(approvalPassword);
                            setCopiedApprovalPassword(true);
                            setTimeout(() => setCopiedApprovalPassword(false), 2000);
                          }
                        }}
                        className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        {copiedApprovalPassword ? <Check size={11} /> : <Copy size={11} />}
                        <span>{copiedApprovalPassword ? b("Copied!", "कॉपी!") : b("Copy", "कॉपी")}</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type={showApprovalPassword ? "text" : "password"}
                      required
                      value={approvalPassword}
                      onChange={(e) => setApprovalPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full p-2.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApprovalPassword(!showApprovalPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showApprovalPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    {b("Admin Note (Recorded in Audit Trail)", "व्यवस्थापक टिप्पणी (ऑडिट ट्रेल में दर्ज)")}
                  </label>
                  <input
                    type="text"
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    placeholder="Approved by Admin on phone verification"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setApprovingRequest(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                  >
                    {b("Cancel", "रद्द करें")}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-md shadow-emerald-900/30 disabled:opacity-50"
                  >
                    {submitting ? b("Issuing...", "जारी किया जा रहा है...") : b("Approve & Save Password", "स्वीकृत करें एवं पासवर्ड सहेजें")}
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
