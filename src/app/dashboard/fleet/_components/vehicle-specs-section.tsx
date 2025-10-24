"use client";

import { UseFormReturn } from "react-hook-form";
import { Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface VehicleSpecsSectionProps {
  form: UseFormReturn<any>;
}

export function VehicleSpecsSection({ form }: VehicleSpecsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">Vehicle Specifications</h3>
        <span className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">Optional</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Vehicle Weight */}
        <FormField
          control={form.control}
          name="specifications.vehicleWeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Weight (lbs)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="4500" 
                  min="0"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Exterior Length */}
        <FormField
          control={form.control}
          name="specifications.exteriorLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exterior Length (ft)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="20.5" 
                  step="0.1"
                  min="0"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Exterior Width */}
        <FormField
          control={form.control}
          name="specifications.exteriorWidth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exterior Width (ft)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="8.0" 
                  step="0.1"
                  min="0"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Exterior Height */}
        <FormField
          control={form.control}
          name="specifications.exteriorHeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exterior Height (ft)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="6.5" 
                  step="0.1"
                  min="0"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cargo Length */}
        <FormField
          control={form.control}
          name="specifications.cargoLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo Length (ft)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="15.0" 
                  step="0.1"
                  min="0"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cargo Width */}
        <FormField
          control={form.control}
          name="specifications.cargoWidth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo Width (ft)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="7.5" 
                  step="0.1"
                  min="0"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cargo Height */}
        <FormField
          control={form.control}
          name="specifications.cargoHeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo Height (ft)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="6.0" 
                  step="0.1"
                  min="0"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cargo Volume */}
        <FormField
          control={form.control}
          name="specifications.cargoVolume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo Volume (cu ft)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="675" 
                  step="0.1"
                  min="0"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payload Capacity */}
        <FormField
          control={form.control}
          name="specifications.payloadCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payload Capacity (lbs)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="3000" 
                  min="0"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Towing Capacity */}
        <FormField
          control={form.control}
          name="specifications.towingCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Towing Capacity (lbs)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="7500" 
                  min="0"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Engine Type */}
        <FormField
          control={form.control}
          name="specifications.engineType"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Engine Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g., V6 3.5L Turbo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Transmission */}
        <FormField
          control={form.control}
          name="specifications.transmission"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Transmission</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 10-Speed Automatic" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
