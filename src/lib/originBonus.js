import { validatePointBuyAllocation } from './pointBuy.js';

/** Apply only the catalog attribute bonus to a legal pre-origin allocation.
 * No final-score cap, passives, drawbacks, reputation or training effects.
 */
export function applyOriginBonus(attributes, originId, blueprint) {
  validatePointBuyAllocation(attributes);
  const origins = blueprint?.catalogs?.origins;
  if (!Array.isArray(origins)) throw new TypeError('Origin catalog is unavailable');
  const origin = typeof originId === 'string' && origins.find((entry) => entry.id === originId);
  if (!origin) throw new RangeError('Unknown origin identifier');
  const match = typeof origin.bonus === 'string' && origin.bonus.match(/^([+-]?\d+)\s+(Might|Agility|Wit|Spirit|Resolve|Instinct)$/i);
  if (!match || !Number.isSafeInteger(Number(match[1]))) {
    throw new TypeError('Unsupported origin attribute bonus');
  }
  const key = match[2].toLowerCase();
  return { ...attributes, [key]: attributes[key] + Number(match[1]) };
}
