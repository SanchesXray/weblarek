import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export abstract class BaseForm extends Component<any> {
    protected formElement: HTMLFormElement;
    protected submitButton: HTMLButtonElement | null;
    protected errorsContainer: HTMLElement | null;
    protected inputs: NodeListOf<HTMLInputElement>;
    protected eventBus: EventEmitter;

    constructor(template: HTMLTemplateElement, eventBus: EventEmitter) {
        // Клонируем содержимое шаблона
        const fragment = template.content.cloneNode(true) as DocumentFragment;
        // Находим форму внутри фрагмента
        const formElement = fragment.querySelector('form');
        
        if (!formElement) {
            throw new Error('BaseForm: в шаблоне не найден элемент <form>');
        }
        
        // Вызываем super с формой как контейнером
        super(formElement as HTMLElement);
        this.eventBus = eventBus;
        this.formElement = formElement as HTMLFormElement;
        
        // Находим элементы внутри формы
        this.submitButton = this.formElement.querySelector('button[type="submit"]');
        this.errorsContainer = this.formElement.querySelector('.form__errors');
        this.inputs = this.formElement.querySelectorAll('input');
        
        // Навешиваем обработчики
        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.eventBus.emit('form:submit', this.getFormData());
            }
        });
        
        this.inputs.forEach(input => {
            input.addEventListener('input', () => this.validateForm());
        });
    }

    protected abstract validateForm(): boolean;

    protected getFormData(): Record<string, string> {
        const data: Record<string, string> = {};
        this.inputs.forEach(input => {
            data[input.name] = input.value;
        });
        return data;
    }

    protected showError(message: string): void {
        if (this.errorsContainer) this.errorsContainer.textContent = message;
    }

    protected clearError(): void {
        if (this.errorsContainer) this.errorsContainer.textContent = '';
    }

    protected setSubmitButtonState(isValid: boolean): void {
        if (this.submitButton) this.submitButton.disabled = !isValid;
    }

    render(): HTMLElement {
        return this.container;
    }
}