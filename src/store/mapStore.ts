import { create } from "zustand";

type MapState = {
    selectedProvince: string | null;
    description: string | null;
    setSelectedProvince: (province: string, description?: string) => void;
    clearSelection: () => void;
};

export const useMapStore = create<MapState>((set) => ({
    selectedProvince: null,
    description: null,
    setSelectedProvince: (province, description) => set({ selectedProvince: province, description: description ?? null }),
    clearSelection: () => set({ selectedProvince: null, description: null }),
}));
