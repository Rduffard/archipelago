import { FALLBACK_ATTRIBUTES } from './archipelagoSystemBlueprint'
export function getAttributeDetails(blueprint) {
  return Object.fromEntries(FALLBACK_ATTRIBUTES.map((entry) => [entry.key,
    blueprint?.display?.attributes?.[entry.key]?.description ?? entry.description]))
}
