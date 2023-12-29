import { dayWrapper, useData } from "../common.js";

const testData = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`;
const { data } = useData(testData);

const cardsAry = ['A', 'K', 'Q', 'J', 'T', 9, 8, 7, 6, 5, 4, 3, 2];
const categories = {
    '5oak': 7,
    '4oak': 6,
    'fhouse': 5,
    '3oak': 4,
    '2pair': 3,
    '1pair': 2,
    'highcard': 1
}

const cardValues = Object.fromEntries(cardsAry.map((card, i) => [card, cardsAry.length - i]));
const rankCache = new Map();

const getRank = (hand) => {
    const sortedHand = hand.split('').sort().join('');
    if (rankCache.has(sortedHand)) return rankCache.get(sortedHand);

    const result = {};
    const handCount = new Map([...hand.split('')
        .reduce((hcMap, label) =>
            hcMap.set(label, (hcMap.get(label) ?? 0) + 1), new Map())]
        .sort((a, b) => {
            const asd = b[1] - a[1];
            return asd === 0 ? (cardValues[b[0]] - cardValues[a[0]]) : asd;
        }));

    result.cards = [...handCount.entries()];
    const [highestCard] = result.cards;

    if (handCount.size === 1) {
        result.type = '5oak'
    } else if (handCount.size === 2) {
        result.type = highestCard[1] === 4 ? '4oak' : 'fhouse';
    } else if (handCount.size === 3) {
        //three of a kind or two pair
        result.type = (highestCard[1] === 3) ? '3oak' : '2pair';
    } else if (handCount.size === 4) {
        result.type = '1pair';
    } else {
        result.type = 'highcard';
    }

    rankCache.set(sortedHand, result)

    return result;
}

dayWrapper(() => data.split('\n').filter(l => !!l)
    .toSorted((l1, l2) => {
        const hand1 = getRank(l1.split(' ')[0]);
        const hand2 = getRank(l2.split(' ')[0]);

        if (hand1.type === hand2.type) {
            const [hand1Cards, hand2Cards] = [hand1.cards, hand2.cards];
            for (let i = 0; i < hand1Cards.length; i++) {
                if (hand1Cards[i][0] !== hand2Cards[i][0]) {
                    return cardValues[hand1Cards[i][0]] - cardValues[hand2Cards[i][0]];
                }
            }
            return 0;
        }

        return categories[hand1.type] - categories[hand2.type];
    })
    .reduce((acc, line, index, ary) => acc + (+line.split(' ')[1] * (index + 1)), 0))

//247261230 too high
//247255339 too high