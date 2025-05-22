"use client"

import React, {useState} from 'react';
import PhysicsSimulation from "../../components/PhysicsSimulation"
import {calculateProjectileMotion, PhysicsParams, PhysicsResults} from "@/app/utils/physics";
import PhysicsTabs from "@/components/PhysicsTabs";

function Button(props: { onSubmit: (params: PhysicsParams) => void, children: ReactNode }) {
  return null;
}

const page = () => {
  const [simulationResults, setSimulationResults] = useState<PhysicsResults | null>(null);
  const [simulationType, setSimulationType] = useState<'projectile' | 'free-fall'>('projectile');

  const defaultParams: PhysicsParams = {
    initialVelocity: 10,
    angle: 45,
    initialHeight: 1,
    gravity: 9.8,
    timeStep: 0.1,
    simulationType: 'projectile'
  };

  const runSimulation = (params: PhysicsParams) => {
    const results = calculateProjectileMotion(params);
    setSimulationResults(results);
    setSimulationType(params.simulationType);
  };
  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Physics Kinematics Simulator</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
                <PhysicsTabs
                    onSubmit={runSimulation}
                    defaultParams={defaultParams}
                />
          </div>

          <div className="lg:col-span-2">
                <PhysicsSimulation
                    results={simulationResults}
                    simulationType={simulationType}
                />
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">About This Simulator</h2>
          <p className="mb-4">
            This physics simulator helps visualize kinematics problems involving projectile motion and free-fall.
            You can either input parameters manually or describe your problem in plain text and let our system extract
            the parameters.
          </p>
          <p>
            The simulation accounts for initial velocity, launch angle, initial height, and gravitational acceleration.
            It calculates and displays the object's trajectory, maximum height, distance traveled, and time of flight.
          </p>
        </div>
      </div>
  );
};

export default page;
