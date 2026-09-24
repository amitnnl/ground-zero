"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/languageContext";

function EditRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { b } = useLanguage();
  const id = searchParams.get("id") || searchParams.get("edit");

  useEffect(() => {
    if (id) {
      router.replace(`/admin/new?edit=${id}`);
    } else {
      router.replace("/admin/editorial");
    }
  }, [id, router]);

  return (
    <div className="py-16 text-center text-xs text-slate-400">
      {b("Loading editor desk...", "संपादक डेस्क पर लोड हो रहा है...")}
    </div>
  );
}

export default function EditNewsPage() {
  const { b } = useLanguage();
  return (
    <Suspense fallback={<div className="py-16 text-center text-xs text-slate-400">{b("Loading...", "लोड हो रहा है...")}</div>}>
      <EditRedirectContent />
    </Suspense>
  );
}
