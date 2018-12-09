import { Blockchain } from "../dev/blockchain";
import { expect } from "chai";
import "mocha";
import { Block } from "../dev/block";
import { Transaction } from "../dev/transaction";

describe("BlockchainTest", () => {
  const blockchain = new Blockchain();

  const prevHash =
    "5D25DEC8523C8B3726E073A9946A";
  const currentHash =
    "47787110B5C621433BE3607B9B50";

  const transactions = [
    new Transaction("IUO9UASIU12", 100, "ADKFH123", "34HH123SAF"),
    new Transaction("9H2J3KH8JAS", 100, "PIOH14123", "HKLH123SDF")
  ];

  it("should create a new block", () => {
    expect(blockchain.chain.length).to.be.equal(1);
    blockchain.createNewBlock(100, prevHash, currentHash);
    expect(blockchain.chain.length).to.be.equal(2);
  });

  it("should hash correctly", () => {
    const block = new Block(0, Date.now(), [], 100, currentHash, prevHash);
    const hash = blockchain.hashBlock(block, 100);
    expect(hash).to.not.be.null;
  });

  it("should find a legitimate nonce", () => {
    const block = new Block(0, Date.now(), transactions, 0, currentHash, prevHash);
    const nonce = blockchain.proofOfWork(block);
    console.log(nonce);
    const hash = blockchain.hashBlock(block, nonce);
    console.log(hash);
  }).timeout(20000);
});
