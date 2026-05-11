import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { ProductsModel } from './components/models/ProductsModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { WebLarekAPI } from './components/api/WebLarekAPI';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

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

import { IProduct } from './types';

// ========== ИНИЦИАЛИЗАЦИЯ ==========
const eventBus = new EventEmitter();
const productsModel = new ProductsModel(eventBus);
const basketModel = new BasketModel(eventBus);
const buyerModel = new BuyerModel(eventBus);
const apiInstance = new Api(API_URL);
const api = new WebLarekAPI(apiInstance);

// ========== DOM ЭЛЕМЕНТЫ (с использованием ensureElement) ==========
const galleryElement = ensureElement<HTMLElement>('.gallery');
const modalElement = ensureElement<HTMLElement>('#modal-container');
const headerElement = ensureElement<HTMLElement>('.header');

// ========== ШАБЛОНЫ (с использованием ensureElement) ==========
const catalogCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewCardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// ========== СОЗДАНИЕ КОМПОНЕНТОВ (ОДНОКРАТНО) ==========

// Header
const header = new Header(headerElement, eventBus);
header.render();

// Modal
const modal = new Modal(modalElement, eventBus);
modal.render();

// Gallery
const gallery = new Gallery(galleryElement);
gallery.render();

// Basket
const basketContainer = cloneTemplate(basketTemplate);
const basket = new Basket(basketContainer, eventBus);

// PreviewCard (один экземпляр, переиспользуется)
const previewCardContainer = cloneTemplate(previewCardTemplate);
const previewCard = new PreviewCard(previewCardContainer, eventBus, (id) => {
    eventBus.emit('product:toggle-basket', { id });
});

// OrderForm
const orderForm = new OrderForm(orderTemplate, eventBus);

// ContactsForm
const contactsForm = new ContactsForm(contactsTemplate, eventBus);

// Success
const successContainer = cloneTemplate(successTemplate);
const success = new Success(successContainer, eventBus);

// ========== ЗАГРУЗКА ТОВАРОВ ==========
api.getProducts()
    .then(data => productsModel.setItems(data.items))
    .catch(error => console.error('Ошибка загрузки товаров:', error));

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

// Обновление каталога
eventBus.on('products:changed', (data: { items: IProduct[] }) => {
    const cards = data.items.map(product => {
        const cardElement = cloneTemplate(catalogCardTemplate);
        const card = new CatalogCard(cardElement, eventBus, (id) => {
            eventBus.emit('card:select', { id });
        });
        card.id = product.id;
        card.title = product.title;
        card.price = product.price;
        card.image = CDN_URL + product.image;
        card.category = product.category;
        return card.render();
    });
    gallery.catalog = cards;
});

// Выбор карточки для просмотра
eventBus.on('card:select', (data: { id: string }) => {
    const product = productsModel.getProductById(data.id);
    if (product) productsModel.setSelectedProduct(product);
});

// Показ превью товара
eventBus.on('selected-product:changed', (data: { product: IProduct | null }) => {
    if (data.product) {
        const isInBasket = basketModel.contains(data.product.id);

        previewCard.id = data.product.id;
        previewCard.title = data.product.title;
        previewCard.price = data.product.price;
        previewCard.image = CDN_URL + data.product.image;
        previewCard.category = data.product.category;
        previewCard.description = data.product.description;

        if (data.product.price === null) {
            previewCard.buttonText = 'Недоступно';
            previewCard.buttonDisabled = true;
        } else if (isInBasket) {
            previewCard.buttonText = 'Удалить из корзины';
            previewCard.buttonAlt = true;
            previewCard.buttonDisabled = false;
        } else {
            previewCard.buttonText = 'В корзину';
            previewCard.buttonAlt = false;
            previewCard.buttonDisabled = false;
        }

        modal.setContent(previewCard.render());
        modal.open();
    }
});

// Переключение товара в корзине
eventBus.on('product:toggle-basket', (data: { id: string }) => {
    const product = productsModel.getProductById(data.id);
    if (!product || product.price === null) return;

    if (basketModel.contains(data.id)) {
        basketModel.removeItem(data.id);
    } else {
        basketModel.addItem(product);
    }
});

// Выбор способа оплаты
eventBus.on('order:payment-change', (data: { payment: string }) => {
    buyerModel.payment = data.payment as 'card' | 'cash';
});

// Изменение полей формы
eventBus.on('form:field-change', (data: { name: string, value: string }) => {
    if (data.name === 'address') buyerModel.address = data.value;
    if (data.name === 'email') buyerModel.email = data.value;
    if (data.name === 'phone') buyerModel.phone = data.value;
});

// Удаление товара из корзины
eventBus.on('basket:remove-item', (data: { id: string }) => {
    basketModel.removeItem(data.id);
});

// Обновление счётчика и корзины при изменении данных
eventBus.on('basket:changed', (data: { items: IProduct[], total: number, count: number }) => {
    // Обновляем счётчик в шапке
    header.counter = data.count;

    // Если корзина открыта — обновляем её содержимое
    if (basketCardTemplate) {
        const cards = data.items.map((item, index) => {
            const cardElement = cloneTemplate(basketCardTemplate);
            const card = new BasketCard(cardElement, eventBus, (id) => {
                eventBus.emit('basket:remove-item', { id });
            });
            card.id = item.id;
            card.title = item.title;
            card.price = item.price;
            card.index = index + 1;
            return card;
        });
        basket.items = cards;
        basket.total = data.total;
    }

    // Если открыто модальное окно с товаром (превью), обновляем состояние кнопки
    const modalContent = modal.render().querySelector('.modal__content');
    if (modalContent && modalContent.querySelector('.basket')) {
        modal.setContent(basket.render());  // ✅ Только если корзина уже открыта
    }

    // Обновляем кнопку в превью (если открыто)
    if (modalContent && modalContent.querySelector('.card_full')) {
        const product = productsModel.getProductById(previewCard.id);
        if (product) {
            const isInBasket = basketModel.contains(product.id);

            if (product.price === null) {
                previewCard.buttonText = 'Недоступно';
                previewCard.buttonDisabled = true;
            } else if (isInBasket) {
                previewCard.buttonText = 'Удалить из корзины';
                previewCard.buttonAlt = true;
                previewCard.buttonDisabled = false;
            } else {
                previewCard.buttonText = 'В корзину';
                previewCard.buttonAlt = false;
                previewCard.buttonDisabled = false;
            }
        }
    }
});

// Открытие корзины
eventBus.on('basket:open', () => {
    const items = basketModel.getItems();
    const total = basketModel.getTotal();

    if (!basketCardTemplate) {
        console.error('Шаблон card-basket не найден');
        return;
    }

    const cards = items.map((item, index) => {
        const cardElement = cloneTemplate(basketCardTemplate);
        const card = new BasketCard(cardElement, eventBus, (id) => {
            eventBus.emit('basket:remove-item', { id });
        });
        card.id = item.id;
        card.title = item.title;
        card.price = item.price;
        card.index = index + 1;
        return card;
    });

    basket.items = cards;
    basket.total = total;

    modal.setContent(basket.render());
    modal.open();
});

// Оформление заказа
eventBus.on('basket:create-order', () => {
    if (basketModel.getCount() === 0) return;
    // Не очищаем модель здесь — только при успешной отправке
    orderForm.clearForm();
    orderForm.setPaymentMethod('');
    modal.setContent(orderForm.render());
    modal.open();
});

// Обновление UI при изменении данных покупателя
eventBus.on('buyer:changed', (data: { payment: string, address: string, email: string, phone: string }) => {
    // Обновляем UI форм
    orderForm.setPaymentMethod(data.payment);
    orderForm.setAddress(data.address);
    contactsForm.setEmail(data.email);
    contactsForm.setPhone(data.phone);

    // Валидация и обновление состояния кнопок
    const errors = buyerModel.validateAll();
    orderForm.setSubmitEnabled(!errors.address && !errors.payment);
    contactsForm.setSubmitEnabled(!errors.email && !errors.phone);

    // Показываем ошибки в активной форме
    const content = modal.render().querySelector('.modal__content');
    if (content?.querySelector('.order')) {
        orderForm.setError(errors.address || errors.payment || '');
    } else if (content?.querySelector('.contacts')) {
        contactsForm.setError(errors.email || errors.phone || '');
    }
});

// Отправка формы заказа
eventBus.on('order:submit', () => {
    const errors = buyerModel.validateAll();
    if (errors.address || errors.payment) {
        orderForm.setError('Заполните все поля');
        return;
    }
    modal.setContent(contactsForm.render());
});

// Отправка контактной формы
eventBus.on('contacts:submit', () => {
    const errors = buyerModel.validateAll();
    if (errors.email || errors.phone) {
        contactsForm.setError('Заполните все поля');
        return;
    }

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
            success.total = result.total;
            modal.setContent(success.render());
            basketModel.clear();
            buyerModel.clear(); // Очистка ТОЛЬКО после успешной отправки
        })
        .catch(error => console.error('Ошибка отправки заказа:', error));
});

// Закрытие успешного заказа
eventBus.on('success:close', () => {
    modal.close();
});

// Закрытие модального окна
eventBus.on('modal:close', () => { });