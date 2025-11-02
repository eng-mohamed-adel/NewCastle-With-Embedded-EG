
import React from 'react';

const Particles: React.FC = () => {
  const particleCount = 40;
  const particles = Array.from({ length: particleCount });

  return (
    <>
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .particle {
          position: absolute;
          display: block;
          list-style: none;
          background-color: rgba(255, 255, 255, 0.4);
          animation: float 25s linear infinite;
          bottom: -150px;
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        }
      `}</style>
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden" aria-hidden="true">
        {particles.map((_, i) => {
          const size = Math.random() * 20 + 5; // 5px to 25px
          const left = Math.random() * 100; // 0% to 100%
          const animationDuration = Math.random() * 15 + 10; // 10s to 25s
          const animationDelay = Math.random() * 10; // 0s to 10s
          
          return (
            <div
              key={i}
              className="particle"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                animationDuration: `${animationDuration}s`,
                animationDelay: `${animationDelay}s`,
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default Particles;
