import {
	Aptos,
	AptosConfig,
	Ed25519PrivateKey,
	HexInput,
	Network,
	PrivateKey,
	PrivateKeyVariants,
} from "@aptos-labs/ts-sdk"
import { ChatOpenAI } from "@langchain/openai"
import dotenv from "dotenv";
import { AgentRuntime, LocalSigner } from 'move-agent-kit'

// Load environment variables from .env file
dotenv.config();

export const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-mini",
  });

export const setupAgentKit = async (data: any) => {
	const aptosConfig = new AptosConfig({
		network: Network.TESTNET,
	})
	const aptos = new Aptos(aptosConfig)
	const account = await aptos.deriveAccountFromPrivateKey({
		privateKey: new Ed25519PrivateKey(
			PrivateKey.formatPrivateKey(process.env.PRIVATE_KEY as HexInput, PrivateKeyVariants.Ed25519)
		),
	})
	const signer = new LocalSigner(account, Network.TESTNET)
	const agentRuntime = new AgentRuntime(signer, aptos)

    const transaction = await agentRuntime.aptos.transaction.build.simple({
        sender: agentRuntime.account.getAddress(),
        data: {
            function: "0xb8188ed9a1b56a11344aab853f708ead152484081c3b5ec081c38646500c42d7::router::deposit_and_stake_entry",
            typeArguments: [],
            functionArguments: [
                10000000,
                "0xe8ec9945a78a48452def46207e65a0a4ed6acd400306b977020924ae3652ab85"
            ],
        },
    })

    const tx_resp = await agentRuntime.aptos.signAndSubmitTransaction({
        signer: account,
        transaction: transaction
    })

	return {
		tx_resp
	}
}