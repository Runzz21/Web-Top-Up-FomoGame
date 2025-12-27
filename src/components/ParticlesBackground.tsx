import React, { useEffect } from 'react';

const ParticlesBackground = () => {
    useEffect(() => {
        const container = document.querySelector('.particles');
        if (!container) return;
        const numberOfParticles = 30;

        for (let i = 0; i < numberOfParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 7 + 3; // 3px to 10px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particle.style.top = `${Math.random() * 100}vh`;
            particle.style.left = `${Math.random() * 100}vw`;
            
            const animationDuration = Math.random() * 20 + 15; // 15s to 35s
            const animationDelay = Math.random() * 10;
            particle.style.animationDuration = `${animationDuration}s`;
            particle.style.animationDelay = `-${animationDelay}s`;
            
            // Randomize colors between pink and purple
            const colors = ['#ff00ff', '#da70d6', '#8a2be2', '#c71585'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            container.appendChild(particle);
        }
    }, []);

    return (
        <div className="particle-bg">
            <div className="particles"></div>
        </div>
    );
};

export default ParticlesBackground;
