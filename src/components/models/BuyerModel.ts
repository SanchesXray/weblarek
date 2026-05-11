import { TPayment, FormErrors } from '../../types';
import { EventEmitter } from '../base/Events';

export class BuyerModel {
    private paymentValue: TPayment = '';
    private addressValue: string = '';
    private emailValue: string = '';
    private phoneValue: string = '';
    private eventBus: EventEmitter;

    constructor(eventBus: EventEmitter) {
        this.eventBus = eventBus;
    }

    set payment(value: TPayment) {
        this.paymentValue = value;
        this.emitBuyerChanged();
    }

    get payment(): TPayment {
        return this.paymentValue;
    }

    set address(value: string) {
        this.addressValue = value;
        this.emitBuyerChanged();
    }

    get address(): string {
        return this.addressValue;
    }

    set email(value: string) {
        this.emailValue = value;
        this.emitBuyerChanged();
    }

    get email(): string {
        return this.emailValue;
    }

    set phone(value: string) {
        this.phoneValue = value;
        this.emitBuyerChanged();
    }

    get phone(): string {
        return this.phoneValue;
    }

    clear(): void {
        this.paymentValue = '';
        this.addressValue = '';
        this.emailValue = '';
        this.phoneValue = '';
        this.emitBuyerChanged();
    }

    validateAll(): FormErrors {
        const errors: FormErrors = {};

        if (!this.paymentValue) errors.payment = 'Не выбран способ оплаты';
        if (!this.addressValue.trim()) errors.address = 'Введите адрес доставки';
        if (!this.emailValue.trim()) errors.email = 'Введите email';
        if (!this.phoneValue.trim()) errors.phone = 'Введите телефон';

        return errors;
    }

    private emitBuyerChanged(): void {
        this.eventBus.emit('buyer:changed', {
            payment: this.paymentValue,
            address: this.addressValue,
            email: this.emailValue,
            phone: this.phoneValue
        });
    }
}