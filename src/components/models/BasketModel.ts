import { IProduct } from '../../types';

export class BasketModel {
    private _items: IProduct[] = [];

    // Получить все товары в корзине
    getItems(): IProduct[] {
        return this._items;
    }

    // Добавить товар
    addItem(product: IProduct): void {
        // Проверяем, нет ли уже такого товара
        if (!this.contains(product.id)) {
            this._items.push(product);
        }
    }

    // Удалить товар по id
    removeItem(productId: string): void {
        this._items = this._items.filter(item => item.id !== productId);
    }

    // Очистить корзину
    clear(): void {
        this._items = [];
    }

    // Получить общую стоимость
    getTotal(): number {
        return this._items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    // Получить количество товаров
    getCount(): number {
        return this._items.length;
    }

    // Проверить наличие товара по id
    contains(productId: string): boolean {
        return this._items.some(item => item.id === productId);
    }
}