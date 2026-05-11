import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductsModel {
    private items: IProduct[] = [];
    private selectedProduct: IProduct | null = null;
    private eventBus: EventEmitter;

    constructor(eventBus: EventEmitter) {
        this.eventBus = eventBus;
    }

    // Сохранить массив товаров
    setItems(items: IProduct[]): void {
        this.items = items;
        this.eventBus.emit('products:changed', { items: this.items }); // Генерация события
    }

    // Получить все товары
    getItems(): IProduct[] {
        return this.items;
    }

    // Получить товар по id
    getProductById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    // Сохранить выбранный товар для просмотра
    setSelectedProduct(product: IProduct): void {              
        this.selectedProduct = product;
        this.eventBus.emit('selected-product:changed', { product: this.selectedProduct }); // Генерация события
    }

    // Получить выбранный товар
    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}