"use client";

import { useState, useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Trash2, Eye, EyeOff, Building2, MapPin } from "lucide-react";
import { CompanyCard } from "@/components/company-card";
import { CompanyDetailDialog } from "@/components/company-detail-dialog";
import { CompanyNotesDialog } from "@/components/company-notes-dialog";
import { US_STATES } from "@/data/us-states";
import { toast } from "sonner";

interface Company {
    id: string;
    name: string;
    vehicleTypes: string[];
    averagePay: string | null;
    serviceVertical: string[];
    contractType: string;
    areasServed: string[];
    insuranceRequirements: string | null;
    licenseRequirements: string | null;
    certificationsRequired: string[];
    website: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    description: string | null;
    logoUrl: string | null;
    isActive: boolean;
    workflowStatus: string | null;
    yearEstablished: string | null;
    companySize: string | null;
    headquarters: string | null;
    businessModel: string | null;
    companyMission: string | null;
    targetCustomers: string | null;
    companyCulture: string | null;
    videoUrl: string | null;
    userStatuses?: Array<{
        status: string;
        notes: string | null;
        updatedAt: string;
    }>;
}

interface FilterOptions {
    vehicleTypes: Array<{ value: string; label: string }>;
    contractTypes: Array<{ value: string; label: string }>;
    serviceVerticals: string[];
    areasServed: string[];
    userStatusOptions: string[];
}

interface UserStatusCounts {
    [key: string]: number;
}

export default function OpportunitiesPage() {
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [showNotesDialog, setShowNotesDialog] = useState(false);
    const [showDeleted, setShowDeleted] = useState(false);

    // Filters
    const [search, setSearch] = useState("");
    const [selectedVehicleType, setSelectedVehicleType] = useState("");
    const [selectedContractType, setSelectedContractType] = useState("");
    const [selectedServiceVertical, setSelectedServiceVertical] = useState("");
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedUserStatus, setSelectedUserStatus] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");

    // Fetch filter options
    const { data: filterData } = useQuery({
        queryKey: ["company-filters"],
        queryFn: async () => {
            const response = await fetch("/api/companies/filters");
            if (!response.ok) throw new Error("Failed to fetch filters");
            return response.json();
        },
    });

    const filterOptions: FilterOptions = filterData?.filters || {
        vehicleTypes: [],
        contractTypes: [],
        serviceVerticals: [],
        areasServed: [],
        userStatusOptions: [],
    };

    const userStatusCounts: UserStatusCounts = filterData?.userStatusCounts || {};

    // Fetch companies with infinite scroll
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
    } = useInfiniteQuery({
        queryKey: [
            "companies",
            search,
            selectedVehicleType,
            selectedContractType,
            selectedServiceVertical,
            selectedArea,
            selectedState,
            selectedUserStatus,
            sortBy,
            sortOrder,
        ],
        queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams({
                page: pageParam.toString(),
                limit: "20",
                ...(search && { search }),
                ...(selectedVehicleType && selectedVehicleType !== "all" && { vehicleType: selectedVehicleType }),
                ...(selectedContractType && selectedContractType !== "all" && { contractType: selectedContractType }),
                ...(selectedServiceVertical && selectedServiceVertical !== "all" && { serviceVertical: selectedServiceVertical }),
                ...(selectedArea && selectedArea !== "all" && { areaServed: selectedArea }),
                ...(selectedState && selectedState !== "all" && { state: selectedState }),
                ...(selectedUserStatus && { userStatus: selectedUserStatus }),
                sortBy,
                sortOrder,
            });

            const response = await fetch(`/api/companies?${params}`);
            if (!response.ok) throw new Error("Failed to fetch companies");
            return response.json();
        },
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasNextPage
                ? lastPage.pagination.page + 1
                : undefined;
        },
        initialPageParam: 1,
    });

    const companies = data?.pages.flatMap(page => page.companies) || [];
    const totalCompanies = data?.pages[0]?.pagination?.totalCount || 0;

    // Show loading toast for initial load
    useEffect(() => {
        if (isLoading && companies.length === 0) {
            toast.loading("Loading opportunities...", { id: "loading-opportunities" });
        } else if (!isLoading && companies.length > 0) {
            toast.dismiss("loading-opportunities");
        }
    }, [isLoading, companies.length]);

    // Handle status change
    const handleStatusChange = async (companyId: string, status: string) => {
        try {
            const response = await fetch("/api/user/company-status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    companyId,
                    status,
                }),
            });

            if (response.ok) {
                refetch();
            } else {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            throw error; // Re-throw so the toast can handle it
        }
    };

    // Handle notes
    const handleAddNotes = (companyId: string) => {
        const company = companies.find(c => c.id === companyId);
        if (company) {
            setSelectedCompany(company);
            setShowNotesDialog(true);
        }
    };

    const handleOpenNotes = () => {
        setShowNotesDialog(true);
    };

    const handleCloseNotes = () => {
        setShowNotesDialog(false);
    };

    // Handle load more with toast
    const handleLoadMore = async () => {
        toast.loading("Loading more opportunities...", { id: "load-more" });
        try {
            await fetchNextPage();
            toast.dismiss("load-more");
        } catch (error) {
            toast.error("Failed to load more opportunities", { id: "load-more" });
        }
    };

    // Clear filters
    const clearFilters = () => {
        setSearch("");
        setSelectedVehicleType("all");
        setSelectedContractType("all");
        setSelectedServiceVertical("all");
        setSelectedArea("all");
        setSelectedState("all");
        setSelectedUserStatus("");
        setSortBy("createdAt");
        setSortOrder("desc");
    };

    const getStatusCount = (status: string) => {
        if (status === "All") return totalCompanies;
        return userStatusCounts[status] || 0;
    };

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Driver Opportunities</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{totalCompanies} opportunities available</span>
                    </div>
                </div>
                {/* <div className="flex flex-wrap gap-2">
           <Button variant="outline" size="sm">
            <Building2 className="w-4 h-4 mr-2" />
            List of Opportunities
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Company
          </Button> 
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Recommendation Criteria</span>
            <span className="sm:hidden">Criteria</span>
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Remove Duplicates
          </Button> 
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDeleted(!showDeleted)}
            className="text-xs sm:text-sm"
          >
            {showDeleted ? <EyeOff className="w-4 h-4 sm:mr-2" /> : <Eye className="w-4 h-4 sm:mr-2" />}
            <span className="hidden sm:inline">Show Deleted</span>
            <span className="sm:hidden">Deleted</span>
          </Button>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <Search className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Search Criteria</span>
            <span className="sm:hidden">Search</span>
          </Button>
        </div> */}
            </div>

            {/* Search and Filters */}
            <div className="p-4 md:p-6 rounded-lg bg-white shadow-md">
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search companies, services, locations..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="flex flex-wrap gap-2 md:gap-2">
                        <Select value={selectedServiceVertical} onValueChange={setSelectedServiceVertical}>
                            <SelectTrigger>
                                <SelectValue placeholder="Service Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Service Types</SelectItem>
                                {filterOptions.serviceVerticals.map((vertical) => (
                                    <SelectItem key={vertical} value={vertical}>
                                        {vertical}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedVehicleType} onValueChange={setSelectedVehicleType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Vehicle Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Vehicle Types</SelectItem>
                                {filterOptions.vehicleTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedContractType} onValueChange={setSelectedContractType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Contract Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Contract Types</SelectItem>
                                {filterOptions.contractTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedArea} onValueChange={setSelectedArea}>
                            <SelectTrigger>
                                <SelectValue placeholder="Area Served" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Areas</SelectItem>
                                {filterOptions.areasServed.map((area) => (
                                    <SelectItem key={area} value={area}>
                                        {area}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedState} onValueChange={setSelectedState}>
                            <SelectTrigger>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <SelectValue placeholder="State" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All States</SelectItem>
                                {US_STATES.map((state) => (
                                    <SelectItem key={state.value} value={state.value}>
                                        {state.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdAt">Date Added</SelectItem>
                                <SelectItem value="name">Company Name</SelectItem>
                                <SelectItem value="averagePay">Average Pay</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={clearFilters}>
                            Clear
                        </Button>
                    </div>

                    <div className="flex justify-between items-center">

                        <div className="text-sm text-gray-600">
                            Showing {companies.length} of {totalCompanies} companies
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Tabs */}
            <Tabs value={selectedUserStatus || "All"} onValueChange={(value) => setSelectedUserStatus(value === "All" ? "" : value)}>
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto">
                    <TabsTrigger value="All" className="text-xs sm:text-sm py-2">
                        <span className="hidden sm:inline">All {getStatusCount("All")}</span>
                        <span className="sm:hidden">All</span>
                    </TabsTrigger>
                    <TabsTrigger value="Researching" className="text-xs sm:text-sm py-2">
                        <span className="hidden sm:inline">Researching {getStatusCount("Researching")}</span>
                        <span className="sm:hidden">Research</span>
                    </TabsTrigger>
                    <TabsTrigger value="Applied" className="text-xs sm:text-sm py-2">
                        <span className="hidden sm:inline">Applied {getStatusCount("Applied")}</span>
                        <span className="sm:hidden">Applied</span>
                    </TabsTrigger>
                    <TabsTrigger value="Wait List" className="text-xs sm:text-sm py-2">
                        <span className="hidden sm:inline">Wait List {getStatusCount("Wait List")}</span>
                        <span className="sm:hidden">Wait</span>
                    </TabsTrigger>
                    <TabsTrigger value="Active" className="text-xs sm:text-sm py-2">
                        <span className="hidden sm:inline">Active {getStatusCount("Active")}</span>
                        <span className="sm:hidden">Active</span>
                    </TabsTrigger>
                    <TabsTrigger value="Other" className="text-xs sm:text-sm py-2">
                        <span className="hidden sm:inline">Other {getStatusCount("Other")}</span>
                        <span className="sm:hidden">Other</span>
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Company Cards */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-4 md:p-6">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {companies.map((company) => (
                        <CompanyCard
                            key={company.id}
                            company={company}
                            onViewProfile={setSelectedCompany}
                            onStatusChange={handleStatusChange}
                            onAddNotes={handleAddNotes}
                        />
                    ))}
                </div>
            )}

            {/* Load More Button */}
            {hasNextPage && (
                <div className="flex justify-center py-8">
                    <Button
                        onClick={handleLoadMore}
                        variant="outline"
                        disabled={isFetchingNextPage}
                    >
                        {isFetchingNextPage ? "Loading..." : "Load More"}
                    </Button>
                </div>
            )}

            {/* Company Detail Dialog */}
            {selectedCompany && (
                <CompanyDetailDialog
                    company={selectedCompany}
                    onClose={() => setSelectedCompany(null)}
                    onStatusUpdate={() => {
                        refetch();
                    }}
                    onOpenNotes={handleOpenNotes}
                />
            )}

            {/* Company Notes Dialog */}
            {selectedCompany && (
                <CompanyNotesDialog
                    company={selectedCompany}
                    isOpen={showNotesDialog}
                    onClose={handleCloseNotes}
                    onStatusUpdate={() => {
                        refetch();
                    }}
                />
            )}
        </div>
    );
}
