import './scss/styles.scss';
import { ProductsModel } from './components/models/ProductsModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { WebLarekAPI } from './components/api/WebLarekAPI';

// Проверка переменных окружения
console.log('=== ПРОВЕРКА .ENV ===');
console.log('VITE_API_ORIGIN:', import.meta.env.VITE_API_ORIGIN);
console.log('Все переменные VITE:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE')));
console.log('==================');

// Тестовые данные для проверки моделей
const testProducts = {
    items: [
        {
            id: '1',
            title: 'Тестовый товар 1',
            description: 'Описание товара 1',
            image: '/test.jpg',
            category: 'софт-скил',
            price: 1000
        },
        {
            id: '2',
            title: 'Тестовый товар 2',
            description: 'Описание товара 2',
            image: '/test.jpg',
            category: 'хард-скил',
            price: 2000
        }
    ]
};

// Создаем экземпляры моделей
const productsModel = new ProductsModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

console.log('=== Тестирование моделей данных ===');

// 1. Тестируем модель каталога
console.log('\n1. Модель каталога:');
productsModel.setItems(testProducts.items);
console.log('Массив товаров из каталога:', productsModel.getItems());
console.log('Количество товаров:', productsModel.getItems().length);

const firstProduct = productsModel.getItems()[0];
console.log('Первый товар:', firstProduct);

productsModel.setSelectedProduct(firstProduct);
console.log('Выбранный товар:', productsModel.getSelectedProduct());

// 2. Тестируем модель корзины
console.log('\n2. Модель корзины:');
basketModel.addItem(firstProduct);
console.log('Товаров в корзине:', basketModel.getCount());
console.log('Список товаров в корзине:', basketModel.getItems());
console.log('Общая стоимость:', basketModel.getTotal());

const secondProduct = productsModel.getItems()[1];
basketModel.addItem(secondProduct);
console.log('После добавления второго товара, количество:', basketModel.getCount());
console.log('Общая стоимость:', basketModel.getTotal());

console.log('Содержит ли корзина первый товар?', basketModel.contains(firstProduct.id));
basketModel.removeItem(firstProduct.id);
console.log('После удаления первого товара, количество:', basketModel.getCount());

basketModel.clear();
console.log('После очистки, количество:', basketModel.getCount());

// 3. Тестируем модель покупателя
console.log('\n3. Модель покупателя:');
buyerModel.payment = 'card';
buyerModel.address = 'г. Москва, ул. Ленина, д. 1';
buyerModel.email = 'test@example.com';
buyerModel.phone = '+7 (999) 123-45-67';

console.log('Данные покупателя:', buyerModel.getBuyerData());
console.log('Первый шаг валиден?', buyerModel.isFirstStepValid());
console.log('Второй шаг валиден?', buyerModel.isSecondStepValid());

const errors = buyerModel.validateAll();
console.log('Ошибки валидации:', errors);

// 4. Тестируем работу с API
console.log('\n4. Работа с API:');
// Используем переменную из .env или fallback URL
const API_URL = import.meta.env.VITE_API_ORIGIN || 'https://larek-api.nomoreparties.co';
console.log('Используемый URL API:', API_URL);

const api = new WebLarekAPI(API_URL);

api.getProducts()
    .then(data => {
        console.log('Данные с сервера:', data);
        productsModel.setItems(data.items);
        console.log('Сохранено в модель:', productsModel.getItems().length, 'товаров');
        console.log('Массив товаров из каталога после загрузки:', productsModel.getItems());
    })
    .catch(error => {
        console.error('Ошибка при загрузке товаров:', error);
        if (error.message) {
            console.error('Сообщение ошибки:', error.message);
        }
    });