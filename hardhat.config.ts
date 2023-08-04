import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-abi-exporter'
import 'hardhat-deploy'
import 'hardhat-deploy-ethers'
import 'hardhat-gas-reporter'
import 'hardhat-contract-sizer'
import '@nomiclabs/hardhat-ganache'
import './tasks/InterfaceExample'
import './tasks/InterfaceExampleMock'

const config: HardhatUserConfig = {
    solidity: {
        version: '0.8.19',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    defaultNetwork: 'hardhat',
    networks: {
        hardhat: {
            accounts: [
                {
                    privateKey: '0x6021ba41d6df4b515fb6013c5b3c4fac9c0b39cd3c44b657a3db6ec4321b71ea',
                    balance: '100000000000000000000000000',
                },
            ],
            chainId: 9527,
            mining: {
                auto: true,
                interval: 5000,
            },
        },
        localhost: {
            url: 'http://127.0.0.1:8545',
            accounts: ['0x6021ba41d6df4b515fb6013c5b3c4fac9c0b39cd3c44b657a3db6ec4321b71ea'],
            chainId: 9527,
            timeout: 5000,
        },
        testnet: {
            url: 'http://34.219.38.228:8545',
            accounts: ['0xe74d147702ced7184fb9512f707461f56d0eeb5dd5439156dbc327a79b548c1e'],
            chainId: 9527,
            timeout: 5000,
        },
    },
    mocha: {
        timeout: 5000,
    },
    paths: {
        sources: './contracts/',
        tests: './test',
        cache: './cache',
        artifacts: './artifacts',
    },
    abiExporter: {
        path: './abi',
        runOnCompile: true,
        clear: true,
        spacing: 2,
    },
    gasReporter: {
        enabled: true,
        showMethodSig: true,
        maxMethodDiff: 10,
        gasPrice: 127,
    },
    contractSizer: {
        alphaSort: true,
        runOnCompile: true,
        disambiguatePaths: false,
    },
    typechain: {
        outDir: './build/types',
        target: 'ethers-v5',
    },     
}

export default config
