/** Derive fastest/slowest/average lap statistics in a single pass. */
export function computeLapStats(laps) {
  if (!Array.isArray(laps) || laps.length === 0) {
    return {
      count: 0,
      fastest: null,
      slowest: null,
      average: 0,
      hasComparison: false,
      fastestId: null,
      slowestId: null,
    }
  }

  let fastest = laps[0]
  let slowest = laps[0]
  let total = 0

  for (const lap of laps) {
    total += lap.split
    if (lap.split < fastest.split) fastest = lap
    if (lap.split > slowest.split) slowest = lap
  }

  const hasComparison = laps.length > 1

  return {
    count: laps.length,
    fastest,
    slowest,
    average: total / laps.length,
    hasComparison,
    fastestId: hasComparison ? fastest.id : null,
    slowestId: hasComparison ? slowest.id : null,
  }
}
