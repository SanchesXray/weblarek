import { BaseCard } from './BaseCard';
import { EventEmitter } from '../base/Events';

/**
 * Базовый класс для карточек с кнопкой действия.
 * Отделяет клик по карточке от клика по кнопке.
 */
export abstract class ActionCard extends BaseCard {
    protected buttonElement: HTMLButtonElement | null;
    protected onButtonClickCallback?: (id: string) => void;

    constructor(container: HTMLElement, eventBus: EventEmitter, onButtonClick?: (id: string) => void, onClick?: (id: string) => void) {
        super(container, eventBus, onClick);
        this.onButtonClickCallback = onButtonClick;
        this.buttonElement = container.querySelector('.card__button');

        this.buttonElement?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onButtonClickCallback) {
                this.onButtonClickCallback(this.id);
            }
        });
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