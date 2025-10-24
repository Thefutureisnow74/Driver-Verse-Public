"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { BasicInfoSection } from "./basic-info-section";
import { FinancialInfoSection } from "./financial-info-section";
import { VehicleSpecsSection } from "./vehicle-specs-section";
import { InsuranceInfoSection } from "./insurance-info-section";
import { NotesSection } from "./notes-section";

const formSchema = z.object({
  nickname: z.string().min(1, "Vehicle nickname is required"),
  year: z.string().optional(),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  vehicleType: z.string().optional(),
  color: z.string().optional(),
  vin: z.string().optional(),
  licensePlate: z.string().optional(),
  state: z.string().optional(),
  mileage: z.string().optional(),
  fuelType: z.string().optional(),
  mpg: z.string().optional(),
  ownerNames: z.string().optional(),
  purchaseLocation: z.string().optional(),
  
  // Financial Information (nested object)
  financialInfo: z.object({
    purchaseDate: z.date().optional(),
    purchasePrice: z.string().optional(),
    currentValue: z.string().optional(),
    monthlyPayment: z.string().optional(),
    interestRate: z.string().optional(),
    loanTermMonths: z.string().optional(),
    financeCompany: z.string().optional(),
    downPayment: z.string().optional(),
    loanStartDate: z.date().optional(),
    firstPaymentDue: z.date().optional(),
    finalPaymentDue: z.date().optional(),
    remainingBalance: z.string().optional(),
    loanAccountNumber: z.string().optional(),
    financeCompanyPhone: z.string().optional(),
    financeCompanyContact: z.string().optional(),
  }).optional(),
  
  // Vehicle Specifications (nested object)
  specifications: z.object({
    vehicleWeight: z.string().optional(),
    exteriorLength: z.string().optional(),
    exteriorWidth: z.string().optional(),
    exteriorHeight: z.string().optional(),
    cargoLength: z.string().optional(),
    cargoWidth: z.string().optional(),
    cargoHeight: z.string().optional(),
    cargoVolume: z.string().optional(),
    payloadCapacity: z.string().optional(),
    towingCapacity: z.string().optional(),
    engineType: z.string().optional(),
    transmission: z.string().optional(),
  }).optional(),
  
  // Insurance Information (nested object)
  insuranceInfo: z.object({
    companyName: z.string().optional(),
    insuranceType: z.string().optional(),
    monthlyPremium: z.string().optional(),
    premiumDueDate: z.string().optional(),
    startDate: z.date().optional(),
    expirationDate: z.date().optional(),
    totalCoverageAmount: z.string().optional(),
    phoneNumber: z.string().optional(),
    representativeName: z.string().optional(),
    policyNumber: z.string().optional(),
    bodilyInjury: z.object({
      coverageLimit: z.string().optional(),
      premium: z.string().optional(),
      deductible: z.string().optional(),
    }).optional(),
    propertyDamage: z.object({
      coverageLimit: z.string().optional(),
      premium: z.string().optional(),
      deductible: z.string().optional(),
    }).optional(),
    pip: z.object({
      status: z.string().optional(),
      coverageLimit: z.string().optional(),
      premium: z.string().optional(),
      deductible: z.string().optional(),
    }).optional(),
    accidentalDeathBenefit: z.string().optional(),
    fullTermPremium: z.string().optional(),
  }).optional(),
  
  // Notes
  notes: z.string().optional(),
  
  // Documents (nested object for different document types)
  documents: z.object({
    vehiclePhotos: z.array(z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      fileKey: z.string().optional(),
    })).optional(),
    insurancePolicy: z.array(z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      fileKey: z.string().optional(),
    })).optional(),
    insuranceCards: z.array(z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      fileKey: z.string().optional(),
    })).optional(),
    registration: z.array(z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      fileKey: z.string().optional(),
    })).optional(),
    title: z.array(z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      fileKey: z.string().optional(),
    })).optional(),
    vehicleWarranty: z.array(z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      fileKey: z.string().optional(),
    })).optional(),
    tireWarranty: z.array(z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      fileKey: z.string().optional(),
    })).optional(),
    partsWarranty: z.array(z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      fileKey: z.string().optional(),
    })).optional(),
    maintenanceRecords: z.array(z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      fileKey: z.string().optional(),
    })).optional(),
    otherDocuments: z.array(z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      fileKey: z.string().optional(),
    })).optional(),
  }).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Vehicle {
  id: string;
  nickname: string;
  year?: number | null;
  make: string;
  model: string;
  vehicleType?: string | null;
  color?: string | null;
  vin?: string | null;
  licensePlate?: string | null;
  state?: string | null;
  mileage?: number | null;
  fuelType?: string | null;
  mpg?: number | null;
  ownerNames?: string | null;
  purchaseLocation?: string | null;
  financialInfo?: any; // JSON field
  specifications?: any; // JSON field
  insuranceInfo?: any; // JSON field
  vehiclePhotos?: any; // JSON field
  insuranceDocs?: any; // JSON field
  registrationDocs?: any; // JSON field
  warrantyDocs?: any; // JSON field
  maintenanceDocs?: any; // JSON field
  otherDocs?: any; // JSON field
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function VehicleForm({ vehicle, onSubmit, onCancel, isLoading }: VehicleFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: vehicle?.nickname || "",
      year: vehicle?.year ? vehicle.year.toString() : "",
      make: vehicle?.make || "",
      model: vehicle?.model || "",
      vehicleType: vehicle?.vehicleType || "",
      color: vehicle?.color || "",
      vin: vehicle?.vin || "",
      licensePlate: vehicle?.licensePlate || "",
      state: vehicle?.state || "",
      mileage: vehicle?.mileage ? vehicle.mileage.toString() : "",
      fuelType: vehicle?.fuelType || "",
      mpg: vehicle?.mpg ? vehicle.mpg.toString() : "",
      ownerNames: vehicle?.ownerNames || "",
      purchaseLocation: vehicle?.purchaseLocation || "",
      
      // Initialize nested objects
      financialInfo: {
        purchaseDate: vehicle?.financialInfo?.purchaseDate ? new Date(vehicle.financialInfo.purchaseDate) : undefined,
        purchasePrice: vehicle?.financialInfo?.purchasePrice || "",
        currentValue: vehicle?.financialInfo?.currentValue || "",
        monthlyPayment: vehicle?.financialInfo?.monthlyPayment || "",
        interestRate: vehicle?.financialInfo?.interestRate || "",
        loanTermMonths: vehicle?.financialInfo?.loanTermMonths || "",
        financeCompany: vehicle?.financialInfo?.financeCompany || "",
        downPayment: vehicle?.financialInfo?.downPayment || "",
        loanStartDate: vehicle?.financialInfo?.loanStartDate ? new Date(vehicle.financialInfo.loanStartDate) : undefined,
        firstPaymentDue: vehicle?.financialInfo?.firstPaymentDue ? new Date(vehicle.financialInfo.firstPaymentDue) : undefined,
        finalPaymentDue: vehicle?.financialInfo?.finalPaymentDue ? new Date(vehicle.financialInfo.finalPaymentDue) : undefined,
        remainingBalance: vehicle?.financialInfo?.remainingBalance || "",
        loanAccountNumber: vehicle?.financialInfo?.loanAccountNumber || "",
        financeCompanyPhone: vehicle?.financialInfo?.financeCompanyPhone || "",
        financeCompanyContact: vehicle?.financialInfo?.financeCompanyContact || "",
      },
      
      specifications: {
        vehicleWeight: vehicle?.specifications?.vehicleWeight || "",
        exteriorLength: vehicle?.specifications?.exteriorLength || "",
        exteriorWidth: vehicle?.specifications?.exteriorWidth || "",
        exteriorHeight: vehicle?.specifications?.exteriorHeight || "",
        cargoLength: vehicle?.specifications?.cargoLength || "",
        cargoWidth: vehicle?.specifications?.cargoWidth || "",
        cargoHeight: vehicle?.specifications?.cargoHeight || "",
        cargoVolume: vehicle?.specifications?.cargoVolume || "",
        payloadCapacity: vehicle?.specifications?.payloadCapacity || "",
        towingCapacity: vehicle?.specifications?.towingCapacity || "",
        engineType: vehicle?.specifications?.engineType || "",
        transmission: vehicle?.specifications?.transmission || "",
      },
      
      insuranceInfo: {
        companyName: vehicle?.insuranceInfo?.companyName || "",
        insuranceType: vehicle?.insuranceInfo?.insuranceType || "",
        monthlyPremium: vehicle?.insuranceInfo?.monthlyPremium || "",
        premiumDueDate: vehicle?.insuranceInfo?.premiumDueDate || "",
        startDate: vehicle?.insuranceInfo?.startDate ? new Date(vehicle.insuranceInfo.startDate) : undefined,
        expirationDate: vehicle?.insuranceInfo?.expirationDate ? new Date(vehicle.insuranceInfo.expirationDate) : undefined,
        totalCoverageAmount: vehicle?.insuranceInfo?.totalCoverageAmount || "",
        phoneNumber: vehicle?.insuranceInfo?.phoneNumber || "",
        representativeName: vehicle?.insuranceInfo?.representativeName || "",
        policyNumber: vehicle?.insuranceInfo?.policyNumber || "",
        bodilyInjury: {
          coverageLimit: vehicle?.insuranceInfo?.bodilyInjury?.coverageLimit || "",
          premium: vehicle?.insuranceInfo?.bodilyInjury?.premium || "",
          deductible: vehicle?.insuranceInfo?.bodilyInjury?.deductible || "",
        },
        propertyDamage: {
          coverageLimit: vehicle?.insuranceInfo?.propertyDamage?.coverageLimit || "",
          premium: vehicle?.insuranceInfo?.propertyDamage?.premium || "",
          deductible: vehicle?.insuranceInfo?.propertyDamage?.deductible || "",
        },
        pip: {
          status: vehicle?.insuranceInfo?.pip?.status || "",
          coverageLimit: vehicle?.insuranceInfo?.pip?.coverageLimit || "",
          premium: vehicle?.insuranceInfo?.pip?.premium || "",
          deductible: vehicle?.insuranceInfo?.pip?.deductible || "",
        },
        accidentalDeathBenefit: vehicle?.insuranceInfo?.accidentalDeathBenefit || "",
        fullTermPremium: vehicle?.insuranceInfo?.fullTermPremium || "",
      },
      
      // Notes
      notes: vehicle?.notes || "",
      
      // Documents
      documents: {
        vehiclePhotos: vehicle?.vehiclePhotos || [],
        insurancePolicy: vehicle?.insuranceDocs?.insurancePolicy || [],
        insuranceCards: vehicle?.insuranceDocs?.insuranceCards || [],
        registration: vehicle?.registrationDocs?.registration || [],
        title: vehicle?.registrationDocs?.title || [],
        vehicleWarranty: vehicle?.warrantyDocs?.vehicleWarranty || [],
        tireWarranty: vehicle?.warrantyDocs?.tireWarranty || [],
        partsWarranty: vehicle?.warrantyDocs?.partsWarranty || [],
        maintenanceRecords: vehicle?.maintenanceDocs || [],
        otherDocuments: vehicle?.otherDocs || [],
      },
    },
  });

  const handleSubmit = async (data: FormData) => {
    // Convert string numbers back to numbers
    const processedData = {
      ...data,
      year: data.year ? parseInt(data.year) : undefined,
      mileage: data.mileage ? parseInt(data.mileage) : undefined,
      mpg: data.mpg ? parseFloat(data.mpg) : undefined,
      
      // Process documents for API
      vehiclePhotos: data.documents?.vehiclePhotos || [],
      insuranceDocs: {
        insurancePolicy: data.documents?.insurancePolicy || [],
        insuranceCards: data.documents?.insuranceCards || []
      },
      registrationDocs: {
        registration: data.documents?.registration || [],
        title: data.documents?.title || []
      },
      warrantyDocs: {
        vehicleWarranty: data.documents?.vehicleWarranty || [],
        tireWarranty: data.documents?.tireWarranty || [],
        partsWarranty: data.documents?.partsWarranty || []
      },
      maintenanceDocs: data.documents?.maintenanceRecords || [],
      otherDocs: data.documents?.otherDocuments || [],
    };
    
    // Remove the nested documents object since we've flattened it
    delete processedData.documents;
    
    await onSubmit(processedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <BasicInfoSection form={form} />
        <FinancialInfoSection form={form} />
        <VehicleSpecsSection form={form} />
        <InsuranceInfoSection form={form} />
        <NotesSection form={form} />

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : vehicle ? "Update Vehicle" : "Add Vehicle"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
