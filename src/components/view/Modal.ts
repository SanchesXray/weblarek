import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class Modal extends Component<any> {
    private contentContainer: HTMLElement | null;
    private closeButton: HTMLButtonElement | null;
    private isOpen: boolean = false;
    private eventBus: EventEmitter;

    constructor(container: HTMLElement, eventBus: EventEmitter) {
        super(container);
        this.eventBus = eventBus;
        this.contentContainer = container.querySelector('.modal__content');
        this.closeButton = container.querySelector('.modal__close');        
        this.closeButton?.addEventListener('click', () => this.close());
        container.addEventListener('click', (e) => {
            if (e.target === container) this.close();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });
    }

    open(): void {
        this.container.classList.add('modal_active');
        this.isOpen = true;
        this.eventBus.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.isOpen = false;
        if (this.contentContainer) this.contentContainer.innerHTML = '';
        this.eventBus.emit('modal:close');
    }

    setContent(content: HTMLElement | Component<any>): void {
        if (this.contentContainer) {
            this.contentContainer.innerHTML = '';
            if (content instanceof Component) {
                this.contentContainer.appendChild(content.render());
            } else {
                this.contentContainer.appendChild(content);
            }
        }
    }

    render(): HTMLElement {
        return this.container;
    }
}