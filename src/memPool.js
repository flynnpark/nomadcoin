const _ = require('lodash');
const Transactions = require('./transactions');

const { validateTx } = Transactions;

let mempool = [];

const getMempool = () => _.cloneDeep(mempool);

const getTxInsInPool = mempool =>
  _(mempool)
    .map(tx => tx.txIns)
    .flatten()
    .value();

const isTxValidForPool = (tx, mempool) => {
  const txInsInPool = getTxInsInPool(mempool);

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

const addToMempool = (tx, uTxOutList) => {
  if (!validateTx(tx, uTxOutList)) {
    throw Error('This tx is invalid. Will not add it to pool');
  } else if (!isTxValidForPool(tx, mempool)) {
    throw Error('This tx is invalid for the pool. Will not add it.');
  }
  mempool.push(tx);
};

module.exports = {
  getMempool,
  addToMempool
};
