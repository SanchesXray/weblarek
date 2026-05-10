import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { ProductsModel } from './components/models/ProductsModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { WebLarekAPI } from './components/api/WebLarekAPI';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';

// Импорты компонентов View
import { Header } from './components/view/Header';
import { Modal } from './components/view/Modal';
import { Gallery } from './components/view/Gallery';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { CatalogCard } from './components/view/CatalogCard';
import { PreviewCard } from './components/view/PreviewCard';
import { BasketCard } from './components/view/BasketCard';

// Типы данных
import { IProduct } from './types';

// ========== ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ==========
// Клонирует шаблон и возвращает первый HTMLElement
function cloneTemplate(template: HTMLTemplateElement): HTMLElement {
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const firstElement = fragment.firstElementChild as HTMLElement;
    return firstElement;
}

// ========== 1. Инициализация ==========
// ========== Инициализация брокера событий ==========
const eventBus = new EventEmitter();

// ========== Инициализация моделей данных ==========
const productsModel = new ProductsModel(eventBus);
const basketModel = new BasketModel(eventBus);
const buyerModel = new BuyerModel(eventBus);

// ========== Инициализация API ==========
const apiInstance = new Api(API_URL);
const api = new WebLarekAPI(apiInstance);

// ========== 2. ПОЛУЧЕНИЕ DOM ЭЛЕМЕНТОВ ==========
const galleryElement = document.querySelector('.gallery') as HTMLElement;
const modalElement = document.getElementById('modal-container') as HTMLElement;
const headerElement = document.querySelector('.header') as HTMLElement;

// ========== 3. ПОЛУЧЕНИЕ ШАБЛОНОВ ==========
const catalogCardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const previewCardTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const basketCardTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
const successTemplate = document.getElementById('success') as HTMLTemplateElement;

// ========== 4. СОЗДАНИЕ КОМПОНЕНТОВ VIEW ==========
// Создаём Header (шапка с корзиной)
const header = new Header(headerElement, eventBus);
header.render();

// Создаём Modal (модальное окно)
const modal = new Modal(modalElement, eventBus);

// Создаём Gallery (каталог, сюда будут вставляться карточки)
const gallery = new Gallery(galleryElement);
gallery.render();

// Создаём Basket (корзина, будет открываться в модалке)
const basketContainer = cloneTemplate(basketTemplate);
const basket = new Basket(basketContainer, eventBus);

// ========== 5. ЗАГРУЗКА ТОВАРОВ С СЕРВЕРА ==========
api.getProducts()
    .then(data => {
        productsModel.setItems(data.items);
    })
    .catch(error => {
        console.error('Ошибка при загрузке товаров:', error);
    });

// ========== 6. НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ ==========
// Обновление каталога при загрузке товаров
eventBus.on('products:changed', (data: { items: IProduct[] }) => {
    const cards = data.items.map(product => {
        const cardElement = cloneTemplate(catalogCardTemplate);
        const card = new CatalogCard(cardElement, eventBus);
        card.render({
            id: product.id,
            title: product.title,
            price: product.price,
            image: CDN_URL + product.image,
            category: product.category
        });
        return card.render();
    });
    gallery.catalog = cards;
    gallery.render();
});

// Показ карточки товара в модальном окне при выборе
eventBus.on('selected-product:changed', (data: { product: IProduct | null }) => {
    if (data.product) {
        const cardElement = cloneTemplate(previewCardTemplate);
        const previewCard = new PreviewCard(cardElement, eventBus, basketModel); // ← передаём basketModel
        previewCard.render({
            price: data.product.price,
            id: data.product.id,
            title: data.product.title,
            image: CDN_URL + data.product.image,
            category: data.product.category,
            description: data.product.description
        });
        modal.setContent(previewCard.render());
        modal.open();
    }
});

// Обновление счётчика в шапке и корзины при изменении корзины
eventBus.on('basket:changed', (data: { items: IProduct[], total: number, count: number }) => {
    // Обновляем счётчик в шапке
    header.counter = data.count;

    // Если модальное окно открыто и в нём отображается корзина, обновляем её
    const modalContent = document.querySelector('.modal__content');
    if (modalContent && modalContent.querySelector('.basket')) {
        // Обновляем корзину
        const cards = data.items.map((item, index) => {
            const cardElement = cloneTemplate(basketCardTemplate);
            const card = new BasketCard(cardElement, eventBus);
            card.render({
                id: item.id,
                title: item.title,
                price: item.price,
                image: CDN_URL + item.image,
                category: item.category
            });
            card.index = index + 1;
            return card;
        });
        basket.items = cards;
        basket.total = data.total;

        // Обновляем содержимое модального окна
        modal.setContent(basket.render());
    }
});

//  Выбор карточки для просмотра
eventBus.on('card:select', (data: { id: string }) => {
    const product = productsModel.getProductById(data.id);
    if (product) {
        productsModel.setSelectedProduct(product);
    }
});

// Добавление товара в корзину
eventBus.on('product:add-to-basket', (data: { id: string, price: number }) => {
    const product = productsModel.getProductById(data.id);
    if (product && product.price !== null) {
        basketModel.addItem(product);
    }
});

// Открытие корзины
eventBus.on('basket:open', () => {
    const items = basketModel.getItems();
    const cards = items.map((item, index) => {
        const cardElement = cloneTemplate(basketCardTemplate);
        const card = new BasketCard(cardElement, eventBus);
        card.render({
            id: item.id,
            title: item.title,
            price: item.price,
            image: CDN_URL + item.image,
            category: item.category
        });
        card.index = index + 1;
        return card;
    });
    basket.items = cards;
    basket.total = basketModel.getTotal();
    modal.setContent(basket.render());
    modal.open();
});

// Удаление товара из корзины
eventBus.on('basket:remove-item', (data: { id: string }) => {
    basketModel.removeItem(data.id);
});

// Оформление заказа (переход к форме заказа)
eventBus.on('basket:create-order', () => {
    if (basketModel.getCount() === 0) return;

    // Очищаем данные покупателя перед новым заказом
    buyerModel.clear();

    // Передаём шаблон напрямую, а не клонированный контейнер
    const orderForm = new OrderForm(orderTemplate, eventBus);
    modal.setContent(orderForm.render());
    modal.open();
});

// Выбор способа оплаты
eventBus.on('order:payment-change', (data: { payment: 'card' | 'cash' }) => {
    buyerModel.payment = data.payment;
});

// Отправка формы заказа (переход к контактной форме)
eventBus.on('form:submit', (data: any) => {
    // Проверяем, что это форма заказа (есть поля payment и address)
    if (data.address !== undefined) {
        buyerModel.address = data.address;
        if (data.payment) {
            buyerModel.payment = data.payment;
        }

        // Передаём шаблон напрямую
        const contactsForm = new ContactsForm(contactsTemplate, eventBus);
        modal.setContent(contactsForm.render());
    }
    
    // Если это форма контактов, обработаем отдельно
    else if (data.email !== undefined && data.phone !== undefined) {
        buyerModel.email = data.email;
        buyerModel.phone = data.phone;

        // Проверяем валидность
        const errors = buyerModel.validateAll();
        if (Object.keys(errors).length > 0) {
            console.error('Ошибки валидации:', errors);
            return;
        }

        // Отправляем заказ на сервер
        const order = {
            payment: buyerModel.payment,
            email: buyerModel.email,
            phone: buyerModel.phone,
            address: buyerModel.address,
            total: basketModel.getTotal(),
            items: basketModel.getItems().map(item => item.id)
        };

        api.postOrder(order)
            .then(result => {
                const success = new Success(successTemplate, eventBus);
                success.total = result.total;
                modal.setContent(success.render());
                basketModel.clear();
            })
            .catch(error => {
                console.error('Ошибка при отправке заказа:', error);
            });
    }
});

// Закрытие успешного заказа
eventBus.on('success:close', () => {
    modal.close();
});

// Закрытие модального окна
eventBus.on('modal:close', () => {});