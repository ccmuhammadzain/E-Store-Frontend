import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  text: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  timeout?: number; // ms
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private messages: ToastMessage[] = [];
  private subject = new BehaviorSubject<ToastMessage[]>([]);
  messages$ = this.subject.asObservable();
  private counter = 0;

  show(text: string, type: ToastMessage['type'] = 'info', timeout = 2500) {
    const msg: ToastMessage = { id: ++this.counter, text, type, timeout };
    this.messages.push(msg);
    this.subject.next([...this.messages]);
    if (timeout > 0) {
      setTimeout(() => this.dismiss(msg.id), timeout);
    }
  }

  success(text: string, timeout?: number) {
    this.show(text, 'success', timeout ?? 2500);
  }
  error(text: string, timeout?: number) {
    this.show(text, 'error', timeout ?? 4000);
  }
  info(text: string, timeout?: number) {
    this.show(text, 'info', timeout ?? 2500);
  }
  warning(text: string, timeout?: number) {
    this.show(text, 'warning', timeout ?? 3000);
  }

  dismiss(id: number) {
    this.messages = this.messages.filter((m) => m.id !== id);
    this.subject.next([...this.messages]);
  }

  clear() {
    this.messages = [];
    this.subject.next([]);
  }
}
