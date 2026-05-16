"use client";
import { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { formatEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";

export default function MarketPage() {
  const { address: myAddress } = useAccount();
  const chainId = useChainId();
  
  // 範例 Token ID
  const listedTokenIds = [1, 2, 3];
  const nftContractAddress = (deployedContracts as any)[chainId]?.MyNFT?.address;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">NFT 市場</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listedTokenIds.map(id => (
          <NFTCard key={id} tokenId={BigInt(id)} nftContractAddress={nftContractAddress} myAddress={myAddress} />
        ))}
      </div>
    </div>
  );
}

function NFTCard({ tokenId, nftContractAddress, myAddress }: { tokenId: bigint, nftContractAddress: string, myAddress: string | undefined }) {
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [txError, setTxError] = useState<string>("");

  const { data: listing } = useScaffoldReadContract({
    contractName: "NFTMarket",
    functionName: "getListing",
    args: [nftContractAddress, tokenId],
  });

  const { writeContractAsync: buyItem } = useScaffoldWriteContract("NFTMarket");
  const { writeContractAsync: cancelListing } = useScaffoldWriteContract("NFTMarket");

  if (!listing || !listing.isActive) return null;

  const isSeller = listing.seller === myAddress;

  const handleBuy = async () => {
    setTxStatus("pending");
    setTxError("");
    try {
      await buyItem({
        functionName: "buyItem",
        args: [nftContractAddress, tokenId],
        value: listing.price,
      });
      setTxStatus("success");
    } catch (err: any) {
      setTxStatus("error");
      setTxError(err.message || "購買失敗");
    }
  };

  const handleCancel = async () => {
    setTxStatus("pending");
    setTxError("");
    try {
      await cancelListing({
        functionName: "cancelListing",
        args: [nftContractAddress, tokenId],
      });
      setTxStatus("success");
    } catch (err: any) {
      setTxStatus("error");
      setTxError(err.message || "取消失敗");
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-primary/20">
      <div className="card-body">
        <h2 className="card-title text-primary">Token #{tokenId.toString()}</h2>
        <div className="text-sm space-y-1">
          <p><span className="text-gray-500">賣家:</span> <span className="font-mono">{listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}</span></p>
          <p><span className="text-gray-500">價格:</span> <span className="text-xl font-bold text-secondary">{formatEther(listing.price)} ETH</span></p>
        </div>

        <div className="mt-4 min-h-[1.5rem] text-xs">
          {txStatus === "pending" && <p className="text-yellow-600 animate-pulse">交易處理中...</p>}
          {txStatus === "success" && <p className="text-green-600 font-bold">交易成功！</p>}
          {txStatus === "error" && <p className="text-red-600 truncate" title={txError}>錯誤: {txError}</p>}
        </div>

        <div className="card-actions justify-end mt-2">
          {isSeller ? (
            <button 
              className={`btn btn-error btn-sm w-full ${txStatus === "pending" ? "loading" : ""}`}
              onClick={handleCancel}
              disabled={txStatus === "pending" || txStatus === "success"}
            >
              {txStatus === "pending" ? "處理中..." : "取消上架"}
            </button>
          ) : (
            <button 
              className={`btn btn-primary btn-sm w-full ${txStatus === "pending" ? "loading" : ""}`}
              onClick={handleBuy}
              disabled={txStatus === "pending" || txStatus === "success"}
            >
              {txStatus === "pending" ? "處理中..." : "立即購買"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
