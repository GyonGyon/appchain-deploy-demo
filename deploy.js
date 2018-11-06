const config = require('./config')
const transaction = require('./transaction')

const Appchain = require('@appchain/base').default

const appchain = Appchain(config.chain)

const { abi, bytecode } = require('./compiled.js')

let _contractAddress = ''
// contract contract instance
const myContract = new appchain.base.Contract(abi)

appchain.base
  .getBlockNumber()
  .then((current) => {
    transaction.validUntilBlock = +current + 88 // update transaction.validUntilBlock
    transaction.from = appchain.base.accounts.privateKeyToAccount(config.privateKey).address
    // deploy contract
    return myContract
      .deploy({
        data: bytecode,
        arguments: [],
      })
      .send(transaction)
  })
  .then((txRes) => {
    if (txRes.hash) {
      // get transaction receipt
      return appchain.listeners.listenToTransactionReceipt(txRes.hash)
    } else {
      throw new Error('No Transaction Hash Received')
    }
  })
  .then((res) => {
    const { contractAddress, errorMessage } = res
    if (errorMessage) throw new Error(errorMessage)
    console.log(`contractAddress is: ${contractAddress}`)
    _contractAddress = contractAddress
    return appchain.base.storeAbi(contractAddress, abi, transaction) // store abi on the chain
  })
  .then((res) => {
    if (res.errorMessage) throw new Error(res.errorMessage)
    return appchain.base.getAbi(_contractAddress).then(console.log) // get abi from the chain
  })
  .catch((err) => console.error(err))
