// ==============================
// Service DTOs
// ==============================

// Request DTOs
export interface CreateServiceDTO {
  name: string;
  description?: string;
}

export interface UpdateServiceDTO {
  name?: string;
  description?: string;
}

// Query params
export interface ListServicesQueryDTO {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'createdAt';
  order?: 'asc' | 'desc';
}

// Response DTOs
export interface ServiceResponseDTO {
  id: string;
  name: string;
  description: string | null;
  serviceDetailsCount: number;
  createdAt: string;
  modifiedAt: string;
}
