import { Component } from '../base/Component';

export class Gallery extends Component<any> {
    private catalogContainer: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.catalogContainer = container;
    }

    set catalog(items: HTMLElement[]) {
        if (this.catalogContainer) {
            this.catalogContainer.innerHTML = '';
            items.forEach(item => {
                this.catalogContainer.appendChild(item);
            });
        }
    }

    render(): HTMLElement {
        return this.container;
    }
}