"use client";

import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon, DollarSign } from "lucide-react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FinancialInfoSectionProps {
  form: UseFormReturn<any>;
}

export function FinancialInfoSection({ form }: FinancialInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold">Financial Information</h3>
        <span className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">Optional</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Purchase Date */}
        <FormField
          control={form.control}
          name="financialInfo.purchaseDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase Date</FormLabel>
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
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Purchase Price */}
        <FormField
          control={form.control}
          name="financialInfo.purchasePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase Price ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="25000" 
                  step="0.01"
                  min="0"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Current Value */}
        <FormField
          control={form.control}
          name="financialInfo.currentValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Value ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="22000" 
                  step="0.01"
                  min="0"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Monthly Payment */}
        <FormField
          control={form.control}
          name="financialInfo.monthlyPayment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Payment ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="450" 
                  step="0.01"
                  min="0"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Interest Rate */}
        <FormField
          control={form.control}
          name="financialInfo.interestRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interest Rate (%)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="5.5" 
                  step="0.01"
                  min="0"
                  max="100"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Loan Term */}
        <FormField
          control={form.control}
          name="financialInfo.loanTermMonths"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Term (months)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="60" 
                  min="1"
                  max="360"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Finance Company */}
        <FormField
          control={form.control}
          name="financialInfo.financeCompany"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Finance Company</FormLabel>
              <FormControl>
                <Input placeholder="ABC Auto Finance" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Down Payment */}
        <FormField
          control={form.control}
          name="financialInfo.downPayment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Down Payment ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="5000" 
                  step="0.01"
                  min="0"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Loan Start Date */}
        <FormField
          control={form.control}
          name="financialInfo.loanStartDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Start Date</FormLabel>
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
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* First Payment Due */}
        <FormField
          control={form.control}
          name="financialInfo.firstPaymentDue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Payment Due</FormLabel>
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

        {/* Final Payment Due */}
        <FormField
          control={form.control}
          name="financialInfo.finalPaymentDue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Final Payment Due</FormLabel>
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

        {/* Remaining Balance */}
        <FormField
          control={form.control}
          name="financialInfo.remainingBalance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remaining Balance ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="18500" 
                  step="0.01"
                  min="0"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Loan Account Number */}
        <FormField
          control={form.control}
          name="financialInfo.loanAccountNumber"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Loan Account Number</FormLabel>
              <FormControl>
                <Input placeholder="123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Finance Company Phone */}
        <FormField
          control={form.control}
          name="financialInfo.financeCompanyPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Finance Company Phone</FormLabel>
              <FormControl>
                <Input placeholder="(555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Finance Company Contact */}
        <FormField
          control={form.control}
          name="financialInfo.financeCompanyContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Finance Company Contact</FormLabel>
              <FormControl>
                <Input placeholder="John Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
