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

describe.only("TodoList", function () {
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
    const taskCount = await token.taskCount();

    expect(taskCount).to.be.equal(1);
    const tasks: Array<any> = await token.tasks(1);

    expect(<BigNumber>tasks[0].toNumber()).to.equal(taskCount);
    expect(tasks[1]).to.equal("First task");
    expect(tasks[2]).to.be.false;
  });

  it("Should emit an event when deployed", async function () {
    const {token} = await loadFixture(fixture);
    const evABI = [
      `event TaskCreated(uint256 indexed id, string indexed content, bool indexed completed, string nI_content)`,
    ];
    const evIface = new ethers.utils.Interface(TodoListABI.abi);

    const result = await token.createTask("Dummy text");

    const eventLogs = await token.filters.TaskCreated(2, "Dummy text");
    const _eventLogs = await ethers.provider.getLogs(eventLogs);

    const res = evIface.parseLog({
      topics: _eventLogs[0].topics,
      data: _eventLogs[0].data,
    });

    expect(result)
      .to.emit(token, "TaskCreated")
      .withArgs(2, "Dummy text", false, "Dummy text");
  });

  it("Toggles completed", async function () {
    const {token} = await loadFixture(fixture);
    await token.toggleCompleted(1);

    const updatedTask: Array<any> = await token.tasks(1);
    expect(updatedTask[2]).to.be.true;
  });
});
