/** Helpers for drawing scatterplots with a target correlation. */

/** small seeded RNG so plots are stable between renders */
export function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return ((s >>> 0) % 1_000_000) / 1_000_000
  }
}

function normal(r: () => number) {
  const u = Math.max(r(), 1e-9)
  const v = r()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

/** standard-normal pairs (x, e) to be mixed into any correlation */
export function noise(n: number, seed: number) {
  const r = rng(seed)
  return Array.from({ length: n }, () => [normal(r), normal(r)] as const)
}

/** points in [0,1]² whose correlation is close to `rho` */
export function scatter(base: readonly (readonly [number, number])[], rho: number) {
  const k = Math.sqrt(Math.max(0, 1 - rho * rho))
  const pts = base.map(([x, e]) => [x, rho * x + k * e] as const)
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  const [x0, x1] = [Math.min(...xs), Math.max(...xs)]
  const [y0, y1] = [Math.min(...ys), Math.max(...ys)]
  return pts.map(([x, y]) => [(x - x0) / (x1 - x0 || 1), (y - y0) / (y1 - y0 || 1)] as const)
}
