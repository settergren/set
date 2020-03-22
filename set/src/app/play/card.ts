export enum COLOR {
    RED = 'RED',
    GREEN = 'GREEN',
    BLUE = 'BLUE'
};

export enum SHAPE {
    ROUND = 'ROUND',
    TRIANGLE = 'TRIANGLE',
    RECTANGLE = 'RECTANGLE'
};

export enum FILL {
    EMPTY = 'EMPTY',
    DASHED = 'DASHED',
    FILLED = 'FILLED'
};

export enum COUNT {
    ONE = 'ONE',
    TWO = 'TWO',
    THREE = 'THREE'
};

/**
 * Card class
 */
export class Card {

    public selected = false;

    constructor(public color: COLOR,
                public shape: SHAPE,
                public count: COUNT,
                public fill: FILL) {}

}