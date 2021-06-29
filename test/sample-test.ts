import {expect, assert} from "chai";
import {MockProvider} from "ethereum-waffle";
import {BigNumber, Contract, Wallet} from "ethers";
import {ethers, waffle} from "hardhat";
const {loadFixture, deployContract} = waffle;

//Contract ABI
import * as TodoListABI from "../artifacts/contracts/TodoList.sol/TodoList.json";

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

describe("TodoList", function () {
  //Fixtures
  async function fixture(_wallets: Wallet[], _mockProvider: MockProvider) {
    const signers = await ethers.getSigners();
    let token: Contract = await deployContract(signers[0], TodoListABI);
    return {token};
  }

  // this.beforeEach(async function () {
  //   // TodoListFactory = await ethers.getContractFactory("TodoList");
  //   // TodoList = await TodoListFactory.deploy();
  //   // await TodoList.deployed();
  // });

  it("Was deployed succesfully", async function () {
    const {token} = await loadFixture(fixture);
    const {address} = token;
    assert.notEqual(address, "0x0");
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it("First task should have the right properties", async function () {
    const {token} = await loadFixture(fixture);
    expect(await token.taskCount()).to.be.equal("1");
    const tasks: Array<any> = await token.tasks(1);

    expect(<BigNumber>tasks[0].toNumber()).to.equal(1);
    expect(tasks[1]).to.equal("First task");
    expect(tasks[2]).to.be.false;
  });
});
