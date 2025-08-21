import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgClass, DecimalPipe } from '@angular/common';
import { BillService, BillCreateDto, BillDto } from '../../core/services/bill.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule, NgClass, DecimalPipe],
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit {
  bills: BillDto[] = [];
  loading = false;
  error: string | null = null;
  newBillId?: number;
  lastErrorCode?: string;

  constructor(private billService: BillService, private router: Router) {}

  ngOnInit(): void {
    const navState: any = history.state;
    if (navState) {
      if (navState.newBillId) this.newBillId = navState.newBillId;
      if (navState.createdBill) {
        const incoming: BillDto = navState.createdBill;
        if (!this.bills.some(b => b.id === incoming.id)) {
          this.bills.unshift(incoming);
        }
      }
    }
    this.loadBills();
  }

  loadBills() {
    this.loading = true;
    this.error = null;
    this.billService.getBills().subscribe({
      next: (data) => {
        this.bills = data;
      },
      error: (err) => {
        console.error(err);
    this.error = err?.error?.error || 'Failed to load bills';
    this.lastErrorCode = err?.error?.code;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // Retry logic removed: server now returns hydrated bill in create response and list fetch is immediate.

  createSampleBill() {
    const newBill: BillCreateDto = {
      billItems: [
        { productId: 12, quantity: 2 },
        { productId: 13, quantity: 1 }
      ]
    };

    this.billService.createBill(newBill).subscribe({
      next: (bill) => {
        // Prepend freshly created bill without reloading entire list
        this.bills = [bill, ...this.bills];
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.error || 'Failed to create bill';
        this.lastErrorCode = err?.error?.code;
      }
    });
  }

  payBill(bill: BillDto) {
    if (bill.status !== 'Pending') return;
    this.billService.payBill(bill.id).subscribe({
      next: () => {
        this.router.navigate(['/order-confirmation'], { state: { billId: bill.id } });
      },
      error: (err) => console.error(err)
    });
  }

  deleteBill(bill: BillDto) {
    if (bill.status === 'Paid') return; // business rule example
    this.billService.deleteBill(bill.id).subscribe({
      next: () => this.loadBills(),
      error: (err) => console.error(err)
    });
  }
}
