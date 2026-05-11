import { BaseCard } from './BaseCard';
import { EventEmitter } from '../base/Events';

export class CatalogCard extends BaseCard {
    constructor(container: HTMLElement, eventBus: EventEmitter, onClick: (id: string) => void) {
        super(container, eventBus, onClick);
    }
}