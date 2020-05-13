import { StreamDeck } from "elgato-stream-deck";
import { Button } from '../Button'

export class Profile {
    private buttonMap = new Map<number, Button>();
    constructor(
        private streamDeck: StreamDeck
    ) {
        
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
}