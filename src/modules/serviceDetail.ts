// ==============================
// Request DTOs
// ==============================

export interface CreateServiceDetailDTO {
  providedService: string;
  description?: string;
  localCost?: number;
  foreignCost?: number;
  isAvailable: boolean;
  serviceId: string;
}

export interface UpdateServiceDetailDTO {
  providedService?: string;
  description?: string;
  localCost?: number;
  foreignCost?: number;
  isAvailable?: boolean;
  serviceId?: string;
}

export interface ListServiceDetailQueryDTO {
  page?: number;
  limit?: number;
  serviceId?: string;
  isAvailable?: boolean;
  sortBy?: "createdAt" | "providedService";
  order?: "asc" | "desc";
}

// ==============================
// Response DTO
// ==============================

export interface ServiceDetailResponseDTO {
  id: string;
  providedService: string;
  description: string | null;
  localCost: number | null;
  foreignCost: number | null;
  isAvailable: boolean;
  serviceId: string;
  createdAt: string;
  modifiedAt: string;
}
