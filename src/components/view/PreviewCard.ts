import { ActionCard } from './ActionCard';
import { EventEmitter } from '../base/Events';

export class PreviewCard extends ActionCard {
    protected descriptionElement: HTMLElement | null;

    constructor(container: HTMLElement, eventBus: EventEmitter, onButtonClick: (id: string) => void) {
        super(container, eventBus, onButtonClick);
        this.descriptionElement = container.querySelector('.card__text');
    }

    set description(value: string) {
        if (this.descriptionElement) this.descriptionElement.textContent = value;
    }
}