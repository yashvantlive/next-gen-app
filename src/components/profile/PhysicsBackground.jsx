"use client";
import React, { useState, useEffect, useRef, memo } from "react";

// --- 🎱 PHYSICS ICON (Super Fast 3x Speed & Collision) ---
const PhysicsIcon = ({ Icon, color, containerRef, pointerRef, id, trackPosition, iconPositions }) => {
  const iconRef = useRef(null);
  const [iconSize, setIconSize] = useState(56);

  // 📱 Responsive Icon Size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setIconSize(32); // Mobile
      else if (width < 1024) setIconSize(48); // Tablet
      else setIconSize(56); // Desktop
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const state = useRef({
    x: Math.random() * 300, y: Math.random() * 150,
    // ⚡ 3x Speed applied
    vx: (Math.random() - 0.5) * 15.0, vy: (Math.random() - 0.5) * 15.0, 
    rotation: Math.random() * 360, vRotation: (Math.random() - 0.5) * 6.0, scale: 1
  });

  useEffect(() => {
    let animationId;
    const updatePhysics = () => {
      if (!iconRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const s = state.current;
      
      // Update global position for Particle interaction
      trackPosition(id, s.x, s.y, iconSize, s.vx, s.vy); 

      // 1. ICON vs ICON COLLISION
      Object.entries(iconPositions.current).forEach(([otherId, other]) => {
        if (otherId === id) return; 
        const dx = other.x - s.x; const dy = other.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = iconSize + 5; 

        if (dist < minDist) {
          const angle = Math.atan2(dy, dx);
          const sin = Math.sin(angle); const cos = Math.cos(angle);

          // Rotate velocities
          const vx1 = s.vx * cos + s.vy * sin;
          const vy1 = s.vy * cos - s.vx * sin;
          const vx2 = other.vx * cos + other.vy * sin; 
          
          // Swap velocities (Elastic)
          const vx1Final = vx2; 
          
          // Rotate back
          s.vx = vx1Final * cos - vy1 * sin;
          s.vy = vy1 * cos + vx1Final * sin;

          // Push apart
          const overlap = minDist - dist;
          s.x -= Math.cos(angle) * overlap * 0.5;
          s.y -= Math.sin(angle) * overlap * 0.5;
          
          s.vx *= 1.02; s.vy *= 1.02; 
        }
      });

      // 2. MAGNETISM
      const px = pointerRef.current.x; const py = pointerRef.current.y;
      if (px > -500) { 
          const dx = px - s.x; const dy = py - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const interactionRadius = 250; 
          
          if (dist < interactionRadius) {
            const force = (interactionRadius - dist) / interactionRadius; 
            s.vx += (dx / dist) * force * 1.5; s.vy += (dy / dist) * force * 1.5;
            
            const maxSpeed = 20; 
            s.vx = Math.max(Math.min(s.vx, maxSpeed), -maxSpeed);
            s.vy = Math.max(Math.min(s.vy, maxSpeed), -maxSpeed);
            s.scale = 1 + (force * 0.3); 
          }
      } 
      
      // Friction
      if (Math.abs(s.vx) > 10) s.vx *= 0.99; 
      if (Math.abs(s.vy) > 10) s.vy *= 0.99;
      s.scale += (1 - s.scale) * 0.1;

      // 3. WALL BOUNCE
      s.x += s.vx; s.y += s.vy; s.rotation += s.vRotation;
      
      if (s.x <= 0) { s.x = 0; s.vx *= -1; }
      else if (s.x >= rect.width - iconSize) { s.x = rect.width - iconSize; s.vx *= -1; }
      
      if (s.y <= 0) { s.y = 0; s.vy *= -1; }
      else if (s.y >= rect.height - iconSize) { s.y = rect.height - iconSize; s.vy *= -1; }

      // Apply Transform
      iconRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) rotate(${s.rotation}deg) scale(${s.scale})`;
      animationId = requestAnimationFrame(updatePhysics);
    };
    
    animationId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationId);
  }, [iconSize]); 

  const containerStyle = { width: iconSize, height: iconSize };
  const iconStyle = { width: iconSize * 0.5, height: iconSize * 0.5 }; 

  return (
    <div ref={iconRef} className="absolute top-0 left-0 cursor-pointer will-change-transform z-20 touch-none" style={containerStyle}>
      <div className="relative group w-full h-full">
        <div className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300" style={{ backgroundColor: `rgba(${color}, 0.6)` }} />
        <div className="relative w-full h-full bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg flex items-center justify-center">
          <Icon style={iconStyle} className="text-white drop-shadow-md relative z-10" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};

// --- ✨ PARTICLE CANVAS (150 Globules, Mixed Colors) ---
const ParticleCanvas = ({ theme, iconPositions }) => {
  const canvasRef = useRef(null);
  
  const particleColor = theme?.particle || "255, 255, 255";

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const updateSize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    updateSize(); window.addEventListener('resize', updateSize);
    
    // ✅ 150 Particles with Mixed Colors (White/Black/Theme)
    const particles = Array.from({ length: 150 }, () => {
      const variant = Math.random();
      let pColor;
      if (variant > 0.8) pColor = "255, 255, 255"; // White
      else if (variant > 0.6) pColor = "0, 0, 0";   // Black
      else pColor = particleColor;                 // Theme Color

      return {
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
        radius: Math.random() * 4 + 3, 
        alpha: Math.random() * 0.5 + 0.2,
        color: pColor 
      };
    });

    let animationId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Particle vs Particle Collision
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p2.x - p.x; const dy = p2.y - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const minDist = p.radius + p2.radius;

            if (dist < minDist) {
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle), cos = Math.cos(angle);
                
                const vx1 = p.vx * cos + p.vy * sin;
                const vy1 = p.vy * cos - p.vx * sin;
                const vx2 = p2.vx * cos + p2.vy * sin;
                const vy2 = p2.vy * cos - p2.vx * sin;

                p.vx = vx2 * cos - vy1 * sin; p.vy = vy1 * cos + vx2 * sin;
                p2.vx = vx1 * cos - vy2 * sin; p2.vy = vy2 * cos + vx1 * sin;

                const overlap = minDist - dist;
                p.x -= Math.cos(angle) * overlap * 0.5; p.y -= Math.sin(angle) * overlap * 0.5;
                p2.x += Math.cos(angle) * overlap * 0.5; p2.y += Math.sin(angle) * overlap * 0.5;
            }
        }

        // Particle vs Icon Collision
        if (iconPositions && iconPositions.current) {
            Object.values(iconPositions.current).forEach(icon => {
                const iconCx = icon.x + (icon.size / 2);
                const iconCy = icon.y + (icon.size / 2);
                const iconR = icon.size / 2;
                const dx = p.x - iconCx; const dy = p.y - iconCy;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const minDist = p.radius + iconR;

                if (dist < minDist) {
                    const angle = Math.atan2(dy, dx);
                    p.vx = Math.cos(angle) * 6 + (icon.vx * 0.3); 
                    p.vy = Math.sin(angle) * 6 + (icon.vy * 0.3);
                    const overlap = minDist - dist;
                    p.x += Math.cos(angle) * overlap; p.y += Math.sin(angle) * overlap;
                }
            });
        }

        ctx.beginPath(); 
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); 
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`; 
        ctx.fill();
      }
      animationId = requestAnimationFrame(render);
    };
    render(); return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', updateSize); };
  }, [theme, iconPositions, particleColor]); 
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />;
};

// --- 🏗️ EXPORT ---
const PhysicsBackground = memo(({ theme, filters, touchEnabled }) => {
  const coverRef = useRef(null);
  const pointerRef = useRef({ x: -1000, y: -1000 });
  const iconPositions = useRef({}); 

  const trackIconPosition = (id, x, y, size, vx, vy) => { iconPositions.current[id] = { x, y, size, vx, vy }; };

  const handlePointerMove = (e) => {
    if (!coverRef.current || !touchEnabled) return;
    const rect = coverRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    pointerRef.current = { x: clientX - rect.left, y: clientY - rect.top };
  };
  const handlePointerLeave = () => { pointerRef.current = { x: -1000, y: -1000 }; };

  const safeTheme = theme || {
    gradient: "from-slate-900 to-slate-800",
    particle: "255, 255, 255",
    icons: []
  };

  return (
    <div 
      ref={coverRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerLeave}
      className={`h-64 sm:h-72 lg:h-80 w-full bg-gradient-to-r ${safeTheme.gradient} relative overflow-hidden rounded-t-[2.5rem] cursor-crosshair touch-none select-none transition-all duration-300`}
      style={{ filter: `hue-rotate(${filters.hue}deg) saturate(${filters.saturation}%) brightness(${filters.brightness}%)` }} 
    >
        {/* ✅ INDUSTRY STANDARD FIX: Base64 Noise (No External Image, No CORB) */}
        <div 
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}
        ></div>

        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
        
        <ParticleCanvas theme={safeTheme} iconPositions={iconPositions} />
        
        {safeTheme.icons && safeTheme.icons.map((Icon, idx) => (
          <PhysicsIcon
            key={idx} id={`icon-${idx}`} Icon={Icon} color={safeTheme.particle}
            containerRef={coverRef} pointerRef={pointerRef} trackPosition={trackIconPosition} iconPositions={iconPositions}
          />
        ))}
    </div>
  );
});

export default PhysicsBackground;