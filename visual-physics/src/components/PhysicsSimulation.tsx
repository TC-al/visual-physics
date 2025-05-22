import { useEffect, useRef } from "react";
import { PhysicsResults } from "../app/utils/physics";

interface PhysicsSimulationProps {
    results: PhysicsResults | null;
    simulationType: 'projectile' | 'free-fall';
}

const PhysicsSimulation = ({ results, simulationType }: PhysicsSimulationProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        if (!canvasRef.current || !results) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Canvas dimensions
        const width = canvas.width;
        const height = canvas.height;

        // Scale factors to fit the trajectory in the canvas
        const padding = 40;
        const xMax = results.distance * 1.1; // Add 10% margin
        const yMax = results.maxHeight * 1.1; // Add 10% margin

        const scaleX = (width - 2 * padding) / xMax;
        const scaleY = (height - 2 * padding) / yMax;

        // Convert coordinates to canvas space
        const toCanvasX = (x: number) => padding + x * scaleX;
        const toCanvasY = (y: number) => height - (padding + y * scaleY);

        // Clear previous animation if any
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        let startTime: number | null = null;
        const totalDuration = 2000; // Animation will run for 2 seconds

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / totalDuration, 1);

            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Draw grid
            ctx.strokeStyle = '#e5e7eb';
            ctx.lineWidth = 0.5;

            // Vertical grid lines
            const xStep = width / 10;
            for (let x = padding; x < width - padding; x += xStep) {
                ctx.beginPath();
                ctx.moveTo(x, padding);
                ctx.lineTo(x, height - padding);
                ctx.stroke();
            }

            // Horizontal grid lines
            const yStep = height / 10;
            for (let y = padding; y < height - padding; y += yStep) {
                ctx.beginPath();
                ctx.moveTo(padding, y);
                ctx.lineTo(width - padding, y);
                ctx.stroke();
            }

            // Draw axes
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1.5;
            ctx.beginPath();

            // X-axis
            ctx.moveTo(padding, height - padding);
            ctx.lineTo(width - padding, height - padding);

            // Y-axis
            ctx.moveTo(padding, height - padding);
            ctx.lineTo(padding, padding);

            ctx.stroke();

            // Draw axes labels
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.fillText('Distance (m)', width / 2, height - 10);
            ctx.save();
            ctx.translate(15, height / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText('Height (m)', 0, 0);
            ctx.restore();

            // Draw ground
            ctx.strokeStyle = '#6b7280';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(padding, toCanvasY(0));
            ctx.lineTo(width - padding, toCanvasY(0));
            ctx.stroke();

            // Calculate points to display based on animation progress
            const pointsToShow = Math.floor(results.trajectory.length * progress);

            // Draw trajectory path
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.beginPath();

            for (let i = 0; i < pointsToShow; i++) {
                const point = results.trajectory[i];
                const x = toCanvasX(point.x);
                const y = toCanvasY(point.y);

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            // Draw the projectile at current position
            if (pointsToShow > 0) {
                const currentPoint = results.trajectory[pointsToShow - 1];
                const projX = toCanvasX(currentPoint.x);
                const projY = toCanvasY(currentPoint.y);

                ctx.fillStyle = '#1e3a8a';
                ctx.beginPath();
                ctx.arc(projX, projY, 6, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw time indicator
            if (pointsToShow > 0) {
                const currentPoint = results.trajectory[pointsToShow - 1];
                ctx.fillStyle = '#000';
                ctx.font = '14px Arial';
                ctx.fillText(`Time: ${currentPoint.time.toFixed(1)} s`, width - 120, 20);
            }

            // Continue animation if not complete
            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        // Start animation
        animationRef.current = requestAnimationFrame(animate);

        // Cleanup function
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [results, simulationType]);

    if (!results) {
        return (
            <div className="h-[400px] flex items-center justify-center bg-gray-50 border rounded-lg">
                <p className="text-gray-500">Enter parameters and run the simulation to see results</p>
            </div>
        );
    }

    return (
        <div className="relative">
            <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full h-auto bg-white border rounded-lg shadow-sm"
            />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-md shadow-sm border">
                    <h3 className="text-sm font-medium text-gray-500">Max Height</h3>
                    <p className="text-xl font-semibold">{results.maxHeight.toFixed(2)} m</p>
                </div>
                <div className="bg-white p-4 rounded-md shadow-sm border">
                    <h3 className="text-sm font-medium text-gray-500">Distance</h3>
                    <p className="text-xl font-semibold">{results.distance.toFixed(2)} m</p>
                </div>
                <div className="bg-white p-4 rounded-md shadow-sm border">
                    <h3 className="text-sm font-medium text-gray-500">Time of Flight</h3>
                    <p className="text-xl font-semibold">{results.timeOfFlight.toFixed(2)} s</p>
                </div>
            </div>
        </div>
    );
};

export default PhysicsSimulation;