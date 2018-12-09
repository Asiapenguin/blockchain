import { Block } from './block';
import { Transaction } from './transaction';
import * as hash from 'hash.js';
import uuid = require("uuid/v1");

const currentNodeURL = process.argv[3];

export class Blockchain {
  
  chain: Array<Block>;
  pendingTransactions: Array<Transaction>;
  currentNodeURL: string;
  networkNodesURL: Array<string>;

  constructor() {
    this.chain = [];
    this.pendingTransactions = [];

    this.currentNodeURL = currentNodeURL
    this.networkNodesURL = [];

    // Genesis block
    this.createNewBlock(100, '0', '0');
  }

  createNewBlock(nonce, prevHash, hash): Block {
    const index = this.chain.length;
    const newBlock = new Block(index, Date.now(), this.pendingTransactions, nonce, hash, prevHash);

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  }

  getLastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  createNewTransaction(amount, sender, receiver): Transaction {
    const newUuid = uuid().split('-').join('');
    const newTransaction = new Transaction(newUuid, amount, sender, receiver);

    return newTransaction;
  }

  addTransactionToPendingTransactions(transaction: Transaction): number {
    this.pendingTransactions.push(transaction);
    
    return this.getLastBlock().index + 1;
  }

  // SHA-256
  hashBlock(data: Block, nonce: number): string {
    const dataString = data.prevHash + nonce.toString() + JSON.stringify(data.transactions);
    const resultHash = hash.sha256().update(dataString).digest('hex');

    return resultHash;
  }

  proofOfWork(data: Block) {
    // repeatedly hash until hash starts with 4 0's
    let nonce = 0;
    let newHash = this.hashBlock(data, nonce);
    
    while(!this.checkLegitimate(newHash)) {
      nonce++;
      newHash = this.hashBlock(data, nonce);
    }

    return nonce;
  }

  private checkLegitimate(newHash: string) {
    const firstFourChar = newHash.substr(0, 4);
    return firstFourChar === '0000';
  }
}