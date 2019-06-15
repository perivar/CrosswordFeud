import { Adapter } from "../shared/adapter";
import { IClue, IPosition, SeparatorLocations, Direction } from "./types";

export class ClueElement implements IClue {
    id: string;
    number: number;
    humanNumber: string;
    group: string[];
    clue: string;
    position: IPosition;
    separatorLocations: {} | SeparatorLocations;
    direction: Direction;
    length: number;
    solution: string;

    constructor(elem: any) {

        this.id = '';
        this.number = 0;
        this.humanNumber = '0';
        this.group = [''];
        this.clue = '';
        this.position = { x: 0, y: 0 };
        this.separatorLocations = {};
        this.direction = 'across';
        this.length = 0;
        this.solution = '';

        if (!elem.group === undefined) {
            
        }
    }
}

export class CrosswordAdapter implements Adapter<IClue> {

    adapt(item: any): IClue {
        return new ClueElement(item);
    }
}

