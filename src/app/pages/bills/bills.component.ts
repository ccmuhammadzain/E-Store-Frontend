import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgClass, DecimalPipe } from '@angular/common';
import { BillService, BillCreateDto, BillDto } from '../../core/services/bill.service';

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

  constructor(private billService: BillService) {}

  ngOnInit(): void {
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
        this.error = 'Failed to load bills';
      },
      complete: () => (this.loading = false)
    });
  }

  createSampleBill() {
    const newBill: BillCreateDto = {
      userId: 1,
      billItems: [
        { productId: 12, quantity: 2 },
        { productId: 13, quantity: 1 }
      ]
    };

    this.billService.createBill(newBill).subscribe({
      next: () => this.loadBills(),
      error: (err) => console.error(err)
    });
  }

  payBill(bill: BillDto) {
    if (bill.status !== 'Pending') return;
    this.billService.payBill(bill.id).subscribe({
      next: () => this.loadBills(),
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
