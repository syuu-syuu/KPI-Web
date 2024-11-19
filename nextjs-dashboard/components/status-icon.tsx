import { CheckCircle2, AlertTriangle, AlertCircle, CircleSlash } from 'lucide-react';
import { DataStatus, STATUS_DEFINITIONS } from '@/lib/definitions';

import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StatusIconProps {
  status: DataStatus;
  className?: string;
  showTooltip?: boolean;
}

export const StatusIcon = ({
  status,
  className = "",
  showTooltip = false,
}: StatusIconProps) => {
  const icon = (() => {
    switch (status) {
      case "A":
        return (
          <CheckCircle2 className={cn("h-5 w-5 text-green-500", className)} />
        );
      case "B":
        return (
          <AlertTriangle className={cn("h-5 w-5 text-yellow-500", className)} />
        );
      case "C":
        return (
          <AlertCircle className={cn("h-5 w-5 text-red-500", className)} />
        );
      case "D":
        return (
          <CircleSlash className={cn("h-5 w-5 text-gray-500", className)} />
        );
      default:
        return null;
    }
  })();

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>{icon}</TooltipTrigger>
          <TooltipContent>
            <p>{STATUS_DEFINITIONS[status]?.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Return only the icon if showTooltip is disabled
  return icon;

};