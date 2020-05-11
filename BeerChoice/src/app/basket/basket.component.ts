
import { Component } from '@angular/core';
import { BeerService } from 'app/services/beer.service';
import { Beer, BeerEvent } from 'app/models/beer-list.model';
import { Router } from '@angular/router';
import { StorageService } from '@alfresco/adf-core';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent {

  basketElements = 0;

  constructor(private beerService: BeerService,
              private router: Router,
              private storageService: StorageService) {

    this.beerService.beerBasket$.subscribe((beerBasketEvent: BeerEvent) => {
      if (beerBasketEvent.action === 'add') {
        this.basketElements++;
      } else if (beerBasketEvent.action === 'remove') {
        this.basketElements--;
      } else {
        this.basketElements = 0;
      }
    });

    const savedBasket = JSON.parse(this.storageService.getItem('STORE-BASKET'));
    if (savedBasket && savedBasket.length > 0) {
      this.basketElements = savedBasket.length;
    }
  }

  onBasketClicked() {
    this.router.navigate(['/basket-view']);
  }

}
