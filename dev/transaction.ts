export class Transaction {
  amount: number;
  sender: string;
  receiver: string;
  
  constructor(amount, sender, receiver) {
    this.amount = amount;
    this.sender = sender;
    this.receiver = receiver;
  }
}