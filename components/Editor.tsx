
import React, { useState } from 'react';
import { ResumeData, Skill, Award, Certification, CustomSection, Experience, Project, Education } from '../types';
import { 
  User, Briefcase, GraduationCap, Code, Plus, Trash2, Sparkles, Globe, Mail, Phone, MapPin, 
  Linkedin, Trophy, Award as AwardIcon, X, FilePlus, Wand2, Upload, BriefcaseBusiness, 
  School, Target, Lightbulb, ChevronDown, ChevronUp
} from 'lucide-react';
import { 
  optimizeSummary, generateBulletPoints, generateCustomSectionContent, 
  tailorResume, getFresherPreset, suggestCustomSections 
} from '../services/geminiService';

interface EditorProps {
  data: ResumeData;
  onUpdate: (newData: Partial<ResumeData>) => void;
}

const Editor: React.FC<EditorProps> = ({ data, onUpdate }) => {
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const [showTailor, setShowTailor] = useState(false);
  const [oldResumeText, setOldResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [suggestedSections, setSuggestedSections] = useState<string[]>([]);

  const updatePersonalInfo = (field: string, value: string) => {
    onUpdate({ personalInfo: { ...data.personalInfo, [field]: value } });
  };

  const handleTailor = async () => {
    if (!oldResumeText || !jobDescription) return;
    setLoadingAI('tailor');
    const tailored = await tailorResume(oldResumeText, jobDescription);
    onUpdate({
      ...data,
      personalInfo: { ...data.personalInfo, summary: tailored.personalInfo?.summary || data.personalInfo.summary },
      experiences: (tailored.experiences as Experience[])?.map(e => ({ ...e, id: Math.random().toString() })) || data.experiences,
      skills: (tailored.skills as Skill[])?.map(s => ({ ...s, id: Math.random().toString(), level: 'Expert' })) || data.skills,
      education: (tailored.education as Education[])?.map(e => ({ ...e, id: Math.random().toString() })) || data.education
    });
    setLoadingAI(null);
    setShowTailor(false);
  };

  const handleFresherPreset = async (domain: string) => {
    setLoadingAI('fresher');
    try {
      const preset = await getFresherPreset(domain);
      onUpdate({
        ...data,
        personalInfo: { ...data.personalInfo, summary: preset.personalInfo?.summary || '' },
        experiences: (preset.experiences as Experience[])?.map(e => ({ ...e, id: Math.random().toString() })) || [],
        skills: (preset.skills as Skill[])?.map(s => ({ ...s, id: Math.random().toString(), level: 'Expert' })) || [],
        customSections: (preset.customSections as CustomSection[])?.map(s => ({ ...s, id: Math.random().toString() })) || [],
        education: (preset.education as Education[])?.map(e => ({ ...e, id: Math.random().toString() })) || []
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(null);
    }
  };

  const handleSuggestSections = async () => {
    setLoadingAI('suggest');
    const context = `${data.personalInfo.summary} ${data.experiences.map(e => e.position).join(', ')}`;
    const suggestions = await suggestCustomSections(context);
    setSuggestedSections(suggestions);
    setLoadingAI(null);
  };

  const handleAIAction = async (type: 'summary' | 'experience' | 'custom', id?: string) => {
    setLoadingAI(id || type);
    try {
      if (type === 'summary') {
        const result = await optimizeSummary(data.personalInfo.summary);
        updatePersonalInfo('summary', result || '');
      } else if (type === 'experience' && id) {
        const exp = data.experiences.find(e => e.id === id);
        if (exp) {
          const result = await generateBulletPoints(exp.position, exp.company, exp.description);
          const newExps = data.experiences.map(e => e.id === id ? { ...e, description: result || '' } : e);
          onUpdate({ experiences: newExps });
        }
      } else if (type === 'custom' && id) {
        const section = data.customSections.find(s => s.id === id);
        if (section) {
          const context = `${data.personalInfo.fullName} ${data.personalInfo.summary}`;
          const result = await generateCustomSectionContent(section.title, context);
          const updated = data.customSections.map(s => s.id === id ? { ...s, content: result || '' } : s);
          onUpdate({ customSections: updated });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(null);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* AI Intelligence Center */}
      <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group border border-slate-800">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Sparkles className="w-64 h-64 text-rose-500 animate-pulse" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-rose-500 p-2 rounded-xl">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">AI Intelligence Center</h2>
          </div>
          <p className="text-slate-400 text-sm mb-8 max-w-lg">Supercharge your resume with context-aware AI tools designed for Big Tech standards.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ATS Tailor Card */}
            <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl hover:bg-slate-800 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold">ATS Tailoring Engine</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">Map your old resume directly to a job description for a perfect match.</p>
              <button 
                onClick={() => setShowTailor(!showTailor)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                {showTailor ? 'Close Tailor' : 'Optimize for a Job'}
              </button>
            </div>

            {/* Fresher Preset Card */}
            <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl hover:bg-slate-800 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <School className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold">Fresher Launchpad</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">Starting fresh? Load industry-specific templates designed for Big Tech.</p>
              <select 
                onChange={(e) => handleFresherPreset(e.target.value)}
                disabled={loadingAI === 'fresher'}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 rounded-xl text-xs font-black uppercase tracking-widest outline-none border-none appearance-none text-center cursor-pointer"
              >
                <option value="" disabled selected>🚀 Select Career Path</option>
                <option value="Software Engineer @ Google/Meta">Software Engineer</option>
                <option value="Product Manager @ Amazon">Product Manager</option>
                <option value="Data Scientist @ Netflix">Data Scientist</option>
                <option value="Consultant @ McKinsey/BCG">Consultant</option>
                <option value="Investment Banker @ Goldman Sachs">Investment Banker</option>
              </select>
            </div>
          </div>

          {showTailor && (
            <div className="mt-8 pt-8 border-t border-slate-800 animate-in fade-in zoom-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Old Resume Content</label>
                  <textarea 
                    className="w-full h-48 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Paste your existing resume here..."
                    value={oldResumeText}
                    onChange={e => setOldResumeText(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Target Job Description</label>
                  <textarea 
                    className="w-full h-48 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Paste the job requirements here..."
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                  />
                </div>
              </div>
              <button 
                onClick={handleTailor}
                disabled={loadingAI === 'tailor' || !oldResumeText || !jobDescription}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl font-black text-lg shadow-xl shadow-indigo-900/40 disabled:opacity-50 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {loadingAI === 'tailor' ? <><Wand2 className="animate-spin" /> Tailoring Experience...</> : <><Sparkles /> Generate ATS-Optimized Profile</>}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Form Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal & Skills */}
        <div className="lg:col-span-1 space-y-8">
          {/* Basics */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-rose-500" /> Identity
            </h3>
            <div className="space-y-4">
              <Input label="Full Name" value={data.personalInfo.fullName} onChange={v => updatePersonalInfo('fullName', v)} placeholder="Jane Doe" />
              <Input label="Email" value={data.personalInfo.email} onChange={v => updatePersonalInfo('email', v)} placeholder="jane@toptech.com" />
              <Input label="Location" value={data.personalInfo.location} onChange={v => updatePersonalInfo('location', v)} placeholder="San Francisco, CA" />
              <Input label="LinkedIn" value={data.personalInfo.linkedin} onChange={v => updatePersonalInfo('linkedin', v)} placeholder="linkedin.com/in/jane" />
            </div>
          </section>

          {/* Skills */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Code className="w-5 h-5 text-rose-500" /> Superpowers
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {data.skills.map(skill => (
                <div key={skill.id} className="flex items-center gap-2 bg-slate-50 border border-slate-100 pl-3 pr-2 py-1.5 rounded-full text-xs font-semibold text-slate-700 group hover:border-rose-200 transition-colors">
                  {skill.name}
                  <button onClick={() => onUpdate({ skills: data.skills.filter(s => s.id !== skill.id) })} className="text-slate-300 hover:text-rose-500 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <input 
              type="text" 
              placeholder="Type & hit enter..." 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-rose-500/10 outline-none transition-all"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const name = (e.target as HTMLInputElement).value;
                  if (name) {
                    onUpdate({ skills: [...data.skills, { id: Math.random().toString(), name, level: 'Expert' }] });
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
          </section>
        </div>

        {/* Right Column: Experience, Summary & Customs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Summary */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" /> Summary
              </h3>
              <button 
                disabled={loadingAI === 'summary' || !data.personalInfo.summary}
                onClick={() => handleAIAction('summary')}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-2 rounded-xl hover:bg-rose-100 transition-all active:scale-95"
              >
                <Sparkles className={`w-3.5 h-3.5 ${loadingAI === 'summary' ? 'animate-spin' : ''}`} />
                AI Refine
              </button>
            </div>
            <textarea 
              className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 leading-relaxed outline-none focus:ring-2 focus:ring-rose-500/10"
              placeholder="Introduce yourself professionally..."
              value={data.personalInfo.summary}
              onChange={e => updatePersonalInfo('summary', e.target.value)}
            />
          </section>

          {/* Experience */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BriefcaseBusiness className="w-5 h-5 text-rose-500" /> Experience
              </h3>
              <button 
                onClick={() => onUpdate({ experiences: [{ id: Math.random().toString(), company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }, ...data.experiences] })}
                className="flex items-center gap-2 text-xs font-bold bg-slate-900 text-white px-4 py-2.5 rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
              >
                <Plus className="w-4 h-4" /> Add Experience
              </button>
            </div>
            <div className="space-y-6">
              {data.experiences.map((exp, idx) => (
                <div key={exp.id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl relative group">
                  <button 
                    onClick={() => onUpdate({ experiences: data.experiences.filter(e => e.id !== exp.id) })}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input label="Company" value={exp.company} onChange={v => {
                      const updated = [...data.experiences]; updated[idx].company = v; onUpdate({ experiences: updated });
                    }} />
                    <Input label="Position" value={exp.position} onChange={v => {
                      const updated = [...data.experiences]; updated[idx].position = v; onUpdate({ experiences: updated });
                    }} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Achievements (STAR Method)</label>
                      <button 
                        onClick={() => handleAIAction('experience', exp.id)}
                        disabled={loadingAI === exp.id || !exp.description}
                        className="text-[10px] font-black text-rose-600 bg-white border border-rose-100 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Sparkles className={`w-3 h-3 ${loadingAI === exp.id ? 'animate-spin' : ''}`} /> Transform with AI
                      </button>
                    </div>
                    <textarea 
                      className="w-full h-32 p-4 bg-white border border-slate-100 rounded-xl text-sm leading-relaxed outline-none focus:ring-2 focus:ring-rose-500/10"
                      placeholder="Describe your impact..."
                      value={exp.description}
                      onChange={e => {
                        const updated = [...data.experiences]; updated[idx].description = e.target.value; onUpdate({ experiences: updated });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dynamic Custom Sections */}
          {data.customSections.map((section, idx) => (
            <section key={section.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 animate-in slide-in-from-bottom duration-500">
              <div className="flex items-center justify-between mb-6">
                <input 
                  className="text-lg font-bold bg-transparent border-b-2 border-transparent hover:border-slate-200 focus:border-rose-500 outline-none flex-1 mr-4 transition-all"
                  value={section.title}
                  onChange={e => {
                    const updated = [...data.customSections]; updated[idx].title = e.target.value; onUpdate({ customSections: updated });
                  }}
                />
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleAIAction('custom', section.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-2 rounded-xl"
                  >
                    <Wand2 className={`w-4 h-4 ${loadingAI === section.id ? 'animate-spin' : ''}`} /> Magic Fill
                  </button>
                  <button onClick={() => onUpdate({ customSections: data.customSections.filter(s => s.id !== section.id) })} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <textarea 
                className="w-full h-40 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm leading-relaxed outline-none focus:ring-2 focus:ring-rose-500/10"
                placeholder={`Content for ${section.title}...`}
                value={section.content}
                onChange={e => {
                  const updated = [...data.customSections]; updated[idx].content = e.target.value; onUpdate({ customSections: updated });
                }}
              />
            </section>
          ))}

          {/* AI Suggested Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">More Options</span>
              <button 
                onClick={handleSuggestSections}
                className="text-xs font-bold text-rose-500 flex items-center gap-1 hover:underline"
              >
                <Sparkles className="w-3 h-3" /> Get Section Suggestions
              </button>
            </div>
            
            {suggestedSections.length > 0 && (
              <div className="flex flex-wrap gap-2 animate-in fade-in duration-500">
                {suggestedSections.map((title, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      onUpdate({ customSections: [...data.customSections, { id: Math.random().toString(), title, content: '' }] });
                      setSuggestedSections(prev => prev.filter(t => t !== title));
                    }}
                    className="bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> {title}
                  </button>
                ))}
              </div>
            )}

            <button 
              onClick={() => onUpdate({ customSections: [...data.customSections, { id: Math.random().toString(), title: 'New Custom Section', content: '' }] })}
              className="w-full py-6 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center gap-2 text-slate-400 hover:border-rose-500 hover:text-rose-500 transition-all font-black text-sm hover:bg-rose-50/50"
            >
              <FilePlus className="w-5 h-5" /> Add Personalized Section
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
    <input 
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-200 transition-all"
      value={value} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder} 
    />
  </div>
);

export default Editor;
