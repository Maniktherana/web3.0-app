

require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/ttsCoSreYDwz3GTsPC_2DPF3LLeoJMQA',
      accounts: [ 'a0c3949deb5364dd1b29e07d3e0fa3c59ada5064d029abfcf3e80d05186b82dc' ]
    }
  }
}