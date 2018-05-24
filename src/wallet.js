const Elliptic = require('elliptic');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const ec = new Elliptic.ec('secp256k1');

const privateKeyLocation = path.join(__dirname, 'privateKey');

const generatePrivateKey = () => {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate();
  return privateKey.toString(16);
};

const getPrivateFromWallet = () => {
  const buffer = fs.readFileSync(privateKeyLocation, 'utf-8');
  buffer.toString();
};

const getPublicFromWallet = () => {
  const privateKey = getPrivateFromWallet();
  const key = ec.keyFromPrivate(privateKey, 'hex');
  return key.getPublic().encode('hex');
};

const getBalance = (address, uTxOuts) => {
  return _(uTxOuts)
    .filter(uTxOut => uTxOut.address === address)
    .map(uTxOut => uTxOut.amount)
    .sum();
};

const initWallet = () => {
  if (fs.existsSync(privateKeyLocation)) {
    return;
  }
  const newPrivateKey = generatePrivateKey();
  fs.writeFileSync(privateKeyLocation, newPrivateKey);
};

module.exports = {
  initWallet
};
