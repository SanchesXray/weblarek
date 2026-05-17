import { BaseCard } from './BaseCard';
import { EventEmitter } from '../base/Events';
import { categoryMap } from '../../utils/constants';

export abstract class ActionCard extends BaseCard {
    protected imageElement: HTMLImageElement | null;
    protected categoryElement: HTMLElement | null;
    protected buttonElement: HTMLButtonElement | null;
    protected onButtonClickCallback?: () => void;

    constructor(
        container: HTMLElement,
        eventBus: EventEmitter,
        onClick?: () => void,
        onButtonClick?: () => void
    ) {
        super(container, eventBus, onClick);
        this.onButtonClickCallback = onButtonClick;
        
        this.imageElement = container.querySelector('.card__image');
        this.categoryElement = container.querySelector('.card__category');
        this.buttonElement = container.querySelector('.card__button');
        
        this.buttonElement?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onButtonClickCallback) {
                this.onButtonClickCallback();
            }
        });
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

    set buttonText(value: string) {
        if (this.buttonElement) this.buttonElement.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        if (this.buttonElement) this.buttonElement.disabled = value;
    }

    set buttonAlt(value: boolean) {
        if (this.buttonElement) {
            if (value) {
                this.buttonElement.classList.add('button_alt');
            } else {
                this.buttonElement.classList.remove('button_alt');
            }
        }
    }
}