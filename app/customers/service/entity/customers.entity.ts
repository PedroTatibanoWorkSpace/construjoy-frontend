export interface Customer {
    id?: string;
    email: string;
    name: string;
    phone: string;
    document: string;
    createdAt?: string; // Ou Date se você converter a string ISO para objeto Date
    status?: 'Active' | 'Inactive'; // Supondo que sejam os únicos status possíveis

  }