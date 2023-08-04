//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Interface OneTimeDraw game instance.
interface IOneTimeDraw {
    /// Player draws all his/her cards at once.
    event PlayerDrewCards(address indexed player, uint256[] cards);

    /// @dev A player draws all his/her (`num` of) cards from deck and submit reveal tokens for other players' cards.
    /// @dev This function is used for games that require players to draw all their cards at once.
    /// @param _player The player's address.
    /// @param _myIndexes The indexes (in deck) of the player's cards.
    /// @param _othersIndexes The indexes (in deck) of the others' cards.
    /// @param _revealTokens The reveal tokens for others' cards.
    /// @param _revealProofs The reveal proofs for others' cards.
    function drawCardsNSubmitRevealTokens(
        address _player,
        uint256[] memory _myIndexes,
        uint256[] memory _othersIndexes,
        bytes[] memory _revealTokens,
        bytes[] memory _revealProofs
    ) external;

    /// @dev A player folds his/her hand.
    /// @dev A player may leave game once he/she folds hand.
    /// @dev It's developer's responsibility to pass in the correct list of necessary un-revealed cards.
    /// @dev It's developer's responsibility to slash the player who refuses to fold AND submit reveal tokens.
    /// @param _player The player's address.
    /// @param _unrevealedIndexes The indexes (in deck) of un-revealed cards.
    /// @param _revealTokens The reveal tokens for un-revealed cards.
    /// @param _revealProofs The reveal proofs for un-revealed cards.
    function foldCards(
        address _player,
        uint256[] memory _unrevealedIndexes,
        bytes[] memory _revealTokens,
        bytes[] memory _revealProofs
    ) external;

    /// @dev A player shows his/her hand.
    /// @dev It's developer's responsibility to pass in the correct list of cards.
    /// @param _player The player's address.
    /// @param _cardIndexes The indexes (in deck) of player's cards.
    /// @param _revealTokens The reveal tokens for player's cards.
    /// @param _revealProofs The reveal proofs for player's cards.
    function showHand(
        address _player,
        uint256[] memory _cardIndexes,
        bytes[] memory _revealTokens,
        bytes[] memory _revealProofs
    ) external;
}
