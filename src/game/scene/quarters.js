import { sceneGeometry } from './geometry.js';

export function buildQuarters(three) {
  const scene = new three.Scene();
  scene.background = new three.Color(0x345769);
  scene.fog = new three.FogExp2(0x628b93, 0.023);
  const camera = new three.PerspectiveCamera(43, 1, 0.1, 100);
  const { material, box, mesh, arch } = sceneGeometry(three);
  const wood = [0x442420, 0x513027, 0x60392b, 0x382321].map(color => material(color));
  const trim = material(0x291b1a);
  const brass = material(0xa77740, { metalness: 0.48 });
  const crimson = material(0x711f2c);
  const parchment = material(0xcdaf79);
  const ocean = material(0x22677b, { roughness: 0.36 });
  scene.add(new three.HemisphereLight(0xb9d4ec, 0x844a2e, 1.45));
  const daylight = new three.DirectionalLight(0x9ed9ef, 1.25);
  daylight.position.set(-2, 6, -7);
  scene.add(daylight);
  const sea = mesh(scene, new three.PlaneGeometry(180, 90), ocean, 0, -1.35, -45);
  sea.rotation.x = -Math.PI / 2;
  const moon = new three.MeshBasicMaterial({ color: 0xffe0ab, fog: false });
  mesh(scene, new three.SphereGeometry(1.5, 20, 12), moon, -8, 6, -47);

  for (let index = 0; index < 25; index++) {
    box(scene, wood[index % wood.length], (index - 12) * 0.52, -0.09, 0, 0.51, 0.18, 12);
  }

  // The stern bulkhead has actual apertures through which the sea can be seen.
  const wall = new three.Shape();
  wall.moveTo(-6.5, 0);
  wall.lineTo(6.5, 0);
  wall.lineTo(6.5, 5.1);
  wall.lineTo(-6.5, 5.1);
  wall.closePath();
  for (const x of [-3.35, 0, 3.35]) {
    const opening = arch(1.27, 2.54, 1.0);
    const hole = new three.Path(opening.getPoints(20).map(p => new three.Vector2(p.x + x, p.y)));
    wall.holes.push(hole);
    const surround = arch(1.45, 2.54, 0.84);
    surround.holes.push(opening);
    mesh(scene, new three.ShapeGeometry(surround, 24), brass, x, 0, -4.87);
    box(scene, trim, x, 1.01, -4.82, 2.85, 0.16, 0.48);
    box(scene, trim, x, 2.38, -4.77, 0.09, 2.7, 0.1);
    box(scene, trim, x, 2.14, -4.77, 2.54, 0.08, 0.1);
  }
  mesh(scene, new three.ShapeGeometry(wall, 24), wood[1], 0, 0, -5);
  for (const x of [-6.4, 6.4]) {
    for (let row = 0; row < 13; row++) {
      box(scene, wood[row % 4], x, 0.2 + row * 0.39, 0, 0.25, 0.38, 10.2);
    }
  }
  for (const z of [-4.6, -2.1, 0.4, 2.9]) box(scene, trim, 0, 4.8, z, 12.8, 0.33, 0.38);
  for (const x of [-5.18, -1.67, 1.67, 5.18]) {
    box(scene, trim, x, 2.5, -4.8, 0.25, 5, 0.28);
  }
  for (const x of [-5.7, 5.7]) {
    box(scene, brass, x, 4.23, -4.56, 0.96, 0.06, 0.1);
    box(scene, crimson, x, 3.34, -4.6, 0.79, 1.77, 0.04);
    box(scene, brass, x, 3.52, -4.57, 0.28, 0.28, 0.02).rotation.z = Math.PI / 4;
  }

  const table = new three.Group();
  table.position.set(1.38, 0, -1.05);
  table.rotation.y = -0.17;
  scene.add(table);
  const tabletop = material(0x674232);
  box(table, tabletop, 0, 1.16, 0, 3.9, 0.19, 2.22);
  for (const x of [-1.7, 1.7]) for (const z of [-0.87, 0.87]) {
    box(table, trim, x, 0.54, z, 0.24, 1.08, 0.24);
    box(table, brass, x, 0.14, z, 0.26, 0.06, 0.26);
  }
  box(table, parchment, -0.15, 1.28, 0, 2.96, 0.04, 1.63).rotation.y = 0.04;
  const ink = material(0x3d6661);
  for (let index = 0; index < 13; index++) {
    const island = mesh(table, new three.CylinderGeometry(0.09 + index % 3 * 0.045, 0.15, 0.025, 5),
      ink, index * 0.208 - 1.43, 1.313, Math.sin(index * 1.7) * 0.58);
    island.scale.z = 0.65;
  }
  mesh(table, new three.TorusGeometry(0.19, 0.025, 8, 20), brass, 1.54, 1.33, 0.71).rotation.x = Math.PI / 2;

  const mirror = new three.Group();
  mirror.position.set(-3.52, 0.19, -2.83);
  mirror.rotation.y = 0.29;
  scene.add(mirror);
  const glass = material(0x356273, { emissive: 0x438f9b, emissiveIntensity: 0.27, metalness: 0.27 });
  const frame = arch(0.87, 2.16, 0.32);
  const pane = arch(0.67, 2.16, 0.54);
  frame.holes.push(pane);
  mesh(mirror, new three.ShapeGeometry(frame, 28), brass, 0, 0, 0.12);
  mesh(mirror, new three.ShapeGeometry(pane, 28), glass, 0, 0, 0.1);
  box(mirror, trim, 0, 0.15, 0, 2.04, 0.3, 0.76);
  const coral = material(0xa64047);
  const bone = material(0xe1c6a1);
  for (const side of [-1, 1]) for (let n = 0; n < 7; n++) {
    const growth = mesh(mirror, new three.ConeGeometry(0.075 + n * 0.006, 0.32, 5),
      n % 3 ? coral : bone, side * (0.8 + n * 0.045), 0.52 + n * 0.22, 0.18);
    growth.rotation.z = side * (0.54 + (n % 2) * 0.36);
  }
  function target(object, to, label, glow, idle) {
    object.userData = { to, label, highlight: active => { glow.emissiveIntensity = active ? 0.68 : idle; } };
  }
  tabletop.emissive.set(0xae651e);
  target(table, '/campaigns/new', 'Chart Table · Campaigns', tabletop, 0);
  target(mirror, '/characters', 'Character Mirror · Characters', glass, 0.27);

  const flame = material(0xffc371, { emissive: 0xff9c39, emissiveIntensity: 2.2 });
  function lantern(x, y, z, intensity) {
    mesh(scene, new three.CylinderGeometry(0.12, 0.17, 0.28, 6), flame, x, y, z);
    for (const offset of [-0.17, 0.17]) box(scene, brass, x, y + offset, z, 0.4, 0.07, 0.37);
    const light = new three.PointLight(0xffaa58, intensity, 9, 1.6);
    light.position.set(x, y - 0.24, z + 0.14);
    scene.add(light);
    return light;
  }
  const lights = [lantern(-4.7, 3.45, -3.96, 19), lantern(3.7, 3.48, -3.69, 22), lantern(-0.1, 4.04, -0.9, 25)];
  box(scene, trim, -0.1, 4.52, -0.9, 0.035, 0.67, 0.035);
  for (let shelf = 0; shelf < 3; shelf++) {
    box(scene, trim, 5.25, 0.38 + shelf * 0.58, -2.75, 1.4, 0.1, 0.59);
    for (let book = 0; book < 8; book++) {
      box(scene, [crimson, wood[2], ink, parchment][book % 4], 4.68 + book * 0.149,
        0.65 + shelf * 0.58, -2.72, 0.12, 0.32 + book % 3 * 0.05, 0.27);
    }
  }
  return {
    scene, camera, targets: [mirror, table],
    resize(aspect) {
      camera.aspect = aspect;
      camera.fov = aspect < 1.1 ? 53 : 43;
      camera.position.set(-0.36, 2.71, aspect < 1.1 ? 8.5 : 6.15);
      camera.lookAt(-0.32, 2.12, -3);
      camera.updateProjectionMatrix();
    },
    animate(time) {
      sea.position.y = -1.35 + Math.sin(time * 0.65) * 0.1;
      lights.forEach((light, index) => { light.intensity = 20 + index * 2 + Math.sin(time * (3 + index)) * 0.7; });
    },
  };
}
