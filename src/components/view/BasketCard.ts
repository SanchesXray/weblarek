import { BaseCard } from './BaseCard';
import { EventEmitter } from '../base/Events';

export class BasketCard extends BaseCard {
    protected indexElement: HTMLElement | null;
    protected deleteButton: HTMLButtonElement | null;
    protected onDeleteCallback?: (id: string) => void;

    constructor(container: HTMLElement, eventBus: EventEmitter, onDelete: (id: string) => void) {
        super(container, eventBus);
        this.onDeleteCallback = onDelete;
        this.indexElement = container.querySelector('.basket__item-index');
        this.deleteButton = container.querySelector('.basket__item-delete');

        this.deleteButton?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onDeleteCallback) {
                this.onDeleteCallback(this.id);
            }
        });
    }

    set index(value: number) {
        if (this.indexElement) this.indexElement.textContent = String(value);
    }
}