"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  KeyRound,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Users,
  Lock,
  ChevronRight,
  Radio,
  Newspaper,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { Role } from "@/lib/types";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/languageContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";

  const { login, allUsers } = useAuth();
  const { b } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password Reset Request Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [requestEmail, setRequestEmail] = useState("");
  const [requestReason, setRequestReason] = useState("");
  const [submittingReset, setSubmittingReset] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSendResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestEmail.trim()) {
      setResetFeedback({
        success: false,
        message: b("Please enter your registered staff email.", "कृपया अपना पंजीकृत ईमेल दर्ज करें।"),
      });
      return;
    }

    setSubmittingReset(true);
    setResetFeedback(null);
    try {
      const res = await fetch("/api/users/password-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: requestEmail.trim(),
          reason: requestReason.trim() || "User requested password reset via login screen",
        }),
      });
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        setResetFeedback({
          success: false,
          message: b("Server returned an invalid response. Please try again.", "सर्वर से अमान्य प्रतिक्रिया मिली। कृपया पुनः प्रयास करें।"),
        });
        return;
      }
      const data = await res.json();
      if (res.ok && data.success) {
        setResetFeedback({
          success: true,
          message:
            data.message ||
            b(
              "Your password reset request has been submitted to the Admin!",
              "आपका पासवर्ड बदलने का अनुरोध व्यवस्थापक (Admin) को भेज दिया गया है!"
            ),
        });
        setTimeout(() => {
          setShowResetModal(false);
          setResetFeedback(null);
          setRequestReason("");
        }, 4000);
      } else {
        setResetFeedback({
          success: false,
          message:
            data.error ||
            b("Could not submit request. Please verify your email.", "अनुरोध प्रेषित नहीं हो सका। ईमेल जांचें।"),
        });
      }
    } catch {
      setResetFeedback({
        success: false,
        message: b("Network error. Please try again.", "सर्वर से संपर्क नहीं हो सका। पुनः प्रयास करें।"),
      });
    } finally {
      setSubmittingReset(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage(b("Please enter your email or staff username.", "कृपया अपना ईमेल या यूज़रनेम दर्ज करें।"));
      return;
    }
    if (!password) {
      setErrorMessage(b("Please enter your password.", "कृपया अपना पासवर्ड दर्ज करें।"));
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.success) {
        setSuccessMessage(
          b(`Login successful! Welcome ${res.user?.name}...`, `लॉगिन सफल! ${res.user?.name} के रूप में स्वागत है...`)
        );
        setTimeout(() => {
          router.push(redirectUrl);
        }, 800);
      } else {
        setErrorMessage(res.error || b("Invalid credentials", "अमान्य क्रेडेंशियल्स"));
      }
    } catch {
      setErrorMessage(b("Technical error during login", "लॉगिन करते समय तकनीकी त्रुटि हुई"));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (staff: { userId?: string; email: string; title: string }) => {
    setEmail(staff.email);
    setPassword("groundzero123");
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await login({ userId: staff.userId, email: staff.email, password: "groundzero123" });
      if (res.success) {
        setSuccessMessage(
          b(`Logged in as ${staff.title}! Redirecting...`, `${staff.title} के रूप में लॉगिन सफल! रीडायरेक्ट हो रहा है...`)
        );
        setTimeout(() => {
          router.push(redirectUrl);
        }, 600);
      } else {
        setErrorMessage(res.error || b("Demo login failed", "डेमो लॉगिन असफल"));
      }
    } catch {
      setErrorMessage(b("Unable to connect to server", "सर्वर से संपर्क करने में असमर्थ"));
    } finally {
      setLoading(false);
    }
  };

  const demoStaff = [
    {
      role: "SUPER_ADMIN" as Role,
      title: b("Super Admin", "Super Admin (सर्वोच्च प्रशासक)"),
      name: b("Rajesh Verma", "राजेश वर्मा (Rajesh Verma)"),
      email: "superadmin@groundzero.media",
      userId: "usr-super-admin",
      badge: b("All 18 Permissions", "सभी 18 अनुमतियां"),
      color: "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400",
    },
    {
      role: "EDITOR_IN_CHIEF" as Role,
      title: b("Editor-in-Chief", "Editor-in-Chief (प्रधान संपादक)"),
      name: b("Amit Kumar", "अमित कुमार (Amit Kumar)"),
      email: "editor@groundzero.media",
      userId: "usr-editor-in-chief",
      badge: b("Publish & Live TV", "प्रकाशन व लाइव टीवी"),
      color: "border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-400",
    },
    {
      role: "DISTRICT_EDITOR" as Role,
      title: b("District Editor", "District Editor (ज़िला संपादक)"),
      name: b("Satish Yadav", "सतीश यादव (Satish Yadav)"),
      email: "satish.editor@groundzero.media",
      userId: "usr-district-editor",
      badge: b("Bureau Chief", "ब्यूरो चीफ"),
      color: "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-400",
    },
    {
      role: "REPORTER" as Role,
      title: b("Senior Reporter", "Senior Reporter (संवाददाता)"),
      name: b("Naveen Sharma", "नवीन शर्मा (Naveen Sharma)"),
      email: "naveen.reporter@groundzero.media",
      userId: "usr-reporter-narnaul",
      badge: b("Draft & Tips", "ड्राफ्ट व टिप्स"),
      color: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    },
    {
      role: "SOCIAL_MEDIA_MANAGER" as Role,
      title: b("Social Media Manager", "Social Media Manager (सोशल डेस्क)"),
      name: b("Priya Rao", "प्रिया राव (Priya Rao)"),
      email: "social@groundzero.media",
      userId: "usr-social-lead",
      badge: b("Syndication & Push", "सिंडिकेशन व अलर्ट"),
      color: "border-pink-500/40 bg-pink-500/10 text-pink-700 dark:text-pink-400",
    },
    {
      role: "CITIZEN_CONTRIBUTOR" as Role,
      title: b("Citizen Reporter", "Citizen Reporter (नागरिक पत्रकार)"),
      name: b("Vikas Choudhary", "विकास चौधरी (Vikas Choudhary)"),
      email: "vikas.citizen@gmail.com",
      userId: "usr-citizen",
      badge: b("Field Tips", "ग्राउंड सूचनाएं"),
      color: "border-slate-500/40 bg-slate-500/10 text-slate-700 dark:text-slate-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      {/* Top Navbar */}
      <nav className="h-16 px-4 lg:px-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9F1239] text-white flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform duration-200">
            GZ
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base sm:text-lg tracking-tight leading-none text-slate-900 dark:text-white">
              GROUND ZERO <span className="text-[#E11D48] text-xs">NEWSROOM</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase mt-0.5">
              {b("Secure Staff Portal", "सुरक्षित न्यूज़रूम पोर्टल")}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle variant="public" />
          <Link
            href="/"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition flex items-center gap-1.5"
          >
            <span>{b("Public Portal", "सार्वजनिक पोर्टल")}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Main Body */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Login Form */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 text-xs font-bold mb-3">
              <Shield size={13} />
              <span>{b("Authentication & Role-Based Access Control (RBAC)", "प्रमाणीकरण एवं भूमिका नियंत्रण (RBAC)")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {b("Enter Newsroom Command", "न्यूज़रूम में प्रवेश करें")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {b(
                "Sign in to Ground Zero Digital News Network editorial, broadcasting, and reporting systems.",
                "ग्राउंड ज़ीरो डिजिटल न्यूज़ नेटवर्क के संपादकीय, ब्रॉडकास्ट एवं रिपोर्टिंग सिस्टम में लॉग इन करें।"
              )}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2.5 animate-in fade-in-50">
              <AlertCircle size={16} className="shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2.5 animate-in fade-in-50">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {b("Staff Email / Username (Staff ID)", "स्टाफ ईमेल / यूज़रनेम (Email or Staff ID)")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={b("e.g. superadmin@groundzero.media", "उदा. rajesh.verma@groundzero.com")}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {b("Password", "पासवर्ड (Password)")}
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {b("Default:", "डिफ़ॉल्ट:")} <code className="font-mono text-rose-600 dark:text-rose-400 font-bold">groundzero123</code>
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-rose-600 focus:ring-rose-500"
                />
                <span>{b("Remember this workstation (7 days)", "इस वर्कस्टेशन को याद रखें (7 दिन)")}</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setRequestEmail(email || "");
                  setShowResetModal(true);
                  setResetFeedback(null);
                }}
                className="text-xs text-rose-600 dark:text-rose-400 font-semibold cursor-pointer hover:underline flex items-center gap-1"
              >
                <KeyRound size={12} />
                <span>{b("Forgot / Request Password Change", "पासवर्ड बदलने का अनुरोध भेजें")}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>{b("Authenticating...", "प्रमाणीकरण हो रहा है...")}</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>{b("Sign In to Newsroom OS", "साइन इन करें (Sign In to Newsroom OS)")}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {b(
                "This portal is restricted to authorized Ground Zero newsroom staff, reporters, and tech operations.",
                "यह प्रणाली केवल अधिकृत ग्राउंड ज़ीरो न्यूज़रूम पत्रकारों एवं तकनीकी टीम के लिए है।"
              )}
            </p>
          </div>
        </div>

        {/* Right Column: 1-Click Quick Demo Login Staff Roster */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="text-amber-500" size={18} />
                  {b("1-Click Staff Demo Login (Quick Role Tester)", "1-क्लिक स्टाफ डेमो लॉगिन (Quick Role Tester)")}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {b(
                    "Click on any role to immediately test corresponding permissions and view access:",
                    "विभिन्न अनुमतियों (Permissions) का तुरंत परीक्षण करने हेतु किसी भी भूमिका पर क्लिक करें:"
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
              {demoStaff.map((staff) => (
                <button
                  key={staff.email}
                  onClick={() => handleQuickDemoLogin(staff)}
                  disabled={loading}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between gap-2 shadow-2xs group ${staff.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black tracking-tight line-clamp-1">{staff.title}</span>
                    <ChevronRight size={13} className="opacity-60 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{staff.name}</div>
                    <div className="text-[10px] font-mono opacity-70 line-clamp-1">{staff.email}</div>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[10px]">
                    <span className="font-semibold">{staff.badge}</span>
                    <span className="font-bold underline text-[9px] uppercase">
                      {b("Login →", "लॉगिन →")}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <Lock size={13} className="text-emerald-500 shrink-0" />
              <span>
                {b(
                  "Once logged in, you can switch roles anytime from the RBAC Console or the top navigation bar.",
                  "लॉगिन करने के बाद आप RBAC Console या शीर्ष हेडर से कभी भी भूमिका बदल सकते हैं।"
                )}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} Ground Zero Newsroom. {b("All rights reserved. Secured with Role-Based Access Control.", "सर्वाधिकार सुरक्षित। RBAC सुरक्षा द्वारा संरक्षित।")}
      </footer>

      {/* Password Reset / Change Request Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl space-y-4">
            <div className="p-5 bg-rose-500/10 border-b border-rose-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {b("Request Password Reset", "पासवर्ड बदलने का अनुरोध भेजें")}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {b("Admin approval required for all password updates", "सुरक्षा नीति: केवल व्यवस्थापक ही पासवर्ड बदल सकते हैं")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(false);
                  setResetFeedback(null);
                }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendResetRequest} className="p-5 space-y-4 text-xs">
              {resetFeedback && (
                <div
                  className={`p-3.5 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
                    resetFeedback.success
                      ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                      : "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300"
                  }`}
                >
                  {resetFeedback.success ? (
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <span>{resetFeedback.message}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  {b("Registered Staff Email / Staff ID *", "पंजीकृत स्टाफ ईमेल या यूज़र आईडी *")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={14} />
                  </div>
                  <input
                    type="text"
                    required
                    value={requestEmail}
                    onChange={(e) => setRequestEmail(e.target.value)}
                    placeholder="e.g. naveen.reporter@groundzero.media"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  {b("Reason / Note for Administrator", "व्यवस्थापक हेतु कारण / विवरण")}
                </label>
                <textarea
                  rows={2}
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder={b("e.g. Forgot password / New workstation setup", "उदा. पासवर्ड भूल गए / नया डिवाइस सेटअप")}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-rose-500 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  {b("How it works:", "यह कैसे कार्य करता है:")}
                </div>
                <p>
                  {b(
                    "Your request will be queued in the Super Admin's security console. Once approved, the admin will set a new password and notify you.",
                    "आपका अनुरोध व्यवस्थापक (Admin) की सुरक्षा कतार में पहुंच जाएगा। अनुमोदन के बाद व्यवस्थापक नया पासवर्ड निर्धारित करेंगे।"
                  )}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(false);
                    setResetFeedback(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  {b("Cancel", "रद्द करें")}
                </button>
                <button
                  type="submit"
                  disabled={submittingReset}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer shadow-md shadow-rose-900/30 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submittingReset ? (
                    b("Sending...", "भेजा जा रहा है...")
                  ) : (
                    <>
                      <KeyRound size={13} />
                      <span>{b("Send Request to Admin", "व्यवस्थापक को अनुरोध भेजें")}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  const { b } = useLanguage();
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">{b("Loading portal...", "लोड हो रहा है...")}</div>}>
      <LoginForm />
    </Suspense>
  );
}
