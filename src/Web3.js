import { ethers } from 'ethers';

export async function mintNFT(modelUrl, modelName) {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contractAddress = 'YOUR_NFT_CONTRACT_ADDRESS'; // جای خودش بذار
        const abi = [
            "function mint(address to, string memory tokenURI) public returns (uint256)"
        ];
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const tx = await contract.mint(await signer.getAddress(), modelUrl);
        await tx.wait();
        console.log('NFT minted:', tx);
    } else {
        alert('Please install MetaMask!');
    }
}