import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class Header extends Component<any> {
    private basketButton: HTMLButtonElement | null;
    private counterElement: HTMLElement | null;
    private eventBus: EventEmitter;

    constructor(container: HTMLElement, eventBus: EventEmitter) {
        super(container);
        this.eventBus = eventBus;
        this.basketButton = container.querySelector('.header__basket');
        this.counterElement = container.querySelector('.header__basket-counter');
        
        this.basketButton?.addEventListener('click', () => {
            this.eventBus.emit('basket:open');
        });
    }

    set counter(value: number) {
        if (this.counterElement) {
            this.counterElement.textContent = String(value);
        }
    }

    render(): HTMLElement {
        return this.container;
    }
}