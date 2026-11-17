import { sceneGeometry } from './geometry.js';

export const facings = Object.freeze(['South', 'Southwest', 'West', 'Northwest', 'North', 'Northeast', 'East', 'Southeast']);

export const defaultAppearance = Object.freeze({
  body: 'humanoid', lineageId: null, hair: 'short', clothing: 'coat', equipment: null,
  skinColor: '#ba805f', hairColor: '#302429', clothingColor: '#77373d',
  animalFormId: null, disguise: null,
});

// Appearance fields are display-only. The renderer resolves layers in this order.
export function appearanceLayers(descriptor) {
  const appearance = { ...defaultAppearance, ...descriptor, ...descriptor.disguise };
  if (appearance.animalFormId) return [{ kind: 'animal', id: appearance.animalFormId }];
  return [
    { kind: 'body', id: appearance.body, color: appearance.skinColor, lineageId: appearance.lineageId },
    { kind: 'hair', id: appearance.hair, color: appearance.hairColor },
    { kind: 'clothing', id: appearance.clothing, color: appearance.clothingColor },
    { kind: 'equipment', id: appearance.equipment },
  ].filter(layer => layer.id);
}

export function buildAppearance(three) {
  const scene = new three.Scene();
  const camera = new three.OrthographicCamera(-2, 2, 2, -2, 0.1, 30);
  camera.position.set(4, 3.84, 4);
  camera.lookAt(0, 1.45, 0);
  const { mesh, material, box } = sceneGeometry(three);
  scene.add(new three.HemisphereLight(0xd4edff, 0xbf845d, 2));
  const light = new three.DirectionalLight(0xffce9a, 2);
  light.position.set(3, 5, 1);
  scene.add(light);
  mesh(scene, new three.CylinderGeometry(0.95, 1.02, 0.14, 8), material(0x52403e), 0, -0.07, 0);
  const figure = new three.Group();
  scene.add(figure);
  const skin = material('#ba805f'), coat = material('#77373d'), hair = material('#302429');
  const boot = material(0x2b2930);
  const humanoid = new three.Group(), animal = new three.Group();
  figure.add(humanoid, animal);
  for (const side of [-1, 1]) {
    box(humanoid, coat, side * 0.4, 1.47, 0, 0.18, 0.62, 0.24);
    box(humanoid, skin, side * 0.41, 1.08, 0.02, 0.17, 0.2, 0.21);
    box(humanoid, boot, side * 0.146, 0.51, 0, 0.24, 0.87, 0.27);
    box(humanoid, boot, side * 0.146, 0.11, 0.06, 0.25, 0.22, 0.37);
  }
  mesh(humanoid, new three.CylinderGeometry(0.32, 0.43, 0.94, 6), coat, 0, 1.36, 0);
  box(humanoid, boot, 0, 1.17, 0.01, 0.64, 0.12, 0.65);
  box(humanoid, material(0xc88d48), 0, 1.17, 0.33, 0.12, 0.12, 0.06);
  mesh(humanoid, new three.IcosahedronGeometry(0.31, 1), skin, 0, 2.04, 0);
  box(humanoid, skin, 0, 2.005, 0.285, 0.09, 0.1, 0.1);
  mesh(humanoid, new three.SphereGeometry(0.324, 10, 5, 0, Math.PI * 2, 0, Math.PI * 0.53),
    hair, 0, 2.09, 0);
  const gear = box(humanoid, boot, 0.36, 0.94, 0.12, 0.084, 0.54, 0.13);
  gear.rotation.z = -0.21;

  box(animal, coat, 0, 0.49, 0, 0.43, 0.42, 0.82);
  box(animal, coat, 0, 0.67, 0.46, 0.32, 0.32, 0.33);
  box(animal, boot, 0, 0.58, 0.67, 0.25, 0.16, 0.21);
  for (const x of [-0.14, 0.14]) {
    for (const z of [-0.28, 0.28]) box(animal, boot, x, 0.22, z, 0.1, 0.44, 0.12);
    mesh(animal, new three.ConeGeometry(0.08, 0.24, 3), coat, x, 0.9, 0.44);
  }
  box(animal, coat, 0, 0.55, -0.6, 0.13, 0.15, 0.45).rotation.x = 0.28;

  return {
    scene, camera,
    resize(aspect) {
      const width = Math.max(1.36, 1.62 * aspect);
      const height = width / Math.max(0.1, aspect);
      Object.assign(camera, { left: -width, right: width, top: height, bottom: -height });
      camera.updateProjectionMatrix();
    },
    update({ appearance, facing }) {
      const layers = appearanceLayers(appearance);
      animal.visible = layers[0]?.kind === 'animal';
      humanoid.visible = !animal.visible;
      figure.rotation.y = Math.PI / 4 - Math.max(0, facings.indexOf(facing)) * Math.PI / 4;
      for (const layer of layers) {
        if (layer.kind === 'body') skin.color.set(layer.color);
        if (layer.kind === 'hair') hair.color.set(layer.color);
        if (layer.kind === 'clothing') coat.color.set(layer.color);
      }
      gear.visible = layers.some(layer => layer.kind === 'equipment');
    },
  };
}
