import { TPayment, FormErrors } from '../../types';

export class BuyerModel {
    private paymentValue: TPayment = '';
    private addressValue: string = '';
    private emailValue: string = '';
    private phoneValue: string = '';

    // Геттеры и сеттеры для полей
    set payment(value: TPayment) {
        this.paymentValue = value;
    }

    get payment(): TPayment {
        return this.paymentValue;
    }

    set address(value: string) {
        this.addressValue = value;
    }

    get address(): string {
        return this.addressValue;
    }

    set email(value: string) {
        this.emailValue = value;
    }

    get email(): string {
        return this.emailValue;
    }

    set phone(value: string) {
        this.phoneValue = value;
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
}
