import { useEffect, useRef } from 'react';

export default function GlassScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const device = navigator as Navigator & { deviceMemory?: number };
    const lowPower = (device.deviceMemory ?? 8) <= 4 || navigator.hardwareConcurrency <= 4;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (lowPower || reducedMotion || !('WebGLRenderingContext' in window)) return;

    let cancelled = false;
    let renderer: import('three').WebGLRenderer | undefined;
    let frame = 0;
    let dispose: (() => void) | undefined;

    const startScene = async () => {
      const THREE = await import('three');
      if (cancelled) return;

      const roundedPanel = (width: number, height: number, radius: number) => {
        const shape = new THREE.Shape();
        shape.moveTo(-width / 2 + radius, -height / 2);
        shape.lineTo(width / 2 - radius, -height / 2);
        shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
        shape.lineTo(width / 2, height / 2 - radius);
        shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
        shape.lineTo(-width / 2 + radius, height / 2);
        shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
        shape.lineTo(-width / 2, -height / 2 + radius);
        shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);
        return new THREE.ExtrudeGeometry(shape, {
          depth: 0.08,
          bevelEnabled: true,
          bevelSegments: 3,
          bevelSize: 0.045,
          bevelThickness: 0.035,
          curveSegments: 5,
        });
      };

      let activeRenderer: import('three').WebGLRenderer;
      try {
        activeRenderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
        });
        activeRenderer.setClearColor(0x000000, 0);
        renderer = activeRenderer;
      } catch {
        canvas.dataset.unavailable = 'true';
        return;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
      camera.position.set(0, 0, 7.2);

      const rig = new THREE.Group();
      scene.add(rig);
      scene.add(new THREE.HemisphereLight(0xd8fff0, 0x201e27, 2.2));

      const keyLight = new THREE.PointLight(0x9ce8d0, 38, 12);
      keyLight.position.set(-3.2, 3.4, 4.5);
      scene.add(keyLight);

      const rimLight = new THREE.PointLight(0xffa998, 24, 10);
      rimLight.position.set(3.4, -2.4, 2.5);
      scene.add(rimLight);

      const panels = [
      { width: 2.55, height: 3.65, radius: 0.36, x: 0.12, y: 0.02, z: 0, color: 0x9ce8d0, opacity: 0.4 },
      { width: 1.9, height: 2.8, radius: 0.3, x: -1.06, y: 0.54, z: -0.62, color: 0xffab98, opacity: 0.25 },
      { width: 1.58, height: 2.24, radius: 0.25, x: 1.18, y: -0.7, z: -1.1, color: 0xd8edf3, opacity: 0.3 },
    ];

      const geometries: import('three').BufferGeometry[] = [];
      const materials: import('three').Material[] = [];

      panels.forEach((panel, index) => {
      const geometry = roundedPanel(panel.width, panel.height, panel.radius);
      const material = new THREE.MeshPhysicalMaterial({
        color: panel.color,
        metalness: 0.08,
        roughness: 0.16,
        transmission: 0.32,
        thickness: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        transparent: true,
        opacity: panel.opacity,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(panel.x, panel.y, panel.z);
      mesh.rotation.set(index * -0.08, index * 0.12, index * 0.045);
      rig.add(mesh);
      geometries.push(geometry);
      materials.push(material);

      const edgeGeometry = new THREE.EdgesGeometry(geometry, 24);
      const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xf1fff9, transparent: true, opacity: 0.36 });
      const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
      edges.position.copy(mesh.position);
      edges.rotation.copy(mesh.rotation);
      rig.add(edges);
      geometries.push(edgeGeometry);
      materials.push(edgeMaterial);
      });

      const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
        activeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        activeRenderer.setSize(bounds.width, bounds.height, false);
        camera.aspect = bounds.width / bounds.height;
        camera.position.x = bounds.width < 500 ? 0.1 : 0.55;
        camera.updateProjectionMatrix();
        activeRenderer.render(scene, camera);
        canvas.dataset.loaded = 'true';
      };

      let pointerX = 0;
      let pointerY = 0;
      const onPointerMove = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 0.22;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 0.16;
      };
      const animate = (time: number) => {
      rig.rotation.y += ((pointerX + Math.sin(time * 0.00024) * 0.045) - rig.rotation.y) * 0.025;
      rig.rotation.x += ((pointerY + Math.sin(time * 0.00019) * 0.025) - rig.rotation.x) * 0.025;
      rig.position.y = Math.sin(time * 0.00032) * 0.07;
      activeRenderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
      };

      const observer = new ResizeObserver(resize);
      observer.observe(canvas);
      window.addEventListener('resize', resize, { passive: true });
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      resize();
      frame = window.requestAnimationFrame(animate);

      dispose = () => {
        observer.disconnect();
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', onPointerMove);
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());
        activeRenderer.dispose();
      };
    };

    startScene().catch(() => {
      if (!cancelled) canvas.dataset.unavailable = 'true';
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      dispose?.();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-scene" aria-hidden="true" />;
}