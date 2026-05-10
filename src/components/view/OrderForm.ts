import { BaseForm } from './BaseForm';
import { EventEmitter } from '../base/Events';

export class OrderForm extends BaseForm {
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    private addressInput: HTMLInputElement | null;
    private selectedPayment: string = '';

    constructor(template: HTMLTemplateElement, eventBus: EventEmitter) {
        super(template, eventBus);
        
        this.paymentButtons = this.formElement.querySelectorAll('.order__buttons button');
        this.addressInput = this.formElement.querySelector('input[name="address"]');
        
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.selectedPayment = button.name;
                this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
                button.classList.add('button_alt-active');
                this.validateForm();
                this.eventBus.emit('order:payment-change', { payment: this.selectedPayment });
            });
        });
    }

    protected validateForm(): boolean {
        const isValid = this.selectedPayment !== '' && (this.addressInput?.value.trim() !== '');
        this.setSubmitButtonState(isValid);
        return isValid;
    }

    protected getFormData(): Record<string, string> {
        return {
            payment: this.selectedPayment,
            address: this.addressInput?.value || ''
        };
    }
}