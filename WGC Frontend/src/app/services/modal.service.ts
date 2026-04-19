import { Injectable, signal, Type } from '@angular/core';

export interface ModalConfig {
  title: string;
  component: Type<any>;
  data?: any;
  maxWidth?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  activeModal = signal<ModalConfig | null>(null);

  open(config: ModalConfig) {
    this.activeModal.set(config);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.activeModal.set(null);
    document.body.style.overflow = 'auto';
  }
}
