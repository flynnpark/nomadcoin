const _ = require('lodash');
const Transactions = require('./transactions');

const { validateTx } = Transactions;

let momPool = [];

const getTxInsInPool = memPool =>
  _(memPool)
    .map(tx => tx.txIns)
    .flatten()
    .value();

const isTxValidForPool = (tx, memPool) => {
  const txInsInPool = getTxInsInPool(memPool);

  const isTxInAlreadyInPool = (txIns, txIn) =>
    _.find(txIns, txInInPool => {
      return (
        txIn.txOutIndex === txInInPool.txOutIndex &&
        txIn.txOutId === txInInPool.txOutId
      );
    });

  for (const txIn of tx.txIns) {
    if (isTxInAlreadyInPool(txInsInPool, txIn)) {
      return false;
    }
  }
  return true;
};

const addToMemPool = (tx, uTxOutList) => {
  if (!validateTx(tx, uTxOutList)) {
    throw Error('This tx is invalid. Will not add it to pool');
  } else if (!isTxValidForPool(tx, memPool)) {
    throw Error('This tx is invalid for the pool. Will not add it.');
  }
  memPool.push(tx);
};

module.exports = {
  addToMemPool
};
