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
}

const TYPE_CONFIG: Record<ProjectType, { icon: string; color: string; label: string }> = {
  FEASIBILITY: { icon: 'fa-chart-pie', color: 'text-emerald-400', label: 'Feasibility' },
  CHALLENGE: { icon: 'fa-lightbulb', color: 'text-blue-400', label: 'Challenge' },
  OPTIMIZER: { icon: 'fa-rocket', color: 'text-purple-400', label: 'Optimizer' },
  RESEARCH: { icon: 'fa-microscope', color: 'text-amber-400', label: 'Research' },
};

export const UnifiedHistorySidebar: React.FC<UnifiedHistorySidebarProps> = ({ 
  projects, onSelect, onEdit, onDelete, onExport, isOpen, onToggle 
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

      <aside className={`fixed top-0 right-0 h-full bg-slate-900 border-l border-slate-800 z-50 transition-all duration-300 shadow-2xl flex flex-col ${
        isOpen ? 'w-80' : 'w-0 overflow-hidden border-none'
      }`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
          <h2 className="text-white font-black text-lg flex items-center">
            <i className="fas fa-folder-tree mr-3 text-emerald-500"></i>
            Project History
          </h2>
          <button onClick={onToggle} className="text-slate-400 hover:text-white transition">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-4 border-b border-slate-800 shrink-0">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
            <input 
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:ring-1 focus:ring-emerald-500 outline-none transition"
            />
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-ghost text-slate-700 text-4xl mb-3"></i>
              <p className="text-slate-500 text-xs font-medium">No projects found</p>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const config = TYPE_CONFIG[project.type];
              return (
                <div 
                  key={project.id}
                  className="group bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/50 hover:bg-slate-800 transition cursor-pointer relative"
                  onClick={() => onSelect(project)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                      <i className={`fas ${config.icon} mr-1`}></i>
                      {config.label}
                    </span>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                        className="text-slate-400 hover:text-blue-400 transition p-1"
                        title="Edit Project"
                      >
                        <i className="fas fa-edit text-xs"></i>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onExport(project); }}
                        className="text-slate-400 hover:text-emerald-400 transition p-1"
                        title="Export Report"
                      >
                        <i className="fas fa-file-export text-xs"></i>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                        className="text-slate-400 hover:text-red-400 transition p-1"
                        title="Delete Project"
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1 truncate pr-8">{project.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">{project.createdAt}</span>
                    {project.score !== undefined && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                        Score: {project.score}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0">
          <p className="text-[10px] text-slate-500 text-center italic">
            Projects are saved locally in your browser.
          </p>
        </div>
      </aside>

      {/* Toggle Button (Floating) */}
      {!isOpen && (
        <button 
          onClick={onToggle}
          className="fixed bottom-8 right-8 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-500 hover:scale-110 active:scale-95 transition-all z-40 group print:hidden"
        >
          <i className="fas fa-folder-tree text-xl"></i>
          <span className="absolute right-full mr-4 px-3 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap border border-slate-800">
            Project History
          </span>
          {projects.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-50 shadow-lg">
              {projects.length}
            </span>
          )}
        </button>
      )}
    </>
  );
};
