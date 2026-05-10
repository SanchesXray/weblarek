import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class BasketModel {
    private items: IProduct[] = [];
    private eventBus: EventEmitter;

    // Конструктор
    constructor(eventBus: EventEmitter) {
        this.eventBus = eventBus;
    }

    // Получить все товары в корзине
    getItems(): IProduct[] {
        return this.items;
    }

    // Добавить товар
    addItem(product: IProduct): void {
        // Проверяем, нет ли уже такого товара
        if (!this.contains(product.id)) {
            this.items.push(product);
            this.emitBasketChanged();
        }
    }

    // Удалить товар по id
    removeItem(productId: string): void {
    const oldCount = this.items.length;
    this.items = this.items.filter(item => item.id !== productId);
    const newCount = this.items.length;

    // Генерируем событие только если товар действительно был удалён
    if (oldCount !== newCount) {
        this.emitBasketChanged();
    }
}

    // Очистить корзину
    clear(): void {
        this.items = [];
        this.emitBasketChanged();
    }

    // Получить общую стоимость
    getTotal(): number {
        return this.items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    // Получить количество товаров
    getCount(): number {
        return this.items.length;
    }

    // Проверить наличие товара по id
 // BasketModel.ts
contains(productId: string): boolean {
    const result = this.items.some(item => item.id === productId);
    return result;
}

    // Приватный метод для генерации события
    private emitBasketChanged(): void {
        this.eventBus.emit('basket:changed', {
            items: this.items,
            total: this.getTotal(),
            count: this.getCount()
        });
    }
}