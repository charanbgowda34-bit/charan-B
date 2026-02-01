
import React, { useState, useEffect } from 'react';
import { ResumeData, TemplateId } from './types';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { 
  Heart, 
  Settings, 
  Download, 
  Sparkles, 
  Layout, 
  CheckCircle,
  Menu,
  X,
  Zap
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
  templateId: 'modern',
};

const App: React.FC = () => {
  const [data, setData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('careerpal_data');
    return saved ? JSON.parse(saved) : initialData;
  });
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('careerpal_data', JSON.stringify(data));
  }, [data]);

  const handleUpdateData = (newData: Partial<ResumeData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className={`
        ${isSidebarOpen ? 'w-full md:w-64' : 'w-0 overflow-hidden'} 
        bg-white border-r border-slate-200 flex flex-col transition-all duration-300 no-print
      `}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-500">
            <div className="bg-rose-500 p-1.5 rounded-lg shadow-sm shadow-rose-200">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">CareerPal</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('edit')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'edit' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Settings className="w-5 h-5" />
            Edit My CV
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'preview' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Layout className="w-5 h-5" />
            View Templates
          </button>
          
          <div className="pt-8 px-4">
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 text-rose-400 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Friend's Advice</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Let me help you polish those bullets to impress the robots!
              </p>
              <button 
                onClick={() => setActiveTab('edit')}
                className="w-full py-2 bg-rose-500 text-white text-xs font-bold rounded-lg hover:bg-rose-600 transition-colors shadow-lg shadow-rose-900/20"
              >
                Let's Polish!
              </button>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-semibold shadow-lg shadow-indigo-100"
          >
            <Download className="w-5 h-5" />
            Save as PDF
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b no-print">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          <span className="font-bold text-slate-800">CareerPal</span>
          <div className="w-6" />
        </header>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'edit' ? (
            <div className="max-w-4xl mx-auto p-4 md:p-8 no-print">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tell me about yourself</h1>
                  <p className="text-slate-500 mt-1">Don't worry, I'll handle the formatting. Just fill in the blanks!</p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100">
                  <CheckCircle className="w-4 h-4" />
                  Your progress is safe
                </div>
              </div>
              <Editor data={data} onUpdate={handleUpdateData} />
            </div>
          ) : (
            <div className="flex-1 min-h-full p-4 md:p-12 flex flex-col items-center bg-slate-100">
              <div className="max-w-4xl w-full mb-8 flex flex-col md:flex-row gap-4 items-center justify-between no-print">
                 <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                    {(['modern', 'classic', 'minimalist'] as TemplateId[]).map(t => (
                      <button
                        key={t}
                        onClick={() => handleUpdateData({ templateId: t })}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${data.templateId === t ? 'bg-rose-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                 </div>
                 <div className="flex items-center gap-3">
                   <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-black transition-all font-bold"
                   >
                     <Zap className="w-4 h-4 text-amber-400 fill-current" />
                     Perfect Print
                   </button>
                 </div>
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
