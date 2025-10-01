import React, { useState } from 'react';
import Logo from './assets/logo.png';
import { useAuth } from './contexts/AuthContext';
import FeedbackList from './FeedbackList';
import QuizEditor from './QuizEditor';

export default function AdminDashboard() {
  const { user } = useAuth() || {};
  const [active, setActive] = useState('dashboard');

  const menu = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'feedback', label: 'Feedback', icon: '💬' },
    { key: 'quizzes', label: 'Quizzes/Questions', icon: '🧩' },
    { key: 'users', label: 'Users', icon: '👥' },
    { key: 'exports', label: 'Exports', icon: '📤' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const latestFeedback = [
    { id: 1, name: 'Mirana', text: "I've used other kits, but this one is the best..." },
    { id: 2, name: 'Asha', text: 'Useful content and simple UX.' },
  ];

  return (
    <div className="min-h-screen bg-[#f3f1fb] flex">
      {/* Left nav */}
      <aside className="w-64 bg-white border-r border-purple-50 p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-white border flex items-center justify-center">
            <img src={Logo} alt="GuardEd" className="w-10 h-10" />
          </div>
          <div>
            <div className="text-[#5c52ff] font-extrabold">GuardEd</div>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {menu.map((m) => (
            <button
              key={m.key}
              onClick={() => setActive(m.key)}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition ${
                active === m.key ? 'bg-[#5c52ff] text-white shadow' : 'text-gray-600 hover:bg-purple-50'
              }`}
            >
              <span className="text-lg">{m.icon}</span>
              <span className="font-medium">{m.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <main className="flex-1 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-[#2b2360]">Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.displayName || user?.email || 'Admin'}!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-48">
              <input
                placeholder="Search"
                className="w-full px-4 py-2 rounded-lg border bg-white"
              />
            </div>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium"
              onClick={async () => {
                const { signOutUser } = await import('./services/firebase');
                await signOutUser();
                window.location.href = '/';
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {active === 'dashboard' && (
          <div>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="col-span-2 bg-white rounded-xl p-6 shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-400">Total Attempts</div>
                    <div className="text-3xl font-extrabold text-[#5c52ff]">112</div>
                  </div>
                  <div className="text-sm text-gray-400">12 Days</div>
                </div>
                <div className="h-44 bg-[#faf8ff] rounded-lg flex items-end p-4">
                  {/* simple bars */}
                  <div className="w-full flex items-end gap-3">
                    {[4,11,6,7,6,12,5,10,1,7,4,6].map((v,i)=>(
                      <div key={i} className="flex-1 h-full flex items-end">
                        <div className="w-full bg-gradient-to-b from-[#5c52ff] to-[#bfb7ff] rounded-t-lg" style={{height: `${(v/12)*100}%`}}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow">
                <div className="text-sm text-gray-400">Completion Rate</div>
                <div className="text-3xl font-extrabold text-[#5c52ff]">40%</div>
                <div className="mt-6 h-20 bg-[#faf8ff] rounded-lg"></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <section className="col-span-2 space-y-6">
                <div className="bg-white rounded-xl p-6 shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#2b2360]">Latest Feedback</h3>
                    <a className="text-sm text-[#5c52ff]" href="#">See all</a>
                  </div>
                  <div className="space-y-4">
                    {latestFeedback.map(f => (
                      <div key={f.id} className="bg-[#faf8ff] p-4 rounded-lg">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">👤</div>
                          <div>
                            <div className="font-semibold text-[#2b2360]">{f.name}</div>
                            <div className="text-gray-600">{f.text}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow">
                  <h3 className="text-lg font-bold text-[#2b2360] mb-4">Recent Attempts</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-sm text-gray-500">
                          <th className="pb-2">Quiz</th>
                          <th className="pb-2">Score</th>
                          <th className="pb-2">Status</th>
                          <th className="pb-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1,2,3,4,5].map(i=>(
                          <tr key={i} className="border-t">
                            <td className="py-3">Quiz {i}</td>
                            <td className="py-3"> {Math.floor(Math.random()*100)}</td>
                            <td className="py-3 text-green-500">Completed</td>
                            <td className="py-3 text-gray-500">20-09-25</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <aside className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow">
                  <div className="text-sm text-gray-400">Active Users Now</div>
                  <div className="text-3xl font-extrabold text-[#5c52ff]">112</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow">
                  <div className="text-sm text-gray-400">Top Quiz</div>
                  <div className="text-xl font-bold">Phishing Awareness</div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow">
                  <h4 className="font-semibold text-[#2b2360] mb-2">Quick Actions</h4>
                  <div className="flex flex-col gap-3">
                    <button className="px-4 py-2 bg-[#5c52ff] text-white rounded-md">Take Quiz</button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md">Learn More</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={()=>window.location.href='#'}>View Profile</button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {active === 'feedback' && (
          <FeedbackList />
        )}

        {active === 'quizzes' && (
          <QuizEditor />
        )}

        {active === 'users' && (
          /* placeholder for users view */
          <div className="bg-white rounded-xl p-6 shadow">Users view (to implement)</div>
        )}
      </main>
    </div>
  );
}
