// Plugins
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import {task} from "hardhat/config";

//Typesafe config
import {HardhatUserConfig} from "hardhat/config";
import {BigNumber} from "ethers";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    const {address} = account;
    const balance: BigNumber = await account.getBalance();
    const formatedBalance: string = hre.ethers.utils.formatEther(balance);
    console.log(`${address} has ${formatedBalance} ether`);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.6",
};

export default config;
