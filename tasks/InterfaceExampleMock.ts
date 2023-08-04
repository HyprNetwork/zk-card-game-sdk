import { task, types } from 'hardhat/config'
import { ethers } from 'ethers'
import { expect } from 'chai'

// const wasm = require("./pkg/zkcard_wasm.js");
import {
    setup,
    keygen,
    computeRevealToken,
    CardRand,
    MaskedCard,
    VRevealToken,
    reveal,
    Permutation,
    VMaskedCard,
    shuffleAndRemask,
    AggregatePublicKey,
    encodeCards,
    mask,
    Card,
    PlayerName,
    contract_verify_key_ownership_mock,
    contract_mask_mock,
    contract_verify_reveal_mock,
    contract_compute_aggregate_key_mock,
    contract_reveal_mock,
    contract_verify_shuffle_mock,
    VPublicKey,
} from '../pkg/zkcard_wasm_rs'

task('iemock', 'Interface Use Example Mock').setAction(pctest)

async function pctest() {
    try {
        {
            const m = 4
            const n = 13
            const rand = CardRand.buildRand()
            const parameters = setup(rand, m, n)
            const playerName = PlayerName.NewPlayerName('Alice')
            const gameKeyAndProof = keygen(rand, parameters, playerName)
            const maskedCard = MaskedCard.rand(rand)
            const publicKey = gameKeyAndProof.getPubKey()
            const secretKey = gameKeyAndProof.getSecKey()
            const revealTokenAndProof = computeRevealToken(rand, parameters, secretKey, publicKey, maskedCard)
            const revealToken = revealTokenAndProof.getRevealToken()
            const revealProof = revealTokenAndProof.getRevealProof()

            expect(contract_verify_reveal_mock(parameters, publicKey, revealToken, maskedCard, revealProof)).to.eql(
                true
            )

            console.log('verifyReveal contract call successful!!!')
        }

        {
            const m = 4
            const n = 13
            const rand = CardRand.buildRand()
            const parameters = setup(rand, m, n)
            const playerName = PlayerName.NewPlayerName('Alice')
            const gameKeyAndProof = keygen(rand, parameters, playerName)
            const publicKey = gameKeyAndProof.getPubKey()
            const keyownershipProof = gameKeyAndProof.getProof()

            expect(contract_verify_key_ownership_mock(parameters, publicKey, playerName, keyownershipProof)).to.eql(
                true
            )

            console.log('verifyKeyOwnership contract call successful!!!')
        }

        {
            const m = 4
            const n = 13
            const rand = CardRand.buildRand()
            const maskedCard = MaskedCard.rand(rand)
            const masked = ethers.utils.toUtf8Bytes(maskedCard.serialAndEnbase64())

            const revealTokens = VRevealToken.newVRevealToken()
            const reveal_tokens = []

            for (let i = 0; i < 10; i++) {
                const parameters = setup(rand, m, n)
                const playerName = PlayerName.NewPlayerName('Alice')
                const gameKeyAndProof = keygen(rand, parameters, playerName)
                const publicKey = gameKeyAndProof.getPubKey()
                const secretKey = gameKeyAndProof.getSecKey()
                const revealTokenAndProof = computeRevealToken(rand, parameters, secretKey, publicKey, maskedCard)
                const revealToken = revealTokenAndProof.getRevealToken()

                revealTokens.push(revealToken)
                const reveal_token = ethers.utils.toUtf8Bytes(revealToken.serialAndEnbase64())
                reveal_tokens.push(reveal_token)
            }

            const cards1 = reveal(revealTokens, maskedCard).serialAndEnbase64()
            const cards2 = contract_reveal_mock(revealTokens, maskedCard).serialAndEnbase64()

            expect(cards1).to.eql(cards2)

            console.log('reveal contract call successful!!!')
        }

        {
            const m = 4
            const n = 13
            const num_of_players = 4

            const rand = CardRand.buildRand()
            const parameters = setup(rand, m, n)

            const pub_keys = VPublicKey.newVPublicKey()
            for (let i = 0; i < num_of_players; i++) {
                const playerName = PlayerName.NewPlayerName('Alice')
                const gameKeyAndProof = keygen(rand, parameters, playerName)
                const pubkey = gameKeyAndProof.getPubKey()
                pub_keys.push(pubkey)
            }

            const aggregate_key = contract_compute_aggregate_key_mock(pub_keys)

            // const aggregate_key = AggregatePublicKey.debase64AndDeserial(
            //     ethers.utils.toUtf8String(await myContr.computeAggregateKey(pub_keys))
            // )

            console.log('computeAggregateKey contract call successful!!!')

            const cur_decks = []
            const deck = VMaskedCard.newVMaskedCard()
            for (let i = 0; i < n * m; i++) {
                const maskedcard = MaskedCard.rand(rand)
                deck.push(maskedcard)
                cur_decks.push(ethers.utils.toUtf8Bytes(maskedcard.serialAndEnbase64()))
            }

            const permutation2 = Permutation.newPermutation(rand, m * n)

            const maskedCardsAndShuffleProof = shuffleAndRemask(rand, parameters, aggregate_key, deck, permutation2)

            const shuffledDecks = maskedCardsAndShuffleProof.getMaskedCards()
            const shuffleProof = maskedCardsAndShuffleProof.getShuffleProof()

            const new_decks = shuffledDecks.serialAndEnbase64().map((v: string) => ethers.utils.toUtf8Bytes(v))

            const params = ethers.utils.toUtf8Bytes(parameters.serialAndEnbase64())
            const shared_key = ethers.utils.toUtf8Bytes(aggregate_key.serialAndEnbase64())
            const shuffle_proof = ethers.utils.toUtf8Bytes(shuffleProof.serialAndEnbase64())

            expect(contract_verify_shuffle_mock(parameters, aggregate_key, deck, shuffledDecks, shuffleProof)).to.eql(
                true
            )

            // // expect(await myContr.verifyShuffle(params, shared_key, cur_decks, new_decks, shuffle_proof)).to.eql(true)

            console.log('verifyShuffle contract call successful!!!')
        }

        {
            const m = 4
            const n = 13
            const num_of_players = 4

            const rand = CardRand.buildRand()
            const parameters = setup(rand, m, n)
            const pub_keys = VPublicKey.newVPublicKey()
            for (let i = 0; i < num_of_players; i++) {
                const playerName = PlayerName.NewPlayerName('Alice')
                const gameKeyAndProof = keygen(rand, parameters, playerName)
                const pubkey = gameKeyAndProof.getPubKey()
                pub_keys.push(pubkey)
            }
            const aggregate_key = contract_compute_aggregate_key_mock(pub_keys)

            // const aggregate_key = AggregatePublicKey.debase64AndDeserial(
            //     ethers.utils.toUtf8String(await myContr.computeAggregateKey(pub_keys))
            // )
            const cards = encodeCards(rand, m * n)
            const cardsencoded = cards.serialAndEnbase64().map((v: string) => Card.debase64AndDeserial(v))

            for (let i = 0; i < cardsencoded.length; i++) {
                const masked1 = mask(parameters, aggregate_key, cardsencoded[i]).serialAndEnbase64()
                const masked2 = contract_mask_mock(parameters, aggregate_key, cardsencoded[i]).serialAndEnbase64()

                expect(masked1).to.eql(masked2)
            }

            console.log('mask contract call successful!!!')
        }
    } catch (err) {
        console.log('error: ', err)
    }
}
