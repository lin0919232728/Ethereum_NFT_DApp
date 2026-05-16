"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function MintPage() {
  const [tokenURI, setTokenURI] = useState("");
  const [mintedTokenId, setMintedTokenId] = useState<bigint | null>(null);
  const { isConnected } = useAccount();

  const { data: mintPrice } = useScaffoldReadContract({
    contractName: "MyNFT",
    functionName: "mintPrice",
  });

  const { data: totalSupply } = useScaffoldReadContract({
    contractName: "MyNFT",
    functionName: "totalSupply",
  });

  const { writeContractAsync, isMining } = useScaffoldWriteContract("MyNFT");

  const handleMint = async () => {
    try {
      setMintedTokenId(null);
      await writeContractAsync({
        functionName: "mint",
        args: [tokenURI],
        value: mintPrice,
      });
      // Use totalSupply as the minted tokenId (tokens start at 1, incremented before mint)
      if (totalSupply !== undefined) {
        setMintedTokenId(totalSupply + 1n);
      }
    } catch (e) {
      console.error("Mint failed:", e);
    }
  };

  const isSoldOut = totalSupply !== undefined && totalSupply >= BigInt(100);
  const canMint = isConnected && tokenURI.trim() !== "" && !isSoldOut && !isMining && mintPrice !== undefined;

  return (
    <div className="container mx-auto p-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">鑄造 NFT</h1>
      <div className="bg-base-200 p-6 rounded-xl shadow-lg">
        <p className="text-sm text-gray-500 mb-4 font-medium">
          剩餘數量: {totalSupply !== undefined ? `${100 - Number(totalSupply)}/100` : "加載中..."}
        </p>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Token URI (IPFS)</span>
          </label>
          <input
            className="input input-bordered w-full mb-4"
            placeholder="ipfs://Qm..."
            value={tokenURI}
            onChange={e => setTokenURI(e.target.value)}
          />
        </div>
        <p className="mb-6 text-gray-600">
          鑄造價格: <span className="font-bold text-primary">{mintPrice ? formatEther(mintPrice) : "加載中..."} ETH</span>
        </p>
        <button
          className={`btn btn-primary w-full ${isMining ? "loading" : ""}`}
          disabled={!canMint}
          onClick={handleMint}
        >
          {mintPrice === undefined ? "加載中..." : isMining ? "鑄造中..." : isSoldOut ? "已售罄" : !isConnected ? "請先連接錢包" : "立即鑄造"}
        </button>

        {mintedTokenId !== null && (
          <div className="mt-6 p-4 bg-green-100 rounded-lg text-green-800 shadow-inner border border-green-200">
            <p className="font-bold">🎉 鑄造成功！</p>
            <p>您的 Token ID 為: <span className="font-mono">#{mintedTokenId.toString()}</span></p>
            <a href="/my-nfts" className="btn btn-sm btn-outline btn-success mt-3 w-full">
              查看我的 NFT
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
