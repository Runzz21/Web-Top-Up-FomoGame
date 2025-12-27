// src/components/FloatingParticles.tsx
import './FloatingParticles.css';

const FloatingParticles = () => {
  // Array to generate multiple particle elements
  const particles = Array.from({ length: 15 });

  return (
    <div className="particle-container">
      {particles.map((_, i) => (
        <div className="particle" key={i} />
      ))}
    </div>
  );
};

export default FloatingParticles;
