import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployNFTMarket: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedMyNFT = await hre.deployments.get("MyNFT");
  console.log("MyNFT deployed at:", deployedMyNFT.address);

  await deploy("NFTMarket", {
    from: deployer,
    args: [deployer],
    log: true,
    autoMine: true,
  });
};

export default deployNFTMarket;
deployNFTMarket.tags = ["NFTMarket"];
deployNFTMarket.dependencies = ["MyNFT"];
