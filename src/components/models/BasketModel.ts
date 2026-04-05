import { IProduct } from '../../types';

export class BasketModel {
    private items: IProduct[] = [];

    // Получить все товары в корзине
    getItems(): IProduct[] {
        return this.items;
    }

    // Добавить товар
    addItem(product: IProduct): void {
        // Проверяем, нет ли уже такого товара
        if (!this.contains(product.id)) {
            this.items.push(product);
        }
    }

    // Удалить товар по id
    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
    }

    // Очистить корзину
    clear(): void {
        this.items = [];
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
    contains(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    }
}