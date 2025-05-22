
import { useState } from "react";
import { PhysicsParams } from ",,/utils/physics";

interface ProblemInputProps {
    onExtract: (params: Partial<PhysicsParams>) => void;
}

const ProblemInput = ({ onExtract }: ProblemInputProps) => {
    const [problemText, setProblemText] = useState("");

    const extractParameters = () => {
        // This is a simplified parameter extraction that looks for key values in the text
        // A more robust solution would use NLP or a more sophisticated parsing approach
        let params: Partial<PhysicsParams> = {};

        // Check for velocity values
        const velocityMatch = problemText.match(/(\d+(?:\.\d+)?)\s*(?:m\/s|meters per second|meter\/s)/i);
        if (velocityMatch) {
            params.initialVelocity = parseFloat(velocityMatch[1]);
        }

        // Check for angle values
        const angleMatch = problemText.match(/(\d+(?:\.\d+)?)\s*(?:degrees|°)/i);
        if (angleMatch) {
            params.angle = parseFloat(angleMatch[1]);
        }

        // Check for height values
        const heightMatch = problemText.match(/(\d+(?:\.\d+)?)\s*(?:m|meters) (?:high|height|tall)/i);
        if (heightMatch) {
            params.initialHeight = parseFloat(heightMatch[1]);
        }

        // Determine simulation type
        if (
            problemText.toLowerCase().includes("projectile") ||
            problemText.toLowerCase().includes("launch") ||
            problemText.toLowerCase().includes("throw") ||
            problemText.toLowerCase().includes("angle")
        ) {
            params.simulationType = "projectile";
        } else if (
            problemText.toLowerCase().includes("drop") ||
            problemText.toLowerCase().includes("fall") ||
            problemText.toLowerCase().includes("free fall")
        ) {
            params.simulationType = "free-fall";
        }

        // Check if we found enough parameters
        const paramCount = Object.keys(params).length;
        if (paramCount === 0) {
            return;
        }

        onExtract(params);
    };

    return (
        <div className="space-y-4">
            <textarea
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                placeholder="Enter a physics problem here. For example: 'A ball is thrown at 15 m/s at an angle of 30 degrees from a height of 2 meters.'"
                className="min-h-[100px]"
            />
            <button onClick={extractParameters} className="w-full">
                Extract Parameters
            </button>
        </div>
    );
};

export default ProblemInput;