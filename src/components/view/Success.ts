import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class Success extends Component<any> {
    private descriptionElement: HTMLElement | null;
    private closeButton: HTMLButtonElement | null;
    private eventBus: EventEmitter;

    constructor(container: HTMLElement, eventBus: EventEmitter) {
        super(container);
        this.eventBus = eventBus;
        this.descriptionElement = container.querySelector('.order-success__description');
        this.closeButton = container.querySelector('.order-success__close');
        
        this.closeButton?.addEventListener('click', () => {
            this.eventBus.emit('success:close');
        });
    }

    set total(value: number) {
        if (this.descriptionElement) {
            this.descriptionElement.textContent = `Списано ${value} синапсов`;
        }
    }

    render(): HTMLElement {
        return this.container;
    }
}