"use client";

import { useState, useEffect } from "react";
import { Plus, Truck, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleForm } from "./_components/vehicle-form";
import { VehicleCard } from "./_components/vehicle-card";
import { useFleet } from "@/hooks/use-fleet";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

export default function FleetPage() {
  const { vehicles, isLoading, error, createVehicle, updateVehicle, deleteVehicle } = useFleet();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);

  // Get unique vehicle types for filter
  const vehicleTypes = Array.from(new Set(vehicles.map(vehicle => vehicle.vehicleType).filter(Boolean))).sort();

  // Filter vehicles based on search and type
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (vehicle.licensePlate && vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === "all" || vehicle.vehicleType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, data);
        toast.success("Vehicle updated successfully");
      } else {
        await createVehicle(data);
        toast.success("Vehicle added successfully");
      }
      
      setShowForm(false);
      setEditingVehicle(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleViewDetails = (vehicle: Vehicle) => {
    router.push(`/dashboard/fleet/${vehicle.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingVehicleId(id);
      await deleteVehicle(id);
      toast.success("Vehicle deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete vehicle");
    } finally {
      setDeletingVehicleId(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVehicle(null);
  };

  const handleAddNew = () => {
    setEditingVehicle(null);
    setShowForm(true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <Truck className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                Error Loading Fleet
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {error}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  My Fleet
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Manage your vehicles and fleet information
                </p>
              </div>
            </div>

            <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/60 dark:bg-neutral-700/60"
              />
            </div>

            {vehicleTypes.length > 0 && (
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48 bg-white/60 dark:bg-neutral-700/60">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type} value={type!}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-neutral-400 dark:text-neutral-500 mb-6">
                <Truck className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                {vehicles.length === 0 ? "No vehicles in your fleet yet" : "No vehicles found"}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-6">
                {vehicles.length === 0 
                  ? "Start building your fleet by adding your first vehicle."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {vehicles.length === 0 && (
                <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Vehicle
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
                isDeleting={deletingVehicleId === vehicle.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="w-[90vw] md:w-[70vw] lg:w-[50vw] max-w-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
            </DialogTitle>
          </DialogHeader>
          
          <VehicleForm
            vehicle={editingVehicle}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

    </div>
  );
}