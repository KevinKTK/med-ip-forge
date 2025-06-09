import { http } from "viem";
import { Account, privateKeyToAccount, Address } from "viem/accounts";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import {storyAeneid} from "wagmi/chains";

const privateKey: Address = `0x${import.meta.env.env.WALLET_PRIVATE_KEY}`;
const account: Account = privateKeyToAccount(privateKey);

const config: StoryConfig = {
    account: account, // the account object from above
    transport: http(import.meta.env.env.RPC_PROVIDER_URL),
    chainId: storyAeneid.id
};
export const client = StoryClient.newClient(config);