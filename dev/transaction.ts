export class Transaction {
  amount;
  sender;
  receiver;
  
  constructor(amount, sender, receiver) {
    this.amount = amount;
    this.sender = sender;
    this.receiver = receiver;
  }
}