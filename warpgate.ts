import { TokenSDK } from "warpgate-fun-sdk";
import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import dotenv from "dotenv";

dotenv.config();

// Initialize SDK
const sdk = new TokenSDK();

// Use with a wallet account
const privateKey = new Ed25519PrivateKey(process.env.PRIVATE_KEY || ""); // Use environment variable
const account = Account.fromPrivateKey({ privateKey });

// Authenticate with the API
sdk.authenticate(account).then((resp) =>{
    console.log("Auth resp: ", resp)
})

// Get token information
const tokenIdentifier =
  "0x2d1479ec4dbbe6f45e068fb767e761f05fab2838954e0c6b8ea87e94ea089abb::NIGHTLY::NIGHTLY"; // Replace with your actual token identifier
sdk.getTokenInfo(tokenIdentifier).then((tokenInfo) =>{
    console.log(`Token: ${tokenInfo.name} (${tokenInfo.symbol})`);
});

sdk.fetchPoolState(tokenIdentifier).then((state) =>{
    console.log("Pool state: ", state)
})

sdk.previewBuy(
    tokenIdentifier,
    0.5, // 0.5 APT
    5 // 5% slippage
).then((buyPreview) =>{
    console.log(
        `Expected output: ${buyPreview.outputAmount} ${buyPreview.outputToken}`
    );
    console.log(`Price impact: ${buyPreview.priceImpact}%`);
})

// sdk.getTokenListings(10, 0).then((tokens) =>{
//     console.log("List token: ", tokens)
//     tokens.forEach((token) =>{
//         console.log("Token info: ", token)
//     })
// })