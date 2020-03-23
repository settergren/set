import { Card, COLOR, SHAPE, COUNT, FILL } from './card';
/**
 * Deck class
 */
export class Deck {

    private cards: Card[] = [];

    constructor() {
        this.init();
        this.shuffle();
    }

    public get size(): number {
        return this.cards.length;
    }

    private init() {
        for (let color in COLOR) {
            for (let shape in SHAPE) {
                for (let count in COUNT) {
                    for (let fill in FILL) {
                        this.cards.push(new Card(color as COLOR, shape as SHAPE, count as COUNT, fill as FILL));
                    }
                }
            }
        }
    }

    private shuffle() {
        let newDeck = [];
        while (this.cards.length > 0) {
            
            const position = Math.floor(Math.random() * this.cards.length);
            newDeck = newDeck.concat(this.cards.splice(position, 1));
        }
        this.cards = newDeck;
    }

    /**
     * Draw a number of cards
     * @param count Number of cards to draw
     */
    public draw(count: number) {
        return count > 0 && count <= this.cards.length ? this.cards.splice(0, count) : [];
    }

    /**
     * Insert a card back into the deck
     * @param card
     */
    public insert(card: Card) {
        if (!this.cards.includes(card)) {
            //const pos = Math.floor(Math.random() * this.cards.length);
            //this.cards.splice(pos, 0, card);
            this.cards.push(card);
        }
    }

}