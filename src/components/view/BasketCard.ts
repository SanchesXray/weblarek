import { BaseCard } from './BaseCard';
import { EventEmitter } from '../base/Events';

export class BasketCard extends BaseCard {
    protected indexElement: HTMLElement | null;
    protected deleteButton: HTMLButtonElement | null;

    constructor(container: HTMLElement, eventBus: EventEmitter) {
        super(container, eventBus);
        this.indexElement = this.container.querySelector('.basket__item-index');
        this.deleteButton = this.container.querySelector('.basket__item-delete');        
        this.deleteButton?.addEventListener('click', () => {
            const id = this.container.getAttribute('data-id');
            this.emit('basket:remove-item', { id });
        });
    }

    set index(value: number) {
        if (this.indexElement) this.indexElement.textContent = String(value);
    }
}