# Agent Report: Contract Security Fixes (CR1)
Applied fixes for P1/P2 issues identified in Critic Round 1.
- Fixed totalSupply() logic in MyNFT.sol
- Added Withdrawn event to MyNFT.sol
- Added zero address check to NFTMarket.sol constructor
- Implemented DoS protection for feeRecipient in NFTMarket.sol
- Added duplicate listing check in NFTMarket.sol
