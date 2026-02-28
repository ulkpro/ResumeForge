import { useState, useMemo, useEffect } from 'react';
import { getResumeData } from './data';
import { Download, LayoutTemplate, BriefcaseBusiness, GraduationCap, Code2, FolderGit2, ChevronDown, ChevronRight, Plus, Settings2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import type { ResumeData, ResumePoint } from './utils/parser';

interface LayoutSettings {
  pageSize: 'A4' | 'LETTER';
  paddingTopBottom: number;
  paddingLeftRight: number;
  gapPoints: number;
  gapSectionToSub: number;
  gapSubsections: number;
}

const defaultLayout: LayoutSettings = {
  pageSize: 'A4',
  paddingTopBottom: 12,
  paddingLeftRight: 12,
  gapPoints: 4,
  gapSectionToSub: 10,
  gapSubsections: 14,
};

export default function App() {
  const [data, setData] = useState<ResumeData[]>(getResumeData());
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [selectedPoints, setSelectedPoints] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    const allData = getResumeData();
    allData.forEach(sec => sec.points.forEach(p => initial[p.id] = true));

    const saved = localStorage.getItem('resume-selected-points');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach(k => { initial[k] = parsed[k]; });
        return initial;
      } catch (e) { /* ignore */ }
    }
    return initial;
  });

  const [layout, setLayout] = useState<LayoutSettings>(() => {
    const saved = localStorage.getItem('resume-layout-settings');
    if (saved) {
      try {
        return { ...defaultLayout, ...JSON.parse(saved) };
      } catch (e) { }
    }
    return defaultLayout;
  });

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    layoutControls: false // default open so user sees it
  });

  useEffect(() => {
    localStorage.setItem('resume-selected-points', JSON.stringify(selectedPoints));
  }, [selectedPoints]);

  useEffect(() => {
    localStorage.setItem('resume-layout-settings', JSON.stringify(layout));
  }, [layout]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    data.forEach(item => {
      item.points.forEach(point => {
        point.tags.forEach(tag => tags.add(tag));
      });
    });
    return Array.from(tags).sort();
  }, [data]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handlePointToggle = (pointId: string) => {
    setSelectedPoints(prev => ({ ...prev, [pointId]: !prev[pointId] }));
  };

  const toggleSection = (sectionName: string) => {
    setCollapsedSections(prev => ({ ...prev, [sectionName]: !prev[sectionName] }));
  };

  const handleExportPDF = () => {
    const element = document.getElementById('resume-preview-container');
    if (!element) return;

    // Use format based on page size. The CSS padding serves as the margin, so html2pdf margins can be 0.
    const opt: any = {
      margin: 0,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: layout.pageSize.toLowerCase(), orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleAddPoint = (sectionId: string, text: string, tagsStr: string) => {
    if (!text.trim()) return;
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    const newPointId = `custom-${Date.now()}`;
    const newPoint: ResumePoint = { id: newPointId, text: text.trim(), tags };
    setData(prev => prev.map(sec =>
      sec.id === sectionId ? { ...sec, points: [...sec.points, newPoint] } : sec
    ));
    setSelectedPoints(prev => ({ ...prev, [newPointId]: true }));
  };

  const filteredData = useMemo(() => {
    return data.map(section => ({
      ...section,
      points: section.points.filter(p => {
        if (selectedTags.length === 0) return true;
        return selectedTags.some(tag => p.tags.includes(tag));
      })
    })).filter(section => section.points.length > 0 || true);
  }, [data, selectedTags]);

  const experienceData = filteredData.filter(d => d.type === 'experience');
  const projectData = filteredData.filter(d => d.type === 'project');
  const educationData = filteredData.filter(d => d.type === 'education');
  const skillsData = filteredData.filter(d => d.type === 'skills');

  // UI Components
  const SectionHeader = ({ icon: Icon, title, sectionKey }: { icon: any, title: string, sectionKey: string }) => {
    const isCollapsed = collapsedSections[sectionKey];
    return (
      <div
        className="flex items-center justify-between mb-4 border-b border-sky-100 pb-2 cursor-pointer hover:bg-sky-50/50 p-2 rounded transition-colors group"
        onClick={() => toggleSection(sectionKey)}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sky-100 text-sky-600 rounded-md group-hover:bg-sky-200 transition-colors">
            <Icon size={18} />
          </div>
          <h2 className="text-xl font-bold text-sky-900 select-none">{title}</h2>
        </div>
        <div className="text-sky-400 group-hover:text-sky-600">
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
    );
  };

  const CheckboxItem = ({ point }: { point: any }) => (
    <label className="flex items-start gap-3 cursor-pointer group p-2 hover:bg-sky-50 transition-colors rounded-lg border border-transparent hover:border-sky-100">
      <div className="relative flex items-start pt-1">
        <input
          type="checkbox"
          checked={!!selectedPoints[point.id]}
          onChange={() => handlePointToggle(point.id)}
          className="peer appearance-none w-5 h-5 border-2 border-sky-300 rounded-md checked:bg-sky-500 checked:border-sky-500 transition-all cursor-pointer focus:ring-2 focus:ring-sky-200"
        />
        <svg
          className="absolute w-5 h-5 left-0 top-1 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity stroke-2 px-1 py-1"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="text-sm flex-1">
        <span className="text-slate-700 leading-snug">{point.text}</span>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {point.tags.map((t: string, i: number) => (
            <span key={i} className="text-[10px] font-medium px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full select-none shadow-sm">
              {t}
            </span>
          ))}
        </div>
      </div>
    </label>
  );

  const AddPointForm = ({ sectionId }: { sectionId: string }) => {
    const [text, setText] = useState('');
    const [tags, setTags] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    if (!isAdding) {
      return (
        <button
          onClick={() => setIsAdding(true)}
          className="text-xs flex items-center gap-1 text-sky-600 hover:text-sky-800 ml-2 mt-2 font-medium"
        >
          <Plus size={14} /> Add Point
        </button>
      );
    }

    return (
      <div className="ml-2 mt-2 p-3 bg-sky-50 rounded-lg border border-sky-200 text-sm">
        <input type="text" placeholder="Bullet point text..." className="w-full mb-2 p-1.5 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" value={text} onChange={e => setText(e.target.value)} />
        <input type="text" placeholder="Tags (comma separated)..." className="w-full mb-2 p-1.5 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400" value={tags} onChange={e => setTags(e.target.value)} />
        <div className="flex gap-2">
          <button onClick={() => { handleAddPoint(sectionId, text, tags); setIsAdding(false); setText(''); setTags(''); }} className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 text-xs font-medium">Save</button>
          <button onClick={() => setIsAdding(false)} className="px-3 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 text-xs font-medium">Cancel</button>
        </div>
      </div>
    );
  };

  const getPageDimensions = () => {
    if (layout.pageSize === 'A4') {
      return { width: '210mm', minHeight: '297mm' };
    }
    // LETTER: 8.5in x 11in (215.9mm x 279.4mm)
    return { width: '8.5in', minHeight: '11in' };
  };

  return (
    <div className="flex h-screen bg-sky-50 overflow-hidden font-sans text-slate-800">

      {/* Sidebar Editor */}
      <div className="w-5/12 p-8 flex flex-col border-r border-sky-200 bg-white shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] overflow-y-auto z-10 custom-scrollbar">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-sky-500 p-2.5 rounded-xl shadow-lg shadow-sky-200 text-white">
            <LayoutTemplate size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-sky-950">Resume Builder</h1>
        </div>

        {/* Layout & Print Settings */}
        <div className="mb-6">
          <SectionHeader icon={Settings2} title="Layout & Spacing" sectionKey="layoutControls" />
          {!collapsedSections['layoutControls'] && (
            <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100 flex flex-col gap-4 text-sm font-medium text-slate-700">

              <div className="flex items-center justify-between">
                <span>Page Size</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLayout(s => ({ ...s, pageSize: 'A4' }))}
                    className={`px-3 py-1.5 rounded ${layout.pageSize === 'A4' ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'} transition-colors`}
                  >A4</button>
                  <button
                    onClick={() => setLayout(s => ({ ...s, pageSize: 'LETTER' }))}
                    className={`px-3 py-1.5 rounded ${layout.pageSize === 'LETTER' ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'} transition-colors`}
                  >Letter</button>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Margins (Top & Bottom)</span>
                  <span className="text-sky-600 font-bold">{layout.paddingTopBottom} mm</span>
                </div>
                <input type="range" min="0" max="30" step="1"
                  value={layout.paddingTopBottom}
                  onChange={e => setLayout(s => ({ ...s, paddingTopBottom: Number(e.target.value) }))}
                  className="w-full accent-sky-500" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Margins (Left & Right)</span>
                  <span className="text-sky-600 font-bold">{layout.paddingLeftRight} mm</span>
                </div>
                <input type="range" min="0" max="30" step="1"
                  value={layout.paddingLeftRight}
                  onChange={e => setLayout(s => ({ ...s, paddingLeftRight: Number(e.target.value) }))}
                  className="w-full accent-sky-500" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Gap Between Title & First Sub</span>
                  <span className="text-sky-600 font-bold">{layout.gapSectionToSub} px</span>
                </div>
                <input type="range" min="0" max="40" step="1"
                  value={layout.gapSectionToSub}
                  onChange={e => setLayout(s => ({ ...s, gapSectionToSub: Number(e.target.value) }))}
                  className="w-full accent-sky-500" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Gap Between Subsections</span>
                  <span className="text-sky-600 font-bold">{layout.gapSubsections} px</span>
                </div>
                <input type="range" min="0" max="40" step="1"
                  value={layout.gapSubsections}
                  onChange={e => setLayout(s => ({ ...s, gapSubsections: Number(e.target.value) }))}
                  className="w-full accent-sky-500" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Gap Between Bullet Points</span>
                  <span className="text-sky-600 font-bold">{layout.gapPoints} px</span>
                </div>
                <input type="range" min="0" max="20" step="1"
                  value={layout.gapPoints}
                  onChange={e => setLayout(s => ({ ...s, gapPoints: Number(e.target.value) }))}
                  className="w-full accent-sky-500" />
              </div>
            </div>
          )}
        </div>

        {/* Tag Filters */}
        <div className="mb-8 bg-sky-50/50 p-4 rounded-xl border border-sky-100">
          <h2 className="text-sm uppercase tracking-wider font-bold text-sky-800 mb-3">Filter by Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm
                  ${selectedTags.includes(tag)
                    ? 'bg-sky-500 text-white border border-sky-600 shadow-sky-200 scale-105'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300 hover:text-sky-600'}`
                }
              >
                {tag}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Sections Editor */}
        <div className="space-y-6 pb-20">

          {/* Experience Editor */}
          {experienceData.length > 0 && (
            <div>
              <SectionHeader icon={BriefcaseBusiness} title="Experience" sectionKey="experience" />
              {!collapsedSections['experience'] && experienceData.map(exp => (
                <div key={exp.id} className="mb-6 ml-2 pl-2 border-l-2 border-slate-100">
                  <h3 className="font-semibold text-slate-800 mb-1">{exp.company} - <span className="text-sky-600 font-normal">{exp.designation}</span></h3>
                  <div className="space-y-1">
                    {exp.points.map(point => <CheckboxItem key={point.id} point={point} />)}
                  </div>
                  <AddPointForm sectionId={exp.id} />
                </div>
              ))}
            </div>
          )}

          {/* Projects Editor */}
          {projectData.length > 0 && (
            <div>
              <SectionHeader icon={FolderGit2} title="Projects" sectionKey="projects" />
              {!collapsedSections['projects'] && projectData.map(proj => (
                <div key={proj.id} className="mb-6 ml-2 pl-2 border-l-2 border-slate-100">
                  <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2 hover:text-sky-600 transition-colors">
                    {proj.project_name}
                  </h3>
                  <div className="space-y-1">
                    {proj.points.map(point => <CheckboxItem key={point.id} point={point} />)}
                  </div>
                  <AddPointForm sectionId={proj.id} />
                </div>
              ))}
            </div>
          )}

          {/* Education Editor */}
          {educationData.length > 0 && (
            <div>
              <SectionHeader icon={GraduationCap} title="Education" sectionKey="education" />
              {!collapsedSections['education'] && educationData.map(edu => (
                <div key={edu.id} className="mb-6 ml-2 pl-2 border-l-2 border-slate-100">
                  <h3 className="font-semibold text-slate-800 mb-1">{edu.institution} - <span className="text-sky-600 font-normal">{edu.degree}</span></h3>
                  <div className="space-y-1">
                    {edu.points.map(point => <CheckboxItem key={point.id} point={point} />)}
                  </div>
                  <AddPointForm sectionId={edu.id} />
                </div>
              ))}
            </div>
          )}

          {/* Skills Editor */}
          {skillsData.length > 0 && (
            <div>
              <SectionHeader icon={Code2} title="Skills" sectionKey="skills" />
              {!collapsedSections['skills'] && skillsData.map(skill => (
                <div key={skill.id} className="mb-6 ml-2 pl-2 border-l-2 border-slate-100">
                  <h3 className="font-semibold text-slate-800 mb-1">{skill.category}</h3>
                  <div className="space-y-1">
                    {skill.points.map(point => <CheckboxItem key={point.id} point={point} />)}
                  </div>
                  <AddPointForm sectionId={skill.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Preview Panel */}
      <div className="w-7/12 bg-slate-100 p-8 flex flex-col relative">
        <div className="absolute top-6 right-8 z-10 flex gap-4">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all data and layouts?")) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 bg-white px-4 py-2 rounded-xl shadow shadow-slate-200 transition-all font-medium border border-slate-200 text-sm"
          >
            Reset All
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2.5 bg-sky-600 hover:bg-sky-500 hover:-translate-y-0.5 text-white px-5 py-2.5 rounded-xl shadow-[0_4px_14px_0_theme(colors.sky.300)] transition-all font-semibold"
          >
            <Download size={20} className="stroke-2" />
            <span className="tracking-wide">Export PDF</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto w-full flex justify-center pb-12 pt-4">
          <div
            id="resume-preview-container"
            className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] resume-preview shrink-0 text-black leading-snug"
            style={{
              width: getPageDimensions().width,
              minHeight: getPageDimensions().minHeight,
              paddingLeft: layout.paddingLeftRight + 'mm',
              paddingRight: layout.paddingLeftRight + 'mm',
              paddingTop: layout.paddingTopBottom + 'mm',
              paddingBottom: layout.paddingTopBottom + 'mm',
              fontSize: '11pt'
            }}
          >
            {/* Header section... */}
            <div className="text-center mb-6">
              <h1 className="text-[22pt] font-semibold text-slate-900 tracking-tight mb-1">Uditha H.</h1>
              <p className="text-[10pt] text-slate-600 flex justify-center flex-wrap gap-2 items-center">
                <span>firstname.lastname@xyz.org</span>
                <span>•</span>
                <span>(999) 999-9999</span>
                <span>•</span>
                <span className="text-sky-700">github.com/username</span>
                <span>•</span>
                <span className="text-sky-700">linkedin.com/in/username</span>
              </p>
            </div>

            {/* Resume Content Sections... */}
            <div className="space-y-4">

              {/* Experience Section */}
              {data.filter(d => d.type === 'experience' && d.points.some(p => selectedPoints[p.id])).length > 0 && (
                <div className="resume-section">
                  <h2
                    className="text-[12pt] font-bold uppercase tracking-wider text-sky-900 border-b-2 border-sky-900 pb-0.5"
                    style={{ marginBottom: layout.gapSectionToSub + 'px' }}
                  >Experience</h2>

                  <div className="flex flex-col" style={{ gap: layout.gapSubsections + 'px' }}>
                    {data.filter(d => d.type === 'experience').map(exp => {
                      const activePoints = exp.points.filter(p => selectedPoints[p.id]);
                      if (activePoints.length === 0) return null;
                      return (
                        <div key={exp.id}>
                          <div className="flex justify-between font-semibold text-[11pt] text-slate-800 leading-snug mb-1">
                            <span>{exp.designation} <span className="font-normal text-slate-600">| {exp.company}</span></span>
                            <span className="text-slate-600 text-[10pt] font-medium">
                              {exp.location && <span className="mr-2">{exp.location}</span>}
                              {exp.startDate} – {exp.endDate}
                            </span>
                          </div>
                          <ul className="list-disc pl-[18px] text-[10pt] text-slate-700 flex flex-col" style={{ gap: layout.gapPoints + 'px' }}>
                            {activePoints.map(p => (
                              <li key={p.id}>{p.text}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {data.filter(d => d.type === 'project' && d.points.some(p => selectedPoints[p.id])).length > 0 && (
                <div className="resume-section">
                  <h2
                    className="text-[12pt] font-bold uppercase tracking-wider text-sky-900 border-b-2 border-sky-900 pb-0.5"
                    style={{ marginBottom: layout.gapSectionToSub + 'px' }}
                  >Projects</h2>

                  <div className="flex flex-col" style={{ gap: layout.gapSubsections + 'px' }}>
                    {data.filter(d => d.type === 'project').map(proj => {
                      const activePoints = proj.points.filter(p => selectedPoints[p.id]);
                      if (activePoints.length === 0) return null;
                      return (
                        <div key={proj.id}>
                          <div className="flex justify-between font-semibold text-[11pt] text-slate-800 leading-snug mb-1">
                            <span className="flex items-center gap-1.5">
                              {proj.project_name}
                              {proj.url && <span className="font-normal text-sky-700 text-[9pt] pt-0.5">| {proj.url}</span>}
                            </span>
                          </div>
                          <ul className="list-disc pl-[18px] text-[10pt] text-slate-700 flex flex-col" style={{ gap: layout.gapPoints + 'px' }}>
                            {activePoints.map(p => (
                              <li key={p.id}>{p.text}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Education Section */}
              {data.filter(d => d.type === 'education' && (d.points.some(p => selectedPoints[p.id]) || d.points.length === 0)).length > 0 && (
                <div className="resume-section">
                  <h2
                    className="text-[12pt] font-bold uppercase tracking-wider text-sky-900 border-b-2 border-sky-900 pb-0.5"
                    style={{ marginBottom: layout.gapSectionToSub + 'px' }}
                  >Education</h2>

                  <div className="flex flex-col" style={{ gap: layout.gapSubsections + 'px' }}>
                    {data.filter(d => d.type === 'education').map(edu => {
                      const activePoints = edu.points.filter(p => selectedPoints[p.id]);
                      if (activePoints.length === 0 && edu.points.length > 0) return null;
                      return (
                        <div key={edu.id}>
                          <div className="flex justify-between font-semibold text-[11pt] text-slate-800 mb-0.5">
                            <span>{edu.institution}, <span className="font-normal italic text-slate-700">{edu.degree}</span></span>
                            <span className="text-slate-600 text-[10pt]">
                              {edu.location && <span className="mr-2">{edu.location}</span>}
                              {edu.startDate ? `${edu.startDate} – ${edu.endDate}` : edu.endDate}
                            </span>
                          </div>
                          {edu.gpa && <div className="text-[10pt] text-slate-700 mb-1">GPA: {edu.gpa}</div>}
                          {activePoints.length > 0 && (
                            <ul className="list-disc pl-[18px] text-[10pt] text-slate-700 flex flex-col" style={{ gap: layout.gapPoints + 'px' }}>
                              {activePoints.map(p => (
                                <li key={p.id}>{p.text}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Skills Section */}
              {data.filter(d => d.type === 'skills' && d.points.some(p => selectedPoints[p.id])).length > 0 && (
                <div className="resume-section">
                  <h2
                    className="text-[12pt] font-bold uppercase tracking-wider text-sky-900 border-b-2 border-sky-900 pb-0.5"
                    style={{ marginBottom: layout.gapSectionToSub + 'px' }}
                  >Technical Skills</h2>

                  <div className="flex flex-col" style={{ gap: layout.gapPoints + 'px' }}>
                    {data.filter(d => d.type === 'skills').map(skill => {
                      const activePoints = skill.points.filter(p => selectedPoints[p.id]);
                      if (activePoints.length === 0) return null;
                      return activePoints.map(p => {
                        const colonIdx = p.text.indexOf(':');
                        if (colonIdx !== -1) {
                          return (
                            <div key={p.id} className="text-[10pt] text-slate-800 leading-snug">
                              <span className="font-semibold">{p.text.substring(0, colonIdx + 1)}</span>
                              <span>{p.text.substring(colonIdx + 1)}</span>
                            </div>
                          );
                        }
                        return <div key={p.id} className="text-[10pt] text-slate-800">{p.text}</div>;
                      });
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
