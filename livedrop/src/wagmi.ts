import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { http, createConfig } from "wagmi";
import { zora } from "wagmi/chains";

export const config = createConfig({
  chains: [zora],
  connectors: [farcasterFrame()],
  transports: {
    [zora.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}