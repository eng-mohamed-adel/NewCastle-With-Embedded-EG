
import React from 'react';
import { Student } from '../types';
import { motion } from 'framer-motion';

interface StudentCardProps {
  student: Student;
  rank: number;
  onPointChange: (id: number, amount: number) => void;
  onDelete: (id: number) => void;
  isWinner: boolean;
  isAdmin: boolean;
}

const RankIndicator: React.FC<{ rank: number }> = ({ rank }) => {
  const rankColors: { [key: number]: string } = {
    1: 'bg-yellow-400 text-yellow-900 shadow-[0_0_15px_rgba(250,204,21,0.7)]',
    2: 'bg-gray-300 text-gray-800 shadow-[0_0_15px_rgba(209,213,219,0.6)]',
    3: 'bg-yellow-600 text-yellow-100 shadow-[0_0_15px_rgba(202,138,4,0.6)]',
  };

  const baseClasses = 'flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full text-lg font-bold transition-all duration-300';
  const rankClass = rankColors[rank] || 'bg-white/10 text-sky-200';

  return (
    <div className={`${baseClasses} ${rankClass}`}>
      {rank}
    </div>
  );
};

const PointButton: React.FC<{ onClick: () => void; children: React.ReactNode, 'aria-label': string }> = ({ onClick, children, 'aria-label': ariaLabel }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-sky-200 hover:bg-white/20 hover:text-white transition-all duration-200 active:scale-90 transform"
  >
    {children}
  </button>
);


const StudentCard: React.FC<StudentCardProps> = ({ student, rank, onPointChange, onDelete, isWinner, isAdmin }) => {
  const { id, name, points } = student;
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isAdmin) return;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      onPointChange(id, 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onPointChange(id, -1);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
        onDelete(id);
    }
  }

  const winnerClasses = isWinner ? 'shadow-[0_0_25px_rgba(56,189,248,0.8)] border-sky-400 scale-[1.03]' : 'border-white/10';
  const hoverClasses = isAdmin ? 'hover:bg-black/30 hover:border-white/20 hover:scale-[1.02]' : 'cursor-default';
  const focusClasses = isAdmin ? 'focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75' : '';


  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, x: -100, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5, type: 'spring' }}
      className={`flex items-center p-3 md:p-4 bg-black/20 backdrop-blur-sm rounded-xl border shadow-lg transition-all duration-300 transform ${winnerClasses} ${hoverClasses} ${focusClasses}`}
      tabIndex={isAdmin ? 0 : -1}
      onKeyDown={handleKeyDown}
      aria-label={isAdmin ? `${name} with ${points} points, rank ${rank}. Press up or down arrow to change points.` : `${name} with ${points} points, rank ${rank}.`}
    >
      <div className="flex-shrink-0 mr-4">
        <RankIndicator rank={rank} />
      </div>

      <div className="flex-grow">
        <p className="text-lg font-semibold text-white truncate">{name}</p>
        <p className="text-sm text-sky-300/80">{points.toLocaleString()} Points</p>
      </div>
      
      {isAdmin && (
        <div className="flex items-center space-x-2 md:space-x-3 ml-4">
          <PointButton onClick={() => onPointChange(id, -1)} aria-label={`Decrease points for ${name}`}>-</PointButton>
          <PointButton onClick={() => onPointChange(id, 1)} aria-label={`Increase points for ${name}`}>+</PointButton>
          <button
            onClick={handleDelete}
            aria-label={`Delete student ${name}`}
            className="w-8 h-8 flex items-center justify-center bg-red-500/20 rounded-full text-red-300 hover:bg-red-500/40 hover:text-white transition-all duration-200 active:scale-90 transform"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default StudentCard;
