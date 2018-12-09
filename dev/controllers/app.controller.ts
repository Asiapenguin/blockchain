import { Router, Request, Response } from "express";
import { Blockchain } from "../blockchain";
import bodyParser = require("body-parser");
import uuid = require("uuid/v1");
import rp = require("request-promise");

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
      error: `JSON Format Error: Must contain "amount", "sender", and "receiver".`
    });
  }
});

app.get("/mine", (req: Request, res: Response) => {
  const lastBlock = blockchain.getLastBlock();
  const prevHash = lastBlock.hash;
  const nonce = blockchain.proofOfWork(lastBlock);
  const hash = blockchain.hashBlock(lastBlock, nonce);

  // reward miner
  blockchain.createTransaction(12.5, "00", nodeAddress);

  const newBlock = blockchain.createNewBlock(nonce, prevHash, hash);
  res.json({
    note: "New block mined",
    block: newBlock
  });
});

app.post("/register-broadcast-node", async (req: Request, res: Response) => {
  const newNodeURL = req.body.newNodeURL;
  if (blockchain.networkNodesURL.indexOf(newNodeURL) < 0) {
    blockchain.networkNodesURL.push(newNodeURL);
  }

  const registerNodeRequestPromises = [];
  for (let networkNodeURL of blockchain.networkNodesURL) {
    const reqOptions = {
      uri: networkNodeURL + "/register-node",
      method: "POST",
      body: { newNodeURL: newNodeURL },
      json: true
    };

    registerNodeRequestPromises.push(rp(reqOptions));
  }

  // Run all the requests needed
  try {
    await Promise.all(registerNodeRequestPromises)
  } catch (err) {
    res.json({
      error: "Error in processing register-node promises."
    });
  }

  const bulkOptions = {
    uri: newNodeURL + "/register-nodes",
    method: "POST",
    body: {
      allNetworkNodesURL: [...blockchain.networkNodesURL, blockchain.currentNodeURL]
    },
    json: true
  };

  try {
    await rp(bulkOptions);
  } catch (err) {
    res.json({
      error: "Error in processing register-nodes promise."
    })
  }
  
  res.json({
    note: "New node registered with network successfully."
  });
});

app.post("/register-node", (req: Request, res: Response) => {
  const newNodeURL = req.body.newNodeURL;
  if (blockchain.networkNodesURL.indexOf(newNodeURL) < 0 &&
      blockchain.currentNodeURL !== newNodeURL) {
    blockchain.networkNodesURL.push(newNodeURL);
    res.json({
      note: "New node registered in network node."
    });
  } else {
    res.json({
      note: "Error in register-node."
    })
  }
});

app.post("/register-nodes", (req: Request, res: Response) => {
  const allNetworkNodesURL = req.body.allNetworkNodesURL;

  for (let networkNodeURL of allNetworkNodesURL) {
    if (blockchain.networkNodesURL.indexOf(networkNodeURL) < 0 &&
        blockchain.currentNodeURL !== networkNodeURL) {
      blockchain.networkNodesURL.push(networkNodeURL);
    }
  }
  res.json({
    note: "All current nodes in the network registered successfully."
  })
});

export const AppController: Router = app;
