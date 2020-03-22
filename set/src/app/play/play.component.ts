import { Component, OnInit } from '@angular/core';

import { Card } from './card';

import { Deck } from './deck';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

  private maxCards = 12;

  private deck = new Deck();

  private cards: Card[] = [];

  public setCount = 0;

  public failedAttempts = 0;

  public startTime = new Date();

  constructor() { }

  ngOnInit() {
    this.draw();
  }

  public get cardCount(): number {
    return this.deck.size + this.cards.length;
  }

  public get elapsedTime(): string {
    const ms = new Date().getTime() - this.startTime.getTime();
    return Math.floor(ms / 1000) + ' Seconds';
  }

  public selectCard(card: Card) {
    card.selected = !card.selected;

    // Get selected cards and validate set
    const selected = this.cards.filter(card => card.selected);
    if (selected.length === 3) {
      this.chooseSet(selected);
    }
  }

  public unselectAll() {
    this.cards.forEach(card => card.selected = false);
  };

  /**
   * Deal more cards if there are no sets left
   */
  public dealMoreCards() {
    // First, make sure there are no sets!
    const sets = this.findSets();
    if (sets.length === 0) {
      this.draw(3);
    }
    else {
      // Increase failed attempts
      this.failedAttempts++;
    }
  }

  public hint() {
    this.failedAttempts++;
    const sets = this.findSets();
    if (sets.length) {
      const set = sets.shift();
      this.selectCard(set[0]);
    }
  }

  /**
   * Choose cards for a set
   * @param cards Cards
   */
  public chooseSet(cards: Card[]) {
    if (this.isSet(cards)) {
      // Increase set count!
      this.setCount++;
      // Remove set!
      this.cards = this.cards.filter(card => !cards.includes(card));
      // Draw cards to replace
      this.draw();
    }
    else {
      // Increase failed attempts!
      this.failedAttempts++;
      this.unselectAll();
    }
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
   * Draw cards from deck
   */
  private draw(count?: number) {
    if (!count) {
      count = this.maxCards - this.cards.length;
    }
    this.cards = this.cards.concat(this.deck.draw(count));
  }

  /**
   * Find all possible sets
   */
  private findSets(): Card[] {
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
