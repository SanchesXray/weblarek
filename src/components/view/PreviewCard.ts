import { ActionCard } from './ActionCard';
import { EventEmitter } from '../base/Events';

export class PreviewCard extends ActionCard {
    protected descriptionElement: HTMLElement | null;

    constructor(container: HTMLElement, eventBus: EventEmitter, onButtonClick: () => void) {
        super(container, eventBus, undefined, onButtonClick);
        this.descriptionElement = container.querySelector('.card__text');
    }

    set description(value: string) {
        if (this.descriptionElement) this.descriptionElement.textContent = value;
    }
}