import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { categoryMap } from '../../utils/constants';

export interface ICardData {
    id: string;
    title: string;
    price: number | null;
    image: string;
    category: string;
    description?: string;
}

export abstract class BaseCard extends Component<ICardData> {
    protected titleElement: HTMLElement | null;
    protected priceElement: HTMLElement | null;
    protected imageElement: HTMLImageElement | null;
    protected categoryElement: HTMLElement | null;
    protected eventBus: EventEmitter;
    protected onClickCallback?: (id: string) => void;

    constructor(container: HTMLElement, eventBus: EventEmitter, onClick?: (id: string) => void) {
        super(container);
        this.eventBus = eventBus;
        this.onClickCallback = onClick;

        this.titleElement = container.querySelector('.card__title');
        this.priceElement = container.querySelector('.card__price');
        this.imageElement = container.querySelector('.card__image');
        this.categoryElement = container.querySelector('.card__category');

        // Клик по карточке передаёт id через колбэк (без хранения в разметке)
        this.container.addEventListener('click', () => {
            if (this.onClickCallback) {
                this.onClickCallback(this.id);
            }
        });
    }

    // Данные хранятся в полях класса, а не в разметке
    private _id: string = '';

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    set title(value: string) {
        if (this.titleElement) this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        if (this.priceElement) {
            this.priceElement.textContent = value ? `${value} синапсов` : 'Бесценно';
        }
    }

    set image(value: string) {
        if (this.imageElement) {
            this.setImage(this.imageElement, value, this.title);
        }
    }

    set category(value: string) {
        if (this.categoryElement) {
            this.categoryElement.textContent = value;
            const modifier = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
            this.categoryElement.className = `card__category ${modifier}`;
        }
    }

    protected emit(event: string, payload?: any): void {
        if (this.eventBus) {
            this.eventBus.emit(event, payload);
        }
    }
}