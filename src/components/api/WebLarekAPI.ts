import { Api } from '../base/api';
import { IProduct, IOrder, IOrderResult, IProductsResponse } from '../../types';

export class WebLarekAPI extends Api {
    constructor(baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    }

    // Получить список товаров
    async getProducts(): Promise<IProductsResponse> {
        return this.get('/product/') as Promise<IProductsResponse>;
    }

    // Отправить заказ
    async postOrder(order: IOrder): Promise<IOrderResult> {
        return this.post('/order/', order) as Promise<IOrderResult>;
    }
}