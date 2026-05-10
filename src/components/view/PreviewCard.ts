import { BaseCard, ICardData } from './BaseCard';
import { EventEmitter } from '../base/Events';
import { BasketModel } from '../models/BasketModel';

export class PreviewCard extends BaseCard {
    protected descriptionElement: HTMLElement | null;
    protected buttonElement: HTMLButtonElement | null;
    private cardPrice: number | null = null;
    private productId: string = '';
    private basketModel: BasketModel;

    constructor(container: HTMLElement, eventBus: EventEmitter, basketModel: BasketModel) {
        super(container, eventBus);
        this.basketModel = basketModel;
        this.descriptionElement = this.container.querySelector('.card__text');
        this.buttonElement = this.container.querySelector('.card__button');
        
        // Подписываемся на изменение корзины для обновления состояния кнопки
        this.eventBus?.on('basket:changed', () => {
            this.updateButtonState();
        });
        
        this.buttonElement?.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = this.container.getAttribute('data-id');
            
            if (!id) return;
            
            // Проверяем цену: если нет цены, ничего не делаем
            if (this.cardPrice === null) return;
            
            // Проверяем, есть ли товар в корзине
            const isInBasket = this.basketModel.contains(id);
            
            if (isInBasket) {
                // Если есть - удаляем
                this.emit('basket:remove-item', { id });
            } else {
                // Если нет - добавляем
                this.emit('product:add-to-basket', { id, price: this.cardPrice });
            }
        });
    }

    set description(value: string) {
        if (this.descriptionElement) this.descriptionElement.textContent = value;
    }

    set price(value: number | null) {
        this.cardPrice = value;
        super.price = value;
        this.updateButtonState();
    }

    set id(value: string) {
        this.productId = value;
        super.id = value;
        this.updateButtonState();
    }

    private updateButtonState(): void {
        if (!this.buttonElement) return;
        
        // Если нет цены - блокируем кнопку и ставим текст "Недоступно"
        if (this.cardPrice === null) {
            this.buttonElement.textContent = 'Недоступно';
            this.buttonElement.disabled = true;
            return;
        }
        
        // Проверяем, есть ли товар в корзине
        const isInBasket = this.basketModel.contains(this.productId);
        
        if (isInBasket) {
            this.buttonElement.textContent = 'Удалить из корзины';
            this.buttonElement.classList.add('button_alt');
        } else {
            this.buttonElement.textContent = 'В корзину';
            this.buttonElement.classList.remove('button_alt');
        }
        this.buttonElement.disabled = false;
    }

    render(data?: Partial<ICardData>): HTMLElement {
        if (data) {
            if (data.price !== undefined) this.price = data.price;
            if (data.description !== undefined) this.description = data.description;
            if (data.id !== undefined) this.id = data.id;
            if (data.title !== undefined) this.title = data.title;
            if (data.image !== undefined) this.image = data.image;
            if (data.category !== undefined) this.category = data.category;
        }
        return super.render(data);
    }
}