import { ControllerRenderProps } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";

interface CaptchaProps {
  captchaText: string;
  onRefresh: () => void;
  field: ControllerRenderProps<any, "captcha">;
}

export function Captcha({ captchaText, onRefresh, field }: CaptchaProps) {
  return (
    <div className="space-y-2">
      <FormLabel>Verification</FormLabel>
      <div className="border border-neutral-300 rounded-md p-4 bg-neutral-100">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-neutral-700">Enter the code below</p>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={onRefresh}
            className="h-8 px-2 text-primary hover:text-primary/80"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <div 
            className="bg-white px-4 py-2 rounded border border-neutral-300 text-lg font-mono tracking-widest select-none text-neutral-700"
          >
            {captchaText}
          </div>
          <FormControl>
            <Input 
              placeholder="Enter code" 
              className="flex-1" 
              {...field} 
            />
          </FormControl>
        </div>
      </div>
    </div>
  );
}
