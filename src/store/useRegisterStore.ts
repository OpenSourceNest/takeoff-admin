import { create } from 'zustand';

export interface RegisterFormData {
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    location: string;
    description: string[];
    source: string;
    pipeline: string;
    updates: string;
    topics: string;
    knowledge: string;
    community: string;
    professionOther: string;
    sourceOther: string;
}

interface RegisterState {
    formData: RegisterFormData;
    status: 'idle' | 'loading' | 'success' | 'error';
    errorMessage: string;
    setFormData: (id: keyof RegisterFormData, value: string | string[]) => void;
    setStatus: (status: 'idle' | 'loading' | 'success' | 'error') => void;
    setErrorMessage: (message: string) => void;
    reset: () => void;
}

const initialFormData: RegisterFormData = {
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    location: '',
    description: [],
    source: '',
    pipeline: '',
    updates: '',
    topics: '',
    knowledge: '',
    community: '',
    professionOther: '',
    sourceOther: '',
};

export const useRegisterStore = create<RegisterState>((set) => ({
    formData: initialFormData,
    status: 'idle',
    errorMessage: '',
    setFormData: (id, value) => set((state) => ({
        formData: { ...state.formData, [id]: value }
    })),
    setStatus: (status) => set({ status }),
    setErrorMessage: (errorMessage) => set({ errorMessage }),
    reset: () => set({ formData: initialFormData, status: 'idle', errorMessage: '' }),
}));
