import React, { useState, useRef, useEffect } from 'react';

export default function QuizEditor() {
  const modules = [
    { id: 'module-1', name: 'Phishing Awareness' },
    { id: 'module-2', name: 'Password Safety' },
    { id: 'module-3', name: 'Social Engineering' },
  ];

  const [selectedModule, setSelectedModule] = useState(modules[0].id);
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [editing, setEditing] = useState({
    text: '',
    type: 'multiple',
    choices: ['',''],
    correctIndex: 0,
    points: 1,
    order: questions.length + 1
  });
  const [saved, setSaved] = useState(false);
  const previewRef = useRef(null);
  const [justAddedId, setJustAddedId] = useState(null);

  function addChoice() {
    setEditing(e => ({ ...e, choices: [...e.choices, ''] }));
  }
  function updateChoice(i, v) {
    setEditing(e => {
      const c = [...e.choices]; c[i] = v; return { ...e, choices: c };
    });
  }
  function removeChoice(i) {
    setEditing(e => ({ ...e, choices: e.choices.filter((_,idx)=>idx!==i) }));
  }

  function addQuestion() {
    const payload = {
      id: Date.now(),
      text: editing.text.trim() || 'Untitled question',
      type: editing.type,
      choices: editing.type === 'multiple' ? editing.choices.map(c=>c.trim()) : [],
      correctIndex: editing.type === 'multiple' ? editing.correctIndex : null,
      points: Number(editing.points) || 1,
      order: Number(editing.order) || (questions.length + 1)
    };

    // Add new question
    setQuestions(prev => {
      const next = [...prev, payload];
      return next;
    });

    // reset editor and increment next order
    setEditing({
      text: '',
      type: 'multiple',
      choices: ['',''],
      correctIndex: 0,
      points: 1,
      order: (questions.length + 2)
    });
    setSaved(false);

    // highlight and scroll to newly added question
    setJustAddedId(payload.id);
    setTimeout(() => setJustAddedId(null), 1200);

    // wait a tick so preview DOM updates, then scroll
    setTimeout(() => {
      if (previewRef.current) {
        previewRef.current.scrollTop = previewRef.current.scrollHeight;
      }
    }, 50);
  }

  function removeQuestion(id) {
    setQuestions(q => q.filter(x => x.id !== id));
  }

  function saveAll() {
    // design-only: show result in console and a tiny success state
    console.log('Save payload -> module:', selectedModule, 'quizTitle:', quizTitle, 'questions:', questions);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow min-h-[640px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#2b2360]">Quiz / Questions Editor</h2>
          <p className="text-sm text-gray-500">Create questions and assign them to a module.</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedModule} onChange={e => setSelectedModule(e.target.value)} className="px-3 py-2 rounded-lg border">
            {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <button onClick={saveAll} className="px-4 py-2 bg-[#5c52ff] text-white rounded-lg">{saved ? 'Saved' : 'Save All'}</button>
        </div>
      </div>

      {/* make grid expand to available space so inner panels can scroll */}
      <div className="grid grid-cols-2 gap-6 flex-1">
        {/* Editor panel */}
        <div className="p-4 border rounded-lg">
          <label className="block text-sm text-gray-600 mb-1">Quiz Title</label>
          <input value={quizTitle} onChange={e=>setQuizTitle(e.target.value)} placeholder="Enter quiz title" className="w-full px-3 py-2 rounded-md border mb-3" />

          <label className="block text-sm text-gray-600 mb-1">Question text</label>
          <textarea value={editing.text} onChange={e=>setEditing(s=>({...s,text:e.target.value}))} className="w-full p-3 rounded-md border mb-3" rows="3" />

          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm">Type:</label>
            <select value={editing.type} onChange={e=>setEditing(s=>({...s,type:e.target.value}))} className="px-2 py-1 rounded-md border">
              <option value="multiple">Multiple Choice</option>
              <option value="text">Text / Short Answer</option>
            </select>

            <label className="text-sm">Points:</label>
            <input type="number" value={editing.points} onChange={e=>setEditing(s=>({...s,points:e.target.value}))} className="w-20 px-2 py-1 rounded-md border" />
            <label className="text-sm">Order:</label>
            <input type="number" value={editing.order} onChange={e=>setEditing(s=>({...s,order:e.target.value}))} className="w-20 px-2 py-1 rounded-md border" />
          </div>

          {editing.type === 'multiple' && (
            <div className="mb-3">
              <div className="text-sm text-gray-600 mb-2">Choices</div>
              <div className="space-y-2">
                {editing.choices.map((c,i)=>(
                  <div key={i} className="flex items-center gap-2">
                    <input type="radio" checked={editing.correctIndex===i} onChange={()=>setEditing(s=>({...s,correctIndex:i}))} />
                    <input value={c} onChange={e=>updateChoice(i,e.target.value)} placeholder={`Choice ${i+1}`} className="flex-1 px-3 py-2 rounded-md border" />
                    <button onClick={()=>removeChoice(i)} className="px-2 py-1 text-sm text-red-500">Remove</button>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <button onClick={addChoice} className="px-3 py-1 bg-gray-100 rounded-md">+ Add choice</button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mt-4">
            <button onClick={addQuestion} className="px-4 py-2 bg-green-600 text-white rounded-md">Add question</button>
            <button onClick={()=>{ setEditing({ text:'', type:'multiple', choices:['',''], correctIndex:0, points:1, order:questions.length+1 }); }} className="px-3 py-2 border rounded-md">Clear</button>
          </div>
        </div>

        {/* Preview / list: make this column flexible and let the inner list scroll */}
        <div className="p-4 border rounded-lg flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">Questions in this draft</div>
            <div className="text-sm text-gray-400">{questions.length}</div>
          </div>

          {/* flexible scroll area; pb-32 prevents last item from being hidden behind fixed bottom bar */}
          <div className="space-y-3 overflow-auto flex-1 pb-32" ref={previewRef}>
            {questions.length === 0 && <div className="text-sm text-gray-400">No questions yet — add one from the left panel.</div>}
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className={`bg-[#faf8ff] p-3 rounded-md border transition-colors ${justAddedId === q.id ? 'ring-4 ring-[#cfc7ff] scale-101' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-[#2b2360]">Q{idx+1}. {q.text}</div>
                    <div className="text-xs text-gray-600">Type: {q.type} • Points: {q.points} • Order: {q.order}</div>
                    {q.type === 'multiple' && (
                      <ul className="mt-2 text-sm space-y-1">
                        {q.choices.map((c,i)=>(
                          <li key={i} className={q.correctIndex===i ? 'font-semibold text-green-600' : ''}>
                            {i+1}. {c || <span className="text-gray-400">empty</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={()=>removeQuestion(q.id)} className="px-3 py-1 border rounded-md text-red-500">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-right">
            <button onClick={saveAll} className="px-4 py-2 bg-[#5c52ff] text-white rounded-md">Save quiz to module</button>
          </div>
        </div>
       </div>
     </div>
   );
 }