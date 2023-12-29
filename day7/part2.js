import { dayWrapper, useData } from "../common.js";

const testData = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`;
const { data } = useData(testData);

const HAND_RANK = {
    '5oak': 7,
    '4oak': 6,
    'fhouse': 5,
    '3oak': 4,
    '2pair': 3,
    '1pair': 2,
    'highcard': 1
}

const CARD_VALUE = Object.fromEntries(
    ['A', 'K', 'Q', 'T', 9, 8, 7, 6, 5, 4, 3, 2, 'J']
        .map((card, i, cardsAry) => [card, cardsAry.length - i])
);
const rankCache = new Map();

const getRank = (hand) => {
    const sortedHand = hand.split('').sort().join('');
    if (rankCache.has(sortedHand)) return rankCache.get(sortedHand);

    let result = '';
    const handCount = new Map([...hand.split('')
        .reduce((hcMap, label) =>
            hcMap.set(label, (hcMap.get(label) ?? 0) + 1), new Map())]
        .sort((a, b) => {
            /**
             * Sort by ocurrence and then
             * sort by individual card rank.
             */
            const asd = b[1] - a[1];
            return asd === 0 ? CARD_VALUE[b[0]] - CARD_VALUE[a[0]] : asd;
        }));

    let [highestCard, c2] = [...handCount.entries()];

    /**
     * Append the 'J' count to the highest card value
     * and remove 'J'.
     */
    if (handCount.size > 1 && handCount.has('J')) {
        if (highestCard[0] === 'J') {
            highestCard = c2;
        }
        highestCard[1] += handCount.get('J');
        handCount.delete('J')
    }

    if (handCount.size === 1) {
        result = '5oak'
    } else if (handCount.size === 2) {
        result = highestCard[1] === 4 ? '4oak' : 'fhouse';
    } else if (handCount.size === 3) {
        result = (highestCard[1] === 3) ? '3oak' : '2pair';
    } else if (handCount.size === 4) {
        result = '1pair';
    } else {
        result = 'highcard';
    }

    rankCache.set(sortedHand, result);

    return result;
}

dayWrapper(() => data.split('\n').filter(l => !!l)
    .toSorted((l1, l2) => {
        const [l1Split, l2Split] = [l1.split(' ')[0], l2.split(' ')[0]]
        const hand1 = getRank(l1Split);
        const hand2 = getRank(l2Split);

        if (hand1 === hand2) {
            for (let i = 0; i < l1Split.length; i++) {
                if (l1Split[i] !== l2Split[i]) {
                    return CARD_VALUE[l1Split[i]] - CARD_VALUE[l2Split[i]];
                }
            }
            return 0;
        }

        return HAND_RANK[hand1] - HAND_RANK[hand2]; //Compare hand rank values
    })
    .reduce((acc, line, index, ary) => acc + (+line.split(' ')[1] * (index + 1)), 0)
)

//249405876 too high
//249356515 ✅
//249086635 too low
//248472013 too low