import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { BasketCard } from './BasketCard';

export class Basket extends Component<any> {
    private listContainer: HTMLElement | null;
    private buttonElement: HTMLButtonElement | null;
    private priceElement: HTMLElement | null;
    private eventBus: EventEmitter;

    constructor(container: HTMLElement, eventBus: EventEmitter) {
        super(container);
        this.eventBus = eventBus;
        this.listContainer = container.querySelector('.basket__list');
        this.buttonElement = container.querySelector('.basket__button');
        this.priceElement = container.querySelector('.basket__price');

        this.buttonElement?.addEventListener('click', () => {
            this.eventBus.emit('basket:create-order');
        });
    }

    set items(cards: BasketCard[]) {
        if (!this.listContainer) return;

        this.listContainer.innerHTML = '';

        if (cards.length === 0) {
        } else {
            cards.forEach(card => {
                this.listContainer?.appendChild(card.render());
            });
        }

        if (this.buttonElement) {
            this.buttonElement.disabled = cards.length === 0;
        }
    }

    set total(value: number) {
        if (this.priceElement) this.priceElement.textContent = `${value} синапсов`;
    }

    render(): HTMLElement {
        return this.container;
    }
}