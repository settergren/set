import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnChanges, OnInit, ViewChild } from '@angular/core';

import { Card, COUNT, FILL, SHAPE } from '../card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements AfterViewInit, OnChanges, OnInit {

  @HostBinding('class.selected') @Input() selected = false;

  @Input() public card: Card;

  @ViewChild('cardCanvas', {static: true}) canvasElement: ElementRef<HTMLCanvasElement>;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {}

  ngOnInit() {
    this.canvas = this.canvasElement.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    this.render();
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnChanges() {
    if (this.canvas && this.ctx) {
      this.render();
    }
  }

  /**
   * Resize the canvas to fill parent element
   */
  private resize() {
    this.canvas.height = this.canvas.parentElement.offsetHeight;
    this.canvas.width = this.canvas.parentElement.offsetWidth;
  }

  private render() {
    // Resize Canvas
    this.resize();

    // Erase
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Set color
    this.ctx.strokeStyle = this.card.color.toLowerCase();
    this.ctx.fillStyle = this.card.color.toLowerCase();

    // Create Dashed Pattern
    if (this.card.fill === FILL.DASHED) {
      const pattern = document.createElement("canvas");
      pattern.width = 5;
      pattern.height = 5;
      const patternCtx = pattern.getContext('2d');

      patternCtx.strokeStyle = this.ctx.strokeStyle;
      patternCtx.lineWidth = 1;
      patternCtx.beginPath();
      patternCtx.moveTo(0, 5);
      patternCtx.lineTo(5, 0);
      patternCtx.stroke();
      this.ctx.fillStyle = this.ctx.createPattern(pattern, 'repeat');
    }
    
    switch (this.card.shape) {
      case SHAPE.ROUND:
        this.roundRect();
        break;
      case SHAPE.RECTANGLE:
        this.rectangle();
        break;
      case SHAPE.TRIANGLE:
        this.diamond();
        break;
    }
  }

  roundRect() {
    const width = this.canvas.height / 5;
    const height = this.canvas.height / 2;
    const x = this.canvas.width / 2 - (width / 2);
    const y = this.canvas.height / 2 - (height / 2);
    const spacing = width / 4;
    const r = width / 2;

    switch (this.card.count) {
      case COUNT.ONE:
        this.drawRoundRect(x, y, width, height, r);
        break;
      case COUNT.TWO:
        this.drawRoundRect(x - (width / 2) - spacing, y, width, height, r);
        this.drawRoundRect(x + (width / 2) + spacing, y, width, height, r);
        break;
      case COUNT.THREE:
        this.drawRoundRect(x - width - spacing, y, width, height, r);
        this.drawRoundRect(x, y, width, height, r);
        this.drawRoundRect(x + width + spacing, y, width, height, r);
        break;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.lineTo(x + width - r, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    this.ctx.lineTo(x + width, y + height - r);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    this.ctx.lineTo(x + r, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    this.ctx.lineTo(x, y + r);
    this.ctx.quadraticCurveTo(x, y, x + r, y);
    this.ctx.closePath();  
  }

  /**
   * Draw a round rectangle
   * @param x 
   * @param y 
   * @param width 
   * @param height 
   * @param r 
   */
  private drawRoundRect(x: number, y: number, width: number, height: number, r: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.lineTo(x + width - r, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    this.ctx.lineTo(x + width, y + height - r);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    this.ctx.lineTo(x + r, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    this.ctx.lineTo(x, y + r);
    this.ctx.quadraticCurveTo(x, y, x + r, y);
    this.ctx.closePath();

    if (this.card.fill !== FILL.EMPTY) {
      this.ctx.fill();
    }
    this.ctx.stroke();
  }

  rectangle() {
    const width = this.canvas.height / 5;
    const height = this.canvas.height / 2;
    const x = this.canvas.width / 2 - (width / 2);
    const y = this.canvas.height / 2 - (height / 2);
    const spacing = width / 4;
    
    switch (this.card.count) {
      case COUNT.ONE:
        this.ctx.rect(x, y, width, height);
        break;
      case COUNT.TWO:
        this.ctx.rect(x - (width / 2) - spacing, y, width, height);
        this.ctx.rect(x + (width / 2) + spacing, y, width, height);
        break;
      case COUNT.THREE:
        this.ctx.rect(x - width - spacing, y, width, height);
        this.ctx.rect(x, y, width, height);
        this.ctx.rect(x + width + spacing, y, width, height);
        break;
    }

    if (this.card.fill !== FILL.EMPTY) {
      this.ctx.fill();
    }
    this.ctx.stroke();

  }

  diamond() {
    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;
    const width = this.canvas.height / 5;
    const height = this.canvas.height / 2;
    const spacing = width / 4;

    switch (this.card.count) {
      case COUNT.ONE:
        this.drawDiamond(x, y, width, height);
        break;
      case COUNT.TWO:
        this.drawDiamond(x - (width / 2) - spacing, y, width, height);
        this.drawDiamond(x + (width / 2) + spacing, y, width, height);
        break;
      case COUNT.THREE:
        this.drawDiamond(x - width - spacing, y, width, height);
        this.drawDiamond(x, y, width, height);
        this.drawDiamond(x + width + spacing, y, width, height);
        break;
    }

  }

  drawDiamond(x: number, y: number, width: number, height: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - (height / 2));
    this.ctx.lineTo(x + (width / 2), y);
    this.ctx.lineTo(x, y + (height / 2));
    this.ctx.lineTo(x - (width / 2), y);
    this.ctx.lineTo(x, y - (height / 2));
    this.ctx.closePath();

    if (this.card.fill !== FILL.EMPTY) {
      this.ctx.fill();
    }
    this.ctx.stroke();
  }

}
