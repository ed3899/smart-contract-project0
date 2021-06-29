import {expect, assert} from "chai";
import {BigNumber, Contract} from "ethers";
import {ethers, waffle} from "hardhat";
const {loadFixture, deployContract} = waffle;

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

describe("TodoList", async function () {
  const TodoListFactory = await ethers.getContractFactory("TodoList");
  let TodoList = await TodoListFactory.deploy();
  await TodoList.deployed();

  it("Was deployed succesfully", async function () {
    const {address} = TodoList;
    assert.notEqual(address, "0x0");
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it("First task should have the right properties", async function () {
    expect(await TodoList.taskCount()).to.be.equal("1");
    const tasks: Array<any> = await TodoList.tasks(1);

    expect(<BigNumber>tasks[0].toNumber()).to.equal(1);
    expect(tasks[1]).to.equal("First task");
    expect(tasks[2]).to.be.false;
  });
});
