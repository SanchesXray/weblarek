import { BaseCard } from './BaseCard.ts';
import { EventEmitter } from '../base/Events';

export class CatalogCard extends BaseCard {
    constructor(container: HTMLElement, eventBus: EventEmitter) {
        super(container, eventBus);
        this.container.addEventListener('click', () => {
            const id = this.container.getAttribute('data-id');
            this.emit('card:select', { id });
        });
    }
}