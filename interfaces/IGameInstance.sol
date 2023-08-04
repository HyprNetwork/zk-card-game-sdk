//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Interface of basic game instance.
abstract contract IGameInstance {
    // Any custom card.
    struct AnyCard {
        bytes _encoded;
        bytes _masked;
        string _playingCardID;
    }

    // The player.
    struct Player {
        address _acc;
        bytes _key;
        bytes _memo;
        uint256[] _cards;
    }

    function players() public view virtual returns (address[] memory);

    function getPlayer(address _account) public view virtual returns (Player memory);

    function isPlayer(address _account) public view virtual returns (bool);

    function isFull() public view virtual returns (bool);

    function cardHash(bytes memory _card) public pure virtual returns (bytes32);

    function isOpen(uint256 _cardIndex) public view virtual returns (bool);

    function isUsed(uint256 _cardIndex) public view virtual returns (bool);

    function playingCard(uint256 _cardIndex) public view virtual returns (string memory);

    function getRevealTokens(uint256 _cardIndex) public view virtual returns (bytes[] memory);

    /// @dev Resets the game instance.
    /// @dev This allows the game instance to be reused.
    /// @param _params The public game parameters.
    /// @param _numPlayers The required number of players for game.
    function resetGame(bytes memory _params, uint256 _numPlayers) external virtual;

    /// @dev Player joins Game.
    /// @dev A player joins the game after checking everything (e.g., the initial deck).
    /// @dev A specific game may require a player to stake some tokens (table fee, etc.) on joining.
    /// @param _player The player's address.
    /// @param _pubKey The player's public game key.
    /// @param _memo The player memo (e.g., the player's nick name).
    /// @param _keyProof The proof of player's public game key ownership.
    function joinGame(
        address _player,
        bytes memory _pubKey,
        bytes memory _memo,
        bytes memory _keyProof
    ) external virtual;

    /// @dev A player might leave the game at any time before the game starts.
    /// @dev It depends on the specific game to decide wether or not to let a player leave the game before the game starts.
    /// @dev It depends on the specific game to decide wether or not to slash table fee if a player leaves the game.
    /// @param _player The player's address.
    function leaveGame(address _player) external virtual;

    /// @dev Every player must shuffle the deck.
    /// @param _player The player's address.
    /// @param _shuffledDeck The shuffled deck of masked cards.
    /// @param _shuffleProof The proof of shuffling.
    function shuffleDeck(address _player, bytes[] memory _shuffledDeck, bytes memory _shuffleProof) external virtual;

    /// @dev Verifies and adds reveal tokens.
    /// @param _player The player's address.
    /// @param _revealMine Whether the player reveals his/her own cards.
    /// @param _cardIndexes The indexes (in deck) of the cards.
    /// @param _revealTokens The reveal tokens for the cards.
    /// @param _revealProofs The reveal proofs for the cards.
    function addRevealTokens(
        address _player,
        bool _revealMine,
        uint256[] memory _cardIndexes,
        bytes[] memory _revealTokens,
        bytes[] memory _revealProofs
    ) public virtual;

    /// @dev Ready to reveal cards or not.
    function readyToReveal(uint256[] memory _cardIndexes) public view virtual returns (bool);

    /// @dev Set card as used.
    function setUsed(uint256[] memory _cardIndexes) external virtual;

    /// @dev Number of used cards.
    function numUsed() public view virtual returns (uint256);
}
