const CryptoJS = require('crypto-js');

class Block {
  constructor(index, hash, previousHash, timestamp, data) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
  }
}

const genesisBlock = new Block(
  0,
  'B326BD92BE843EFB8240544CB382CC9BB628A870939BC7D21AD90E8998141E64',
  null,
  1525750421,
  'This is the Genesis Block!'
);

let blockchain = [genesisBlock];

const getLastBlock = () => blockchain[blockchain.length - 1];

const getTimestamp = () => new Date().getTime() / 1000;

const getBlockchain = () => blockchain;

const createHash = (index, previousHash, timestamp, data) =>
  CryptoJS.SHA256(
    index + previousHash + timestamp + JSON.stringify(data)
  ).toString();

const createNewBlock = data => {
  const previousBlock = getLastBlock();
  const newBlockIndex = previousBlock.index + 1;
  const newTimestamp = getTimestamp();
  const newHash = createHash(
    newBlockIndex,
    previousBlock.hash,
    newTimestamp,
    data
  );
  const newBlock = new Block(
    newBlockIndex,
    newHash,
    previousBlock.hash,
    newTimestamp,
    data
  );
  addBlockToChain(newBlock);
  return newBlock;
};

const getBlocksHash = block =>
  createHash(block.index, block.previousHash, block.timestamp, block.data);

const isBlockValid = (candidateBlock, latestBlock) => {
  if (!isBlockStructureValid(candidateBlock)) {
    console.log('The candidate block structure is not valid');
    return false;
  } else if (latestBlock.index + 1 !== candidateBlock.index) {
    console.log('The candidate block does not have a valid index');
    return false;
  } else if (latestBlock.hash !== candidateBlock.previousHash) {
    console.log(
      'The previousHash of the candidate block does not the hash of the latest block'
    );
    return false;
  } else if (getBlocksHash(candidateBlock) !== candidateBlock.hash) {
    console.log('The hash of this block is invalid');
    return false;
  }
  return true;
};

const isBlockStructureValid = block => {
  return (
    typeof block.index === 'number' &&
    typeof block.hash === 'string' &&
    typeof block.previousHash === 'string' &&
    typeof block.timestamp === 'number' &&
    typeof block.data === 'string'
  );
};

const isChainValid = candidateChain => {
  const isGenesisValid = block => {
    return JSON.stringify(block) === JSON.stringify(genesisBlock);
  };
  if (!isGenesisValid(candidateChain[0])) {
    console.log(
      "The candidate chain's genesis block is not the same as our genesis block"
    );
    return false;
  }
  for (let i = 1; i < candidateChain.length; i++) {
    if ((!isBlockValid(candidateChain[i]), candidateChain[i - 1])) {
      return false;
    }
  }
  return true;
};

const replaceChain = candidateChain => {
  if (
    isChainValid(candidateChain) &&
    candidateChain.length > getBlockchain().length
  ) {
    blockchain = candidateChain;
    return true;
  } else {
    return false;
  }
};

const addBlockToChain = candidateBlock => {
  if (isBlockValid(candidateBlock, getLastBlock())) {
    getBlockchain().push(candidateBlock);
    return true;
  } else {
    return false;
  }
};

module.exports = {
  getBlockchain,
  isBlockStructureValid,
  getLastBlock,
  createNewBlock
};
