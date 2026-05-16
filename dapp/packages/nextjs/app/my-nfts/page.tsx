"use client";
import { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { parseEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";
import { usePublicClient } from "wagmi";

export default function MyNFTsPage() {
  const { isConnected } = useAccount();

  // 範例 Token ID (實際應從合約獲取)
  const myTokenIds = [1, 2, 3]; 

  if (!isConnected) return <div className="p-8 text-center"><h1 className="text-2xl font-bold">請先連接錢包</h1></div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">我的 NFT</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {myTokenIds.map(id => (
          <NFTCard key={id} tokenId={BigInt(id)} />
        ))}
      </div>
    </div>
  );
}

function NFTCard({ tokenId }: { tokenId: bigint }) {
  const { address: myAddress } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const [listPrice, setListPrice] = useState("0.1");
  const [listStep, setListStep] = useState<"idle" | "checking" | "approving" | "listing" | "done" | "error">("idle");

  const nftContractAddress = (deployedContracts as any)[chainId]?.MyNFT?.address;
  const marketContractAddress = (deployedContracts as any)[chainId]?.NFTMarket?.address;

  const { writeContractAsync: approveNFT } = useScaffoldWriteContract("MyNFT");
  const { writeContractAsync: listItem } = useScaffoldWriteContract("NFTMarket");

  const handleList = async () => {
    setListStep("checking");
    try {
      // Step 1: Check existing approval
      if (publicClient) {
        const approvedAddress = await publicClient.readContract({
          address: nftContractAddress,
          abi: (deployedContracts as any)[chainId]?.MyNFT?.abi,
          functionName: "getApproved",
          args: [tokenId],
        });

        if (approvedAddress !== marketContractAddress) {
          setListStep("approving");
          await approveNFT({
            functionName: "approve",
            args: [marketContractAddress, tokenId],
          });
        }
      }

      setListStep("listing");
      await listItem({
        functionName: "listItem",
        args: [nftContractAddress, tokenId, parseEther(listPrice)],
      });
      setListStep("done");
    } catch (e) {
      console.error(e);
      setListStep("error");
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body">
        <h2 className="card-title text-secondary">Token #{tokenId.toString()}</h2>
        <div className="form-control w-full mt-2">
          <label className="label">
            <span className="label-text">上架價格 (ETH)</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={listPrice}
            onChange={e => setListPrice(e.target.value)}
            disabled={listStep !== "idle" && listStep !== "error"}
          />
        </div>
        
        <div className="mt-4 min-h-[1.5rem] text-sm text-center">
          {listStep === "approving" && <p className="text-yellow-600 animate-pulse">步驟 1/2: 授權中...</p>}
          {listStep === "listing" && <p className="text-blue-600 animate-pulse">步驟 2/2: 上架中...</p>}
          {listStep === "done" && <p className="text-green-600 font-bold">✅ 上架成功！</p>}
          {listStep === "error" && <p className="text-red-600">❌ 操作失敗，請重試</p>}
        </div>

        <div className="card-actions justify-end mt-2">
          <button 
            className={`btn btn-primary w-full ${listStep !== "idle" && listStep !== "error" && listStep !== "done" ? "loading" : ""}`}
            onClick={handleList}
            disabled={listStep !== "idle" && listStep !== "error"}
          >
            {listStep === "done" ? "已上架" : "上架銷售"}
          </button>
        </div>
      </div>
    </div>
  );
}
