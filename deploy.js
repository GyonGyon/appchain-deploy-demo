const config = require('./config')
const transaction = require('./transaction')

const Appchain = require('@appchain/base').default

const appchain = Appchain(config.chain)

const ap = Appchain()
// Appchain(config.chain)
// ap.setProvider(config.chain)
// ap._provider = ap.providers.HttpProvider(config.chain)
// console.log('has provider:\n', appchain, '\n')
// console.log('not provider:\n', ap, '\n')

const { abi, bytecode } = require('./compiled.js')

let _contractAddress = ''
// contract contract instance
const contract = new appchain.base.Contract(abi)

appchain.base
  .getBlockNumber()
  .then((current) => {
    transaction.validUntilBlock = +current + 88 // update transaction.validUntilBlock
    transaction.from = appchain.base.accounts.privateKeyToAccount(config.privateKey).address
    // deploy contract
    return contract
      .deploy({
        data: bytecode,
        arguments: ['test'],
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
    contract.options.address = contractAddress
    return appchain.base.storeAbi(contractAddress, abi, transaction) // store abi on the chain
  })
  .then((res) => {
    if (res.errorMessage) throw new Error(res.errorMessage)
    return appchain.base.getAbi(_contractAddress) // get abi from the chain
  })
  .then((abi) => {
    // console.log('abi:', abi)
    console.log(contract)
    contract.methods
      .sayHi()
      .call()
      .then(console.log.bind(console, '\ncall res'))
    const p = contract.methods
      .changeName('changeName')
      .send({ from: _contractAddress })
      .then(console.log.bind(console, 'send res'))
      .then(console.log(contract.methods.sayHi().call()))
  })
  .catch((err) => console.error(err))
