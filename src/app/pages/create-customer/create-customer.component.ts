import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../interfaces/customer.interface';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css']
})
export class CreateCustomerComponent implements OnInit {
  customerForm: FormGroup;
  isEditMode = false;
  customerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      website: [''],
      company: this.fb.group({
        name: [''],
        catchPhrase: [''],
        bs: ['']
      })
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.customerId = +id;
      this.loadCustomer(this.customerId);
    }
  }

  loadCustomer(id: number): void {
    this.customerService.getCustomer(id).subscribe({
      next: (customer) => {
        this.customerForm.patchValue(customer);
      },
      error: (error) => {
        this.snackBar.open('Error loading customer', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;
      
      if (this.isEditMode && this.customerId) {
        this.customerService.updateCustomer(this.customerId, customerData).subscribe({
          next: () => {
            this.snackBar.open('Customer updated successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/customers']);
          },
          error: (error) => {
            this.snackBar.open('Error updating customer', 'Close', { duration: 3000 });
          }
        });
      } else {
        this.customerService.createCustomer(customerData).subscribe({
          next: () => {
            this.snackBar.open('Customer created successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/customers']);
          },
          error: (error) => {
            this.snackBar.open('Error creating customer', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }
}