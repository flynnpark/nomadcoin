const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const Blockchain = require('./blockchain');
const P2P = require('./p2p');
const Mempool = require('./mempool');
const Wallet = require('./wallet');

const { getBlockchain, createNewBlock, getAccountBalance, sendTx } = Blockchain;
const { startP2PServer, connectToPeers } = P2P;
const { getMempool } = Mempool;
const { initWallet, getPublicFromWallet } = Wallet;

const PORT = process.env.HTTP_PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(morgan('combined'));

app
  .route('/blocks')
  .get((req, res) => {
    res.send(getBlockchain());
  })
  .post((req, res) => {
    const newBlock = createNewBlock();
    res.send(newBlock);
  });

app.post('/peers', (req, res) => {
  const {
    body: { peer }
  } = req;
  connectToPeers(peer);
  res.send();
});

app.get('/me/balance', (req, res) => {
  const balance = getAccountBalance();
  res.send({ balance });
});

app.get('/me/address', (req, res) => {
  res.send(getPublicFromWallet());
});

app.get('/blocks/:hash', (req, res) => {
  const {
    params: { hash }
  } = req;
  const block = _.find(getBlockchain(), { hash });
  if (block === undefined) {
    res.status(400).send('Block not found');
  } else {
    res.send(block);
  }
});

app
  .route('/transactions')
  .get((req, res) => {
    res.send(getMempool());
  })
  .post((req, res) => {
    try {
      const {
        body: { address, amount }
      } = req;
      if (address === undefined || amount === undefined) {
        throw Error('Please specify and address and an amount');
      } else {
        const txRes = sendTx(address, amount);
        res.send(txRes);
      }
    } catch (e) {
      res.status(400).send(e.message);
    }
  });

const server = app.listen(PORT, () =>
  console.log(`Nomadcoin HTTP Server Running on port ${PORT} ✅`)
);

initWallet();
startP2PServer(server);
