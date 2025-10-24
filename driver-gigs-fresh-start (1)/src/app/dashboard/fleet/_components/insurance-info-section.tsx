"use client";

import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Shield, Phone, User, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface InsuranceInfoSectionProps {
  form: UseFormReturn<any>;
}

const insuranceTypes = [
  "Liability Only",
  "Full Coverage",
  "Commercial",
  "Personal",
  "Comprehensive",
  "Collision",
  "Other"
];

const billingFrequencies = [
  "Monthly",
  "Quarterly", 
  "Semi-Annual",
  "Annual"
];

const coverageStatuses = [
  "ACTIVE",
  "REJECTED BY INSURED",
  "DECLINED",
  "PENDING"
];

export function InsuranceInfoSection({ form }: InsuranceInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">🛡️ Insurance Information</h3>
        <span className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">Optional</span>
      </div>

      {/* Basic Insurance Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Insurance Company Name */}
        <FormField
          control={form.control}
          name="insuranceInfo.companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insurance Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter insurance company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Insurance Type */}
        <FormField
          control={form.control}
          name="insuranceInfo.insuranceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insurance Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select insurance type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {insuranceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Monthly Premium */}
        <FormField
          control={form.control}
          name="insuranceInfo.monthlyPremium"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Premium ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="71.00" 
                  step="0.01"
                  min="0"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Premium Due Date */}
        <FormField
          control={form.control}
          name="insuranceInfo.premiumDueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Premium Due Date</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select billing frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {billingFrequencies.map((frequency) => (
                    <SelectItem key={frequency} value={frequency}>
                      {frequency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Insurance Start Date */}
        <FormField
          control={form.control}
          name="insuranceInfo.startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Insurance Start Date
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>dd/mm/yyyy</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Insurance Expiration Date */}
        <FormField
          control={form.control}
          name="insuranceInfo.expirationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Insurance Expiration Date
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>dd/mm/yyyy</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Total Coverage Amount */}
        <FormField
          control={form.control}
          name="insuranceInfo.totalCoverageAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Coverage Amount ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="30000" 
                  min="0"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Insurance Phone Number */}
        <FormField
          control={form.control}
          name="insuranceInfo.phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insurance Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="(555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Representative Name */}
        <FormField
          control={form.control}
          name="insuranceInfo.representativeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Representative Name</FormLabel>
              <FormControl>
                <Input placeholder="Representative name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Policy Number */}
        <FormField
          control={form.control}
          name="insuranceInfo.policyNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Policy Number</FormLabel>
              <FormControl>
                <Input placeholder="Policy number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      {/* Detailed Coverage Information */}
      <div className="space-y-6">
        <h4 className="text-md font-semibold">Detailed Coverage Information</h4>

        {/* Bodily Injury */}
        <div className="space-y-4">
          <h5 className="font-medium">Bodily Injury</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="insuranceInfo.bodilyInjury.coverageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coverage Limit</FormLabel>
                  <FormControl>
                    <Input placeholder="30000/person 60000/accident" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="insuranceInfo.bodilyInjury.premium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Premium ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="395.00" 
                      step="0.01"
                      min="0"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="insuranceInfo.bodilyInjury.deductible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deductible ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      step="0.01"
                      min="0"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Property Damage */}
        <div className="space-y-4">
          <h5 className="font-medium">Property Damage</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="insuranceInfo.propertyDamage.coverageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coverage Limit</FormLabel>
                  <FormControl>
                    <Input placeholder="25000/accident" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="insuranceInfo.propertyDamage.premium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Premium ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="256.00" 
                      step="0.01"
                      min="0"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="insuranceInfo.propertyDamage.deductible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deductible ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      step="0.01"
                      min="0"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Personal Injury Protection (PIP) */}
        <div className="space-y-4">
          <h5 className="font-medium">Personal Injury Protection (PIP)</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="insuranceInfo.pip.status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="REJECTED BY INSURED" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {coverageStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="insuranceInfo.pip.coverageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coverage Limit</FormLabel>
                  <FormControl>
                    <Input placeholder="N/A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="insuranceInfo.pip.premium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Premium ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      step="0.01"
                      min="0"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="insuranceInfo.pip.deductible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deductible ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      step="0.01"
                      min="0"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Additional Coverage Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="insuranceInfo.accidentalDeathBenefit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accidental Death Benefit ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="1000" 
                    min="0"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="insuranceInfo.fullTermPremium"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Term Premium ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="65.00" 
                    step="0.01"
                    min="0"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
