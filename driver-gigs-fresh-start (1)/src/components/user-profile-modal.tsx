"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";

// Form validation schema
const profileSchema = z.object({
  dateOfBirth: z.string().optional(),
  primaryGoal: z.string().min(1, "Please select your primary goal"),
  targetIncome: z.string().min(1, "Please select your target income"),
  interestedIndustries: z.array(z.string()).min(1, "Please select at least one industry"),
  availableVehicles: z.array(z.string()).min(1, "Please select at least one vehicle type"),
  travelDistance: z.string().min(1, "Please select your travel preference"),
  additionalInfo: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INDUSTRY_OPTIONS = [
  { value: "food", label: "🍔 Food", emoji: "🍔" },
  { value: "package-delivery", label: "📦 Package Delivery", emoji: "📦" },
  { value: "rideshare", label: "🚗 Rideshare", emoji: "🚗" },
  { value: "freight", label: "🚛 Freight", emoji: "🚛" },
  { value: "medical", label: "🏥 Medical", emoji: "🏥" },
  { value: "cannabis-delivery", label: "🌿 Cannabis Delivery", emoji: "🌿" },
  { value: "pet-transport", label: "🐕 Pet Transport", emoji: "🐕" },
  { value: "child-transport", label: "👶 Child Transport", emoji: "👶" },
  { value: "senior-services", label: "👴 Senior Services", emoji: "👴" },
  { value: "air-transport", label: "✈️ Air Transport", emoji: "✈️" },
  { value: "vehicle-transport", label: "🚙 Vehicle Transport", emoji: "🚙" },
  { value: "luggage-delivery", label: "🧳 Luggage Delivery", emoji: "🧳" },
  { value: "other", label: "🔧 Other", emoji: "🔧" },
];

const VEHICLE_OPTIONS = [
  { value: "car", label: "🚗 Car (includes Car, Sedan, Prius, EV, Hybrid)", emoji: "🚗" },
  { value: "suv", label: "🚙 SUV (includes SUV, Luxury SUV)", emoji: "🚙" },
  { value: "van", label: "🚐 Van (includes Van, Cargo Van, Minivan, Sprinter Van, Shuttle)", emoji: "🚐" },
  { value: "truck", label: "🚛 Truck (includes Truck, Pickup Truck, Box Truck, Tractor-Trailer)", emoji: "🚛" },
  { value: "bike", label: "🚲 Bike (includes Bike, Bicycle, Scooter)", emoji: "🚲" },
  { value: "other", label: "🛻 Other (includes everything else)", emoji: "🛻" },
];

export default function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { profile: user, isLoading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      dateOfBirth: "",
      primaryGoal: "",
      targetIncome: "",
      interestedIndustries: [],
      availableVehicles: [],
      travelDistance: "",
      additionalInfo: "",
    },
  });

  // Prefill form when user data is available
  React.useEffect(() => {
    if (user && isOpen) {
      form.reset({
        dateOfBirth: user.jobPreferences?.dateOfBirth ? 
          new Date(user.jobPreferences.dateOfBirth).toISOString().split('T')[0] : "",
        primaryGoal: user.jobPreferences?.primaryGoal || "",
        targetIncome: user.jobPreferences?.targetIncome || "",
        interestedIndustries: user.jobPreferences?.interestedIndustries || [],
        availableVehicles: user.jobPreferences?.availableVehicles || [],
        travelDistance: user.jobPreferences?.travelDistance || "",
        additionalInfo: user.jobPreferences?.additionalInfo || "",
      });
    }
  }, [user, isOpen, form]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/user/job-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile data...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job Preferences</DialogTitle>
          <DialogDescription>
            Update your job preferences and goals to get better recommendations.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Goals & Objectives */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Goals & Objectives</h3>
              
              <FormField
                control={form.control}
                name="primaryGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What's your primary goal with gig work?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your primary goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-time-income">Full-time income replacement</SelectItem>
                        <SelectItem value="part-time-supplemental">Part-time supplemental income</SelectItem>
                        <SelectItem value="flexible-schedule">Flexible schedule control</SelectItem>
                        <SelectItem value="experience-industries">Experience different industries</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What's your target monthly income from gig work?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your target income" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="500-1500">$500 - $1,500/month</SelectItem>
                        <SelectItem value="1500-3000">$1,500 - $3,000/month</SelectItem>
                        <SelectItem value="3000-5000">$3,000 - $5,000/month</SelectItem>
                        <SelectItem value="5000-plus">$5,000+/month</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Industries */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Which industries interest you most?</h3>
              <FormField
                control={form.control}
                name="interestedIndustries"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 gap-3">
                      {INDUSTRY_OPTIONS.map((industry) => (
                        <FormField
                          key={industry.value}
                          control={form.control}
                          name="interestedIndustries"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={industry.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(industry.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, industry.value])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== industry.value
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {industry.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Vehicle Types */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What vehicle types do you have available for gig work?</h3>
              <FormField
                control={form.control}
                name="availableVehicles"
                render={() => (
                  <FormItem>
                    <div className="space-y-3">
                      {VEHICLE_OPTIONS.map((vehicle) => (
                        <FormField
                          key={vehicle.value}
                          control={form.control}
                          name="availableVehicles"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={vehicle.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(vehicle.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, vehicle.value])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== vehicle.value
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {vehicle.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Travel Distance */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="travelDistance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How far are you willing to travel for gig work?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your travel preference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="local">Local only (within 15 miles)</SelectItem>
                        <SelectItem value="regional">Regional (15-50 miles)</SelectItem>
                        <SelectItem value="long-distance">Long distance (50+ miles)</SelectItem>
                        <SelectItem value="flexible">Flexible/Variable distance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us anything else that might help us provide better recommendations..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
