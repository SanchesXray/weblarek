import { BaseForm } from './BaseForm';
import { EventEmitter } from '../base/Events';

export class OrderForm extends BaseForm {
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    private addressInput: HTMLInputElement | null;

    constructor(template: HTMLTemplateElement, eventBus: EventEmitter) {
        super(template, eventBus, 'order:submit');

        this.paymentButtons = this.formElement.querySelectorAll('.order__buttons button');
        this.addressInput = this.formElement.querySelector('input[name="address"]');

        // Только эмит события, UI меняется через setPaymentMethod из презентера
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.eventBus.emit('order:payment-change', { payment: button.name });
            });
        });
    }

    // UI обновляется только через этот метод (вызывается из презентера)
    setPaymentMethod(payment: string): void {
        this.paymentButtons.forEach(btn => {
            if (btn.name === payment) {
                btn.classList.add('button_alt-active');
            } else {
                btn.classList.remove('button_alt-active');
            }
        });
    }

    setAddress(value: string): void {
        if (this.addressInput) this.addressInput.value = value;
    }

    getAddress(): string {
        return this.addressInput?.value || '';
    }
}