export function sceneGeometry(three) {
  const material = (color, options) => new three.MeshStandardMaterial({ color, roughness: 0.85, ...options });
  function mesh(parent, geometry, surface, x, y, z) {
    const object = new three.Mesh(geometry, surface);
    object.position.set(x, y, z);
    parent.add(object);
    return object;
  }
  const box = (parent, surface, x, y, z, width, height, depth) =>
    mesh(parent, new three.BoxGeometry(width, height, depth), surface, x, y, z);
  function arch(width, spring, bottom) {
    const shape = new three.Shape();
    shape.moveTo(-width, bottom);
    shape.lineTo(width, bottom);
    shape.lineTo(width, spring);
    shape.absarc(0, spring, width, 0, Math.PI, false);
    shape.closePath();
    return shape;
  }
  return { material, mesh, box, arch };
}
