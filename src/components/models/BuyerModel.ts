import { IBuyer, TPayment } from '../../types';

export type FormErrors = Partial<Record<keyof IBuyer, string>>;

export class BuyerModel {
    private _payment: TPayment = '';
    private _address: string = '';
    private _email: string = '';
    private _phone: string = '';

    // Геттеры и сеттеры для полей
    set payment(value: TPayment) {
        this._payment = value;
    }

    get payment(): TPayment {
        return this._payment;
    }

    set address(value: string) {
        this._address = value;
    }

    get address(): string {
        return this._address;
    }

    set email(value: string) {
        this._email = value;
    }

    get email(): string {
        return this._email;
    }

    set phone(value: string) {
        this._phone = value;
    }

    get phone(): string {
        return this._phone;
    }

    // Получить все данные покупателя
    getBuyerData(): IBuyer {
        return {
            payment: this._payment,
            address: this._address,
            email: this._email,
            phone: this._phone
        };
    }

    // Очистить данные
    clear(): void {
        this._payment = '';
        this._address = '';
        this._email = '';
        this._phone = '';
    }

    // Валидация одного поля
    validateField(field: keyof IBuyer): string | null {
        switch (field) {
            case 'payment':
                if (!this._payment) return 'Не выбран способ оплаты';
                break;
            case 'address':
                if (!this._address.trim()) return 'Введите адрес доставки';
                break;
            case 'email':
                if (!this._email.trim()) return 'Введите email';
                break;
            case 'phone':
                if (!this._phone.trim()) return 'Введите телефон';
                break;
        }
        return null;
    }

    // Валидация всех полей
    validateAll(): FormErrors {
        const errors: FormErrors = {};
        
        const paymentError = this.validateField('payment');
        if (paymentError) errors.payment = paymentError;
        
        const addressError = this.validateField('address');
        if (addressError) errors.address = addressError;
        
        const emailError = this.validateField('email');
        if (emailError) errors.email = emailError;
        
        const phoneError = this.validateField('phone');
        if (phoneError) errors.phone = phoneError;
        
        return errors;
    }

    // Проверка валидности для первого шага (оплата и адрес)
    isFirstStepValid(): boolean {
        return !!(this._payment && this._address.trim());
    }

    // Проверка валидности для второго шага (email и телефон)
    isSecondStepValid(): boolean {
        return !!(this._email.trim() && this._phone.trim());
    }
}