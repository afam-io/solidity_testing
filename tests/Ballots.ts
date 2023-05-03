import { expect } from "chai";
import { Ballot } from "../typechain-types";
import { ethers } from "hardhat";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

describe("Ballot", () => {
  let ballotContract: Ballot;
  beforeEach(async () => {
    const ballotContractFactory = await ethers.getContractFactory("Ballot");
    const converted = PROPOSALS.map((x) => ethers.utils.formatBytes32String(x));
    ballotContract = await ballotContractFactory.deploy(converted);
    await ballotContract.deployed();
  });

  describe("when the contract is deployed", function () {
    it("has the provided proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });

    it("has zero votes for all proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(proposal.voteCount).to.eq(0);
      }
    });

    it("sets the deployer address as chairperson", async () => {
      const chairperson = await ballotContract.chairperson();
      const accounts = await ethers.getSigners();
      expect(chairperson).to.eq(accounts[0].address);
    });
  });
});
