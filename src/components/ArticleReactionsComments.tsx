"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  ThumbsUp,
  Heart,
  Lightbulb,
  AlertCircle,
  Send,
  User,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface Comment {
  id: string;
  name: string;
  comment: string;
  createdAt: string;
  likes: number;
}

interface ArticleReactionsCommentsProps {
  articleId: string;
}

export default function ArticleReactionsComments({
  articleId,
}: ArticleReactionsCommentsProps) {
  // Reactions State
  const [reactions, setReactions] = useState<{
    like: number;
    clap: number;
    heart: number;
    insight: number;
    angry: number;
  }>({
    like: 42,
    clap: 28,
    heart: 35,
    insight: 19,
    angry: 3,
  });

  const [userReacted, setUserReacted] = useState<string | null>(null);

  // Comments State
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "c-1",
      name: "विकास राव (रेवाड़ी)",
      comment:
        "इस मुद्दे पर ग्राउंड ज़ीरो की रिपोर्ट बेहद निष्पक्ष है। प्रशासन को इस पर तत्काल संज्ञान लेना चाहिए।",
      createdAt: "1 घंटे पहले",
      likes: 8,
    },
    {
      id: "c-2",
      name: "सुनीता शर्मा (नारनौल)",
      comment:
        "स्वास्थ्य सुविधाओं को लेकर लंबे समय से मांग थी। उम्मीद है कि नए ट्रॉमा सेंटर से ग्रामीण अंचल को बहुत राहत मिलेगी।",
      createdAt: "3 घंटे पहले",
      likes: 14,
    },
  ]);

  const [authorName, setAuthorName] = useState("");
  const [newComment, setNewComment] = useState("");
  const [commentSuccess, setCommentSuccess] = useState(false);

  const handleReact = (type: "like" | "clap" | "heart" | "insight" | "angry") => {
    if (userReacted === type) return;
    setReactions((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
    setUserReacted(type);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !newComment.trim()) return;

    const created: Comment = {
      id: `c-${Date.now()}`,
      name: authorName.trim(),
      comment: newComment.trim(),
      createdAt: "अभी (Just now)",
      likes: 1,
    };

    setComments([created, ...comments]);
    setAuthorName("");
    setNewComment("");
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  return (
    <div className="my-8 space-y-6 pt-6 border-t-2 border-slate-900">
      {/* 1. Emoji Reactions Bar */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            आपकी राय (Reader Reactions)
          </h4>
          <span className="text-xs text-slate-400">
            {Object.values(reactions).reduce((a, b) => a + b, 0)} प्रतिक्रियाएं
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => handleReact("like")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              userReacted === "like"
                ? "bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-950 dark:text-blue-300 scale-105"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-700 dark:text-slate-200"
            }`}
          >
            <span className="text-base">👍</span>
            <span>लाइक</span>
            <span className="text-[11px] text-slate-400 font-mono">
              {reactions.like}
            </span>
          </button>

          <button
            onClick={() => handleReact("clap")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              userReacted === "clap"
                ? "bg-amber-50 border-amber-400 text-amber-700 dark:bg-amber-950 dark:text-amber-300 scale-105"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-700 dark:text-slate-200"
            }`}
          >
            <span className="text-base">👏</span>
            <span>सराहनीय</span>
            <span className="text-[11px] text-slate-400 font-mono">
              {reactions.clap}
            </span>
          </button>

          <button
            onClick={() => handleReact("heart")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              userReacted === "heart"
                ? "bg-rose-50 border-rose-400 text-rose-700 dark:bg-rose-950 dark:text-rose-300 scale-105"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-rose-400 text-slate-700 dark:text-slate-200"
            }`}
          >
            <span className="text-base">❤️</span>
            <span>पसंद</span>
            <span className="text-[11px] text-slate-400 font-mono">
              {reactions.heart}
            </span>
          </button>

          <button
            onClick={() => handleReact("insight")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              userReacted === "insight"
                ? "bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 scale-105"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-700 dark:text-slate-200"
            }`}
          >
            <span className="text-base">💡</span>
            <span>ज्ञानवर्धक</span>
            <span className="text-[11px] text-slate-400 font-mono">
              {reactions.insight}
            </span>
          </button>

          <button
            onClick={() => handleReact("angry")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              userReacted === "angry"
                ? "bg-red-50 border-red-400 text-red-700 dark:bg-red-950 dark:text-red-300 scale-105"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-red-400 text-slate-700 dark:text-slate-200"
            }`}
          >
            <span className="text-base">😡</span>
            <span>चिंताजनक</span>
            <span className="text-[11px] text-slate-400 font-mono">
              {reactions.angry}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Reader Discussion & Comments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#E11D48]" />
            <h3 className="font-black text-base text-slate-900 dark:text-white uppercase tracking-tight">
              पाठकों की राय एवं टिप्पणियां ({comments.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            सभ्य संवाद व मर्यादित भाषा अपेक्षित
          </span>
        </div>

        {commentSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>आपकी टिप्पणी सफलतापूर्वक प्रकाशित हो गई है!</span>
          </div>
        )}

        {/* Comment Form */}
        <form
          onSubmit={handleAddComment}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
        >
          <div>
            <input
              type="text"
              required
              placeholder="आपका नाम एवं शहर (उदा. राजेश यादव, अटेली)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <textarea
              rows={2}
              required
              placeholder="इस खबर पर अपनी राय लिखें..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-slate-400">
              * अभद्र या भ्रामक टिप्पणियां हटा दी जाएंगी
            </p>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>टिप्पणी भेजें</span>
            </button>
          </div>
        </form>

        {/* Comments Feed */}
        <div className="space-y-3 pt-2">
          {comments.map((c) => (
            <div
              key={c.id}
              className="p-4 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-950 text-[#E11D48] flex items-center justify-center font-bold text-xs">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white leading-tight">
                      {c.name}
                    </h5>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {c.createdAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <ThumbsUp className="w-3 h-3 text-slate-400" />
                  <span>{c.likes}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-9">
                {c.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
