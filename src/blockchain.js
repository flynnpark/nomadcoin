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

console.log(blockchain);
