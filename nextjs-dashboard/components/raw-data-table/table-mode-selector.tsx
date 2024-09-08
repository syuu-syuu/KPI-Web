import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from 'react';


interface TableModeSelectorProps {
    selectedMode: string;
    setSelectedMode: (mode: string) => void;
}

const TableModeSelector = ({ selectedMode, setSelectedMode } : TableModeSelectorProps) => {
  return (
    <RadioGroup value={selectedMode} onValueChange={setSelectedMode} className="flex">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="original" id="original" />
        <Label htmlFor="original">Original</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="auto-processed" id="auto-processed" />
        <Label htmlFor="auto-processed">Auto-Processed</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="expected" id="expected" />
        <Label htmlFor="expected">Expected</Label>
      </div>
    </RadioGroup>
  );
}


export default TableModeSelector;