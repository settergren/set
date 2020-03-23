import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Card } from './card';

import { Deck } from './deck';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnDestroy, OnInit {

  public meter = 100;

  public setCount = 0;

  public failedAttempts = 0;

  public startTime = new Date();

  public sound = true;

  public gameOver = false;

  public elapsedTime = 0;

  private timer: any;

  private maxCards = 12;

  private deck = new Deck();

  private cards: Card[] = [];

  private tickSound = new Audio('assets/sounds/tick.wav');

  private shuffleSound = new Audio('assets/sounds/shuffle.wav');

  private successSound = new Audio('assets/sounds/success.wav');

  private popSound = new Audio('assets/sounds/pop.wav');

  private dealSound = new Audio('assets/sounds/deal.wav');

  private errorSound = new Audio('assets/sounds/error.wav');

  @ViewChild('gameOverDialog', {static: true}) private gameOverDialog: TemplateRef<any>;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.deal();

    // Start timer to deplete the health meter
    this.timer = setInterval(() => {
      if (this.sound) this.tickSound.play();
      this.elapsedTime++;
      this.updateMeter(-1);
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  public get cardCount(): number {
    return this.deck.size + this.cards.length;
  }

  public selectCard(card: Card) {
    card.selected = !card.selected;

    if (this.sound) {
      this.popSound.play();
    }

    // Get selected cards and validate set
    const selected = this.cards.filter(card => card.selected);
    if (selected.length === 3) {
      // Choose set with a slight delay (allows the selection to render and adds suspense)
      setTimeout(() => this.chooseSet(selected), 500);
    }
  }

  public unselectAll() {
    this.cards.forEach(card => card.selected = false);
  };

  /**
   * Re-deals the cards.
   */
  public reDeal() {
    // First, check to see if there is an available set. If there is then
    // give a penalty.
    const sets = this.findSets();
    if (sets.length) {
      this.penalty(-20);
    }

    if (this.sound) this.shuffleSound.play();

    const cards = this.cards.concat([]);
    cards.forEach((card, i) => {
      setTimeout(() => {
        this.replaceCard(card, true);
      }, 150 * i);
    });

    // this.cards.forEach((card, i) => {
    //   setTimeout(() => {
    //     card.removed = true;
    //     setTimeout(() => {
    //       this.deck.insert(card);
    //       this.cards.splice(i, 1, null);
    //     }, 500);
    //   }, 50 * i);
    // });


    // TODO
  }

  // /**
  //  * Deal more cards if there are no sets left
  //  */
  // public dealMoreCards() {
  //   // First, make sure there are no sets!
  //   const sets = this.findSets();
  //   if (sets.length === 0) {
  //     //this.draw(3);
  //   }
  //   else {
  //     this.updateMeter(-20);
  //     this.failedAttempts++;
  //   }
  // }

  /**
   * Get a hint with a penalty. The hint will select a card in a set.
   */
  public hint() {
    this.penalty(-10);
    const sets = this.findSets();
    if (sets.length) {
      const set = sets.shift();

      const unselected = set.filter(card => !card.selected);
      unselected[0].selected = true;
      
      // if (!set[0].selected) this.selectCard(set[0]);
      // else if (!set[1].selected) this.selectCard(set[])
    }
  }

  /**
   * Choose cards for a set
   * @param cards Cards
   */
  public chooseSet(cards: Card[]) {
    this.isSet(cards) ? this.set(cards) : this.failedSet();
  }

  /**
   * Give the user a penalty.
   */
  private penalty(amount: number = -20) {
    this.failedAttempts++;
    this.updateMeter(amount);
    if (this.sound) this.errorSound.play();
  }

  /**
   * Update the meter value
   * @param value meter difference
   */
  private updateMeter(value) {
    this.meter += value;
    if (this.meter <= 0) {
      this.endGame();
    }
  }

  /**
   * End the game
   */
  private endGame() {
    this.gameOver = true;
    clearInterval(this.timer);
    this.dialog.open(this.gameOverDialog);
  }

  /**
   * Handle a valid set by increasing score, replacing cards
   * @param cards Cards in the set
   */
  private set(cards: Card[]) {
    // Increase set count!
    this.setCount++;

    this.updateMeter(20);

    if (this.sound) this.successSound.play();

    // Visually remove each card by flagging as removed
    cards.forEach((card, i) => {
      setTimeout(() => {
        this.replaceCard(card);
      }, 500 * i);
    });
  }

  /**
   * Exchange a card with the deck
   * @param card
   */
  private exchangeCard(card: Card) {
    card.removed = true;
    setTimeout(() => {
      const index = this.cards.indexOf(card);
      // Replace card with null
      this.cards.splice(index, 1, null);
      // Put card back into deck
      this.deck.insert(card);

      setTimeout(() => {
        // Draw a new card and put
        const newCard = this.deck.draw(1)[0];
        this.cards.splice(index, 1, newCard);
        setTimeout(() => {
          newCard.placed = true;
        }, 500);
      }, 500);
    }, 500);
  }

  /**
   * Removes a card from the table
   */
  private replaceCard(card: Card, reInsert: boolean = false) {
    card.removed = true;
    setTimeout(() => {
      if (reInsert) this.deck.insert(card);
      const index = this.cards.indexOf(card);
      // Replace card with null
      this.cards.splice(index, 1, null);
      setTimeout(() => {
        // Draw a new card and put
        if (this.sound) this.dealSound.play();
        const newCard = this.deck.draw(1)[0];
        this.cards.splice(index, 1, newCard);
        setTimeout(() => {
          newCard.placed = true;
        }, 500);
      }, 500);
    }, 500);
  }

  private failedSet() {
    this.penalty(-20);
    this.unselectAll();
  }

  public isSet(cards: Card[]) {
    return cards.length === 3 &&
            this.validAttr(cards, 'color') &&
            this.validAttr(cards, 'shape') &&
            this.validAttr(cards, 'count') &&
            this.validAttr(cards, 'fill');
  }

  private validAttr(items: Object[], attr: string): boolean {
    const values = this.getUniqueValues(items, attr);
    return values.length === 1 || values.length === items.length;
  }

  /**
   * Get unique values from objects for a specific attr
   * @param items
   * @param attr 
   */
  private getUniqueValues(items: any[], attr: string): any[] {
    return items.reduce((values: any[], item) => {
      const value = item[attr];
      if (!values.includes(value)) {
        values.push(value);
      }
      return values;
    }, []);
  }

  /**
   * Deal cards from deck
   */
  private deal() {
    if (this.sound) this.shuffleSound.play();

    this.cards = new Array(this.maxCards);

    // Draw twelve cards from the deck
    const cards = this.deck.draw(this.maxCards);
    // Place each card one at a time (visual effect)
    cards.forEach((card, i) => {
      setTimeout(() => {
        if (this.sound) this.dealSound.play();
        card.placed = true;
        this.cards.splice(i, 1, card);
      }, 100 * i);
    });
  }

  /**
   * Find all possible sets
   */
  private findSets(): Card[][] {
    return this.cards.reduce((sets, a) => {
      return this.cards.reduce((sets, b) => {
        return this.cards.reduce((sets, c) => {
          if (a !== b && b !== c && c !== a && this.isSet([a, b, c])) {
            sets.push([a, b, c]);
          }
          return sets;
        }, sets);
      }, sets);
    }, []);
  }

}
