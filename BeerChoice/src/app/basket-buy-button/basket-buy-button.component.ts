
import { Component } from '@angular/core';
import { BeerService } from 'app/services/beer.service';
import { Beer } from 'app/models/beer-list.model';
import { Router } from '@angular/router';
import { StorageService } from '@alfresco/adf-core';
import moment from 'moment-es6';

@Component({
  selector: 'app-basket-buy-button',
  templateUrl: './basket-buy-button.component.html',
  styleUrls: ['./basket-buy-button.component.css']
})
export class BasketBuyButtonComponent {

  basketToBuy = [];

  constructor(private beerService: BeerService,
              private router: Router,
              private storageService: StorageService) {

    this.beerService.beerBasket$.subscribe((beerBasket) => {
      this.basketToBuy = beerBasket;
    });
  }

  onBuyOrderClick() {
    const serializedBasket = this.storageService.getItem('STORE-BASKET');
    const deserializedBasket = JSON.parse(serializedBasket);
    this.storageService.removeItem('STORE-BASKET');
    this.beerService.perfomBuy(this.buildFormValues(deserializedBasket)).subscribe(() => {
      this.beerService.executedOutcome();
      this.router.navigate(['/']);
    });
  }

  private buildFormValues(basketItems: any): any {
    const formValues: any = {};
    formValues.user = 'The Chosen One';
    formValues.when = moment().format('YYYY-MM-DD hh:mm A');
    formValues.orderdetails = this.buildOrderString(basketItems);
    return formValues;
  }

  private buildOrderString(basketItems: any) {
    const countedElements = {};
    const result = basketItems.forEach((beer: Beer) => {
      const key = beer.beer_name;
      countedElements[key] = (countedElements[key] || 0) + 1;
    });
    return JSON.stringify(countedElements, null, '\n').replace('{', '').replace('}', '');
  }

}
