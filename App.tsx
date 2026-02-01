
import React, { useState, useEffect } from 'react';
import { ResumeData, TemplateId } from './types';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { 
  Heart, Settings, Download, Sparkles, Layout, CheckCircle, Menu, X, Zap, Rocket
} from 'lucide-react';

const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    summary: '',
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  awards: [],
  certifications: [],
  customSections: [],
  templateId: 'modern',
};

const App: React.FC = () => {
  const [data, setData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('careerpal_data_v3');
    return saved ? JSON.parse(saved) : initialData;
  });
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('careerpal_data_v3', JSON.stringify(data));
  }, [data]);

  const handleUpdateData = (newData: Partial<ResumeData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-full md:w-64' : 'w-0 overflow-hidden'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 no-print`}>
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-500">
            <div className="bg-rose-500 p-1.5 rounded-lg shadow-sm">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">CareerPal</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden"><X /></button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => setActiveTab('edit')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'edit' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Settings className="w-5 h-5" /> Editor
          </button>
          <button onClick={() => setActiveTab('preview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'preview' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Layout className="w-5 h-5" /> Templates
          </button>
          
          <div className="pt-8 px-4">
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Rocket className="w-16 h-16 text-rose-500 rotate-45" />
              </div>
              <div className="flex items-center gap-2 text-rose-400 mb-2 relative z-10">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Student Special</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4 relative z-10 font-medium">
                New to the job market? Try the <span className="text-rose-400">Fresher Launchpad</span> to build a top-tier resume in seconds.
              </p>
              <button onClick={() => setActiveTab('edit')} className="w-full py-2 bg-rose-500 text-white text-xs font-bold rounded-lg hover:bg-rose-600 transition-all shadow-lg relative z-10">
                Open Launchpad
              </button>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t">
          <button onClick={handlePrint} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-semibold">
            <Download className="w-5 h-5" /> Export PDF
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b no-print">
          <button onClick={() => setIsSidebarOpen(true)}><Menu /></button>
          <span className="font-bold text-slate-800 text-lg">CareerPal</span>
          <div className="w-6" />
        </header>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'edit' ? (
            <div className="max-w-4xl mx-auto p-4 md:p-8 no-print">
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Career Journey</h1>
                <p className="text-slate-500 mt-1">Let's make sure you stand out from the crowd.</p>
              </div>
              <Editor data={data} onUpdate={handleUpdateData} />
            </div>
          ) : (
            <div className="flex-1 min-h-full p-4 md:p-12 flex flex-col items-center bg-slate-100">
              <div className="max-w-4xl w-full mb-8 flex flex-col md:flex-row gap-4 items-center justify-between no-print">
                 <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                    {(['modern', 'classic', 'minimalist'] as TemplateId[]).map(t => (
                      <button key={t} onClick={() => handleUpdateData({ templateId: t })} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${data.templateId === t ? 'bg-rose-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                 </div>
                 <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-black transition-all font-bold">
                   <Zap className="w-4 h-4 text-amber-400 fill-current" /> Perfect Print
                 </button>
              </div>
              <div className="w-full max-w-[850px] shadow-2xl bg-white rounded-sm overflow-hidden border border-slate-200">
                <Preview data={data} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
