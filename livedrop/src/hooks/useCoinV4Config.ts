import { parseAbi } from "viem";

export const COINV4_CONTRACT_ADDRESS = "0xYourCoinV4ContractOnBase"; // TODO: Replace with your contract address on base
export const COINV4_ABI = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
  "function mint(address to)",
]);
export const CHAIN_ID = 8453; // base mainnet