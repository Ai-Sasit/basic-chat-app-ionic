import create from "zustand";

export const useBack = create((set) => ({
  isBack: false,
  setIsBack: (bool: any) => set({ isBack: bool }),
}));
