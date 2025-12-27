// src/components/Confetti.tsx
import './Confetti.css';
import { Gem } from 'lucide-react';

const Confetti = () => {
  const confettiPieces = Array.from({ length: 20 });

  return (
    <div className="confetti-container">
      {confettiPieces.map((_, i) => (
        <div className="confetti-piece" key={i} style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${Math.random() * 3 + 4}s`,
        }}>
          {i % 3 === 0 ? (
             <Gem size={12 + Math.random() * 10} className="text-pink-500" style={{ filter: 'drop-shadow(0 0 5px #ec4899)'}}/>
          ) : (
            <div className="confetti-shape" style={{ 
                backgroundColor: i % 2 === 0 ? '#a855f7' : '#3b82f6',
                transform: `rotate(${Math.random() * 360}deg)`
            }}/>
          )}
        </div>
      ))}
    </div>
  );
};

export default Confetti;
