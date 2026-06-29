"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Plus, MapPin, Briefcase, GraduationCap, Award, ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

interface ProfileData {
  headline: string;
  location: string;
  about: string;
  experience: { title: string; company: string; duration: string; description: string }[];
  education: { degree: string; school: string; year: string }[];
  skills: string[];
}

const defaultProfile: ProfileData = {
  headline: "",
  location: "",
  about: "",
  experience: [],
  education: [],
  skills: [],
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [tempData, setTempData] = useState<any>({});
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) { router.push("/login"); return; }
      setUser(currentUser);
      // Load saved profile from localStorage
      const saved = localStorage.getItem(`profile_${currentUser.uid}`);
      if (saved) setProfile(JSON.parse(saved));
    });
    return () => unsubscribe();
  }, []);

  const saveProfile = (updated: ProfileData) => {
    setProfile(updated);
    if (user) localStorage.setItem(`profile_${user.uid}`, JSON.stringify(updated));
  };

  const startEdit = (section: string, data: any) => {
    setEditSection(section);
    setTempData(data);
  };

  const cancelEdit = () => {
    setEditSection(null);
    setTempData({});
  };

  const saveIntro = () => {
    saveProfile({ ...profile, headline: tempData.headline, location: tempData.location, about: tempData.about });
    cancelEdit();
  };

  const saveExperience = () => {
    if (!tempData.title || !tempData.company) return;
    const updated = [...profile.experience];
    if (tempData._index !== undefined) updated[tempData._index] = { title: tempData.title, company: tempData.company, duration: tempData.duration, description: tempData.description };
    else updated.push({ title: tempData.title, company: tempData.company, duration: tempData.duration, description: tempData.description });
    saveProfile({ ...profile, experience: updated });
    cancelEdit();
  };

  const deleteExperience = (idx: number) => {
    const updated = profile.experience.filter((_, i) => i !== idx);
    saveProfile({ ...profile, experience: updated });
  };

  const saveEducation = () => {
    if (!tempData.degree || !tempData.school) return;
    const updated = [...profile.education];
    if (tempData._index !== undefined) updated[tempData._index] = { degree: tempData.degree, school: tempData.school, year: tempData.year };
    else updated.push({ degree: tempData.degree, school: tempData.school, year: tempData.year });
    saveProfile({ ...profile, education: updated });
    cancelEdit();
  };

  const deleteEducation = (idx: number) => {
    const updated = profile.education.filter((_, i) => i !== idx);
    saveProfile({ ...profile, education: updated });
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    saveProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
    setNewSkill("");
  };

  const removeSkill = (idx: number) => {
    saveProfile({ ...profile, skills: profile.skills.filter((_, i) => i !== idx) });
  };

  const initials = user?.displayName?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || user?.email?.charAt(0).toUpperCase() || "P";

  return (
    <main className="min-h-screen bg-[#f3f2ef] font-sans">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 h-12 sticky top-0 z-50 flex items-center px-6 gap-4 shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>
      </header>

      <div className="max-w-3xl mx-auto py-6 px-4 space-y-4">

        {/* Profile Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 relative">
            <button className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
              <Pencil className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="relative">
                {user?.photoURL ? (
                  <img src={user.photoURL || undefined} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-3xl shadow">
                    {initials}
                  </div>
                )}
                <button className="absolute bottom-1 right-1 w-7 h-7 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
                  <Pencil className="w-3 h-3 text-gray-600" />
                </button>
              </div>
              <button
                onClick={() => startEdit("intro", { headline: profile.headline, location: profile.location, about: profile.about })}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-full px-4 py-1.5 hover:bg-blue-50 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit intro
              </button>
            </div>

            <h1 className="text-2xl font-bold text-[#050505]">{user?.displayName || user?.email}</h1>
            <p className="text-base text-[#050505] mt-1">{profile.headline || <span className="text-gray-400 italic">Add a headline</span>}</p>
            {profile.location && (
              <div className="flex items-center gap-1 mt-1.5 text-sm text-[#65676b]">
                <MapPin className="w-3.5 h-3.5" /> {profile.location}
              </div>
            )}
            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>

            {/* Edit intro modal */}
            {editSection === "intro" && (
              <div className="mt-4 border border-blue-200 rounded-lg p-4 bg-blue-50 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Headline</label>
                  <input
                    value={tempData.headline || ""}
                    onChange={e => setTempData({ ...tempData, headline: e.target.value })}
                    placeholder="e.g. Fractional Sales Partner · Revenue Growth"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Location</label>
                  <input
                    value={tempData.location || ""}
                    onChange={e => setTempData({ ...tempData, location: e.target.value })}
                    placeholder="e.g. Mumbai, India"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">About</label>
                  <textarea
                    value={tempData.about || ""}
                    onChange={e => setTempData({ ...tempData, about: e.target.value })}
                    placeholder="Write a short summary about yourself..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white resize-none"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={cancelEdit} className="text-sm px-4 py-1.5 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">Cancel</button>
                  <button onClick={saveIntro} className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">Save</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* About */}
        {profile.about && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#050505] mb-3">About</h2>
            <p className="text-sm text-[#050505] leading-relaxed whitespace-pre-line">{profile.about}</p>
          </div>
        )}

        {/* Experience */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#050505] flex items-center gap-2"><Briefcase className="w-5 h-5" /> Experience</h2>
            <button
              onClick={() => startEdit("experience", {})}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {profile.experience.length === 0 && (
            <p className="text-sm text-gray-400 italic">Add your work experience to stand out.</p>
          )}

          <div className="space-y-4">
            {profile.experience.map((exp, idx) => (
              <div key={idx} className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 border border-gray-200 font-bold text-gray-500 text-sm">
                  {exp.company.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-[#050505]">{exp.title}</h4>
                  <p className="text-xs text-[#65676b]">{exp.company}</p>
                  {exp.duration && <p className="text-xs text-[#65676b]">{exp.duration}</p>}
                  {exp.description && <p className="text-xs text-[#050505] mt-1 leading-relaxed">{exp.description}</p>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit("experience", { ...exp, _index: idx })} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center">
                    <Pencil className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                  <button onClick={() => deleteExperience(idx)} className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center">
                    <X className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editSection === "experience" && (
            <div className="mt-4 border border-blue-200 rounded-lg p-4 bg-blue-50 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Job Title *</label>
                  <input value={tempData.title || ""} onChange={e => setTempData({ ...tempData, title: e.target.value })} placeholder="e.g. Sales Director" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Company *</label>
                  <input value={tempData.company || ""} onChange={e => setTempData({ ...tempData, company: e.target.value })} placeholder="e.g. Acme Corp" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Duration</label>
                <input value={tempData.duration || ""} onChange={e => setTempData({ ...tempData, duration: e.target.value })} placeholder="e.g. Jan 2022 – Present" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
                <textarea value={tempData.description || ""} onChange={e => setTempData({ ...tempData, description: e.target.value })} placeholder="Describe your role and achievements..." rows={3} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white resize-none" />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={cancelEdit} className="text-sm px-4 py-1.5 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">Cancel</button>
                <button onClick={saveExperience} className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">Save</button>
              </div>
            </div>
          )}
        </div>

        {/* Education */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#050505] flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Education</h2>
            <button onClick={() => startEdit("education", {})} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {profile.education.length === 0 && (
            <p className="text-sm text-gray-400 italic">Add your educational background.</p>
          )}

          <div className="space-y-4">
            {profile.education.map((edu, idx) => (
              <div key={idx} className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 border border-gray-200 font-bold text-gray-500 text-sm">
                  {edu.school.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-[#050505]">{edu.school}</h4>
                  <p className="text-xs text-[#65676b]">{edu.degree}</p>
                  {edu.year && <p className="text-xs text-[#65676b]">{edu.year}</p>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit("education", { ...edu, _index: idx })} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center">
                    <Pencil className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                  <button onClick={() => deleteEducation(idx)} className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center">
                    <X className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editSection === "education" && (
            <div className="mt-4 border border-blue-200 rounded-lg p-4 bg-blue-50 space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Degree / Field *</label>
                <input value={tempData.degree || ""} onChange={e => setTempData({ ...tempData, degree: e.target.value })} placeholder="e.g. MBA, Marketing" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">School / University *</label>
                <input value={tempData.school || ""} onChange={e => setTempData({ ...tempData, school: e.target.value })} placeholder="e.g. IIM Ahmedabad" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Year</label>
                <input value={tempData.year || ""} onChange={e => setTempData({ ...tempData, year: e.target.value })} placeholder="e.g. 2015 – 2017" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white" />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={cancelEdit} className="text-sm px-4 py-1.5 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">Cancel</button>
                <button onClick={saveEducation} className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">Save</button>
              </div>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#050505] flex items-center gap-2"><Award className="w-5 h-5" /> Skills</h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {profile.skills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                {skill}
                <button onClick={() => removeSkill(idx)} className="ml-1 hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {profile.skills.length === 0 && (
              <p className="text-sm text-gray-400 italic">Add skills to showcase your expertise.</p>
            )}
          </div>

          <div className="flex gap-2">
            <input
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addSkill()}
              placeholder="Type a skill and press Enter..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-1.5 text-sm outline-none focus:border-blue-500"
            />
            <button onClick={addSkill} className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              Add
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
