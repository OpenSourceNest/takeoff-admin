import { create } from 'zustand';

interface ModalStore {
    isConnectModalOpen: boolean;
    openConnectModal: () => void;
    closeConnectModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
    isConnectModalOpen: false,
    openConnectModal: () => set({ isConnectModalOpen: true }),
    closeConnectModal: () => set({ isConnectModalOpen: false }),
}));
