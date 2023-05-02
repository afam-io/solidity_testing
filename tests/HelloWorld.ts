import { expect } from "chai";
import { ethers } from "hardhat";
import { HelloWorld } from "../typechain-types";
describe("HelloWorld", () => {
  it("Should give a Hello World", async () => {
    const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
    // https://docs.ethers.io/v5/api/contract/contract-factory/#ContractFactory-deploy
    const helloWorldContract = (await helloWorldFactory.deploy()) as HelloWorld;
    // line below make sure the contract is encluded in a block before next step otherwise in a real environemtn e.g. not hardhat it worn't work,
    await helloWorldContract.deployed();
    const helloWorldText = await helloWorldContract.helloWorld();
    expect(helloWorldText).to.equal("Hello World!");
  });

  it("Should set owner to deployer account", async function () {
    const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
    // https://docs.ethers.io/v5/api/contract/contract-factory/#ContractFactory-deploy
    const helloWorldContract = (await helloWorldFactory.deploy()) as HelloWorld;
    // https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html#helpers
    const accounts = await ethers.getSigners();
    // https://docs.ethers.io/v5/api/contract/contract/#Contract-functionsCall
    const contractOwner = await helloWorldContract.owner();
    // https://www.chaijs.com/api/bdd/#method_equal
    expect(contractOwner).to.equal(accounts[0].address);
  });
});
