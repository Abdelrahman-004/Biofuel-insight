import * as React from 'react';
import { UnifiedProject, ProjectType } from './types';

interface UnifiedHistorySidebarProps {
  projects: UnifiedProject[];
  onSelect: (project: UnifiedProject) => void;
  onEdit: (project: UnifiedProject) => void;
  onDelete: (id: string) => void;
  onExport: (project: UnifiedProject) => void;
  isOpen: boolean;
  onToggle: () => void;
  language: string;
}

const TYPE_CONFIG: Record<ProjectType, { icon: string; color: string; label: string, labelAr: string }> = {
  FEASIBILITY: { icon: 'fa-chart-pie', color: 'text-[var(--accent-emerald)] dark:text-emerald-400', label: 'Feasibility', labelAr: 'الجدوى' },
  CHALLENGE: { icon: 'fa-lightbulb', color: 'text-blue-700 dark:text-blue-400', label: 'Challenge', labelAr: 'تحدي' },
  OPTIMIZER: { icon: 'fa-rocket', color: 'text-purple-400', label: 'Optimizer', labelAr: 'محسن' },
  RESEARCH: { icon: 'fa-microscope', color: 'text-amber-700 dark:text-amber-400', label: 'Research', labelAr: 'بحث' },
};

export const UnifiedHistorySidebar: React.FC<UnifiedHistorySidebarProps> = ({ 
  projects, onSelect, onEdit, onDelete, onExport, isOpen, onToggle, language
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      <aside className={`fixed top-0 right-0 h-full bg-[var(--sidebar-bg)]/95 backdrop-blur-2xl border-l border-[var(--border-dark)] z-50 transition-all duration-300 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col ${
        isOpen ? 'w-80' : 'w-0 overflow-hidden border-none'
      }`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
          <h2 className="text-[var(--text-primary)] font-black text-lg flex items-center">
            <i className="fas fa-folder-tree mr-3 text-[var(--accent-emerald)] dark:text-emerald-400 rtl:ml-3 rtl:mr-0"></i>
            {language === 'Arabic' ? 'سجل المشاريع' : 'Project History'}
          </h2>
          <button onClick={onToggle} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-4 border-b border-slate-800 shrink-0">
          <div className="relative">
            <i className="fas fa-search absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-xs"></i>
            <input 
              type="text"
              placeholder={language === 'Arabic' ? "البحث في المشاريع..." : "Search projects..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-9 pr-4 rtl:pr-9 rtl:pl-4 text-xs text-[var(--text-primary)] focus:ring-1 focus:ring-emerald-500 outline-none transition"
            />
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-ghost text-[var(--text-secondary)] text-4xl mb-3"></i>
              <p className="text-[var(--text-secondary)] text-xs font-medium">{language === 'Arabic' ? "لم يتم العثور على مشاريع" : "No projects found"}</p>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const config = TYPE_CONFIG[project.type];
              return (
                <div 
                  key={project.id}
                  className="group bg-slate-800/50/50 border border-slate-700/50 rounded-xl p-4 hover:border-var(--accent-emerald) hover:bg-slate-800/50 transition cursor-pointer relative"
                  onClick={() => onSelect(project)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                      <i className={`fas ${config.icon} mr-1`}></i>
                      {language === 'Arabic' ? config.labelAr : config.label}
                    </span>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                        className="text-[var(--text-secondary)] hover:text-blue-700 dark:text-blue-400 transition p-1"
                        title="Edit Project"
                      >
                        <i className="fas fa-edit text-xs"></i>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onExport(project); }}
                        className="text-[var(--text-secondary)] hover:text-[var(--accent-emerald)] dark:text-emerald-400 transition p-1"
                        title="Export Report"
                      >
                        <i className="fas fa-file-export text-xs"></i>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                        className="text-[var(--text-secondary)] hover:text-red-700 dark:text-red-400 transition p-1"
                        title="Delete Project"
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
                  <h3 className="text-[var(--text-primary)] font-bold text-sm mb-1 truncate pr-8">{project.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[var(--text-secondary)]">{project.createdAt}</span>
                    {project.score !== undefined && (
                      <span className="text-[10px] font-bold text-[var(--accent-emerald)] dark:text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                        {language === 'Arabic' ? 'الدرجة:' : 'Score:'} {project.score}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 bg-transparent border-t border-white/5 shrink-0">
          <p className="text-[10px] text-[var(--text-secondary)] text-center italic">
            {language === 'Arabic' ? 'يتم حفظ المشاريع محليًا في متصفحك.' : 'Projects are saved locally in your browser.'}
          </p>
        </div>
      </aside>

      {/* Toggle Button (Floating) - Removed as per user request */}
    </>
  );
};
