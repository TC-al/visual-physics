
export interface PhysicsParams {
    initialVelocity: number; // meters per second
    angle: number; // degrees
    initialHeight: number; // meters
    gravity: number; // m/s^2
    timeStep: number; // seconds
    simulationType: 'projectile' | 'free-fall';
}

export interface PositionPoint {
    x: number;
    y: number;
    time: number;
}

export interface PhysicsResults {
    trajectory: PositionPoint[];
    maxHeight: number;
    distance: number;
    timeOfFlight: number;
}

export const calculateProjectileMotion = (params: PhysicsParams): PhysicsResults => {
    const {
        initialVelocity,
        angle,
        initialHeight,
        gravity,
        timeStep,
        simulationType
    } = params;

    // Convert angle from degrees to radians
    const angleRad = (angle * Math.PI) / 180;

    // Initial velocity components
    const v0x = simulationType === 'projectile' ? initialVelocity * Math.cos(angleRad) : 0;
    const v0y = simulationType === 'projectile' ? initialVelocity * Math.sin(angleRad) : 0;

    // Calculate time of flight
    // For projectile: use quadratic formula to solve when y = 0
    // For free-fall: time to hit the ground from initialHeight
    let timeOfFlight: number;

    if (simulationType === 'projectile') {
        // Quadratic formula: at^2 + bt + c = 0
        // a = -gravity/2
        // b = v0y
        // c = initialHeight
        const a = -gravity / 2;
        const b = v0y;
        const c = initialHeight;

        // Only the positive solution makes sense for our physics
        const discriminant = Math.sqrt(b * b - 4 * a * c);
        timeOfFlight = (-b + discriminant) / (2 * a);

        // If timeOfFlight is negative or NaN, use a default reasonable time
        if (timeOfFlight <= 0 || isNaN(timeOfFlight)) {
            timeOfFlight = Math.abs(2 * v0y / gravity) + Math.sqrt(2 * initialHeight / gravity);
        }
    } else {
        // Free-fall: time = sqrt(2 * height / gravity)
        timeOfFlight = Math.sqrt(2 * initialHeight / gravity);
    }

    // Add a small buffer to ensure visualization is complete
    timeOfFlight *= 1.1;

    // Generate trajectory points
    const trajectory: PositionPoint[] = [];
    let maxHeight = initialHeight;
    let maxDistance = 0;

    for (let t = 0; t <= timeOfFlight; t += timeStep) {
        const x = v0x * t;
        const y = initialHeight + v0y * t - (gravity * t * t) / 2;

        // Stop if the object hits the ground
        if (y < 0) break;

        trajectory.push({ x, y, time: t });

        maxHeight = Math.max(maxHeight, y);
        maxDistance = Math.max(maxDistance, x);
    }

    // Ensure the final point is included (when y = 0)
    const finalTime = simulationType === 'projectile'
        ? timeOfFlight
        : Math.sqrt(2 * initialHeight / gravity);

    const finalX = v0x * finalTime;
    trajectory.push({ x: finalX, y: 0, time: finalTime });
    maxDistance = Math.max(maxDistance, finalX);

    return {
        trajectory,
        maxHeight,
        distance: maxDistance,
        timeOfFlight: finalTime
    };
};
