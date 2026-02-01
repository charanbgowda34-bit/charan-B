
import React from 'react';
import { ResumeData } from '../types';
// Added Trophy to the imports to resolve the missing component error
import { Mail, Phone, MapPin, Linkedin, Globe, Trophy } from 'lucide-react';

interface PreviewProps {
  data: ResumeData;
}

const Preview: React.FC<PreviewProps> = ({ data }) => {
  const { personalInfo, experiences, education, skills, projects, awards, certifications, templateId } = data;

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
            <p className="text-sm text-center leading-loose max-w-2xl mx-auto font-light">{personalInfo.summary}</p>
          </section>
        )}

        <div className="space-y-12">
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 border-b border-slate-100 pb-3 mb-8">Professional Experience</h2>
            <div className="space-y-10">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider">{exp.position}</h3>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-xs text-rose-600 font-bold uppercase tracking-widest mb-4">{exp.company} / {exp.location}</div>
                  <div className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap pl-6 border-l border-slate-100">{exp.description}</div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-12">
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 border-b border-slate-100 pb-3 mb-6">Education</h2>
                {education.map(edu => (
                  <div key={edu.id} className="mb-6">
                    <div className="font-bold text-xs uppercase tracking-wider">{edu.degree}</div>
                    <div className="text-[11px] text-slate-500 italic mb-1">{edu.field}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">{edu.school}</div>
                  </div>
                ))}
              </section>
              {certifications.length > 0 && (
                <section>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 border-b border-slate-100 pb-3 mb-6">Certifications</h2>
                  {certifications.map(cert => (
                    <div key={cert.id} className="mb-4">
                      <div className="font-bold text-xs uppercase tracking-tight">{cert.name}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest">{cert.issuer} ({cert.date})</div>
                    </div>
                  ))}
                </section>
              )}
            </div>

            <div className="space-y-12">
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 border-b border-slate-100 pb-3 mb-6">Expertise</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-3">
                  {skills.map(skill => (
                    <span key={skill.id} className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{skill.name}</span>
                  ))}
                </div>
              </section>
              {awards.length > 0 && (
                <section>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 border-b border-slate-100 pb-3 mb-6">Awards</h2>
                  {awards.map(award => (
                    <div key={award.id} className="mb-4">
                      <div className="font-bold text-xs uppercase tracking-tight">{award.title}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest">{award.issuer} • {award.date}</div>
                    </div>
                  ))}
                </section>
              )}
            </div>
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
          <div className="flex justify-center gap-4 text-[10px] font-bold mt-2 uppercase tracking-widest text-slate-500">
            {personalInfo.website && <span>{personalInfo.website}</span>}
            {personalInfo.linkedin && <span>|</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
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
                    <span className="text-sm">{exp.company}, {exp.location}</span>
                    <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="italic text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">{exp.position}</div>
                  <div className="text-xs leading-relaxed whitespace-pre-wrap list-disc pl-2">{exp.description}</div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <section>
                <h2 className="text-sm font-black border-b-2 border-slate-900 mb-4 uppercase tracking-widest">Education</h2>
                {education.map(edu => (
                  <div key={edu.id} className="mb-3">
                    <div className="flex justify-between text-xs font-bold">
                      <span>{edu.school}</span>
                      <span>{edu.graduationDate}</span>
                    </div>
                    <div className="text-[11px] italic text-slate-700">{edu.degree} in {edu.field}</div>
                  </div>
                ))}
             </section>
             <section>
                <h2 className="text-sm font-black border-b-2 border-slate-900 mb-4 uppercase tracking-widest">Skills & Expertise</h2>
                <div className="text-xs leading-relaxed">
                  {skills.map((s, i) => (
                    <span key={s.id}>{s.name}{i < skills.length - 1 ? ', ' : ''}</span>
                  ))}
                </div>
             </section>
          </div>

          {(awards.length > 0 || certifications.length > 0) && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {awards.length > 0 && (
                  <section>
                    <h2 className="text-sm font-black border-b-2 border-slate-900 mb-4 uppercase tracking-widest">Honors & Awards</h2>
                    {awards.map(award => (
                      <div key={award.id} className="mb-2 text-xs">
                        <span className="font-bold">{award.title}</span> – {award.issuer} ({award.date})
                      </div>
                    ))}
                  </section>
                )}
                {certifications.length > 0 && (
                  <section>
                    <h2 className="text-sm font-black border-b-2 border-slate-900 mb-4 uppercase tracking-widest">Certifications</h2>
                    {certifications.map(cert => (
                      <div key={cert.id} className="mb-2 text-xs">
                        <span className="font-bold">{cert.name}</span> – {cert.issuer} ({cert.date})
                      </div>
                    ))}
                  </section>
                )}
             </div>
          )}
        </div>
      </div>
    );
  }

  // Modern Template
  return (
    <div className="flex min-h-[1100px] bg-slate-50">
      {/* Sidebar - Dark Gradient */}
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
            <h2 className="text-[10px] font-black uppercase text-rose-500 mb-5 tracking-[0.2em]">Contact Information</h2>
            <ul className="space-y-4 text-xs text-slate-300 font-medium">
              {personalInfo.email && <li className="flex items-center gap-3"><Mail size={14} className="text-rose-500"/> {personalInfo.email}</li>}
              {personalInfo.phone && <li className="flex items-center gap-3"><Phone size={14} className="text-rose-500"/> {personalInfo.phone}</li>}
              {personalInfo.location && <li className="flex items-center gap-3"><MapPin size={14} className="text-rose-500"/> {personalInfo.location}</li>}
              {personalInfo.linkedin && <li className="flex items-center gap-3"><Linkedin size={14} className="text-rose-500"/> /in/{personalInfo.linkedin.split('/').pop()}</li>}
            </ul>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase text-rose-500 mb-5 tracking-[0.2em]">Key Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill.id} className="text-[10px] font-bold bg-white/5 px-3 py-1.5 rounded-sm border border-white/10 uppercase tracking-widest">{skill.name}</span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase text-rose-500 mb-5 tracking-[0.2em]">Academic History</h2>
            <div className="space-y-6">
              {education.map(edu => (
                <div key={edu.id}>
                  <p className="text-xs font-bold leading-tight">{edu.degree}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{edu.school}</p>
                  <p className="text-[10px] text-rose-400 font-black mt-1 uppercase tracking-widest">{edu.graduationDate}</p>
                </div>
              ))}
            </div>
          </section>

          {certifications.length > 0 && (
            <section>
              <h2 className="text-[10px] font-black uppercase text-rose-500 mb-5 tracking-[0.2em]">Certifications</h2>
              <div className="space-y-4">
                {certifications.map(cert => (
                  <div key={cert.id}>
                    <p className="text-[11px] font-bold">{cert.name}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{cert.issuer} • {cert.date}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Main Content - Minimalist White */}
      <div className="flex-1 p-14 bg-white shadow-inner">
        <section className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-slate-200 flex-1"></div>
            <h2 className="text-[10px] font-black uppercase text-slate-900 tracking-[0.3em]">Professional Profile</h2>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          <p className="text-sm text-slate-600 leading-[1.8] font-medium italic text-center">{personalInfo.summary}</p>
        </section>

        <section className="mb-14">
           <h2 className="text-[11px] font-black uppercase text-slate-900 border-l-4 border-rose-500 pl-4 mb-10 tracking-[0.2em]">Experience Timeline</h2>
           <div className="space-y-12">
            {experiences.map(exp => (
              <div key={exp.id} className="relative group">
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-none">{exp.position}</h3>
                  <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-3 py-1.5 rounded uppercase tracking-widest">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span>{exp.company}</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <span>{exp.location}</span>
                </div>
                <div className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{exp.description}</div>
              </div>
            ))}
          </div>
        </section>

        {awards.length > 0 && (
          <section>
             <h2 className="text-[11px] font-black uppercase text-slate-900 border-l-4 border-rose-500 pl-4 mb-8 tracking-[0.2em]">Honors & Recognition</h2>
             <div className="grid grid-cols-1 gap-6">
               {awards.map(award => (
                 <div key={award.id} className="flex gap-4 items-start p-4 bg-slate-50 rounded border-l-2 border-slate-200">
                    <div className="text-rose-500 mt-1"><Trophy size={16}/></div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{award.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{award.issuer} • {award.date}</p>
                    </div>
                 </div>
               ))}
             </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Preview;
