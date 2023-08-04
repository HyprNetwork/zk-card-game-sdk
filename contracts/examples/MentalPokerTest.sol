// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import '../../interfaces/IMentalPoker.sol';

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract MentalPokerTest {
    address mentalPokerAddr;
    IMentalPoker mentalPoker;

    constructor(address _mentalPokerAddr) {
        mentalPokerAddr = _mentalPokerAddr;
        mentalPoker = IMentalPoker(mentalPokerAddr);
    }

    function verifyKeyOwnership(
        bytes calldata params,
        bytes calldata pubKey,
        bytes calldata memo,
        bytes calldata keyProof
    ) public view returns (bool) {
        return mentalPoker.verifyKeyOwnership(params, pubKey, memo, keyProof);
    }

    function computeAggregateKey(bytes[] calldata pubKeys) public view returns (bytes memory) {
        return mentalPoker.computeAggregateKey(pubKeys);
    }

    function mask(
        bytes calldata params,
        bytes calldata sharedKey,
        bytes calldata encoded
    ) public view returns (bytes memory) {
        return mentalPoker.mask(params, sharedKey, encoded);
    }

    function verifyShuffle(
        bytes calldata params,
        bytes calldata sharedKey,
        bytes[] calldata curDeck,
        bytes[] calldata newDeck,
        bytes calldata shuffleProof
    ) public view returns (bool) {
        return mentalPoker.verifyShuffle(params, sharedKey, curDeck, newDeck, shuffleProof);
    }

    function verifyReveal(
        bytes calldata params,
        bytes calldata pubKey,
        bytes calldata revealToken,
        bytes calldata masked,
        bytes calldata revealProof
    ) public view returns (bool) {
        return mentalPoker.verifyReveal(params, pubKey, revealToken, masked, revealProof);
    }

    function reveal(bytes[] calldata revealTokens, bytes calldata masked) public view returns (bytes memory) {
        return mentalPoker.reveal(revealTokens, masked);
    }

    function test(bytes calldata param1, bytes[] calldata param2) public view returns (bytes memory) {
        return mentalPoker.test(param1, param2);
    }
}
