import { ActionCard } from './ActionCard';
import { EventEmitter } from '../base/Events';

export class CatalogCard extends ActionCard {
    constructor(container: HTMLElement, eventBus: EventEmitter, onClick: () => void) {
        super(container, eventBus, onClick);
    }
}