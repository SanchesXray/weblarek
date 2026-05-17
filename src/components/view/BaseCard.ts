import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export interface ICardData {
    title: string;
    price: number | null;
}

export abstract class BaseCard extends Component<ICardData> {
    protected titleElement: HTMLElement | null;
    protected priceElement: HTMLElement | null;
    protected eventBus: EventEmitter;
    protected onClickCallback?: () => void;

    constructor(container: HTMLElement, eventBus: EventEmitter, onClick?: () => void) {
        super(container);
        this.eventBus = eventBus;
        this.onClickCallback = onClick;

        this.titleElement = container.querySelector('.card__title');
        this.priceElement = container.querySelector('.card__price');

        this.container.addEventListener('click', () => {
            if (this.onClickCallback) {
                this.onClickCallback();
            }
        });
    }

    set title(value: string) {
        if (this.titleElement) this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        if (this.priceElement) {
            this.priceElement.textContent = value ? `${value} синапсов` : 'Бесценно';
        }
    }

    protected emit(event: string, payload?: any): void {
        if (this.eventBus) {
            this.eventBus.emit(event, payload);
        }
    }
}