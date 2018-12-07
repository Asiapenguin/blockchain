import { Transaction } from './transaction';

export class Block {
  index: number;
  timestamp: Date;
  transactions: Array<Transaction>;
  nonce: number;
  hash: string;
  prevHash: string;

  constructor(index, time, transactions, nonce, hash, prevHash) {
    this.index = index;
    this.timestamp = time;
    this.transactions = transactions;
    this.nonce = nonce;
    this.hash = hash;
    this.prevHash = prevHash;
  }
}