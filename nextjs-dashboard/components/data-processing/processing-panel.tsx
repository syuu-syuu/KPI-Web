'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { processOriginalData, calculateAvailabilities } from '@/lib/api';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FileUpload } from './file-upload';

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  action: (site_id: string) => Promise<any>;
  status: 'idle' | 'processing' | 'completed' | 'error';
}

interface DataProcessingPanelProps {
  site_id: string;
}

export function DataProcessingPanel({ site_id }: DataProcessingPanelProps) {
  const { toast } = useToast();
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'completed' | 'error'
  >('idle');
  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: 'process',
      title: 'Process Raw Data',
      description: 'Process and validate the raw data',
      action: processOriginalData,
      status: 'idle',
    },
    {
      id: 'calculate',
      title: 'Calculate Availabilities',
      description: 'Calculate daily, monthly, and cumulative availabilities',
      action: calculateAvailabilities,
      status: 'idle',
    },
  ]);

  const updateStepStatus = (
    stepId: string,
    status: ProcessingStep['status'],
  ) => {
    setSteps((currentSteps) =>
      currentSteps.map((step) =>
        step.id === stepId ? { ...step, status } : step,
      ),
    );
  };

  const handleProcessStep = async (step: ProcessingStep) => {
    if (uploadStatus !== 'completed') {
      toast({
        title: 'Error',
        description: 'Please upload and process the data file first',
        variant: 'destructive',
      });
      return;
    }

    updateStepStatus(step.id, 'processing');

    try {
      await step.action(site_id);
      updateStepStatus(step.id, 'completed');
      toast({
        title: 'Success',
        description: `${step.title} completed successfully`,
      });
    } catch (error) {
      updateStepStatus(step.id, 'error');
      toast({
        title: 'Error',
        description: `Failed to ${step.title.toLowerCase()}`,
        variant: 'destructive',
      });
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
      case 'uploading':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Processing Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Section */}
        <div className="flex flex-col space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <StatusIcon status={uploadStatus} />
              <div>
                <h4 className="font-semibold">Upload Data File</h4>
                <p className="text-sm text-muted-foreground">
                  Upload the raw data file for processing
                </p>
              </div>
            </div>
          </div>
          <FileUpload site_id={site_id} onStatusChange={setUploadStatus} />
        </div>

        {/* Processing Steps */}
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col space-y-4 rounded-lg border p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <StatusIcon status={step.status} />
                <div>
                  <h4 className="font-semibold">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handleProcessStep(step)}
                disabled={
                  step.status === 'processing' ||
                  uploadStatus !== 'completed' ||
                  (index > 0 && steps[index - 1].status !== 'completed')
                }
              >
                {step.status === 'processing' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Run'
                )}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
