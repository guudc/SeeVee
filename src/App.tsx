/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Download, 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Heart, 
  Users,
  ChevronRight,
  ChevronLeft,
  Palette,
  LayoutDashboard,
  FileText,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { CVData, DEFAULT_CV_DATA, SavedCV } from './types';
import { storage } from './services/storage';
import logo from './logo.svg'
// @ts-ignore
import html2pdf from 'html2pdf.js';

const COLORS = [
  { name: 'Deepslate', value: '#334155' },
  { name: 'Purple', value: '#AD6BFF' },
  { name: 'Pink', value: '#FF478B' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Slate', value: '#475569' },
];

export default function App() {
  const [cvData, setCvData] = useState<CVData>(DEFAULT_CV_DATA);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [step, setStep] = useState(0);
  const [savedCVs, setSavedCVs] = useState<SavedCV[]>([]);
  const [currentCVId, setCurrentCVId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load saved CVs and current work on mount
  useEffect(() => {
    const saved = storage.getSavedCVs();
    setSavedCVs(saved);

    const currentWork = storage.getCurrentWork();
    if (currentWork && (currentWork.name || currentWork.summary)) {
      setCvData(currentWork);
      setView('editor');
    }
  }, []);

  // Auto-save current work
  useEffect(() => {
    if (view === 'editor') {
      storage.saveCurrentWork(cvData);
    }
  }, [cvData, view]);

  const handleNewCV = () => {
    setCvData(DEFAULT_CV_DATA);
    setCurrentCVId(null);
    setView('editor');
    setStep(0);
  };

  const handleEditCV = (cv: SavedCV) => {
    setCvData(cv.data);
    setCurrentCVId(cv.id);
    setView('editor');
    setStep(0);
  };

  const handleSaveCV = () => {
    const id = currentCVId || crypto.randomUUID();
    const newCV: SavedCV = {
      id,
      name: cvData.name || 'Untitled CV',
      lastModified: Date.now(),
      data: cvData
    };
    storage.saveCV(newCV);
    setSavedCVs(storage.getSavedCVs());
    setCurrentCVId(id);
  };

  const handleDeleteCV = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this CV?')) {
      storage.deleteCV(id);
      setSavedCVs(storage.getSavedCVs());
    }
  };

  const handlePrint = () => {
    const element = document.getElementById('cv-preview');
    if (!element) return;

    const opt = {
      margin: 10,
      filename: `${cvData.name.replace(/\s+/g, '_')}_CV.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        scrollY: 0,
        windowWidth: 850
      },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all'] }
    };

    html2pdf().set(opt).from(element).save();
  };

  const updateField = (field: keyof CVData, value: any) => {
    setCvData(prev => ({ ...prev, [field]: value }));
  };

  const addExperience = () => {
    updateField('experience', [
      ...cvData.experience,
      { title: '', company: '', location: '', date: '', bullets: [''] }
    ]);
  };

  const removeExperience = (index: number) => {
    updateField('experience', cvData.experience.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const newExp = [...cvData.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    updateField('experience', newExp);
  };

  const addEducation = () => {
    updateField('education', [
      ...cvData.education,
      { degree: '', school: '', location: '', date: '' }
    ]);
  };

  const removeEducation = (index: number) => {
    updateField('education', cvData.education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const newEdu = [...cvData.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    updateField('education', newEdu);
  };

  const addSkill = () => {
    updateField('skills', [...cvData.skills, '']);
  };

  const removeSkill = (index: number) => {
    updateField('skills', cvData.skills.filter((_, i) => i !== index));
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...cvData.skills];
    newSkills[index] = value;
    updateField('skills', newSkills);
  };

  const addSocial = () => {
    updateField('socials', [...cvData.socials, { platform: '', handle: '' }]);
  };

  const removeSocial = (index: number) => {
    updateField('socials', cvData.socials.filter((_, i) => i !== index));
  };

  const updateSocial = (index: number, field: 'platform' | 'handle', value: string) => {
    const newSocials = [...cvData.socials];
    newSocials[index] = { ...newSocials[index], [field]: value };
    updateField('socials', newSocials);
  };

  const steps = [
    { title: 'Personal Info', icon: User },
    { title: 'Summary & Skills', icon: Wrench },
    { title: 'Experience', icon: Briefcase },
    { title: 'Education', icon: GraduationCap },
    { title: 'Optional', icon: Heart },
    { title: 'Theme', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-purple-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 px-4 md:px-6 py-4 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-2 md:gap-3">
          <img src={logo} onClick={() => setView('dashboard')} style={{maxWidth:'40px', maxHeight:'40px'}} />
          <h1 className="text-xl md:text-2xl font-bold tracking-tighter text-stone-900">SeeVee</h1>
        </div>

        {view === 'editor' ? (
          <>
            <div className="flex bg-stone-100 p-1 rounded-full">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === 'edit' ? 'bg-white shadow-sm text-[#AD6BFF]' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === 'preview' ? 'bg-white shadow-sm text-[#AD6BFF]' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Preview
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('dashboard')}
                className="hidden md:flex items-center gap-2 text-stone-500 hover:text-stone-900 px-4 py-2 text-sm font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={handleSaveCV}
                className="flex items-center gap-2 bg-stone-100 text-stone-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-stone-200"
              >
                Save
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center w-10 h-10 md:w-auto md:px-5 md:py-2.5 bg-[#141414] text-white rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-purple-500/10"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline ml-2">Export PDF</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={handleNewCV}
              className="flex items-center gap-2 bg-[#AD6BFF] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 shadow-lg shadow-purple-500/20"
            >
              <Plus className="w-4 h-4" />
              Create New
            </button>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto min-h-[calc(100vh-73px)]">
        {view === 'dashboard' ? (
          <div className="p-6 md:p-12 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-serif italic text-stone-900">Your Dashboard</h2>
                <p className="text-stone-500">Manage and edit your saved CVs locally.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* New CV Card */}
              <button
                onClick={handleNewCV}
                className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-dashed border-stone-200 hover:border-[#AD6BFF] hover:bg-purple-50/50 transition-all group h-[240px]"
              >
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-[#AD6BFF] group-hover:text-white transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-stone-900">Create New CV</p>
                  <p className="text-xs text-stone-500 mt-1">Start from a blank template</p>
                </div>
              </button>

              {/* Saved CVs */}
              {savedCVs.map((cv) => (
                <div
                  key={cv.id}
                  onClick={() => handleEditCV(cv)}
                  className="group relative flex flex-col p-6 rounded-2xl bg-white border border-stone-200 hover:border-[#AD6BFF] hover:shadow-xl hover:shadow-purple-500/5 transition-all cursor-pointer h-[240px]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-purple-50 group-hover:text-[#AD6BFF] transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <button
                      onClick={(e) => handleDeleteCV(cv.id, e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all font-medium text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                  
                  <div className="mt-auto space-y-2">
                    <h3 className="font-bold text-lg text-stone-900 group-hover:text-[#AD6BFF] transition-colors truncate">
                      {cv.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                      <Clock className="w-3 h-3" />
                      <span>Last modified {new Date(cv.lastModified).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <ArrowLeft className="w-5 h-5 text-[#AD6BFF] rotate-180" />
                  </div>
                </div>
              ))}
            </div>

            {savedCVs.length === 0 && (
              <div className="text-center py-20 bg-stone-50 rounded-3xl border border-stone-100">
                <div className="max-w-xs mx-auto space-y-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <FileText className="w-8 h-8 text-stone-200" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-stone-900">No saved CVs yet</p>
                    <p className="text-sm text-stone-500">Your work will appear here once you save it.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Form Section */}
            <div className={`p-4 md:p-8 space-y-6 print:hidden border-r border-stone-200 bg-white ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-stone-100 scroll-smooth">
              {steps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs md:text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                    step === i ? 'text-[#AD6BFF] border-[#AD6BFF]' : 'text-stone-400 border-transparent hover:text-stone-600'
                  }`}
                >
                  <s.icon className="w-3.5 h-3.5" />
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {step === 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif italic text-stone-800">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Full Name</label>
                    <input
                      type="text"
                      value={cvData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Email Address</label>
                    <input
                      type="email"
                      value={cvData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Phone Number</label>
                    <input
                      type="text"
                      value={cvData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Location</label>
                    <input
                      type="text"
                      value={cvData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Social Media</label>
                    <button onClick={addSocial} className="text-[#AD6BFF] hover:opacity-80 text-sm font-medium flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Add Social
                    </button>
                  </div>
                  {cvData.socials.map((social, idx) => (
                    <div key={idx} className="flex gap-4 items-end">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={social.platform}
                          onChange={(e) => updateSocial(idx, 'platform', e.target.value)}
                          className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none"
                          placeholder="Platform (e.g. LinkedIn)"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={social.handle}
                          onChange={(e) => updateSocial(idx, 'handle', e.target.value)}
                          className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none"
                          placeholder="Handle/URL"
                        />
                      </div>
                      <button onClick={() => removeSocial(idx)} className="p-2 text-stone-400 hover:text-rose-500">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif italic text-stone-800">Summary & Skills</h2>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Professional Summary</label>
                  <textarea
                    value={cvData.summary}
                    onChange={(e) => updateField('summary', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition-all resize-none"
                    placeholder="Describe your professional background and key achievements..."
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Skills</label>
                    <button onClick={addSkill} className="text-[#AD6BFF] hover:opacity-80 text-sm font-medium flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Add Skill
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {cvData.skills.map((skill, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => updateSkill(idx, e.target.value)}
                          className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none"
                          placeholder="e.g. React.js, Project Management"
                        />
                        <button onClick={() => removeSkill(idx)} className="p-2 text-stone-400 hover:text-rose-500">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-serif italic text-stone-800">Work Experience</h2>
                  <button onClick={addExperience} className="bg-purple-50 text-[#AD6BFF] px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Experience
                  </button>
                </div>
                <div className="space-y-8">
                  {cvData.experience.map((exp, idx) => (
                    <div key={idx} className="p-6 bg-stone-50 rounded-xl border border-stone-200 space-y-4 relative group">
                      <button 
                        onClick={() => removeExperience(idx)}
                        className="absolute top-4 right-4 p-2 text-stone-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => updateExperience(idx, 'title', e.target.value)}
                          className="px-4 py-2 bg-white border border-stone-200 rounded-lg outline-none"
                          placeholder="Job Title"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                          className="px-4 py-2 bg-white border border-stone-200 rounded-lg outline-none"
                          placeholder="Company Name"
                        />
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(idx, 'location', e.target.value)}
                          className="px-4 py-2 bg-white border border-stone-200 rounded-lg outline-none"
                          placeholder="Location"
                        />
                        <input
                          type="text"
                          value={exp.date}
                          onChange={(e) => updateExperience(idx, 'date', e.target.value)}
                          className="px-4 py-2 bg-white border border-stone-200 rounded-lg outline-none"
                          placeholder="Date Range (e.g. 2020 - Present)"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Responsibilities (One per line)</label>
                        <textarea
                          value={exp.bullets.join('\n')}
                          onChange={(e) => updateExperience(idx, 'bullets', e.target.value.split('\n'))}
                          rows={4}
                          className="w-full px-4 py-2 bg-white border border-stone-200 rounded-lg outline-none resize-none"
                          placeholder="• Developed new features..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-serif italic text-stone-800">Education</h2>
                  <button onClick={addEducation} className="bg-purple-50 text-[#AD6BFF] px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Education
                  </button>
                </div>
                <div className="space-y-6">
                  {cvData.education.map((edu, idx) => (
                    <div key={idx} className="p-6 bg-stone-50 rounded-xl border border-stone-200 space-y-4 relative group">
                      <button 
                        onClick={() => removeEducation(idx)}
                        className="absolute top-4 right-4 p-2 text-stone-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                          className="px-4 py-2 bg-white border border-stone-200 rounded-lg outline-none"
                          placeholder="Degree / Certification"
                        />
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => updateEducation(idx, 'school', e.target.value)}
                          className="px-4 py-2 bg-white border border-stone-200 rounded-lg outline-none"
                          placeholder="Institution Name"
                        />
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => updateEducation(idx, 'location', e.target.value)}
                          className="px-4 py-2 bg-white border border-stone-200 rounded-lg outline-none"
                          placeholder="Location"
                        />
                        <input
                          type="text"
                          value={edu.date}
                          onChange={(e) => updateEducation(idx, 'date', e.target.value)}
                          className="px-4 py-2 bg-white border border-stone-200 rounded-lg outline-none"
                          placeholder="Date Range"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif italic text-stone-800">Optional Sections</h2>
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Hobbies (Comma separated)</label>
                  <input
                    type="text"
                    value={cvData.hobbies?.join(', ') || ''}
                    onChange={(e) => updateField('hobbies', e.target.value.split(',').map(s => s.trim()))}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none"
                    placeholder="Photography, Hiking, Chess..."
                  />
                </div>
                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-400">References</label>
                    <button 
                      onClick={() => updateField('references', [...(cvData.references || []), { name: '', contact: '', relationship: '' }])}
                      className="text-[#AD6BFF] hover:opacity-80 text-sm font-medium flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Reference
                    </button>
                  </div>
                  {cvData.references?.map((ref, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-stone-50 rounded-lg border border-stone-200 relative group">
                      <button 
                        onClick={() => updateField('references', cvData.references?.filter((_, i) => i !== idx))}
                        className="absolute -top-2 -right-2 p-1 bg-white border border-stone-200 rounded-full text-stone-400 hover:text-rose-500 shadow-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <input
                        type="text"
                        value={ref.name}
                        onChange={(e) => {
                          const newRefs = [...(cvData.references || [])];
                          newRefs[idx].name = e.target.value;
                          updateField('references', newRefs);
                        }}
                        className="px-3 py-1.5 bg-white border border-stone-200 rounded-md text-sm outline-none"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={ref.contact}
                        onChange={(e) => {
                          const newRefs = [...(cvData.references || [])];
                          newRefs[idx].contact = e.target.value;
                          updateField('references', newRefs);
                        }}
                        className="px-3 py-1.5 bg-white border border-stone-200 rounded-md text-sm outline-none"
                        placeholder="Contact Info"
                      />
                      <input
                        type="text"
                        value={ref.relationship}
                        onChange={(e) => {
                          const newRefs = [...(cvData.references || [])];
                          newRefs[idx].relationship = e.target.value;
                          updateField('references', newRefs);
                        }}
                        className="px-3 py-1.5 bg-white border border-stone-200 rounded-md text-sm outline-none"
                        placeholder="Relationship"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif italic text-stone-800">Customize Theme</h2>
                <div className="grid grid-cols-4 gap-4">
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => updateField('themeColor', c.value)}
                      className={`group relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        cvData.themeColor === c.value ? 'border-purple-500 bg-purple-50' : 'border-stone-100 hover:border-stone-200'
                      }`}
                    >
                      <div 
                        className="w-10 h-10 rounded-full shadow-inner" 
                        style={{ backgroundColor: c.value }}
                      />
                      <span className="text-xs font-medium text-stone-600">{c.name}</span>
                      {cvData.themeColor === c.value && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-10 border-t border-stone-100 mt-10">
              <button
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                className="flex items-center gap-2 text-stone-400 hover:text-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
                disabled={step === steps.length - 1}
                className="flex items-center gap-2 bg-stone-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Preview Section */}
        <div className={`bg-stone-100 ${activeTab === 'edit' ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white min-h-full print:bg-white">
            <div 
              ref={previewRef}
              className="px-[10px] py-8 md:p-12 bg-white text-stone-900 font-serif leading-relaxed mx-auto max-w-[850px] shadow-sm"
              id="cv-preview"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              {/* Header */}
              <header className="text-center space-y-2 md:space-y-4 mb-6 md:mb-8">
                <h1 
                  className="text-2xl md:text-5xl font-bold tracking-tight uppercase break-words leading-tight"
                  style={{ color: cvData.themeColor }}
                >
                  {cvData.name}
                </h1>
                <div className="flex flex-wrap justify-center items-center gap-x-2 md:gap-x-4 gap-y-1 text-[9px] md:text-xs text-stone-600">
                  <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5 md:w-3 md:h-3" /> {cvData.location}</span>
                  <span className="hidden md:inline text-stone-300">|</span>
                  <span className="flex items-center gap-1"><Phone className="w-2.5 h-2.5 md:w-3 md:h-3" /> {cvData.phone}</span>
                  <span className="hidden md:inline text-stone-300">|</span>
                  <span className="flex items-center gap-1"><Mail className="w-2.5 h-2.5 md:w-3 md:h-3" /> {cvData.email}</span>
                  {cvData.socials.map((s, i) => (
                    <React.Fragment key={i}>
                      <span className="hidden md:inline text-stone-300">|</span>
                      <span className="flex items-center gap-1"><Globe className="w-2.5 h-2.5 md:w-3 md:h-3" /> {s.handle}</span>
                    </React.Fragment>
                  ))}
                </div>
                <div 
                  className="h-0.5 w-full mt-6"
                  style={{ backgroundColor: cvData.themeColor }}
                />
              </header>

              {/* Summary */}
              <section className="mb-6 md:mb-8">
                <div className="text-center mb-3 md:mb-4">
                  <h2 
                    className="text-lg md:text-xl font-bold uppercase tracking-widest inline-block pb-1"
                    style={{ color: cvData.themeColor }}
                  >
                    Summary
                  </h2>
                  <div className="h-px w-full mt-1" style={{ backgroundColor: cvData.themeColor }} />
                </div>
                <p className="text-xs md:text-sm text-stone-700 text-justify">
                  {cvData.summary}
                </p>
              </section>

              {/* Skills */}
              <section className="mb-6 md:mb-8">
                <div className="text-center mb-3 md:mb-4">
                  <h2 
                    className="text-lg md:text-xl font-bold uppercase tracking-widest inline-block pb-1"
                    style={{ color: cvData.themeColor }}
                  >
                    Skills
                  </h2>
                  <div className="h-px w-full mt-1" style={{ backgroundColor: cvData.themeColor }} />
                </div>
                <ul className="grid grid-cols-1 gap-1 text-xs md:text-sm text-stone-700">
                  {cvData.skills.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-stone-400 mt-1.5">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Experience */}
              <section className="mb-6 md:mb-8">
                <div className="text-center mb-3 md:mb-4">
                  <h2 
                    className="text-lg md:text-xl font-bold uppercase tracking-widest inline-block pb-1"
                    style={{ color: cvData.themeColor }}
                  >
                    Experience
                  </h2>
                  <div className="h-px w-full mt-1" style={{ backgroundColor: cvData.themeColor }} />
                </div>
                <div className="space-y-4 md:space-y-6">
                  {cvData.experience.map((exp, i) => (
                    <div key={i} className="space-y-1 md:space-y-2">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-stone-800 text-sm md:text-base">{exp.title} | {exp.company}</h3>
                      </div>
                      <div className="flex justify-between items-baseline text-[10px] md:text-xs text-stone-500 italic">
                        <span>{exp.location}</span>
                        <span>{exp.date}</span>
                      </div>
                      <ul className="space-y-1 text-xs md:text-sm text-stone-700">
                        {exp.bullets.filter(b => b.trim()).map((b, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="text-stone-400 mt-1.5">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section className="mb-6 md:mb-8">
                <div className="text-center mb-3 md:mb-4">
                  <h2 
                    className="text-lg md:text-xl font-bold uppercase tracking-widest inline-block pb-1"
                    style={{ color: cvData.themeColor }}
                  >
                    Education
                  </h2>
                  <div className="h-px w-full mt-1" style={{ backgroundColor: cvData.themeColor }} />
                </div>
                <div className="space-y-3 md:space-y-4">
                  {cvData.education.map((edu, i) => (
                    <div key={i} className="space-y-1">
                      <h3 className="font-bold text-stone-800 text-xs md:text-sm">{edu.degree}</h3>
                      <div className="flex justify-between items-baseline text-[10px] md:text-xs text-stone-600">
                        <span className="font-medium">{edu.school}, {edu.location}</span>
                        <span className="italic">{edu.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Optional: Hobbies & References */}
              {(cvData.hobbies?.length || cvData.references?.length) ? (
                <div className="grid grid-cols-2 gap-8">
                  {cvData.hobbies && cvData.hobbies.length > 0 && (
                    <section>
                      <div className="text-center mb-4">
                        <h2 
                          className="text-lg font-bold uppercase tracking-widest inline-block pb-1"
                          style={{ color: cvData.themeColor }}
                        >
                          Hobbies
                        </h2>
                        <div className="h-px w-full mt-1" style={{ backgroundColor: cvData.themeColor }} />
                      </div>
                      <p className="text-sm text-stone-700">
                        {cvData.hobbies.join(', ')}
                      </p>
                    </section>
                  )}
                  {cvData.references && cvData.references.length > 0 && (
                    <section>
                      <div className="text-center mb-4">
                        <h2 
                          className="text-lg font-bold uppercase tracking-widest inline-block pb-1"
                          style={{ color: cvData.themeColor }}
                        >
                          References
                        </h2>
                        <div className="h-px w-full mt-1" style={{ backgroundColor: cvData.themeColor }} />
                      </div>
                      <div className="space-y-2">
                        {cvData.references.map((ref, i) => (
                          <div key={i} className="text-xs text-stone-700">
                            <p className="font-bold">{ref.name}</p>
                            <p className="text-stone-500">{ref.relationship} • {ref.contact}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )}
  </main>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
            padding: 0;
            margin: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          #cv-preview {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            min-height: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          @page {
            margin: 1cm;
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
