import { Api } from '../base/Api';
import { IOrder, IOrderResult, IProductsResponse } from '../../types';

export class WebLarekAPI {
    private _api: Api;

    constructor(api: Api) {  // ← принимаем экземпляр Api
        this._api = api;
    }

    async getProducts(): Promise<IProductsResponse> {
        return this._api.get('/product/') as Promise<IProductsResponse>;
    }

    async postOrder(order: IOrder): Promise<IOrderResult> {
        return this._api.post('/order/', order) as Promise<IOrderResult>;
    }
}