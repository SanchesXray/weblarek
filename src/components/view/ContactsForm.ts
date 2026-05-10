import { BaseForm } from './BaseForm';
import { EventEmitter } from '../base/Events';

export class ContactsForm extends BaseForm {
    private emailInput: HTMLInputElement | null;
    private phoneInput: HTMLInputElement | null;

    constructor(template: HTMLTemplateElement, eventBus: EventEmitter) {
        super(template, eventBus);
        
        this.emailInput = this.formElement.querySelector('input[name="email"]');
        this.phoneInput = this.formElement.querySelector('input[name="phone"]');
    }

    protected validateForm(): boolean {
        const emailValid = this.validateEmail(this.emailInput?.value || '');
        const phoneValid = this.validatePhone(this.phoneInput?.value || '');
        const isValid = emailValid && phoneValid;
        
        this.setSubmitButtonState(isValid);
        
        if (!isValid) {
            this.showError('Заполните все поля корректно');
        } else {
            this.clearError();
        }
        
        return isValid;
    }

    private validateEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    private validatePhone(phone: string): boolean {
        return phone.replace(/[^0-9]/g, '').length >= 10;
    }

    protected getFormData(): Record<string, string> {
        return {
            email: this.emailInput?.value || '',
            phone: this.phoneInput?.value || ''
        };
    }
}