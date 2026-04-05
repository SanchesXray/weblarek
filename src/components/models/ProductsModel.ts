import { IProduct } from '../../types';

export class ProductsModel {
    private items: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    // Сохранить массив товаров
    setItems(items: IProduct[]): void {
        this.items = items;
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
    }

    // Получить выбранный товар
    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}