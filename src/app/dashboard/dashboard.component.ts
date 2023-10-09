import { Component } from '@angular/core';

import { Subscription, tap } from 'rxjs';

import { Product } from '../Product';
import { ProductService } from '../product.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
    private product_sub: Subscription;

    public product_list: Product[] = [];
    public total_price: number = 0;
    public total_quantity: number = 0;

    constructor(private productService: ProductService) {
        this.product_sub = this.productService
            .onProductUpdate()
            .pipe(tap())
            .subscribe((products) => {
                this.product_list = products;
                const totals = this.productService.calculateTotals(
                    this.product_list
                );
                this.total_price = totals.price;
                this.total_quantity = totals.quantity;
            });
    }

    public removeProduct(index: number) {
        this.productService.deleteProduct(index);
    }
}
