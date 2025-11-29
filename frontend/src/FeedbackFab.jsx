import React, { useState } from 'react';
import FeedbackChat from './FeedbackChat';

export default function FeedbackFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* slide-up panel */}
        {open && (
          <div className="mb-3 w-[360px] max-w-sm">
            <div className="rounded-xl shadow-xl">
              <FeedbackChat />
            </div>
          </div>
        )}

        {/* floating button */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Open feedback"
          className="w-14 h-14 rounded-full bg-[#5c52ff] text-white shadow-lg flex items-center justify-center text-2xl transition-transform hover:scale-105"
          title="Feedback"
        >
          💬
        </button>
      </div>
    </>
  );
}