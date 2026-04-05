import {  IApi , IOrder, IOrderResult, IProductsResponse } from '../../types';

export class WebLarekAPI {
    private api: IApi;

    constructor(api: IApi) {  // ← принимаем экземпляр Api
        this.api = api;
    }

    async getProducts(): Promise<IProductsResponse> {
        return this.api.get('/product/') as Promise<IProductsResponse>;
    }

    async postOrder(order: IOrder): Promise<IOrderResult> {
        return this.api.post('/order/', order) as Promise<IOrderResult>;
    }
}