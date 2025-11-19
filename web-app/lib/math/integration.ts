/**
 * Numerical integration using Simpson's 1/3 rule.
 * @param func The function to integrate
 * @param a Lower limit
 * @param b Upper limit
 * @param n Number of intervals (must be even, defaults to 100)
 */
export function integrate(
    func: (x: number) => number,
    a: number,
    b: number,
    n: number = 100
): number {
    if (n % 2 !== 0) n++; // Ensure n is even
    const h = (b - a) / n;
    let sum = func(a) + func(b);

    for (let i = 1; i < n; i++) {
        const x = a + i * h;
        sum += (i % 2 === 0 ? 2 : 4) * func(x);
    }

    return (sum * h) / 3;
}

/**
 * Safe integration wrapper that handles potential errors (though less likely in TS than Python's quad)
 */
export function safeIntegrate(
    func: (x: number) => number,
    a: number,
    b: number
): number {
    try {
        return integrate(func, a, b);
    } catch (e) {
        console.error("Integration error:", e);
        return 0.0;
    }
}
