import { Blockchain } from "../dev/blockchain";
import { expect } from "chai";
import "mocha";
import { Block } from "../dev/block";
import { Transaction } from "../dev/transaction";

describe("BlockchainTest", () => {
  const blockchain = new Blockchain();

  const block1Hash = "47787110B5C621433BE3607B9B50";

  const transactions = [
    new Transaction("IUO9UASIU12", 100, "ADKFH123", "34HH123SAF"),
    new Transaction("9H2J3KH8JAS", 100, "PIOH14123", "HKLH123SDF")
  ];

  const validTestChain = {
    chain: [
      {
        index: 0,
        timestamp: 1544395680414,
        transactions: [],
        nonce: 100,
        hash: "0",
        prevHash: "0"
      },
      {
        index: 1,
        timestamp: 1544395693151,
        transactions: [
          {
            uuid: "7fdcddd0fc0411e89194edec8bbbb302",
            amount: 10,
            sender: "ASDFA4214FASD",
            receiver: "36EYSDFASDFASDF"
          }
        ],
        nonce: 4922,
        hash:
          "0000948c41f8bc463e1d058f48d7f28d6fd097f47978d0d247ba3472c2247990",
        prevHash: "0"
      },
      {
        index: 2,
        timestamp: 1544395709026,
        transactions: [
          {
            uuid: "82577ac0fc0411e89194edec8bbbb302",
            amount: 12.5,
            sender: "00",
            receiver: "7abdd4d0fc0411e89194edec8bbbb302"
          },
          {
            uuid: "8661df70fc0411e89194edec8bbbb302",
            amount: 20,
            sender: "ASDFA4214FASD",
            receiver: "36EYSDFASDFASDF"
          },
          {
            uuid: "89b9e410fc0411e89194edec8bbbb302",
            amount: 30,
            sender: "ASDFA4214FASD",
            receiver: "36EYSDFASDFASDF"
          }
        ],
        nonce: 2505,
        hash:
          "0000fa51a16ea1eb829ce6b3cb6afcab516252603f30b04fcd4568fffa31a989",
        prevHash:
          "0000948c41f8bc463e1d058f48d7f28d6fd097f47978d0d247ba3472c2247990"
      },
      {
        index: 3,
        timestamp: 1544395723044,
        transactions: [
          {
            uuid: "8bcc7060fc0411e89194edec8bbbb302",
            amount: 12.5,
            sender: "00",
            receiver: "7abdd4d0fc0411e89194edec8bbbb302"
          }
        ],
        nonce: 109613,
        hash:
          "0000133c759c5cf2d2719ec8c865d46757596998485a99a7801706d61562eabb",
        prevHash:
          "0000fa51a16ea1eb829ce6b3cb6afcab516252603f30b04fcd4568fffa31a989"
      }
    ],
    pendingTransactions: [
      {
        uuid: "94274370fc0411e89194edec8bbbb302",
        amount: 12.5,
        sender: "00",
        receiver: "7abdd4d0fc0411e89194edec8bbbb302"
      }
    ],
    currentNodeURL: "http://localhost:3000",
    networkNodesURL: []
  };
  // change hash of index 1 block
  const invalidTestChainHash = {
    chain: [
      {
        index: 0,
        timestamp: new Date(1544391715951),
        transactions: [],
        nonce: 100,
        hash: "0",
        prevHash: "0"
      },
      {
        index: 1,
        timestamp: new Date(1544391775160),
        transactions: [
          {
            uuid: "563929b0fbfb11e89c9f33144df52554",
            amount: 10,
            sender: "ASDFA4214FASD",
            receiver: "36EYSDFASDFASDF"
          },
          {
            uuid: "5aa97c20fbfb11e89c9f33144df52554",
            amount: 20,
            sender: "ASDFA4214FASD",
            receiver: "36EYSDFASDFASDF"
          },
          {
            uuid: "5cea6b70fbfb11e89c9f33144df52554",
            amount: 30,
            sender: "ASDFA4214FASD",
            receiver: "36EYSDFASDFASDF"
          }
        ],
        nonce: 4922,
        hash: "0000948c41f8bc463e1d058f48d7f28d6fd097f47978d0d247ba3472c224",
        prevHash: "0"
      },
      {
        index: 2,
        timestamp: new Date(1544391797732),
        transactions: [
          {
            uuid: "6309a660fbfb11e89c9f33144df52554",
            amount: 12.5,
            sender: "00",
            receiver: "3fbceff0fbfb11e89c9f33144df52554"
          },
          {
            uuid: "6d061b80fbfb11e89c9f33144df52554",
            amount: 40,
            sender: "ASDFA4214FASD",
            receiver: "36EYSDFASDFASDF"
          },
          {
            uuid: "6f4201c0fbfb11e89c9f33144df52554",
            amount: 50,
            sender: "ASDFA4214FASD",
            receiver: "36EYSDFASDFASDF"
          }
        ],
        nonce: 5047,
        hash:
          "0000413af8408ba728979ef2bf5cffabec8aafa24585e28a31458013a8730343",
        prevHash:
          "0000948c41f8bc463e1d058f48d7f28d6fd097f47978d0d247ba3472c2247990"
      },
      {
        index: 3,
        timestamp: new Date(1544391807184),
        transactions: [
          {
            uuid: "707c2f70fbfb11e89c9f33144df52554",
            amount: 12.5,
            sender: "00",
            receiver: "3fbceff0fbfb11e89c9f33144df52554"
          }
        ],
        nonce: 3895,
        hash:
          "0000915b2fd28b780df1e137fb4684d041778e2d9ef91240108e459d9f9d178a",
        prevHash:
          "0000413af8408ba728979ef2bf5cffabec8aafa24585e28a31458013a8730343"
      },
      {
        index: 4,
        timestamp: new Date(1544391809765),
        transactions: [
          {
            uuid: "761e9940fbfb11e89c9f33144df52554",
            amount: 12.5,
            sender: "00",
            receiver: "3fbceff0fbfb11e89c9f33144df52554"
          }
        ],
        nonce: 89503,
        hash:
          "00009b913d3dd0ef71afa7c2c96f73efc1ab23838672f8f124c77bdc5a2a9667",
        prevHash:
          "0000915b2fd28b780df1e137fb4684d041778e2d9ef91240108e459d9f9d178a"
      }
    ],
    pendingTransactions: [
      {
        uuid: "77a86d90fbfb11e89c9f33144df52554",
        amount: 12.5,
        sender: "00",
        receiver: "3fbceff0fbfb11e89c9f33144df52554"
      }
    ],
    currentNodeURL: "http://localhost:3000",
    networkNodesURL: []
  };
  // change transaction of index 1 block
  const invalidTestChainTransaction = {
    chain: [
      {
        index: 0,
        timestamp: new Date(1544391715951),
        transactions: [],
        nonce: 100,
        hash: "0",
        prevHash: "0"
      },
      {
        index: 1,
        timestamp: new Date(1544391775160),
        transactions: [
          {
            uuid: "563929b0fbfb11e89c9f33144df52554",
            amount: 10,
            sender: "ASDFA4214FASD",
            receiver: "36EYSDFASDFASDF"
          },
          {
            uuid: "5aa97c20fbfb11e89c9f33144df52554",
            amount: 20,
            sender: "ASDFA4214FASD",
            receiver: "36EYSDFASDFASDF"
          },
          {
            uuid: "5cea6b70fbfb11e89c9f33144df52554",
            amount: 30,
            sender: "ASDFA4214",
            receiver: "36EYSDFASDFASDF"
          }
        ],
        nonce: 4922,
        hash: "0000948c41f8bc463e1d058f48d7f28d6fd097f47978d0d247ba3472c2247990",
        prevHash: "0"
      },
      {
        index: 2,
        timestamp: new Date(1544391797732),
        transactions: [
          {
            uuid: "6309a660fbfb11e89c9f33144df52554",
            amount: 12.5,
            sender: "00",
            receiver: "3fbceff0fbfb11e89c9f33144df52554"
          },
          {
            uuid: "6d061b80fbfb11e89c9f33144df52554",
            amount: 40,
            sender: "ASDFA4214FASD",
            receiver: "36EYSDFASDFASDF"
          },
          {
            uuid: "6f4201c0fbfb11e89c9f33144df52554",
            amount: 50,
            sender: "ASDFA4214FASD",
            receiver: "36EYSDFASDFASDF"
          }
        ],
        nonce: 5047,
        hash:
          "0000413af8408ba728979ef2bf5cffabec8aafa24585e28a31458013a8730343",
        prevHash:
          "0000948c41f8bc463e1d058f48d7f28d6fd097f47978d0d247ba3472c2247990"
      },
      {
        index: 3,
        timestamp: new Date(1544391807184),
        transactions: [
          {
            uuid: "707c2f70fbfb11e89c9f33144df52554",
            amount: 12.5,
            sender: "00",
            receiver: "3fbceff0fbfb11e89c9f33144df52554"
          }
        ],
        nonce: 3895,
        hash:
          "0000915b2fd28b780df1e137fb4684d041778e2d9ef91240108e459d9f9d178a",
        prevHash:
          "0000413af8408ba728979ef2bf5cffabec8aafa24585e28a31458013a8730343"
      },
      {
        index: 4,
        timestamp: new Date(1544391809765),
        transactions: [
          {
            uuid: "761e9940fbfb11e89c9f33144df52554",
            amount: 12.5,
            sender: "00",
            receiver: "3fbceff0fbfb11e89c9f33144df52554"
          }
        ],
        nonce: 89503,
        hash:
          "00009b913d3dd0ef71afa7c2c96f73efc1ab23838672f8f124c77bdc5a2a9667",
        prevHash:
          "0000915b2fd28b780df1e137fb4684d041778e2d9ef91240108e459d9f9d178a"
      }
    ],
    pendingTransactions: [
      {
        uuid: "77a86d90fbfb11e89c9f33144df52554",
        amount: 12.5,
        sender: "00",
        receiver: "3fbceff0fbfb11e89c9f33144df52554"
      }
    ],
    currentNodeURL: "http://localhost:3000",
    networkNodesURL: []
  };
  // change nonce of genesis block
  const invalidTestChainGenesis = {
    chain: [
      {
        index: 0,
        timestamp: new Date(1544391715951),
        transactions: [],
        nonce: 0,
        hash: "0",
        prevHash: "0"
      },
      {
        index: 1,
        timestamp: new Date(1544391775160),
        transactions: [
          {
            uuid: "563929b0fbfb11e89c9f33144df52554",
            amount: 10,
            sender: "ASDFA4214FASD",
            receiver: "36EYSDFASDFASDF"
          },
          {
            uuid: "5aa97c20fbfb11e89c9f33144df52554",
            amount: 20,
            sender: "ASDFA4214FASD",
            receiver: "36EYSDFASDFASDF"
          },
          {
            uuid: "5cea6b70fbfb11e89c9f33144df52554",
            amount: 30,
            sender: "ASDFA4214",
            receiver: "36EYSDFASDFASDF"
          }
        ],
        nonce: 4922,
        hash: "0000948c41f8bc463e1d058f48d7f28d6fd097f47978d0d247ba3472c2247990",
        prevHash: "0"
      },
      {
        index: 2,
        timestamp: new Date(1544391797732),
        transactions: [
          {
            uuid: "6309a660fbfb11e89c9f33144df52554",
            amount: 12.5,
            sender: "00",
            receiver: "3fbceff0fbfb11e89c9f33144df52554"
          },
          {
            uuid: "6d061b80fbfb11e89c9f33144df52554",
            amount: 40,
            sender: "ASDFA4214FASD",
            receiver: "36EYSDFASDFASDF"
          },
          {
            uuid: "6f4201c0fbfb11e89c9f33144df52554",
            amount: 50,
            sender: "ASDFA4214FASD",
            receiver: "36EYSDFASDFASDF"
          }
        ],
        nonce: 5047,
        hash:
          "0000413af8408ba728979ef2bf5cffabec8aafa24585e28a31458013a8730343",
        prevHash:
          "0000948c41f8bc463e1d058f48d7f28d6fd097f47978d0d247ba3472c2247990"
      },
      {
        index: 3,
        timestamp: new Date(1544391807184),
        transactions: [
          {
            uuid: "707c2f70fbfb11e89c9f33144df52554",
            amount: 12.5,
            sender: "00",
            receiver: "3fbceff0fbfb11e89c9f33144df52554"
          }
        ],
        nonce: 3895,
        hash:
          "0000915b2fd28b780df1e137fb4684d041778e2d9ef91240108e459d9f9d178a",
        prevHash:
          "0000413af8408ba728979ef2bf5cffabec8aafa24585e28a31458013a8730343"
      },
      {
        index: 4,
        timestamp: new Date(1544391809765),
        transactions: [
          {
            uuid: "761e9940fbfb11e89c9f33144df52554",
            amount: 12.5,
            sender: "00",
            receiver: "3fbceff0fbfb11e89c9f33144df52554"
          }
        ],
        nonce: 89503,
        hash:
          "00009b913d3dd0ef71afa7c2c96f73efc1ab23838672f8f124c77bdc5a2a9667",
        prevHash:
          "0000915b2fd28b780df1e137fb4684d041778e2d9ef91240108e459d9f9d178a"
      }
    ],
    pendingTransactions: [
      {
        uuid: "77a86d90fbfb11e89c9f33144df52554",
        amount: 12.5,
        sender: "00",
        receiver: "3fbceff0fbfb11e89c9f33144df52554"
      }
    ],
    currentNodeURL: "http://localhost:3000",
    networkNodesURL: []
  };

  it("should create a new block", () => {
    expect(blockchain.chain.length).to.be.equal(1);
    blockchain.createNewBlock(100, "0", block1Hash);
    expect(blockchain.chain.length).to.be.equal(2);
  });

  it("should hash correctly", () => {
    const block = new Block(0, Date.now(), [], 100, block1Hash, "0");
    const hash = blockchain.hashBlock(block, 100);
    expect(hash).to.not.be.null;
  });

  it("should find a legitimate nonce", () => {
    const block = new Block(0, Date.now(), transactions, 0, block1Hash, "0");
    const nonce = blockchain.proofOfWork(block);
    console.log(nonce);
    const hash = blockchain.hashBlock(block, nonce);
    console.log(hash);
  }).timeout(20000);

  it("should return false for an invalid blockchain with invalid hash", () => {
    const invalidHash = blockchain.isChainValid(invalidTestChainHash);
    expect(invalidHash).to.be.false;
  });

  it("should return false for an invalid blockchain with invalid data/transaction", () => {
    const invalidTransaction = blockchain.isChainValid(invalidTestChainTransaction);
    expect(invalidTransaction).to.be.false;
  });

  it("should return false for an invalid blockchain with invalid genesis block", () => {
    const invalidGenesis = blockchain.isChainValid(invalidTestChainGenesis);
    expect(invalidGenesis).to.be.false;
  });

  it("should return true for a valid blockchain", () => {
    const validChain = blockchain.isChainValid(validTestChain);
    expect(validChain).to.be.true;
  });
});
