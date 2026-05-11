import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export abstract class BaseForm extends Component<any> {
    protected formElement: HTMLFormElement;
    protected submitButton: HTMLButtonElement | null;
    protected errorsContainer: HTMLElement | null;
    protected inputs: NodeListOf<HTMLInputElement>;
    protected eventBus: EventEmitter;
    protected submitEventName: string;

    constructor(template: HTMLTemplateElement, eventBus: EventEmitter, submitEventName: string) {
        const fragment = template.content.cloneNode(true) as DocumentFragment;
        const formElement = fragment.querySelector('form');
        if (!formElement) throw new Error('BaseForm: <form> not found');
        super(formElement as HTMLElement);

        this.eventBus = eventBus;
        this.submitEventName = submitEventName;
        this.formElement = formElement as HTMLFormElement;
        this.submitButton = this.formElement.querySelector('button[type="submit"]');
        this.errorsContainer = this.formElement.querySelector('.form__errors');
        this.inputs = this.formElement.querySelectorAll('input');

        // Только уведомление о сабмите, без данных
        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            this.eventBus.emit(this.submitEventName);
        });

        // Уведомление об изменении полей
        this.inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.eventBus.emit('form:field-change', { name: input.name, value: input.value });
            });
        });
    }

    setFieldValue(name: string, value: string): void {
        const input = this.formElement.querySelector(`[name="${name}"]`) as HTMLInputElement;
        if (input) input.value = value;
    }

    setError(message: string): void {
        if (this.errorsContainer) this.errorsContainer.textContent = message;
    }

    clearError(): void {
        if (this.errorsContainer) this.errorsContainer.textContent = '';
    }

    setSubmitEnabled(enabled: boolean): void {
        if (this.submitButton) this.submitButton.disabled = !enabled;
    }

    getFormData(): Record<string, string> {
        const data: Record<string, string> = {};
        this.inputs.forEach(input => {
            data[input.name] = input.value;
        });
        return data;
    }

    clearForm(): void {
        this.inputs.forEach(input => input.value = '');
        this.clearError();
    }

    render(): HTMLElement {
        return this.container;
    }
}