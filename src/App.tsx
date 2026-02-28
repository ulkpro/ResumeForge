import { useResumeState } from './hooks/useResumeState';
import { Sidebar } from './components/editor/Sidebar';
import { ResumePreview } from './components/preview/ResumePreview';
import { PreviewToolbar } from './components/preview/PreviewToolbar';
import { handleExportPDF } from './utils/pdfExport';

export default function App() {
  const {
    data,
    selectedTags,
    selectedPoints,
    layout,
    setLayout,
    collapsedSections,
    allTags,
    handleTagToggle,
    handlePointToggle,
    toggleSection,
    handleAddPoint,
    experienceData,
    projectData,
    educationData,
    skillsData
  } = useResumeState();

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data and layouts?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex h-screen bg-sky-50 overflow-hidden font-sans text-slate-800">

      {/* Sidebar Editor */}
      <Sidebar
        layout={layout}
        setLayout={setLayout}
        allTags={allTags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        onClearTags={() => handleTagToggle('')} // We handle clear in TagFilters but passing a blank triggers reset internally or we just pass a clear func properly.
        collapsedSections={collapsedSections}
        onToggleSection={toggleSection}
        experienceData={experienceData}
        projectData={projectData}
        educationData={educationData}
        skillsData={skillsData}
        selectedPoints={selectedPoints}
        onPointToggle={handlePointToggle}
        onAddPoint={handleAddPoint}
      />

      {/* Main Preview Panel */}
      <div className="w-7/12 bg-slate-100 p-8 flex flex-col relative">
        <PreviewToolbar
          onReset={handleReset}
          onExportPDF={() => handleExportPDF(layout)}
        />

        <div className="flex-1 overflow-y-auto w-full flex justify-center pb-12 pt-4">
          <ResumePreview
            data={data}
            selectedPoints={selectedPoints}
            layout={layout}
          />
        </div>
      </div>
    </div>
  );
}
