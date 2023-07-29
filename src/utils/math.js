export function clamp01(a) {
    return Math.max(0, Math.min(a, 1))
}

export function lerp(a, b, t) {
    t = clamp01(t)
    return (1 - t) * a + t * b
}