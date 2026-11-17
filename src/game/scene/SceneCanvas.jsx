import { useEffect, useRef, useState } from 'react';

export default function SceneCanvas({ build, onSelect, data, className = '', fallback, transparent = false }) {
  const host = useRef(null);
  const display = useRef({ data, update: null });

  useEffect(() => {
    display.current.data = data;
    display.current.update?.(data);
  }, [data]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const element = host.current;
    const displayState = display.current;
    const controller = new AbortController();
    let renderer, world, observer, frame;
    const timeout = window.setTimeout(() => setStatus('unavailable'), 8000);

    async function start() {
      try {
        const three = await import('./threeSceneKit.js');
        if (controller.signal.aborted) return;
        renderer = new three.WebGLRenderer({ alpha: transparent, antialias: true, powerPreference: 'low-power' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.toneMapping = three.ACESFilmicToneMapping;
        world = build(three);
        element.append(renderer.domElement);
        const { scene, camera, targets = [], resize, animate } = world;
        const draw = () => renderer.render(scene, camera);
        if (world.update) {
          displayState.update = next => { world.update(next); draw(); };
          world.update(displayState.data);
        }
        const layout = () => {
          renderer.setSize(element.clientWidth, element.clientHeight);
          resize(element.clientWidth / Math.max(1, element.clientHeight));
          draw();
        };
        observer = new ResizeObserver(layout);
        observer.observe(element);
        const ray = new three.Raycaster();
        const pointer = new three.Vector2();
        function hit(event) {
          const rect = element.getBoundingClientRect();
          pointer.set(2 * (event.clientX - rect.left) / rect.width - 1,
            1 - 2 * (event.clientY - rect.top) / rect.height);
          ray.setFromCamera(pointer, camera);
          // The first solid surface blocks objects behind it.
          const nearest = ray.intersectObjects(scene.children, true)[0]?.object;
          for (let object = nearest; object; object = object.parent) {
            if (targets.includes(object)) return object;
          }
          return null;
        }
        const options = { signal: controller.signal };
        if (onSelect) {
          element.addEventListener('pointermove', event => {
            const target = hit(event);
            element.style.cursor = target ? 'pointer' : '';
            element.dataset.target = target?.userData.label ?? '';
            for (const entry of targets) entry.userData.highlight(target === entry);
            draw();
          }, options);
          element.addEventListener('pointerleave', () => {
            element.style.cursor = '';
            element.dataset.target = '';
            for (const entry of targets) entry.userData.highlight(false);
            draw();
          }, options);
          element.addEventListener('click', event => {
            const target = hit(event);
            if (target) onSelect(target.userData.to);
          }, options);
        }
        renderer.domElement.addEventListener('webglcontextlost', event => {
          event.preventDefault();
          cancelAnimationFrame(frame);
          setStatus('unavailable');
        }, options);
        renderer.domElement.addEventListener('webglcontextrestored', () => {
          layout();
          if (animate && !motion.matches) frame = requestAnimationFrame(tick);
          setStatus('ready');
        }, options);
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        function tick(time) {
          animate(time / 1000);
          draw();
          frame = requestAnimationFrame(tick);
        }
        if (animate) {
          const syncMotion = () => {
            cancelAnimationFrame(frame);
            if (!motion.matches) frame = requestAnimationFrame(tick);
          };
          motion.addEventListener('change', syncMotion, options);
          syncMotion();
        }
        layout();
        setStatus('ready');
      } catch {
        if (!controller.signal.aborted) setStatus('unavailable');
      } finally {
        window.clearTimeout(timeout);
      }
    }
    start();
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
      displayState.update = null;
      observer?.disconnect();
      cancelAnimationFrame(frame);
      const geometries = new Set();
      const materials = new Set();
      world?.scene.traverse(({ geometry, material }) => {
        if (geometry) geometries.add(geometry);
        if (material) for (const entry of [material].flat()) materials.add(entry);
      });
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      renderer?.dispose();
      renderer?.forceContextLoss();
      renderer?.domElement.remove();
      element.style.cursor = '';
      delete element.dataset.target;
    };
  }, [build, onSelect, transparent]);

  return <div className={`sa-scene ${className}`}>
    <div className="sa-scene__canvas" ref={host} aria-hidden="true" />
    {status !== 'ready' && <div className="sa-scene__fallback" role="status">
      {status === 'loading' ? 'Loading 3D scene…' : fallback}
    </div>}
  </div>;
}
