import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    let isVisible = true;
    let animationFrameId: number;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / (height || 1), 0.1, 1000);
    camera.position.z = isMobile ? 38 : 32;

    // Renderer
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL init failed:', e);
      return;
    }

    // ── 3D OBJECT 1: Central Glowing Wireframe Icosahedron ──────────────────
    const icoRadius = isMobile ? 7 : 9.5;
    const icoGeometry = new THREE.IcosahedronGeometry(icoRadius, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    scene.add(icosahedron);

    // Inner Core Octahedron
    const coreGeo = new THREE.OctahedronGeometry(icoRadius * 0.5, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // ── 3D OBJECT 2: Dual Rotating Orbital 3D Rings (Gimbal) ────────────────
    const ring1Geo = new THREE.TorusGeometry(isMobile ? 12 : 15, 0.08, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(isMobile ? 14 : 17.5, 0.08, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.3,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // ── 3D OBJECT 3: Floating 3D Particle Cloud Field ────────────────────────
    const particleCount = isMobile ? 75 : 160;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x8b5cf6); // Purple
    const color2 = new THREE.Color(0x06b6d4); // Cyan
    const color3 = new THREE.Color(0xec4899); // Pink

    for (let i = 0; i < particleCount; i++) {
      const spreadX = isMobile ? 45 : 70;
      const spreadY = isMobile ? 35 : 45;
      const spreadZ = 40;

      const px = (Math.random() - 0.5) * spreadX;
      const py = (Math.random() - 0.5) * spreadY;
      const pz = (Math.random() - 0.5) * spreadZ;

      positions[i * 3] = px;
      positions[i * 3 + 1] = py;
      positions[i * 3 + 2] = pz;

      originalPositions[i * 3] = px;
      originalPositions[i * 3 + 1] = py;
      originalPositions[i * 3 + 2] = pz;

      // Random gradient color
      const mixRatio = Math.random();
      const chosenColor = mixRatio < 0.5
        ? color1.clone().lerp(color2, mixRatio * 2)
        : color2.clone().lerp(color3, (mixRatio - 0.5) * 2);

      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle sprite using canvas circle
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(16, 16, 16, 0, Math.PI * 2);
        ctx.fill();
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 1.0 : 1.4,
      vertexColors: true,
      map: createCircleTexture(),
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Mouse & Touch Parallax Tracking ─────────────────────────────────────
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetMouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Intersection Observer to save power when not on screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // ── Main 3D Animation Loop ──────────────────────────────────────────────
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible || !renderer) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse follow with inertia
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Rotate Central 3D Icosahedron
      icosahedron.rotation.x = elapsed * 0.15 + currentMouseY * 0.4;
      icosahedron.rotation.y = elapsed * 0.2 + currentMouseX * 0.4;
      icosahedron.rotation.z = Math.sin(elapsed * 0.1) * 0.2;

      // Rotate Inner Core in opposite direction
      coreMesh.rotation.x = -elapsed * 0.3 - currentMouseY * 0.6;
      coreMesh.rotation.y = -elapsed * 0.25 - currentMouseX * 0.6;

      // Spin 3D Orbital Rings
      ring1.rotation.z = elapsed * 0.3;
      ring1.rotation.x = Math.PI / 3 + Math.sin(elapsed * 0.2) * 0.15 + currentMouseY * 0.2;
      ring1.rotation.y = currentMouseX * 0.3;

      ring2.rotation.z = -elapsed * 0.25;
      ring2.rotation.y = Math.PI / 4 + Math.cos(elapsed * 0.15) * 0.2 + currentMouseX * 0.2;
      ring2.rotation.x = currentMouseY * 0.3;

      // 3D Sine Wave motion for particles
      const posArray = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        posArray[i3 + 1] = originalPositions[i3 + 1] + Math.sin(elapsed * 1.2 + originalPositions[i3] * 0.1) * 1.5;
        posArray[i3] = originalPositions[i3] + Math.cos(elapsed * 0.8 + originalPositions[i3 + 1] * 0.1) * 1.0;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Global scene gentle floating sway
      scene.rotation.y = currentMouseX * 0.15;
      scene.rotation.x = -currentMouseY * 0.15;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / (h || 1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
      icoGeometry.dispose();
      icoMaterial.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background ambient radial glow layers */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-purple-600/20 rounded-full blur-[90px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[280px] sm:w-[480px] h-[280px] sm:h-[480px] bg-cyan-500/15 rounded-full blur-[90px] pointer-events-none animate-blob-delayed" />
    </div>
  );
}
