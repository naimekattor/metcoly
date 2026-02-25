import { create } from 'zustand';

interface PersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationality: string;
    address: string;
}

interface CaseState {
    currentStep: number;
    serviceType: {
        id: string;
        label: string;
        price: string;
    } | null;
    personalInfo: PersonalInfo;
    documents: {
        passport: File | null;
        photo: File | null;
        birthCertificate: File | null;
        education: File | null;
        employment: File | null;
        financial: File | null;
    };

    // Actions
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    setServiceType: (service: { id: string; label: string; price: string }) => void;
    setPersonalInfo: (info: Partial<PersonalInfo>) => void;
    setDocument: (key: keyof CaseState['documents'], file: File | null) => void;
    resetForm: () => void;
}

export const useCaseStore = create<CaseState>((set) => ({
    currentStep: 1,
    serviceType: null,
    personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nationality: '',
        address: '',
    },
    documents: {
        passport: null,
        photo: null,
        birthCertificate: null,
        education: null,
        employment: null,
        financial: null,
    },

    setStep: (step) => set({ currentStep: step }),
    nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
    prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

    setServiceType: (service) => set({ serviceType: service }),

    setPersonalInfo: (info) => set((state) => ({
        personalInfo: { ...state.personalInfo, ...info }
    })),

    setDocument: (key, file) => set((state) => ({
        documents: { ...state.documents, [key]: file }
    })),

    resetForm: () => set({
        currentStep: 1,
        serviceType: null,
        personalInfo: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            nationality: '',
            address: '',
        },
        documents: {
            passport: null,
            photo: null,
            birthCertificate: null,
            education: null,
            employment: null,
            financial: null,
        },
    }),
}));
