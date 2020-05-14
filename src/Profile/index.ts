import { StreamDeck } from "elgato-stream-deck";
import { Button } from '../Button'

export class Profile {
    private buttonMap = new Map<number, Button>();
    constructor(
        private streamDeck: StreamDeck
    ) {}

    public onButtonDown(callback: (buttonIndex: number) => void) {
        this.streamDeck.on('down', callback);
    } 

    public onButtonUp(callback: (buttonIndex: number) => void) {
        this.streamDeck.on('up', callback);
    }

    public getButtonByIndex(index: number): Button {
        if (!this.buttonMap.has(index)) {
            this.buttonMap.set(index, new Button(this.streamDeck, index))
        }
        return this.buttonMap.get(index) as Button;
    }

    public getIndexBelow(index: number): number {
        return index + this.streamDeck.KEY_COLUMNS;
    }

    public getIndexAbove(index: number): number {
        const calculatedIndex = index - this.streamDeck.KEY_COLUMNS;
        if (calculatedIndex < 0) {
            throw new Error('not possible')
        }
        return calculatedIndex;
    }

    public getIndexRight(index: number): number {
        const calculatedIndex = index + 1;
        if (calculatedIndex > this.streamDeck.NUM_KEYS -1) {
            throw new Error('not possible')
        }
        return calculatedIndex;
    }

    public getIndexLeft(index: number): number {
        const calculatedIndex = index - 1;
        if (calculatedIndex < 0) {
            throw new Error('not possible')
        }
        return calculatedIndex;
    }
}