import { BaseCard } from './BaseCard';
import { EventEmitter } from '../base/Events';

export class BasketCard extends BaseCard {
    protected indexElement: HTMLElement | null;
    protected deleteButton: HTMLButtonElement | null;

    constructor(container: HTMLElement, eventBus: EventEmitter, onDelete: () => void) {
        super(container, eventBus);
        this.indexElement = container.querySelector('.basket__item-index');
        this.deleteButton = container.querySelector('.basket__item-delete');
        
        this.deleteButton?.addEventListener('click', (e) => {
            e.stopPropagation();
            onDelete();
        });
    }

    set index(value: number) {
        if (this.indexElement) this.indexElement.textContent = String(value);
    }
}