# ZK Card Game SDK

## Introduction

Hypr provides a zero-knowledge card protocol via precompiled smart contract for on-chain games. Thanks to the support of [Geometry Research](https://geometryresearch.xyz), Hypr is able to bring this powerful tool to game developers in the web3 space.

## Features

-   Define custom cards.

    Developers can define their own number of cards, suites and values.

-   Hide card values.

    The card values are encrypted with the aggregate key and players hide the encrypted values from each other.

-   Zero-knowledge card shuffling.

    The shuffling is done off-chain with fair randomness by every player using zero-knowledge proofs.

-   Zero-knowledge card revealling.

    No sub-group of players can see the card values unless all players agree to reveal the cards.

-   Cheating prevention.
    Each secret off-chain computation is proven in zero-knowledge proof and verified by on-chain smart contract.

## Use cases

The protocol allows any on-chain card-like games including

-   Poker games
-   Casino games
-   Board games
-   Turn-based games
-   Card trading games
-   Any game having card models

## API list

Developers need only six game APIs to build games on top of Hypr platform. Pleae checkout [Solidity interface](https://github.com/HyprNetwork/zk-card-game-sdk/blob/main/interfaces/IMentalPoker.sol) for more details.

```
function verifyKeyOwnership(bytes params, bytes pubKey, bytes memo, bytes keyProof) external view returns (bool);
function computeAggregateKey(bytes[] pubKeys) external view returns (bytes memory);
function mask(bytes params, bytes sharedKey, bytes encoded) external pure returns (bytes memory);
function verifyShuffle(bytes params, bytes sharedKey, bytes[] curDeck, bytes[] newDeck, bytes shuffleProof) external view returns (bool);
function verifyReveal(bytes params, bytes pubKey, bytes revealToken, bytes masked, bytes revealProof) external view returns (bool);
function reveal(bytes[] revealTokens, bytes masked) external view returns (bytes memory);
```

## Contract address

Above APIs will be provided via precompiled smart contract on game side chain (GSC).

| Network     | Contract Address                             |
| ----------- | -------------------------------------------- |
| GSC Mainnet | `0x0000000000000000000000000000000000003000` |
| GSC Testnet | `0x0000000000000000000000000000000000003000` |

## Starter kit and examples

Build your games on top of example game contracts to save time and effort. The starter kit includes

| Contract                                                                                                                     | Description                                                                                |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [GameInstance.sol](https://github.com/HyprNetwork/zk-card-game-sdk/blob/main/contracts/GameInstance.sol)                  | An example of basic game contract for general card game                                    |
| [OneTimeDrawInstance.sol](https://github.com/HyprNetwork/zk-card-game-sdk/blob/main/contracts/OneTimeDrawInstance.sol)    | An example of game contract where players draw all their hands at once, e.g. Texas Hold'em |
| [TexasHoldemController.sol](https://github.com/HyprNetwork/zk-card-game-sdk/blob/main/examples/TexasHoldemController.sol) | A minimized implementation of Texas Hold'em using `OneTimeDrawInstance`                    |

## Zkcard precompile and wasm test example

```shell
yarn && make
REPORT_GAS=true
yarn mt:dev
or
yarn mt:test
```
