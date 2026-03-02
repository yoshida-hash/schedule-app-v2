import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import NotesSection from './components/NotesSection';
import EventModal from './components/EventModal';
import { startOfMonth } from 'date-fns';
import { subscribeToEvents, addEvent, updateEvent, deleteEvent } from './lib/eventService';
import { subscribeToProjects, addProject, updateProject, deleteProject } from './lib/projectService';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

function App() {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [baseDate, setBaseDate] = useState(startOfMonth(new Date()));
  const [monthCount, setMonthCount] = useState(2);
  const [zoomLevel, setZoomLevel] = useState(100);

  // プロジェクト編集関連の状態
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // イベント関連の状態
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 現場一覧の購読
  useEffect(() => {
    const unsubscribe = subscribeToProjects((data) => {
      setProjects(data);
      if (data.length > 0 && !projectId) {
        setProjectId(data[0].id);
      }
    });
    return () => unsubscribe();
  }, []);

  // イベントの購読
  useEffect(() => {
    if (!projectId) return;
    const unsubscribe = subscribeToEvents(projectId, setEvents);
    return () => unsubscribe();
  }, [projectId]);

  // 現場追加
  const handleAddProject = async () => {
    const name = window.prompt('新しい現場名を入力してください');
    if (name) {
      const docRef = await addProject(name);
      setProjectId(docRef.id);
    }
  };

  // 現場名編集開始
  const startEditing = (p) => {
    setEditingProjectId(p.id);
    setEditingName(p.name);
  };

  // 現場名保存
  const handleUpdateProject = async () => {
    if (!editingName.trim()) return;
    try {
      await updateProject(editingProjectId, editingName);
      setEditingProjectId(null);
    } catch (e) {
      alert('更新に失敗しました');
    }
  };

  // 現場削除
  const handleDeleteProject = async (id, name) => {
    if (!window.confirm(`現場「${name}」を削除してもよろしいですか？\n※この操作は元に戻せません。`)) return;
    try {
      await deleteProject(id);
      if (projectId === id) {
        setProjectId(projects.find(p => p.id !== id)?.id || null);
      }
    } catch (e) {
      alert('削除に失敗しました');
    }
  };

  const handleDayClick = (dateString) => {
    setSelectedDate(dateString);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setSelectedDate('');
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      const { id, ...dataToSave } = eventData;
      if (id) {
        await updateEvent(id, dataToSave);
      } else {
        await addEvent(projectId, dataToSave);
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      alert('予定の保存に失敗しました');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('この予定を削除してもよろしいですか？')) return;
    try {
      await deleteEvent(id);
      setIsModalOpen(false);
    } catch (e) {
      alert('予定の削除に失敗しました');
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:border-none print:shadow-none print:rounded-none relative">

        {/* プロジェクトタブ */}
        <div className="flex items-center bg-slate-100 border-b border-slate-200 no-print overflow-x-auto shrink-0">
          {projects.map(p => (
            <div
              key={p.id}
              className={`group flex items-center transition-colors border-r border-slate-200 h-10 md:h-12 shrink-0 ${projectId === p.id ? 'bg-white' : 'hover:bg-slate-200'}`}
            >
              {editingProjectId === p.id ? (
                <div className="flex items-center px-4 gap-1">
                  <input
                    autoFocus
                    className="text-xs md:text-sm font-bold border rounded px-1 w-24 md:w-32 focus:outline-blue-500"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateProject()}
                  />
                  <button onClick={handleUpdateProject} className="text-green-600"><Check size={16} /></button>
                  <button onClick={() => setEditingProjectId(null)} className="text-slate-400"><X size={16} /></button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setProjectId(p.id)}
                    className={`px-4 md:px-6 h-full font-bold text-xs md:text-sm flex items-center whitespace-nowrap ${projectId === p.id ? 'text-blue-600 border-b-2 border-b-blue-600' : 'text-slate-500'}`}
                  >
                    {p.name}
                  </button>
                  <div className="flex items-center gap-1 pr-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEditing(p)} className="p-1 text-slate-400 hover:text-blue-600"><Edit2 size={12} /></button>
                    <button onClick={() => handleDeleteProject(p.id, p.name)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
                  </div>
                </>
              )}
            </div>
          ))}
          <button
            onClick={handleAddProject}
            className="px-4 h-full flex items-center text-slate-400 hover:text-blue-500 hover:bg-slate-200 transition-colors"
            title="現場を追加"
          >
            <Plus size={20} />
          </button>
        </div>

        <CalendarHeader
          baseDate={baseDate}
          setBaseDate={setBaseDate}
          monthCount={monthCount}
          setMonthCount={setMonthCount}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          projectName={projects.find(p => p.id === projectId)?.name || ''}
        />

        <div className="flex-grow flex flex-col overflow-y-auto bg-slate-50 print:bg-white print:overflow-visible">
          <div
            style={{ zoom: `${zoomLevel}%`, transformOrigin: 'top left' }}
            className="flex-grow flex flex-col w-full p-2 md:p-4 print:p-0 print-zoom-reset"
          >
            {projectId ? (
              <div className="overflow-x-auto pb-4 md:pb-0">
                <div className="min-w-[500px] md:min-w-full">
                  {Array.from({ length: monthCount }).map((_, i) => {
                    const currentMonthDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, 1);
                    return (
                      <CalendarGrid
                        key={`month-${i}`}
                        monthDate={currentMonthDate}
                        events={events}
                        onDayClick={handleDayClick}
                        onEventClick={handleEventClick}
                      />
                    );
                  })}
                  <NotesSection projectId={projectId} />
                </div>
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center text-slate-400 text-lg">
                現場を選択するか、新しい現場を追加してください
              </div>
            )}
          </div>
        </div>

        <EventModal
          isOpen={isModalOpen}
          initialDate={selectedDate}
          initialEvent={selectedEvent}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      </div>
    </Layout>
  );
}

export default App;

