// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard {

    struct Listing {
        address seller;
        uint256 price;
        bool isActive;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;

    uint256 public constant FEE_PERCENT = 25;
    uint256 public constant FEE_BASE = 1000;
    address public feeRecipient;

    event ItemListed(address indexed nftContract, uint256 indexed tokenId, address indexed seller, uint256 price);
    event ItemSold(address indexed nftContract, uint256 indexed tokenId, address indexed buyer, address seller, uint256 price);
    event ListingCancelled(address indexed nftContract, uint256 indexed tokenId, address indexed seller);  

    constructor(address _feeRecipient) {
        require(_feeRecipient != address(0), "Fee recipient cannot be zero address");
        feeRecipient = _feeRecipient;
    }

    function listItem(address nftContract, uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be greater than zero");
        require(!listings[nftContract][tokenId].isActive, "Item already listed");
        
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the token owner");
        require(
            nft.getApproved(tokenId) == address(this) ||
            nft.isApprovedForAll(msg.sender, address(this)),
            "Market not approved"
        );
        
        listings[nftContract][tokenId] = Listing({ seller: msg.sender, price: price, isActive: true });    
        emit ItemListed(nftContract, tokenId, msg.sender, price);
    }

    function buyItem(address nftContract, uint256 tokenId) external payable nonReentrant {
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.isActive, "Item not listed");
        require(msg.value >= listing.price, "Insufficient payment");
        require(listing.seller != msg.sender, "Cannot buy your own NFT");

        address seller = listing.seller;
        uint256 price = listing.price;

        // Effects FIRST
        listing.isActive = false;

        // Interactions LAST
        uint256 fee = (price * FEE_PERCENT) / FEE_BASE;
        uint256 sellerProceeds = price - fee;

        IERC721(nftContract).safeTransferFrom(seller, msg.sender, tokenId);

        (bool feeSuccess, ) = payable(feeRecipient).call{value: fee}("");
        if (!feeSuccess) {
            sellerProceeds = sellerProceeds + fee;
        }

        (bool sellerSuccess, ) = payable(seller).call{value: sellerProceeds}("");
        require(sellerSuccess, "Seller transfer failed");

        if (msg.value > price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - price}("");
            require(refundSuccess, "Refund failed");
        }

        emit ItemSold(nftContract, tokenId, msg.sender, seller, price);
    }

    function cancelListing(address nftContract, uint256 tokenId) external {
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.isActive, "Item not listed");
        require(listing.seller == msg.sender, "Not the seller");
        listing.isActive = false;
        emit ListingCancelled(nftContract, tokenId, msg.sender);
    }

    function getListing(address nftContract, uint256 tokenId) external view returns (Listing memory) {     
        return listings[nftContract][tokenId];
    }
}
