import { ethers } from "ethers";

export async function mintNFT(modelUrl, modelName) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    "YOUR_NFT_CONTRACT_ADDRESS", // Replace with your NFT contract address
    ["function mint(string memory uri) public"],
    signer
  );
  const tx = await contract.mint(modelUrl);
  await tx.wait();
  console.log("NFT minted with transaction:", tx.hash);
  return tx.hash;
}
