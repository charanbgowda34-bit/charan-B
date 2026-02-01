
import React from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, MapPin, Linkedin, Globe, Trophy } from 'lucide-react';

interface PreviewProps {
  data: ResumeData;
}

const Preview: React.FC<PreviewProps> = ({ data }) => {
  const { personalInfo, experiences, education, skills, projects, awards, certifications, customSections, templateId } = data;

  if (templateId === 'minimalist') {
    return (
      <div className="p-16 text-slate-800 leading-relaxed max-w-full">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extralight tracking-[0.3em] uppercase mb-4 text-slate-900">{personalInfo.fullName || 'FULL NAME'}</h1>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[11px] text-slate-400 uppercase tracking-widest font-medium">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </header>

        {personalInfo.summary && (
          <section className="mb-12">
            <p className="text-sm text-center leading-loose max-w-2xl mx-auto font-light italic">{personalInfo.summary}</p>
          </section>
        )}

        <div className="space-y-12">
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 border-b border-slate-100 pb-3 mb-8">Professional History</h2>
            <div className="space-y-10">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider">{exp.position}</h3>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-xs text-rose-600 font-bold uppercase tracking-widest mb-4">{exp.company}</div>
                  <div className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap pl-6 border-l border-slate-100">{exp.description}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Dynamic Custom Sections */}
          {customSections.map(section => (
            <section key={section.id}>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 border-b border-slate-100 pb-3 mb-6">{section.title}</h2>
              <div className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">{section.content}</div>
            </section>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 border-b border-slate-100 pb-3 mb-6">Education</h2>
              {education.map(edu => (
                <div key={edu.id} className="mb-6 text-xs">
                  <div className="font-bold uppercase tracking-wider">{edu.degree}</div>
                  <div className="text-slate-400 uppercase tracking-widest text-[10px]">{edu.school}</div>
                </div>
              ))}
            </section>
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 border-b border-slate-100 pb-3 mb-6">Skills</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {skills.map(skill => (
                  <span key={skill.id} className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{skill.name}</span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  if (templateId === 'classic') {
    return (
      <div className="p-12 font-serif text-slate-900">
        <div className="border-b-4 border-slate-900 pb-6 mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 uppercase tracking-tight">{personalInfo.fullName || 'YOUR NAME'}</h1>
          <div className="flex justify-center gap-4 text-xs font-semibold italic text-slate-700">
             <span>{personalInfo.email}</span>
             {personalInfo.phone && <span>|</span>}
             <span>{personalInfo.phone}</span>
             {personalInfo.location && <span>|</span>}
             <span>{personalInfo.location}</span>
          </div>
        </div>

        <div className="space-y-8">
          <section>
             <h2 className="text-sm font-black border-b-2 border-slate-900 mb-3 uppercase tracking-widest">Professional Summary</h2>
             <p className="text-xs leading-relaxed text-justify">{personalInfo.summary}</p>
          </section>

          <section>
            <h2 className="text-sm font-black border-b-2 border-slate-900 mb-4 uppercase tracking-widest">Experience</h2>
            <div className="space-y-6">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between font-bold text-xs mb-1">
                    <span className="text-sm">{exp.company}</span>
                    <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="italic text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">{exp.position}</div>
                  <div className="text-xs leading-relaxed whitespace-pre-wrap pl-4 border-l border-slate-200">{exp.description}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Dynamic Custom Sections */}
          {customSections.map(section => (
            <section key={section.id}>
              <h2 className="text-sm font-black border-b-2 border-slate-900 mb-3 uppercase tracking-widest">{section.title}</h2>
              <div className="text-xs leading-relaxed whitespace-pre-wrap">{section.content}</div>
            </section>
          ))}

          <div className="grid grid-cols-2 gap-8">
             <section>
                <h2 className="text-sm font-black border-b-2 border-slate-900 mb-4 uppercase tracking-widest">Education</h2>
                {education.map(edu => (
                  <div key={edu.id} className="mb-2 text-xs">
                    <span className="font-bold">{edu.school}</span>, {edu.degree}
                  </div>
                ))}
             </section>
             <section>
                <h2 className="text-sm font-black border-b-2 border-slate-900 mb-4 uppercase tracking-widest">Skills</h2>
                <div className="text-xs leading-relaxed">
                  {skills.map((s, i) => (
                    <span key={s.id}>{s.name}{i < skills.length - 1 ? ', ' : ''}</span>
                  ))}
                </div>
             </section>
          </div>
        </div>
      </div>
    );
  }

  // Modern Default
  return (
    <div className="flex min-h-[1100px] bg-slate-50">
      <div className="w-[32%] bg-gradient-to-b from-slate-900 to-slate-800 text-white p-10 flex flex-col">
        <div className="mb-12">
          <h1 className="text-3xl font-black leading-none mb-3 tracking-tighter text-rose-500 uppercase">{personalInfo.fullName.split(' ')[0] || 'FIRST'}<br/><span className="text-white opacity-90">{personalInfo.fullName.split(' ').slice(1).join(' ') || 'LAST'}</span></h1>
          <div className="h-1 w-12 bg-rose-500 mb-6"></div>
          <p className="text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase">
            {experiences[0]?.position || 'Professional'}
          </p>
        </div>

        <div className="space-y-10 flex-1">
          <section>
            <h2 className="text-[10px] font-black uppercase text-rose-500 mb-5 tracking-[0.2em]">Contact</h2>
            <ul className="space-y-4 text-xs text-slate-300 font-medium">
              {personalInfo.email && <li className="flex items-center gap-3"><Mail size={14} className="text-rose-500"/> {personalInfo.email}</li>}
              {personalInfo.phone && <li className="flex items-center gap-3"><Phone size={14} className="text-rose-500"/> {personalInfo.phone}</li>}
              {personalInfo.location && <li className="flex items-center gap-3"><MapPin size={14} className="text-rose-500"/> {personalInfo.location}</li>}
            </ul>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase text-rose-500 mb-5 tracking-[0.2em]">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill.id} className="text-[10px] font-bold bg-white/5 px-3 py-1.5 rounded-sm border border-white/10 uppercase tracking-widest">{skill.name}</span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase text-rose-500 mb-5 tracking-[0.2em]">Education</h2>
            <div className="space-y-6">
              {education.map(edu => (
                <div key={edu.id}>
                  <p className="text-xs font-bold leading-tight">{edu.degree}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{edu.school}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="flex-1 p-14 bg-white shadow-inner">
        <section className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-slate-200 flex-1"></div>
            <h2 className="text-[10px] font-black uppercase text-slate-900 tracking-[0.3em]">Profile</h2>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          <p className="text-sm text-slate-600 leading-[1.8] font-medium italic text-center">{personalInfo.summary}</p>
        </section>

        <section className="mb-14">
           <h2 className="text-[11px] font-black uppercase text-slate-900 border-l-4 border-rose-500 pl-4 mb-10 tracking-[0.2em]">Experience</h2>
           <div className="space-y-12">
            {experiences.map(exp => (
              <div key={exp.id} className="relative group">
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-none">{exp.position}</h3>
                  <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-3 py-1.5 rounded uppercase tracking-widest">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{exp.company}</div>
                <div className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{exp.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic Custom Sections */}
        <div className="space-y-14">
          {customSections.map(section => (
            <section key={section.id}>
               <h2 className="text-[11px] font-black uppercase text-slate-900 border-l-4 border-rose-500 pl-4 mb-8 tracking-[0.2em]">{section.title}</h2>
               <div className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{section.content}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preview;
