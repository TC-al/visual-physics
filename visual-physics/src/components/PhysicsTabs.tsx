
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhysicsForm from "@/components/PhysicsForm";
import ProblemInput from "@/components/ProblemInput";
import { PhysicsParams } from "../utils/physics";

interface PhysicsTabsProps {
    onSubmit: (params: PhysicsParams) => void;
    defaultParams: PhysicsParams;
}

const PhysicsTabs = ({ onSubmit, defaultParams }: PhysicsTabsProps) => {
    const [params, setParams] = useState<PhysicsParams>(defaultParams);

    const handleExtractParams = (extractedParams: Partial<PhysicsParams>) => {
        const updatedParams = { ...params, ...extractedParams };
        setParams(updatedParams);
        onSubmit(updatedParams);
    };

    return (
        <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="manual">Manual Input</TabsTrigger>
                <TabsTrigger value="problem">Problem Text</TabsTrigger>
            </TabsList>
            <TabsContent value="manual" className="py-4">
                <PhysicsForm onSubmit={onSubmit} />
            </TabsContent>
            <TabsContent value="problem" className="py-4">
                <ProblemInput onExtract={handleExtractParams} />
            </TabsContent>
        </Tabs>
    );
};

export default PhysicsTabs;
