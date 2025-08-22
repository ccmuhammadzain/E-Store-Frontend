import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="fixed inset-0 pointer-events-none flex flex-col items-end gap-2 p-4 z-[1000]">
    <div *ngFor="let m of messages" class="pointer-events-auto w-72 shadow-lg rounded-md px-4 py-3 text-sm font-medium border flex items-start gap-2 animate-fadeIn"
      [ngClass]="{
        'bg-green-400 text-white border-green-600': m.type==='success',
        'bg-red-blue text-white border-blue-600': m.type==='error',
        'bg-red-400 text-white border-red-600': m.type==='info',
        'bg-yellow-400 text-white border-yellow-600': m.type==='warning'
      }">
      <div class="flex-1 whitespace-pre-line">{{ m.text }}</div>
      <button (click)="dismiss(m.id)" aria-label="Close" class="opacity-70 hover:opacity-100">✕</button>
    </div>
  </div>
  `,
  styles: [`
    :host { position: fixed; top:0; left:0; }
    .animate-fadeIn { animation: fadeIn .25s ease; }
    @keyframes fadeIn { from { opacity:0; transform: translateY(-4px);} to { opacity:1; transform: translateY(0);} }
  `]
})
export class ToastContainerComponent implements OnDestroy {
  messages: ToastMessage[] = [];
  private sub: Subscription;

  constructor(private toast: ToastService) {
    this.sub = this.toast.messages$.subscribe(ms => this.messages = ms);
  }

  dismiss(id: number) { this.toast.dismiss(id); }

  ngOnDestroy(): void { this.sub.unsubscribe(); }
}
