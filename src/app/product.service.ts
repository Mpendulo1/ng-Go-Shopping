import { Injectable } from '@angular/core';
import { Product } from './Product';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private product_array: Product[] = [];
    private productUpdate = new BehaviorSubject<Product[]>([]);

    public total_price: number = 0;
    public total_quantity: number = 0;

    constructor() {
        this.fetchProducts();
    }

    public fetchProducts() {
        const product_encoded = localStorage.getItem('product_list');
        let product_list = [];

        if (product_encoded) {
            product_list = JSON.parse(product_encoded);
            product_list = product_list.map((product: any) => {
                return {
                    ...product,
                    _quantity: +product._quantity,
                    _price: +product._price,
                };
            });
        } else {
            alert('Sorry, no products were found!!');
        }
        this.product_array = product_list;
        this.productUpdate.next(this.product_array);
    }

    public saveProduct() {
        localStorage.setItem(
            'product_list',
            JSON.stringify(this.product_array)
        );
    }

    public addProduct(product: Product): void {
        const product_exists = this.product_array.find(
            (item) => item._name === product._name
        );
        if (product_exists) {
            return alert('Sorry this product exists');
        } else {
            this.product_array.push(product);
            this.saveProduct();
            this.productUpdate.next(this.product_array);
        }
    }

    public updateProduct(name: string, product: Product) {
        const index = this.product_array.findIndex(
            (item) => item._name === name
        );
        if (index === -1) {
            return;
        } else {
            this.product_array[index] = { ...product };
            this.saveProduct();
            this.productUpdate.next(this.product_array);
        }
    }

    public onProductUpdate() {
        return this.productUpdate.asObservable();
    }

    public getProduct(name: string) {
        return this.onProductUpdate().pipe(
            map((products) => {
                const item = products.find((product) => product._name === name);
                return item;
            })
        );
    }

    public deleteProduct(index: number): void {
        this.product_array.length > index;
        this.product_array.splice(index, 1);
        this.productUpdate.next(this.product_array);
        this.saveProduct();
    }

    public calculateTotals(product: Product[]) {
        let price: number = 0;
        let quantity: number = 0;
        for (let item of product) {
            price += item._price * item._quantity;
            quantity += item._quantity;
        }
        this.total_price = price;
        this.total_quantity = quantity;
        return {
            price,
            quantity,
        };
    }
}
