import { create } from "zustand";

const useStore = create((set) => ({
  alghorithm: "SHA-1",
  setActiveTab: (alghorithm) => set((state) => ({ alghorithm })),
}));

export default useStore;
