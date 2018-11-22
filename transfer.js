const transfer = async (to, value) => {
  checkBalance(to)
  const current = await web3.base.getBlockNumber()
  const tx = {
    ...transaction,
    to,
    value,
    validUntilBlock: +current + 88
  }

  console.log(chalk.green.bold(`Transaction to ${to} with value ${value}`))
  const result = await web3.base.sendTransaction(tx)
  console.log(chalk.green.bold('Received Result:'))
  console.log(chalk.blue(JSON.stringify(result, null, 2)))
  setTimeout(() => {
    checkBalance(to)
  }, 6000)
}

const checkBalance = async to => {
  const balance = await web3.base.getBalance(to)
  console.log(chalk.green.bold(`Now ${to} has balance of ${balance}`))
}

const to = '0x46a23e25df9a0f6c18729dda9ad1af3b6a131161'

transfer(to, '0x10')