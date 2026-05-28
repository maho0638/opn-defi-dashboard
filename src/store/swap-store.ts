import { create } from "zustand";

type SwapToken = "OPN" | "USDC";

type SwapState = {
  fromAmount: string;
  fromToken: SwapToken;
  toToken: SwapToken;
  setFromAmount: (value: string) => void;
  flipTokens: () => void;
};

export const useSwapStore = create<SwapState>((set) => ({
  fromAmount: "",
  fromToken: "OPN",
  toToken: "USDC",
  setFromAmount: (fromAmount) => set({ fromAmount }),
  flipTokens: () =>
    set((state) => ({
      fromToken: state.toToken,
      toToken: state.fromToken
    }))
}));
