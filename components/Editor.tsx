
import React, { useState } from 'react';
import { ResumeData, Skill, Award, Certification } from '../types';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Plus, 
  Trash2, 
  Sparkles,
  Globe,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Trophy,
  Award as AwardIcon,
  X
} from 'lucide-react';
import { optimizeSummary, generateBulletPoints, suggestSkills } from '../services/geminiService';

interface EditorProps {
  data: ResumeData;
  onUpdate: (newData: Partial<ResumeData>) => void;
}

const Editor: React.FC<EditorProps> = ({ data, onUpdate }) => {
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  const updatePersonalInfo = (field: string, value: string) => {
    onUpdate({ personalInfo: { ...data.personalInfo, [field]: value } });
  };

  const handleAIAction = async (type: 'summary' | 'experience' | 'skills', id?: string) => {
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
      } else if (type === 'skills') {
        const expDescs = data.experiences.map(e => e.description);
        const projDescs = data.projects.map(p => p.description);
        const suggested = await suggestSkills(expDescs, projDescs);
        const newSkills: Skill[] = suggested.map((s: string) => ({
          id: Math.random().toString(36).substr(2, 9),
          name: s,
          level: 'Expert'
        }));
        onUpdate({ skills: [...data.skills, ...newSkills].slice(0, 15) });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(null);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Personal Info */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6 text-slate-800">
          <User className="w-5 h-5 text-rose-500" />
          <h2 className="text-xl font-bold">The Basics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" value={data.personalInfo.fullName} onChange={v => updatePersonalInfo('fullName', v)} placeholder="John Doe" />
          <Input label="Email" value={data.personalInfo.email} onChange={v => updatePersonalInfo('email', v)} placeholder="john@example.com" icon={<Mail className="w-4 h-4"/>}/>
          <Input label="Phone" value={data.personalInfo.phone} onChange={v => updatePersonalInfo('phone', v)} placeholder="+1 234 567 890" icon={<Phone className="w-4 h-4"/>}/>
          <Input label="Location" value={data.personalInfo.location} onChange={v => updatePersonalInfo('location', v)} placeholder="New York, NY" icon={<MapPin className="w-4 h-4"/>}/>
          <Input label="Website / Portfolio" value={data.personalInfo.website} onChange={v => updatePersonalInfo('website', v)} placeholder="portfolio.com" icon={<Globe className="w-4 h-4"/>}/>
          <Input label="LinkedIn" value={data.personalInfo.linkedin} onChange={v => updatePersonalInfo('linkedin', v)} placeholder="linkedin.com/in/johndoe" icon={<Linkedin className="w-4 h-4"/>}/>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700">Tell me your story (Professional Summary)</label>
            <button 
              disabled={loadingAI === 'summary' || !data.personalInfo.summary}
              onClick={() => handleAIAction('summary')}
              className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50"
            >
              <Sparkles className={`w-3 h-3 ${loadingAI === 'summary' ? 'animate-spin' : ''}`} />
              {loadingAI === 'summary' ? 'Polishing...' : 'Polish with AI'}
            </button>
          </div>
          <textarea 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all min-h-[120px] text-slate-700 text-sm"
            placeholder="I'm a passionate developer who..."
            value={data.personalInfo.summary}
            onChange={e => updatePersonalInfo('summary', e.target.value)}
          />
        </div>
      </section>

      {/* Experience */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-800">
            <Briefcase className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl font-bold">Career Journey</h2>
          </div>
          <button 
            onClick={() => onUpdate({ experiences: [...data.experiences, { id: Math.random().toString(), company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }] })}
            className="flex items-center gap-1 text-xs font-bold bg-slate-100 px-3 py-2 rounded-lg hover:bg-slate-200"
          >
            <Plus className="w-4 h-4" /> Add Milestone
          </button>
        </div>
        <div className="space-y-6">
          {data.experiences.map((exp, idx) => (
            <div key={exp.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Company" value={exp.company} onChange={v => {
                  const newExp = [...data.experiences];
                  newExp[idx].company = v;
                  onUpdate({ experiences: newExp });
                }} />
                <Input label="Position" value={exp.position} onChange={v => {
                  const newExp = [...data.experiences];
                  newExp[idx].position = v;
                  onUpdate({ experiences: newExp });
                }} />
                <Input label="When?" value={`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`} placeholder="Jan 2020 - Present" onChange={v => {
                  const newExp = [...data.experiences];
                  const [start, end] = v.split(' - ');
                  newExp[idx].startDate = start || '';
                  newExp[idx].endDate = end || '';
                  onUpdate({ experiences: newExp });
                }} />
                <div className="flex items-end justify-between">
                  <Input label="Where?" value={exp.location} onChange={v => {
                    const newExp = [...data.experiences];
                    newExp[idx].location = v;
                    onUpdate({ experiences: newExp });
                  }} />
                  <button 
                    onClick={() => onUpdate({ experiences: data.experiences.filter(e => e.id !== exp.id) })}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-600">What did you achieve there?</label>
                  <button 
                    disabled={loadingAI === exp.id || !exp.description}
                    onClick={() => handleAIAction('experience', exp.id)}
                    className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-white border border-rose-100 px-2 py-1 rounded-md shadow-sm hover:bg-rose-50"
                  >
                    <Sparkles className={`w-3 h-3 ${loadingAI === exp.id ? 'animate-spin' : ''}`} />
                    Make it ATS-Friendly
                  </button>
                </div>
                <textarea 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500/20 text-sm min-h-[100px]"
                  placeholder="Tell me what you did, and I'll help you format it!"
                  value={exp.description}
                  onChange={e => {
                    const newExp = [...data.experiences];
                    newExp[idx].description = e.target.value;
                    onUpdate({ experiences: newExp });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Awards Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-800">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold">Awards & Recognition</h2>
          </div>
          <button 
            onClick={() => onUpdate({ awards: [...data.awards, { id: Math.random().toString(), title: '', date: '', issuer: '', description: '' }] })}
            className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-700 px-3 py-2 rounded-lg hover:bg-amber-100"
          >
            <Plus className="w-4 h-4" /> Add Award
          </button>
        </div>
        <div className="space-y-4">
          {data.awards.map((award, idx) => (
            <div key={award.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-slate-100 rounded-xl relative">
              <Input label="Award Title" value={award.title} onChange={v => {
                const updated = [...data.awards];
                updated[idx].title = v;
                onUpdate({ awards: updated });
              }} />
              <Input label="Issuer" value={award.issuer} onChange={v => {
                const updated = [...data.awards];
                updated[idx].issuer = v;
                onUpdate({ awards: updated });
              }} />
              <div className="flex items-end justify-between">
                <Input label="Date" value={award.date} onChange={v => {
                  const updated = [...data.awards];
                  updated[idx].date = v;
                  onUpdate({ awards: updated });
                }} />
                <button 
                  onClick={() => onUpdate({ awards: data.awards.filter(a => a.id !== award.id) })}
                  className="p-2 text-slate-300 hover:text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-800">
            <AwardIcon className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-bold">Certifications</h2>
          </div>
          <button 
            onClick={() => onUpdate({ certifications: [...data.certifications, { id: Math.random().toString(), name: '', issuer: '', date: '' }] })}
            className="flex items-center gap-1 text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-100"
          >
            <Plus className="w-4 h-4" /> Add Certificate
          </button>
        </div>
        <div className="space-y-4">
          {data.certifications.map((cert, idx) => (
            <div key={cert.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-slate-100 rounded-xl relative">
              <Input label="Certificate Name" value={cert.name} onChange={v => {
                const updated = [...data.certifications];
                updated[idx].name = v;
                onUpdate({ certifications: updated });
              }} />
              <Input label="Issuer" value={cert.issuer} onChange={v => {
                const updated = [...data.certifications];
                updated[idx].issuer = v;
                onUpdate({ certifications: updated });
              }} />
              <div className="flex items-end justify-between">
                <Input label="Date" value={cert.date} onChange={v => {
                  const updated = [...data.certifications];
                  updated[idx].date = v;
                  onUpdate({ certifications: updated });
                }} />
                <button 
                  onClick={() => onUpdate({ certifications: data.certifications.filter(c => c.id !== cert.id) })}
                  className="p-2 text-slate-300 hover:text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-800">
            <Code className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl font-bold">Your Superpowers (Skills)</h2>
          </div>
          <button 
            disabled={loadingAI === 'skills'}
            onClick={() => handleAIAction('skills')}
            className="flex items-center gap-1 text-xs font-bold bg-rose-500 text-white px-3 py-2 rounded-lg hover:bg-rose-600 shadow-lg shadow-rose-100"
          >
            <Sparkles className={`w-3 h-3 ${loadingAI === 'skills' ? 'animate-spin' : ''}`} />
            Suggest Skills for me
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {data.skills.map(skill => (
            <div key={skill.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-sm text-slate-700">
              {skill.name}
              <button 
                onClick={() => onUpdate({ skills: data.skills.filter(s => s.id !== skill.id) })}
                className="text-slate-400 hover:text-rose-500"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Hit enter to add a skill..." 
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm"
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
        </div>
      </section>

      {/* Education */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-800">
            <GraduationCap className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl font-bold">Education</h2>
          </div>
          <button 
            onClick={() => onUpdate({ education: [...data.education, { id: Math.random().toString(), school: '', degree: '', field: '', graduationDate: '' }] })}
            className="flex items-center gap-1 text-xs font-bold bg-slate-100 px-3 py-2 rounded-lg hover:bg-slate-200"
          >
            <Plus className="w-4 h-4" /> Add Degree
          </button>
        </div>
        <div className="space-y-4">
          {data.education.map((edu, idx) => (
            <div key={edu.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-slate-100 rounded-xl relative">
              <Input label="Institution" value={edu.school} onChange={v => {
                const newEdu = [...data.education];
                newEdu[idx].school = v;
                onUpdate({ education: newEdu });
              }} />
              <Input label="Degree / Course" value={edu.degree} onChange={v => {
                const newEdu = [...data.education];
                newEdu[idx].degree = v;
                onUpdate({ education: newEdu });
              }} />
              <button 
                onClick={() => onUpdate({ education: data.education.filter(e => e.id !== edu.id) })}
                className="absolute top-2 right-2 p-1 text-slate-300 hover:text-rose-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder, icon }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-600 ml-1">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      )}
      <input 
        className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-sm text-slate-700`}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default Editor;
