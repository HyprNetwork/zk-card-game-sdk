import { task, types } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { ethers } from 'ethers'
import { expect } from 'chai'
import { IMentalPoker } from '../build/types'

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
    GameKeyAndProof,
} from '../pkg/zkcard_wasm_rs'

task('rd', 'Round Game')
    .addOptionalParam('contr', 'contract address', '0x0000000000000000000000000000000000003000', types.string)
    .setAction(pctest)

async function pctest(args: { contr: string }, hre: HardhatRuntimeEnvironment) {
    const myContr = (await hre.ethers.getContractAt('IMentalPoker', args.contr)) as IMentalPoker

    try {
        // Some thing for server.
        const m = 2
        const n = 26
        const rand = CardRand.buildRand()
        const parameters = setup(rand, m, n)
        const cards = encodeCards(rand, m * n)

        // Some thing for game.
        const andrija = keygen(rand, parameters, PlayerName.NewPlayerName('Andrija'))
        const kobi = keygen(rand, parameters, PlayerName.NewPlayerName('Kobi'))
        const nico = keygen(rand, parameters, PlayerName.NewPlayerName('Nico'))
        const tom = keygen(rand, parameters, PlayerName.NewPlayerName('Tom'))

        const players = [andrija, kobi, nico, tom]
        const pubKeys = players.map((v: GameKeyAndProof) => {
            return ethers.utils.toUtf8Bytes(v.getPubKey().serialAndEnbase64())
        })

        const joint_pk = AggregatePublicKey.debase64AndDeserial(
            ethers.utils.toUtf8String(await myContr.computeAggregateKey(pubKeys))
        )

        const cardsEncoded = cards.serialAndEnbase64().map((v: string) => Card.debase64AndDeserial(v))
        const decks = VMaskedCard.newVMaskedCard()
        cardsEncoded.map(async (cardEncoded) => {
            decks.push(
                MaskedCard.debase64AndDeserial(
                    ethers.utils.toUtf8String(
                        await myContr.mask(
                            ethers.utils.toUtf8Bytes(parameters.serialAndEnbase64()),
                            ethers.utils.toUtf8Bytes(joint_pk.serialAndEnbase64()),
                            ethers.utils.toUtf8Bytes(cardEncoded.serialAndEnbase64())
                        )
                    )
                )
            )
        })

        // SHUFFLE TIME --------------
        // 1.a Andrija shuffles first
        let permutation = Permutation.newPermutation(rand, m * n)
        let maskedCardsAndShuffleProof = shuffleAndRemask(rand, parameters, joint_pk, decks, permutation)
        const a_shuffled_decks = maskedCardsAndShuffleProof.getMaskedCards()
        const a_shuffle_proofs = maskedCardsAndShuffleProof.getShuffleProof()

        expect(
            await myContr.verifyShuffle(
                ethers.utils.toUtf8Bytes(parameters.serialAndEnbase64()),
                ethers.utils.toUtf8Bytes(joint_pk.serialAndEnbase64()),
                decks.serialAndEnbase64().map((v: string) => ethers.utils.toUtf8Bytes(v)),
                a_shuffled_decks.serialAndEnbase64().map((v: string) => ethers.utils.toUtf8Bytes(v)),
                ethers.utils.toUtf8Bytes(a_shuffle_proofs.serialAndEnbase64())
            )
        ).to.eql(true)

        //2.a Kobi shuffles second
        permutation = Permutation.newPermutation(rand, m * n)
        maskedCardsAndShuffleProof = shuffleAndRemask(rand, parameters, joint_pk, a_shuffled_decks, permutation)
        const k_shuffled_decks = maskedCardsAndShuffleProof.getMaskedCards()
        const k_shuffle_proofs = maskedCardsAndShuffleProof.getShuffleProof()

        expect(
            await myContr.verifyShuffle(
                ethers.utils.toUtf8Bytes(parameters.serialAndEnbase64()),
                ethers.utils.toUtf8Bytes(joint_pk.serialAndEnbase64()),
                a_shuffled_decks.serialAndEnbase64().map((v: string) => ethers.utils.toUtf8Bytes(v)),
                k_shuffled_decks.serialAndEnbase64().map((v: string) => ethers.utils.toUtf8Bytes(v)),
                ethers.utils.toUtf8Bytes(k_shuffle_proofs.serialAndEnbase64())
            )
        ).to.eql(true)

        //3.a Nico shuffles third
        permutation = Permutation.newPermutation(rand, m * n)
        maskedCardsAndShuffleProof = shuffleAndRemask(rand, parameters, joint_pk, k_shuffled_decks, permutation)
        const n_shuffled_decks = maskedCardsAndShuffleProof.getMaskedCards()
        const n_shuffle_proofs = maskedCardsAndShuffleProof.getShuffleProof()

        expect(
            await myContr.verifyShuffle(
                ethers.utils.toUtf8Bytes(parameters.serialAndEnbase64()),
                ethers.utils.toUtf8Bytes(joint_pk.serialAndEnbase64()),
                k_shuffled_decks.serialAndEnbase64().map((v: string) => ethers.utils.toUtf8Bytes(v)),
                n_shuffled_decks.serialAndEnbase64().map((v: string) => ethers.utils.toUtf8Bytes(v)),
                ethers.utils.toUtf8Bytes(n_shuffle_proofs.serialAndEnbase64())
            )
        ).to.eql(true)

        //4.a Tom shuffles last
        permutation = Permutation.newPermutation(rand, m * n)
        maskedCardsAndShuffleProof = shuffleAndRemask(rand, parameters, joint_pk, n_shuffled_decks, permutation)
        const final_shuffled_decks = maskedCardsAndShuffleProof.getMaskedCards()
        const final_shuffle_proofs = maskedCardsAndShuffleProof.getShuffleProof()

        expect(
            await myContr.verifyShuffle(
                ethers.utils.toUtf8Bytes(parameters.serialAndEnbase64()),
                ethers.utils.toUtf8Bytes(joint_pk.serialAndEnbase64()),
                n_shuffled_decks.serialAndEnbase64().map((v: string) => ethers.utils.toUtf8Bytes(v)),
                final_shuffled_decks.serialAndEnbase64().map((v: string) => ethers.utils.toUtf8Bytes(v)),
                ethers.utils.toUtf8Bytes(final_shuffle_proofs.serialAndEnbase64())
            )
        ).to.eql(true)

        const shuffled_decks: MaskedCard[] = []
        for (let i = 0; i < final_shuffled_decks.len(); i++) {
            shuffled_decks.push(final_shuffled_decks.pop())
        }

        const andrijaCards = shuffled_decks[0]
        const kobiCards = shuffled_decks[1]
        const nicoCards = shuffled_decks[2]
        const tomCards = shuffled_decks[3]

        let andrija_rt_1 = computeRevealToken(rand, parameters, andrija.getSecKey(), andrija.getPubKey(), kobiCards)
        let andrija_rt_2 = computeRevealToken(rand, parameters, andrija.getSecKey(), andrija.getPubKey(), nicoCards)
        let andrija_rt_3 = computeRevealToken(rand, parameters, andrija.getSecKey(), andrija.getPubKey(), tomCards)

        let kobi_rt_0 = computeRevealToken(rand, parameters, kobi.getSecKey(), kobi.getPubKey(), andrijaCards)
        let kobi_rt_2 = computeRevealToken(rand, parameters, kobi.getSecKey(), kobi.getPubKey(), nicoCards)
        let kobi_rt_3 = computeRevealToken(rand, parameters, kobi.getSecKey(), kobi.getPubKey(), tomCards)

        let nico_rt_0 = computeRevealToken(rand, parameters, nico.getSecKey(), nico.getPubKey(), andrijaCards)
        let nico_rt_1 = computeRevealToken(rand, parameters, nico.getSecKey(), nico.getPubKey(), kobiCards)
        let nico_rt_3 = computeRevealToken(rand, parameters, nico.getSecKey(), nico.getPubKey(), tomCards)

        let tom_rt_0 = computeRevealToken(rand, parameters, tom.getSecKey(), tom.getPubKey(), andrijaCards)
        let tom_rt_1 = computeRevealToken(rand, parameters, tom.getSecKey(), tom.getPubKey(), kobiCards)
        let tom_rt_2 = computeRevealToken(rand, parameters, tom.getSecKey(), tom.getPubKey(), nicoCards)
    } catch (err) {
        console.log('error: ', err)
    }
}
