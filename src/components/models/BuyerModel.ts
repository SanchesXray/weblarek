import { TPayment, FormErrors } from '../../types';
import { EventEmitter } from '../base/Events';

export class BuyerModel {
    private paymentValue: TPayment = '';
    private addressValue: string = '';
    private emailValue: string = '';
    private phoneValue: string = '';
    private eventBus: EventEmitter;

    // Конструктор
    constructor(eventBus: EventEmitter) {
        this.eventBus = eventBus;
    }

    // Геттеры и сеттеры для полей
    set payment(value: TPayment) {
        this.paymentValue = value;
        this.emitBuyerChanged();
        this.emitValidation();
    }

    get payment(): TPayment {
        return this.paymentValue;
    }

    set address(value: string) {
        this.addressValue = value;
        this.emitBuyerChanged();
        this.emitValidation();
    }

    get address(): string {
        return this.addressValue;
    }

    set email(value: string) {
        this.emailValue = value;
        this.emitBuyerChanged();
        this.emitValidation();
    }

    get email(): string {
        return this.emailValue;
    }

    set phone(value: string) {
        this.phoneValue = value;
        this.emitBuyerChanged();
        this.emitValidation();
    }

    get phone(): string {
        return this.phoneValue;
    }

    // Очистить данные
    clear(): void {
        this.paymentValue = '';
        this.addressValue = '';
        this.emailValue = '';
        this.phoneValue = '';
        this.emitBuyerChanged();
        this.emitValidation();
    }

    // Валидация всех полей
    validateAll(): FormErrors {
        const errors: FormErrors = {};
                
        if (!this.paymentValue) errors.payment = 'Не выбран способ оплаты';

        if (!this.addressValue.trim()) errors.address = 'Введите адрес доставки';

        if (!this.emailValue.trim()) errors.email = 'Введите email';

        if (!this.phoneValue.trim()) errors.phone = 'Введите телефон';

        return errors;
    }

        // ← добавить приватный метод для генерации события изменения данных
    private emitBuyerChanged(): void {
        this.eventBus.emit('buyer:changed', {
            payment: this.paymentValue,
            address: this.addressValue,
            email: this.emailValue,
            phone: this.phoneValue
        });
    }

    // ← добавить приватный метод для генерации события валидации
    private emitValidation(): void {
        const errors = this.validateAll();
        const isValid = Object.keys(errors).length === 0;
        this.eventBus.emit('buyer:validated', { isValid, errors });
    }
}