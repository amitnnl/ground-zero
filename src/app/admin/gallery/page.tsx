"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Image as ImageIcon,
  PlusCircle,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar,
  CheckCircle2,
  Sparkles,
  Plus,
} from "lucide-react";
import { PhotoAlbum } from "@/lib/types";
import PermissionGuard from "@/components/PermissionGuard";
import { useLanguage } from "@/lib/languageContext";

export default function AdminGalleryPage() {
  const { b, lang } = useLanguage();
  const [albums, setAlbums] = useState<PhotoAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photographerName, setPhotographerName] = useState("Sunil Yadav (Photo Journalist)");
  const [location, setLocation] = useState("Narnaul, Mahendragarh");
  const [coverImageUrl, setCoverImageUrl] = useState("https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80");
  const [photosList, setPhotosList] = useState<Array<{ id: string; url: string; caption: string }>>([
    {
      id: "p-1",
      url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
      caption: "Monument main gateway view",
    },
    {
      id: "p-2",
      url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
      caption: "Historic stone arches and carvings",
    },
  ]);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const data = await res.json();
          if (data?.success) {
            setAlbums(data.albums);
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
    fetchAlbums();
  }, []);

  const handleAddPhotoRow = () => {
    setPhotosList((prev) => [
      ...prev,
      {
        id: `p-${Date.now()}`,
        url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
        caption: b("New photo caption", "नया फ़ोटो विवरण"),
      },
    ]);
  };

  const handleRemovePhotoRow = (index: number) => {
    setPhotosList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          photographerName,
          location,
          coverImageUrl,
          photos: photosList,
        }),
      });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok || !ct.includes("application/json")) {
        alert(b("Failed to create photo album (invalid response)", "एल्बम बनाने में त्रुटि (अमान्य प्रतिक्रिया)"));
        return;
      }
      const data = await res.json();
      if (data.success) {
        setNotification(b("Photo album published successfully!", "फ़ोटो एल्बम सफलतापूर्वक प्रकाशित हुआ!"));
        setShowCreateModal(false);
        setTitle("");
        setDescription("");
        fetchAlbums();
      } else {
        alert(data.error || b("Error creating album", "एल्बम बनाने में त्रुटि"));
      }
    } catch (err) {
      console.error(err);
      alert(b("Unable to connect to server", "सर्वर से संपर्क करने में असमर्थ"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm(b("Are you sure you want to remove this photo album?", "क्या आप इस फ़ोटो एल्बम को हटाना चाहते हैं?"))) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      const ct = res.headers.get("content-type") || "";
      if (res.ok && ct.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          setAlbums((prev) => prev.filter((a) => a.id !== id));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalPhotos = albums.reduce((sum, a) => sum + (a.photos?.length || 0), 0);

  return (
    <PermissionGuard permission="MANAGE_GALLERY">
      <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <Camera className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                {b("Photo Gallery Desk", "फ़ोटो गैलरी डेस्क")}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30">
                  {b("Visual Media", "विज़ुअल मीडिया")}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {b(
                  "Curated photojournalism albums documenting cultural heritage, events, and ground moments across Ahirwal and Haryana",
                  "हरियाणा एवं अहीरवाल की सांस्कृतिक व ऐतिहासिक फ़ोटो पत्रकारिता एल्बम प्रबंधन"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/gallery"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700"
          >
            <span>{b("View Live Gallery", "लाइव गैलरी देखें")}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-900/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{b("Create Photo Album", "नया फ़ोटो एल्बम (Create Album)")}</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs underline hover:text-emerald-900 dark:hover:text-white cursor-pointer">
            {b("Dismiss", "बंद करें")}
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>{b("Total Albums", "कुल एल्बम (Albums)")}</span>
            <ImageIcon className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{albums.length}</div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            {b("Curated Collections", "क्यूरेटेड संग्रह")}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>{b("Total Photos", "कुल तस्वीरें (Photos)")}</span>
            <Camera className="w-4 h-4 text-pink-500 dark:text-pink-400" />
          </div>
          <div className="text-2xl font-black text-pink-600 dark:text-pink-400 mt-2">{totalPhotos}</div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            {b("High-Res Visuals", "हाई-रिज़ॉल्यूशन विज़ुअल्स")}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>{b("Coverage Zone", "कवरेज क्षेत्र")}</span>
            <MapPin className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {b("Ahirwal Region", "अहीरवाल ज़िले")}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            {b("Narnaul, Rewari, Gurugram, Jhajjar", "नारनौल, रेवाड़ी, गुरुग्राम, झज्जर")}
          </p>
        </div>
      </div>

      {/* Albums Catalog Table */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-rose-500 dark:text-rose-400" />
            {b(`Active Photo Albums (${albums.length})`, `सक्रिय फ़ोटो एल्बम (${albums.length})`)}
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {b("Live CDN Image Host", "लाइव CDN इमेज होस्ट")}
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
            {b("Loading albums...", "लोड हो रहा है...")}
          </div>
        ) : albums.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
            {b("No albums available. Create your first photo album.", "कोई एल्बम उपलब्ध नहीं है। नया एल्बम बनाएं।")}
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800/80">
            {albums.map((album) => (
              <div
                key={album.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0 bg-slate-100 dark:bg-slate-900">
                    <Image
                      src={album.coverImageUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"}
                      alt={album.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white">
                      {album.photos?.length || 0}P
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {album.location}
                      </span>
                      <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {album.photographerName}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1 line-clamp-1">
                      {album.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {album.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-slate-800">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 dark:text-slate-400">{b("Photos", "तस्वीरें")}</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      {album.photos?.length || 0} {b("photos", "फ़ोटो")}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/gallery"
                      target="_blank"
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700"
                      title={b("View in Gallery", "गैलरी में देखें")}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteAlbum(album.id)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                      title={b("Delete", "हटाएं")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Create Photo Album */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 my-8">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                {b("Create New Photo Album", "नया फ़ोटो एल्बम बनाएं (Create Photo Album)")}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {b("Album Title *", "एल्बम शीर्षक (Album Title) *")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={b("e.g. Narnaul Jal Mahal & Birbal Chhatta Heritage Walk", "उदा. नारनौल जल महल एवं बीरबल का छत्ता")}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {b("Short Description", "संक्षिप्त विवरण (Description)")}
                </label>
                <textarea
                  rows={2}
                  placeholder={b("Album historical background and context...", "एल्बम की पृष्ठभूमि एवं ऐतिहासिक संदर्भ...")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {b("Photojournalist / Reporter Name", "फ़ोटो जर्नलिस्ट / रिपोर्टर नाम")}
                  </label>
                  <input
                    type="text"
                    value={photographerName}
                    onChange={(e) => setPhotographerName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {b("Location", "स्थान (Location)")}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {b("Cover Image URL *", "कवर इमेज URL (Cover Image) *")}
                </label>
                <input
                  type="url"
                  required
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                />
              </div>

              {/* Photos List Editor */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                    <span>{b(`Album Photos (${photosList.length})`, `एल्बम तस्वीरें (${photosList.length})`)}</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPhotoRow}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{b("Add Photo", "फ़ोटो जोड़ें")}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {photosList.map((photo, idx) => (
                    <div
                      key={photo.id || idx}
                      className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3"
                    >
                      <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">#{idx + 1}</span>
                      <div className="flex-1 space-y-2">
                        <input
                          type="url"
                          required
                          placeholder={b("Photo URL", "फ़ोटो URL")}
                          value={photo.url}
                          onChange={(e) => {
                            const updated = [...photosList];
                            updated[idx].url = e.target.value;
                            setPhotosList(updated);
                          }}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder={b("Caption (Description)", "कैप्शन (विवरण)")}
                          value={photo.caption}
                          onChange={(e) => {
                            const updated = [...photosList];
                            updated[idx].caption = e.target.value;
                            setPhotosList(updated);
                          }}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                      {photosList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePhotoRow(idx)}
                          className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                >
                  {b("Cancel", "रद्द करें")}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting
                    ? b("Publishing...", "प्रकाशित कर रहे हैं...")
                    : b("Publish Photo Album", "एल्बम प्रकाशित करें (Publish)")}
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
