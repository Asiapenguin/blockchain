export class Transaction {
  uuid: string;
  amount: number;
  sender: string;
  receiver: string;
  
  constructor(uuid, amount, sender, receiver) {
    this.uuid = uuid
    this.amount = amount;
    this.sender = sender;
    this.receiver = receiver;
  }
}