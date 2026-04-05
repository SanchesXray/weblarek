import './scss/styles.scss';
import { ProductsModel } from './components/models/ProductsModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { WebLarekAPI } from './components/api/WebLarekAPI';
import { Api } from './components/base/Api';  // ← импорт класса Api
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';  // ← импортируем константу

// Создаем экземпляры моделей
const productsModel = new ProductsModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

console.log('=== Тестирование моделей данных ===');

// 1. Тестируем модель каталога
console.log('\n1. Модель каталога:');
productsModel.setItems(apiProducts.items);
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

// Тест 1: Пустые поля
console.log('\n--- Проверка валидации с пустыми полями ---');
console.log('Ошибки:', buyerModel.validateAll());

// Тест 2: Только способ оплаты
console.log('\n--- Проверка после заполнения способа оплаты ---');
buyerModel.payment = 'card';
console.log('Ошибки:', buyerModel.validateAll());

// Тест 3: Добавляем адрес
console.log('\n--- Проверка после добавления адреса ---');
buyerModel.address = 'г. Москва, ул. Ленина, д. 1';
console.log('Ошибки:', buyerModel.validateAll());

// Тест 4: Добавляем email
console.log('\n--- Проверка после добавления email ---');
buyerModel.email = 'test@example.com';
console.log('Ошибки:', buyerModel.validateAll());

// Тест 5: Добавляем телефон (все поля заполнены)
console.log('\n--- Проверка после заполнения всех полей ---');
buyerModel.phone = '+7 (999) 123-45-67';
console.log('Ошибки (должны отсутствовать):', buyerModel.validateAll());

// Тест 6: Проверка очистки
console.log('\n--- Проверка после очистки данных ---');
buyerModel.clear();
console.log('Ошибки (снова все поля пустые):', buyerModel.validateAll());

// 4. Тестируем работу с API
console.log('\n4. Работа с API:');
console.log('Используемый URL API:', API_URL); // ← используем константу

// Создаем экземпляр Api и передаем его в WebLarekAPI
const apiInstance = new Api(API_URL);
const api = new WebLarekAPI(apiInstance);

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