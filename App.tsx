
import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Student } from './types';
import StudentCard from './components/StudentCard';
import Particles from './components/Particles';
import LoginModal from './components/LoginModal';
import { AnimatePresence, motion } from 'framer-motion';

const INITIAL_STUDENTS: Student[] = [];

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [isCapturing, setIsCapturing] = useState(false);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const leaderboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIsAdmin = sessionStorage.getItem('isAdmin') === 'true';

    if (sessionIsAdmin) {
      setIsAdmin(true);
      return;
    }
    
    if (urlParams.get('mode') === 'admin') {
      setShowLogin(true);
    }
  }, []);

  const handleLogin = (password: string) => {
    if (password === 'Embedded&1715&EG') {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginError('');
      sessionStorage.setItem('isAdmin', 'true');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => b.points - a.points);
  }, [students]);

  const handlePointChange = useCallback((id: number, amount: number) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === id ? { ...student, points: Math.max(0, student.points + amount) } : student
      )
    );
  }, []);
  
  const handleDeleteStudent = useCallback((id: number) => {
    setStudents(prevStudents => prevStudents.filter(student => student.id !== id));
  }, []);

  const handleCaptureSnapshot = useCallback(() => {
    if (leaderboardRef.current) {
      setIsCapturing(true);
      (window as any).html2canvas(leaderboardRef.current, {
        backgroundColor: '#030b19',
        useCORS: true,
        scale: 2,
      }).then((canvas: HTMLCanvasElement) => {
        const link = document.createElement('a');
        link.download = 'student-rankings-snapshot.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        setIsCapturing(false);
      }).catch((err: Error) => {
        console.error("Failed to capture snapshot:", err);
        setIsCapturing(false);
      });
    }
  }, []);
  
  const handleDeclareWinner = useCallback(() => {
    if (sortedStudents.length > 0 && sortedStudents[0].points > 0) {
      setWinnerId(sortedStudents[0].id);
      setTimeout(() => setWinnerId(null), 3000); // Highlight for 3 seconds
    }
  }, [sortedStudents]);

  const handleAddStudent = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim()) {
      const newStudent: Student = {
        id: Date.now(),
        name: newStudentName.trim(),
        points: 0,
      };
      setStudents(prev => [...prev, newStudent]);
      setNewStudentName('');
    }
  }, [newStudentName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030b19] to-[#13459e] text-white antialiased overflow-hidden">
      <AnimatePresence>
        {showLogin && <LoginModal 
            onSubmit={handleLogin} 
            error={loginError} 
            onClose={() => {
              setShowLogin(false);
              window.history.replaceState({}, document.title, window.location.pathname);
            }} 
        />}
      </AnimatePresence>
      <Particles />
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400"
          >
            Student Points Leaderboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 text-lg text-sky-200/80"
          >
            Live rankings and performance tracking
          </motion.p>
        </header>

        <main>
          {isAdmin && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8"
            >
              <form onSubmit={handleAddStudent} className="flex gap-2" aria-label="Add new student">
                <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="Enter student name..."
                    aria-label="New student name"
                    className="w-48 px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-gray-400 transition-all"
                />
                <button
                    type="submit"
                    className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium tracking-tighter text-white bg-sky-600 rounded-lg group transition-all duration-300 ease-out transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-sky-400 rounded-full group-hover:w-56 group-hover:h-56"></span>
                    <span className="relative">Add</span>
                </button>
              </form>

              <div className="flex items-center gap-2">
                 <button
                  onClick={handleDeclareWinner}
                  disabled={!sortedStudents.length || sortedStudents[0].points === 0}
                  className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium tracking-tighter text-white bg-[#13459e] rounded-lg group transition-all duration-300 ease-out transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-yellow-400 rounded-full group-hover:w-56 group-hover:h-56"></span>
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black/50"></span>
                  <span className="relative flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Declare Winner
                  </span>
                </button>
                <button
                  onClick={handleCaptureSnapshot}
                  disabled={isCapturing}
                  className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium tracking-tighter text-white bg-[#13459e] rounded-lg group transition-all duration-300 ease-out transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-teal-400 rounded-full group-hover:w-56 group-hover:h-56"></span>
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black/50"></span>
                  <span className="relative flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    {isCapturing ? 'Capturing...' : 'Capture Snapshot'}
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          <div ref={leaderboardRef} className="max-w-3xl mx-auto space-y-4">
             {sortedStudents.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-12 px-6 bg-black/20 rounded-xl"
                >
                    <p className="text-xl text-sky-200/80">
                      {isAdmin ? "No students yet. Add one to get started!" : "The leaderboard is empty."}
                    </p>
                </motion.div>
             ) : (
                <AnimatePresence>
                {sortedStudents.map((student, index) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      rank={index + 1}
                      onPointChange={handlePointChange}
                      onDelete={handleDeleteStudent}
                      isWinner={student.id === winnerId}
                      isAdmin={isAdmin}
                    />
                ))}
                </AnimatePresence>
             )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
