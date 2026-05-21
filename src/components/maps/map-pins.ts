/** Map pin icons for Leaflet `divIcon` (vendor + search centre). */

const RING = "#fafaf9";
const PATH =
  "M16 3c-5 0-9 4-9 9.25 0 3.85 9 13.75 9 13.75s9-9.9 9-13.75C25 7 21 3 16 3z";

function makePin(w: number, h: number, fill: string, stroke: number, shadow: string) {
  return {
    iconSize: [w, h] as [number, number],
    iconAnchor: [w / 2, h] as [number, number],
    html: `<div style="width:${w}px;height:${h}px;line-height:0;filter:${shadow}"><svg width="${w}" height="${h}" viewBox="0 0 32 28" aria-hidden="true"><path d="${PATH}" fill="${fill}" stroke="${RING}" stroke-width="${stroke}" stroke-linejoin="round"/><circle cx="16" cy="10.5" r="2.75" fill="${RING}"/></svg></div>`,
  };
}

export const vendorPin = makePin(
  30,
  26,
  "#57534e",
  1.5,
  "drop-shadow(0 1px 3px rgba(28,25,23,0.18))",
);

export const userPin = makePin(
  34,
  30,
  "#2563eb",
  1.75,
  "drop-shadow(0 2px 5px rgba(37,99,235,0.28))",
);
