"use client";

import { Button } from "@/components/ui/button";
import { Phone, Copy } from "lucide-react";
import { toast } from "sonner";

export function ConsultationCTA() {
  const handleCopyPhone = () => {
    navigator.clipboard.writeText("(214) 929-1522");
    toast.success("Phone number copied!");
  };

  return (
    <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-100/50 dark:border-green-800/30 shadow-sm backdrop-blur-sm p-6">
      
      {/* Header */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Quick Actions</h3>
        <p className="text-xs text-muted-foreground">Get started with our services</p>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 bg-white/60 dark:bg-gray-800/40 border-white/80 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/60"
          >
            Free Consultation
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 bg-white/60 dark:bg-gray-800/40 border-white/80 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/60"
          >
            Money For You
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 bg-white/60 dark:bg-gray-800/40 border-white/80 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/60"
          >
            Driver Education
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 bg-white/60 dark:bg-gray-800/40 border-white/80 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/60"
          >
            Referral Program
          </Button>
        </div>
      </div>

      {/* Consultation Info */}
      <div className="bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-900/40 dark:to-emerald-900/40 rounded-lg p-4 border border-green-200/50 dark:border-green-700/30">
        <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
          Schedule Your Free Consultation
        </h4>
        <p className="text-xs text-green-700 dark:text-green-300 mb-3">
          Get expert guidance from our team
        </p>
        
        <div className="flex items-center gap-2 mb-2">
          <Phone className="size-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-bold text-green-800 dark:text-green-200">
            (214) 929-1522
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-green-200 dark:hover:bg-green-800/50"
            onClick={handleCopyPhone}
          >
            <Copy className="size-3" />
          </Button>
        </div>
        
        <p className="text-xs text-green-600 dark:text-green-400">
          Available Mon-Fri 9AM-6PM
        </p>
      </div>
    </div>
  );
}
