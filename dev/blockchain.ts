import { Block } from "./block";
import { Transaction } from "./transaction";
import * as hash from "hash.js";
import uuid = require("uuid/v1");

const currentNodeURL = process.argv[3];
const GENESIS_NONCE = 100;
const GENESIS_PREVHASH = "0";
const GENESIS_HASH = "0";

export class Blockchain {
  chain: Array<Block>;
  pendingTransactions: Array<Transaction>;
  currentNodeURL: string;
  networkNodesURL: Array<string>;

  constructor() {
    this.chain = [];
    this.pendingTransactions = [];

    this.currentNodeURL = currentNodeURL;
    this.networkNodesURL = [];

    // Genesis block
    this.createNewBlock(GENESIS_NONCE, GENESIS_PREVHASH, GENESIS_HASH);
  }

  createNewBlock(nonce, prevHash, hash): Block {
    const index = this.chain.length;
    const newBlock = new Block(
      index,
      Date.now(),
      this.pendingTransactions,
      nonce,
      hash,
      prevHash
    );

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  }

  getLastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  createNewTransaction(amount, sender, receiver): Transaction {
    const newUuid = uuid()
      .split("-")
      .join("");
    const newTransaction = new Transaction(newUuid, amount, sender, receiver);

    return newTransaction;
  }

  addTransactionToPendingTransactions(transaction: Transaction): number {
    this.pendingTransactions.push(transaction);

    return this.getLastBlock().index + 1;
  }

  // SHA-256
  hashBlock(data: Block, nonce: number): string {
    const dataString =
      data.prevHash + nonce.toString() + JSON.stringify(data.transactions);
    const resultHash = hash
      .sha256()
      .update(dataString)
      .digest("hex");

    return resultHash;
  }

  proofOfWork(data: Block) {
    // repeatedly hash until hash starts with 4 0's
    let nonce = 0;
    let newHash = this.hashBlock(data, nonce);

    while (!this.checkLegitimate(newHash)) {
      nonce++;
      newHash = this.hashBlock(data, nonce);
    }

    return nonce;
  }

  private checkLegitimate(newHash: string) {
    const firstFourChar = newHash.substr(0, 4);
    return firstFourChar === "0000";
  }

  isChainValid(blockchain): boolean {
    if (blockchain.chain) {
      let valid = true;

      for (let i = 1; i < blockchain.chain.length; i++) {
        const currentBlock = blockchain.chain[i];
        const prevBlock = blockchain.chain[i - 1];
        const hash = this.hashBlock(prevBlock, currentBlock.nonce);

        // check for order
        if (currentBlock.prevHash !== prevBlock.hash) {
          valid = false;
        }

        // check for data validity
        if (!this.checkLegitimate(hash)) {
          valid = false;
        }
      }

      // check genesis block
      const genesisBlock: Block = blockchain.chain[0];
      if (
        genesisBlock.nonce !== GENESIS_NONCE ||
        genesisBlock.prevHash !== GENESIS_PREVHASH ||
        genesisBlock.hash !== GENESIS_HASH ||
        genesisBlock.transactions.length !== 0
      ) {
        valid = false;
      }

      return valid;
    } else {
      return false;
    }
  }
}
