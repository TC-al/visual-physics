import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { PhysicsParams } from "@/utils/physics";

interface PhysicsFormProps {
    onSubmit: (params: PhysicsParams) => void;
}

const PhysicsForm = ({ onSubmit }: PhysicsFormProps) => {
    const [formValues, setFormValues] = useState<PhysicsParams>({
        initialVelocity: 10,
        angle: 45,
        initialHeight: 1,
        gravity: 9.8,
        timeStep: 0.1,
        simulationType: 'projectile'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: parseFloat(value) || 0,
        }));
    };

    const handleSimulationTypeChange = (value: 'projectile' | 'free-fall') => {
        setFormValues((prev) => ({
            ...prev,
            simulationType: value,
            // Reset angle to 0 for free-fall
            angle: value === 'free-fall' ? 0 : prev.angle,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formValues);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-6">
                <RadioGroup
                    defaultValue="projectile"
                    value={formValues.simulationType}
                    onValueChange={(value) => handleSimulationTypeChange(value as 'projectile' | 'free-fall')}
                    className="flex space-x-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="projectile" id="projectile" />
                        <Label htmlFor="projectile">Projectile Motion</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="free-fall" id="free-fall" />
                        <Label htmlFor="free-fall">Free-Fall</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="initialVelocity">Initial Velocity (m/s)</Label>
                    <Input
                        id="initialVelocity"
                        name="initialVelocity"
                        type="number"
                        value={formValues.initialVelocity}
                        onChange={handleChange}
                        min={0}
                        max={100}
                        step={0.1}
                        className="w-full"
                    />
                </div>

                {formValues.simulationType === 'projectile' && (
                    <div className="space-y-2">
                        <Label htmlFor="angle">Angle (degrees)</Label>
                        <Input
                            id="angle"
                            name="angle"
                            type="number"
                            value={formValues.angle}
                            onChange={handleChange}
                            min={0}
                            max={90}
                            step={1}
                            className="w-full"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="initialHeight">Initial Height (m)</Label>
                    <Input
                        id="initialHeight"
                        name="initialHeight"
                        type="number"
                        value={formValues.initialHeight}
                        onChange={handleChange}
                        min={0}
                        max={1000}
                        step={0.1}
                        className="w-full"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="gravity">Gravity (m/s²)</Label>
                    <Input
                        id="gravity"
                        name="gravity"
                        type="number"
                        value={formValues.gravity}
                        onChange={handleChange}
                        min={0.1}
                        max={30}
                        step={0.1}
                        className="w-full"
                        disabled={true} // Usually fixed at 9.8
                    />
                </div>
            </div>

            <Button type="submit" className="w-full">Run Simulation</Button>
        </form>
    );
};

export default PhysicsForm;