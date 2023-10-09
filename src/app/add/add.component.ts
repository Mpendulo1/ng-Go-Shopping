import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { switchMap } from 'rxjs';

import { ProductService } from '../product.service';
@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
    public submitted = false;
    public selected_product: any;
    public page_title: string = 'Add';

    public get name() {
        return this.productForm.controls.name;
    }

    public get price() {
        return this.productForm.controls.price;
    }

    public get quantity() {
        return this.productForm.controls.quantity;
    }

    constructor(
        private productService: ProductService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    public ngOnInit(): void {
        if (this.router.url.includes('edit')) {
            this.page_title = 'Edit';
            this.route.paramMap
                .pipe(
                    switchMap((params) => {
                        return this.productService.getProduct(
                            params.get('product_name') ?? ''
                        );
                    })
                )
                .subscribe((product) => {
                    this.selected_product = product;
                    this.productForm.setValue({
                        name: product!._name,
                        price: +product!._price,
                        quantity: +product!._quantity,
                    });
                });
        }
    }

    public productForm = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
        ]),
        price: new FormControl(0, [
            Validators.required,
            Validators.minLength(1),
        ]),
        quantity: new FormControl(1, [
            Validators.required,
            Validators.minLength(1),
        ]),
    });

    public submitForm() {
        const form_values = this.productForm.value;
        const check_router = this.router.url;

        if (check_router.includes('add')) {
            this.submitted = true;
            if (this.productForm.valid) {
                this.productService.addProduct({
                    _name: form_values.name?.toLocaleLowerCase() ?? '',
                    _price: +(form_values.price ?? 0),
                    _quantity: +(form_values.quantity ?? 0),
                });
                alert(form_values.name + ' was added successfully!!');
                this.productForm.reset();
            } else {
                alert('Please fill product form!!');
            }
        } else {
            if (this.productForm.valid) {
                this.productService.updateProduct(form_values.name!, {
                    _name: form_values.name!.toLocaleLowerCase(),
                    _price: +form_values.price!,
                    _quantity: +form_values.quantity!,
                });
                alert('Product was updated successfully!!');
                this.router.navigate(['']);
            }
        }
    }
}
