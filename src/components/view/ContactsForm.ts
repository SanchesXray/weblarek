import { BaseForm } from './BaseForm';
import { EventEmitter } from '../base/Events';

export class ContactsForm extends BaseForm {
    constructor(template: HTMLTemplateElement, eventBus: EventEmitter) {
        super(template, eventBus, 'contacts:submit');
    }

    setEmail(value: string): void {
        this.setFieldValue('email', value);
    }

    setPhone(value: string): void {
        this.setFieldValue('phone', value);
    }
}