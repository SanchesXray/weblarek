import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { BasketCard } from './BasketCard';

export class Basket extends Component<any> {
    private listContainer: HTMLElement | null;
    private buttonElement: HTMLButtonElement | null;
    private priceElement: HTMLElement | null;
    private eventBus: EventEmitter;
    private emptyMessage: HTMLElement;

    constructor(container: HTMLElement, eventBus: EventEmitter) {
        super(container);
        this.eventBus = eventBus;
        this.listContainer = container.querySelector('.basket__list');
        this.buttonElement = container.querySelector('.basket__button');
        this.priceElement = container.querySelector('.basket__price');
        
        // Создаём элемент для сообщения "Корзина пуста" (гарантированно не null)
        this.emptyMessage = document.createElement('p');
        this.emptyMessage.textContent = 'Корзина пуста';
        this.emptyMessage.style.textAlign = 'center';
        this.emptyMessage.style.padding = '20px';        
        this.buttonElement?.addEventListener('click', () => {
            this.eventBus.emit('basket:create-order');
        });
    }

    set items(cards: BasketCard[]) {
        if (!this.listContainer) return;
        
        this.listContainer.innerHTML = '';
        
        if (cards.length === 0) {
            this.listContainer.appendChild(this.emptyMessage);
        } else {
            cards.forEach(card => {
                const renderedCard = card.render();
                if (renderedCard) {
                    this.listContainer?.appendChild(renderedCard);
                }
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