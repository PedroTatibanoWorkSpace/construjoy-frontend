export interface Customer {
    id?: string;
    internalId?: string;
    email: string;
    name: string;
    phone: string;
    document: string;
    createdAt?: string; 
    status?: 'Active' | 'Inactive'; 

  }