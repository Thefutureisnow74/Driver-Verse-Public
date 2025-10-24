"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  Edit, 
  Trash2, 
  Car,
  Calendar,
  Gauge,
  Fuel,
  MapPin,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => Promise<void>;
  onViewDetails: (vehicle: Vehicle) => void;
  isDeleting?: boolean;
}

const vehicleTypeColors: Record<string, string> = {
  Car: "bg-blue-500",
  Truck: "bg-red-500",
  Van: "bg-green-500",
  SUV: "bg-purple-500",
  Motorcycle: "bg-orange-500",
  Trailer: "bg-gray-500",
  "Box Truck": "bg-yellow-500",
  "Pickup Truck": "bg-red-600",
  "Cargo Van": "bg-green-600",
  "Delivery Van": "bg-blue-600",
  "Semi Truck": "bg-gray-700",
  Flatbed: "bg-yellow-600",
  Other: "bg-neutral-500",
};

export function VehicleCard({ vehicle, onEdit, onDelete, onViewDetails, isDeleting }: VehicleCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    await onDelete(vehicle.id);
    setShowDeleteDialog(false);
  };

  const getVehicleDisplayName = () => {
    const parts = [];
    if (vehicle.year) parts.push(vehicle.year);
    parts.push(vehicle.make);
    parts.push(vehicle.model);
    return parts.join(' ');
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${vehicleTypeColors[vehicle.vehicleType || 'Other'] || vehicleTypeColors.Other}`} />
              <div>
                <CardTitle className="text-lg">{vehicle.nickname}</CardTitle>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {getVehicleDisplayName()}
                </p>
                {vehicle.vehicleType && (
                  <Badge variant="secondary" className="mt-1">
                    {vehicle.vehicleType}
                  </Badge>
                )}
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Vehicle Details */}
          <div className="grid grid-cols-2 gap-3 text-sm text-neutral-600 dark:text-neutral-400">
            {vehicle.licensePlate && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{vehicle.licensePlate} {vehicle.state && `(${vehicle.state})`}</span>
              </div>
            )}
            
            {vehicle.color && (
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                <span>{vehicle.color}</span>
              </div>
            )}

            {vehicle.mileage && (
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                <span>{vehicle.mileage.toLocaleString()} miles</span>
              </div>
            )}

            {vehicle.fuelType && (
              <div className="flex items-center gap-2">
                <Fuel className="h-4 w-4" />
                <span>{vehicle.fuelType} {vehicle.mpg && `(${vehicle.mpg} MPG)`}</span>
              </div>
            )}
          </div>

          {/* Created date */}
          <div className="pt-2 border-t text-xs text-neutral-500 dark:text-neutral-500 flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            Added {format(new Date(vehicle.createdAt), "MMM dd, yyyy")}
          </div>
        </CardContent>

        <CardFooter className="pt-3 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails(vehicle)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Details
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit(vehicle)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardFooter>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{vehicle.nickname}"? This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
