# ZK Card Game SDK

## Introduction

Introducing the Hypr zk card game SDK - a versatile toolkit empowering game developers to effortlessly create on-chain card games with zero-knowledge proof technology. Thanks to the support of [Geometry Research](https://geometryresearch.xyz).

## Features

-   Define custom cards.

    Developers have the flexibility to define their desired number of cards, suites, and values.

-   Hide card values.

    The card values undergo encryption using the aggregate key, and players conceal these encrypted values from one another.

-   Zero-knowledge card shuffling.

    Off-chain, the shuffling process takes place, ensuring fair randomness, as each player utilizes zero-knowledge proofs.

-   Zero-knowledge card revealling.

    Card values remain concealed from any subset of players, unless unanimous agreement is reached among all players to reveal the cards.

-   Cheating prevention.
    Every confidential off-chain computation is verified through a zero-knowledge proof and validated by the on-chain smart contract.

## Use cases

The protocol facilitates a wide range of on-chain card-like games, including but not limited to:

-   Poker games
-   Casino games
-   Board games
-   Turn-based games
-   Card trading games
-   Any game that involves card models

## SDK functions

Developers only require six game functions to construct card games on the Hypr platform. For further information, please refer to the Solidity interface. Please checkout the [Solidity interface](https://github.com/HyprNetwork/zk-card-game-sdk/blob/main/interfaces/IMentalPoker.sol) for more details.

```js
// Verify proof of ownership of a game key
function verifyKeyOwnership(
    bytes params,
    bytes pubKey,
    bytes memo,
    bytes keyProof
) external view returns (bool);

// Compute aggregation public key
function computeAggregateKey(
    bytes[] pubKeys
) external view returns (bytes memory);

// Mask a playing card
function mask(
    bytes params,
    bytes sharedKey,
    bytes encoded
) external pure returns (bytes memory);

// Verify proof of shuffling of deck
function verifyShuffle(
    bytes params,
    bytes sharedKey,
    bytes[] curDeck,
    bytes[] newDeck,
    bytes shuffleProof
) external view returns (bool);

// Verify proof of reveal token of a card
function verifyReveal(
    bytes params,
    bytes pubKey,
    bytes revealToken,
    bytes masked,
    bytes revealProof
) external view returns (bool);

// Reveal a masked playing card
function reveal(
    bytes[] revealTokens,
    bytes masked
) external view returns (bytes memory);
```

## Contract address

Above APIs will be provided via precompiled smart contract on Hypr.

| Network     | Contract Address                             |
| ----------- | -------------------------------------------- |
| GSC Mainnet | `0x0000000000000000000000000000000000003000` |
| GSC Testnet | `0x0000000000000000000000000000000000003000` |

## Examples

Build your games on top of example game contracts to save time and effort:

| Contract                                                                                                                     | Description                                                                                |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [GameInstance.sol](https://github.com/HyprNetwork/zk-card-game-sdk/blob/main/contracts/GameInstance.sol)                  | An example of basic game contract for general card game                                    |
| [OneTimeDrawInstance.sol](https://github.com/HyprNetwork/zk-card-game-sdk/blob/main/contracts/OneTimeDrawInstance.sol)    | An example of game contract where players draw all their hands at once, e.g. Texas Hold'em |
| [TexasHoldemController.sol](https://github.com/HyprNetwork/zk-card-game-sdk/blob/main/contracts/examples/TexasHoldemController.sol) | A minimized implementation of Texas Hold'em using `OneTimeDrawInstance`                    |

## Zkcard precompile and wasm test example

```shell
yarn && make
REPORT_GAS=true
yarn mt:dev
or
yarn mt:test
```
