import { Router, Request, Response } from "express";
import { Blockchain } from "../blockchain";
import bodyParser = require("body-parser");
import uuid = require("uuid/v1");

const app: Router = Router();

const nodeAddress = uuid().split('-').join('');

const blockchain = new Blockchain();

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is up");
});

app.get("/blockchain", (req: Request, res: Response) => {
  res.send(blockchain);
});

app.post("/transaction", (req: Request, res: Response) => {
  if (req.body.amount && req.body.sender && req.body.receiver) {
    const index = blockchain.createTransaction(
      req.body.amount,
      req.body.sender,
      req.body.receiver
    );
    res.json({
      note: `Transaction will be added in block ${index}.`
    });
  } else {
    res.json({
      note: `JSON Format Error: Must contain "amount", "sender", and "receiver".`
    });
  }
});

app.get("/mine", (req: Request, res: Response) => {
  const lastBlock = blockchain.getLastBlock();
  const prevHash = lastBlock.hash;
  const nonce = blockchain.proofOfWork(lastBlock);
  const hash = blockchain.hashBlock(lastBlock, nonce);

  // reward miner
  blockchain.createTransaction(12.5, '00', nodeAddress);

  const newBlock = blockchain.createNewBlock(nonce, prevHash, hash);
  res.json({
    note: "New block mined",
    block: newBlock
  });
});

export const AppController: Router = app;
