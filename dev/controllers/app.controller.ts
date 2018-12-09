import { Router, Request, Response } from "express";
import { Blockchain } from "../blockchain";
import bodyParser = require("body-parser");
import uuid = require("uuid/v1");
import rp = require("request-promise");
import { Transaction } from "../transaction";
import { Block } from "../block";

const app: Router = Router();

const nodeAddress = uuid()
  .split("-")
  .join("");

const blockchain = new Blockchain();

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is up");
});

app.get("/blockchain", (req: Request, res: Response) => {
  res.send(blockchain);
});

app.post("/transaction/broadcast", async (req: Request, res: Response) => {
  if (req.body.amount && req.body.sender && req.body.receiver) {
    const newTransaction = blockchain.createNewTransaction(
      req.body.amount,
      req.body.sender,
      req.body.receiver
    );

    blockchain.addTransactionToPendingTransactions(newTransaction);

    const reqPromises = [];
    for (let networkNodeURL of blockchain.networkNodesURL) {
      const reqOptions = {
        uri: networkNodeURL + "/transaction",
        method: "POST",
        body: { newTransaction },
        json: true
      };

      reqPromises.push(rp(reqOptions));
    }

    try {
      await Promise.all(reqPromises);
    } catch (err) {
      res.json({
        error: "Error in processing transaction promises."
      });
    }

    res.json({
      note: "Transaction created and broadcasted successfully."
    });
  } else {
    res.json({
      error: `JSON must contain "amount", "sender", and "receiver".`
    });
  }
});

app.post("/transaction", (req: Request, res: Response) => {
  if (req.body) {
    const newTransaction: Transaction = req.body;
    const index = blockchain.addTransactionToPendingTransactions(
      newTransaction
    );

    res.json({
      note: `Transaction will be added in block ${index}.`
    });
  } else {
    res.json({
      error: `JSON must be of type Transaction.`
    });
  }
});

app.get("/mine", async (req: Request, res: Response) => {
  const lastBlock = blockchain.getLastBlock();
  const prevHash = lastBlock.hash;
  const nonce = blockchain.proofOfWork(lastBlock);
  const hash = blockchain.hashBlock(lastBlock, nonce);

  const newBlock: Block = blockchain.createNewBlock(nonce, prevHash, hash);

  const reqPromises = [];
  for (let networkNodeURL of blockchain.networkNodesURL) {
    const reqOptions = {
      uri: networkNodeURL + "/receive-new-block",
      method: "POST",
      body: { newBlock: newBlock },
      json: true
    };

    reqPromises.push(rp(reqOptions));
  }

  try {
    await Promise.all(reqPromises);

    // reward miner
    const reqOptions = {
      uri: blockchain.currentNodeURL + '/transaction/broadcast',
      method: "POST",
      body: {
        amount: 12.5,
        sender: "00",
        receiver: nodeAddress
      },
      json: true
    }

    try {
      await rp(reqOptions);
    } catch (err) {
      res.json({
        error: "Error in processing transaction/broadcast promise."
      })
    }
  } catch (err) {
    res.json({
      error: "Error in processing receive-new-block promises."
    })
  }

  res.json({
    note: "New block mined and broadcasted successfully.",
    block: newBlock
  });
});

app.post("/receive-new-block", (req: Request, res: Response) => {
  if (req.body.newBlock) {
    const newBlock: Block = req.body.newBlock;
    const lastBlock = blockchain.getLastBlock();
    const isCorrectHash = newBlock.prevHash === lastBlock.hash;
    const isCorrectIndex = newBlock.index === lastBlock.index + 1;

    if (isCorrectHash && isCorrectIndex) {
      blockchain.chain.push(newBlock);
      // clear transactions because they will all be included in newBlock
      blockchain.pendingTransactions = [];

      res.json({
        note: "New block received and added to chain",
        newBlock: newBlock
      })
    } else {
      res.json({
        error: "New block does not have correct hash or index and thus rejected.",
        newBlock: newBlock
      })
    }
  } else {
    res.json({
      error: "JSON must include newBlock."
    })
  }
});

app.post("/register-broadcast-node", async (req: Request, res: Response) => {
  const newNodeURL = req.body.newNodeURL;
  if (blockchain.networkNodesURL.indexOf(newNodeURL) < 0) {
    blockchain.networkNodesURL.push(newNodeURL);
  }

  const reqPromises = [];
  for (let networkNodeURL of blockchain.networkNodesURL) {
    const reqOptions = {
      uri: networkNodeURL + "/register-node",
      method: "POST",
      body: { newNodeURL: newNodeURL },
      json: true
    };

    reqPromises.push(rp(reqOptions));
  }

  // Run all the requests needed
  try {
    await Promise.all(reqPromises);
  } catch (err) {
    res.json({
      error: "Error in processing register-node promises."
    });
  }

  const bulkOptions = {
    uri: newNodeURL + "/register-nodes",
    method: "POST",
    body: {
      allNetworkNodesURL: [
        ...blockchain.networkNodesURL,
        blockchain.currentNodeURL
      ]
    },
    json: true
  };

  try {
    await rp(bulkOptions);
  } catch (err) {
    res.json({
      error: "Error in processing register-nodes promise."
    });
  }

  res.json({
    note: "New node registered with network successfully."
  });
});

app.post("/register-node", (req: Request, res: Response) => {
  const newNodeURL = req.body.newNodeURL;
  if (
    blockchain.networkNodesURL.indexOf(newNodeURL) < 0 &&
    blockchain.currentNodeURL !== newNodeURL
  ) {
    blockchain.networkNodesURL.push(newNodeURL);
    res.json({
      note: "New node registered in network node."
    });
  } else {
    res.json({
      note: "Error in register-node."
    });
  }
});

app.post("/register-nodes", (req: Request, res: Response) => {
  const allNetworkNodesURL = req.body.allNetworkNodesURL;

  for (let networkNodeURL of allNetworkNodesURL) {
    if (
      blockchain.networkNodesURL.indexOf(networkNodeURL) < 0 &&
      blockchain.currentNodeURL !== networkNodeURL
    ) {
      blockchain.networkNodesURL.push(networkNodeURL);
    }
  }
  res.json({
    note: "All current nodes in the network registered successfully."
  });
});

export const AppController: Router = app;
