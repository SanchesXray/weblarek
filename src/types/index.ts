export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Добавляем наши типы и интерфейсы
export type TPayment = 'card' | 'cash' | '';

export interface IProduct {
    id: string;
    title: string;
    image: string;
    category: string;
    price: number | null;
    description: string;
}

export interface IBuyer {
    payment: TPayment;
    address: string;
    email: string;
    phone: string;
}

// Объект для отправки заказа на сервер
export interface IOrder extends IBuyer {
    items: string[];  // массив id товаров
    total: number;
}

// Ответ от сервера после оформления заказа
export interface IOrderResult {
    id: string;
    total: number;
}

// Ответ от сервера при получении списка товаров
export interface IProductsResponse {
    items: IProduct[];
    total: number;
}