import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { MyNFT, NFTMarket } from "../typechain-types";

describe("NFT DApp Tests", function () {
  let myNFT: MyNFT;
  let nftMarket: NFTMarket;
  let owner: SignerWithAddress;
  let seller: SignerWithAddress;
  let buyer: SignerWithAddress;
  let feeRecipient: SignerWithAddress;

  const MINT_PRICE = ethers.parseEther("0.01");
  const LIST_PRICE = ethers.parseEther("0.1");

  beforeEach(async function () {
    [owner, seller, buyer, feeRecipient] = await ethers.getSigners();

    const MyNFTFactory = await ethers.getContractFactory("MyNFT");
    myNFT = await MyNFTFactory.deploy(owner.address);

    const NFTMarketFactory = await ethers.getContractFactory("NFTMarket");
    nftMarket = await NFTMarketFactory.deploy(feeRecipient.address);
  });

  describe("MyNFT", function () {
    it("should mint successfully with correct payment", async function () {
      await myNFT.connect(seller).mint("ipfs://test", { value: MINT_PRICE });
      expect(await myNFT.totalSupply()).to.equal(1);
      expect(await myNFT.ownerOf(1)).to.equal(seller.address);
    });

    it("should revert when payment is insufficient", async function () {
      await expect(
        myNFT.connect(seller).mint("ipfs://test", { value: ethers.parseEther("0.005") })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("should allow owner to withdraw ETH", async function () {
      await myNFT.connect(seller).mint("ipfs://test", { value: MINT_PRICE });
      const initialBalance = await ethers.provider.getBalance(owner.address);
      
      const withdrawTx = await myNFT.connect(owner).withdraw();
      const receipt = await withdrawTx.wait();
      const gasUsed = receipt!.gasUsed;
      const gasPrice = receipt!.gasPrice;
      const gasCost = gasUsed * gasPrice;
      
      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.equal(initialBalance + MINT_PRICE - gasCost);
    });

    it("should revert withdraw for non-owner", async function () {
      await expect(myNFT.connect(seller).withdraw())
        .to.be.revertedWithCustomError(myNFT, "OwnableUnauthorizedAccount")
        .withArgs(seller.address);
    });

    it("should return correct tokenURI after minting", async function () {
      const uri = "ipfs://test-uri";
      await myNFT.connect(seller).mint(uri, { value: MINT_PRICE });
      expect(await myNFT.tokenURI(1)).to.equal(uri);
    });
  });

  describe("NFTMarket", function () {
    beforeEach(async function () {
      await myNFT.connect(seller).mint("ipfs://test", { value: MINT_PRICE });
      await myNFT.connect(seller).approve(await nftMarket.getAddress(), 1);
    });

    it("should list item after approval", async function () {
      await nftMarket.connect(seller).listItem(await myNFT.getAddress(), 1, LIST_PRICE);
      const listing = await nftMarket.getListing(await myNFT.getAddress(), 1);
      expect(listing.isActive).to.be.true;
      expect(listing.price).to.equal(LIST_PRICE);
    });

    it("should revert listItem without approval", async function () {
      await myNFT.connect(seller).mint("ipfs://test2", { value: MINT_PRICE });
      await expect(
        nftMarket.connect(seller).listItem(await myNFT.getAddress(), 2, LIST_PRICE)
      ).to.be.revertedWith("Market not approved");
    });

    it("should buy item and transfer NFT + ETH correctly", async function () {
      await nftMarket.connect(seller).listItem(await myNFT.getAddress(), 1, LIST_PRICE);
      
      const feeRecipientBalanceBefore = await ethers.provider.getBalance(feeRecipient.address);
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);

      await nftMarket.connect(buyer).buyItem(await myNFT.getAddress(), 1, { value: LIST_PRICE });

      expect(await myNFT.ownerOf(1)).to.equal(buyer.address);
      
      const feeRecipientBalanceAfter = await ethers.provider.getBalance(feeRecipient.address);
      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);

      // Fee is 2.5%
      const expectedFee = (LIST_PRICE * 25n) / 1000n;
      expect(feeRecipientBalanceAfter - feeRecipientBalanceBefore).to.equal(expectedFee);
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(LIST_PRICE - expectedFee);
    });

    it("should revert buyItem with insufficient payment", async function () {
      await nftMarket.connect(seller).listItem(await myNFT.getAddress(), 1, LIST_PRICE);
      await expect(
        nftMarket.connect(buyer).buyItem(await myNFT.getAddress(), 1, { value: MINT_PRICE })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("should revert when buyer is the seller", async function () {
      await nftMarket.connect(seller).listItem(await myNFT.getAddress(), 1, LIST_PRICE);
      await expect(
        nftMarket.connect(seller).buyItem(await myNFT.getAddress(), 1, { value: LIST_PRICE })
      ).to.be.revertedWith("Cannot buy your own NFT");
    });

    it("should cancel listing successfully", async function () {
      await nftMarket.connect(seller).listItem(await myNFT.getAddress(), 1, LIST_PRICE);
      await nftMarket.connect(seller).cancelListing(await myNFT.getAddress(), 1);
      const listing = await nftMarket.getListing(await myNFT.getAddress(), 1);
      expect(listing.isActive).to.be.false;
    });

    it("should revert cancelListing for non-seller", async function () {
      await nftMarket.connect(seller).listItem(await myNFT.getAddress(), 1, LIST_PRICE);
      await expect(
        nftMarket.connect(buyer).cancelListing(await myNFT.getAddress(), 1)
      ).to.be.revertedWith("Not the seller");
    });
  });
});
