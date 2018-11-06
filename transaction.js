const config = require('./config')
const transaction = {
  from: '0x0000000000000000000000000000000000000000',
  privateKey: config.privateKey,
  nonce: 999999,
  quota: 10000000,
  chainId: 1,
  version: 0,
  validUntilBlock: 999999,
  value: '0x0',
}

module.exports = transaction
