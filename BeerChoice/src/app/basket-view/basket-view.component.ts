
import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { BeerService } from 'app/services/beer.service';
import { Beer, BeerEvent } from 'app/models/beer-list.model';
import { StorageService } from '@alfresco/adf-core';

@Component({
  selector: 'app-basket-view',
  templateUrl: './basket-view.component.html',
  styleUrls: ['./basket-view.component.css']
})
export class BasketViewComponent implements OnInit, OnChanges {

  @Input()
  showMode = false;

  @Input()
  taskId = null;

  actualOrderBeers: any = [];
  basketBeers: any = null;

  constructor(private beerService: BeerService,
    private storageService: StorageService) {

    this.beerService.beerBasket$.subscribe((eventBeer: BeerEvent) => {
      if (eventBeer.action === 'add') {
        this.actualOrderBeers.push(eventBeer.value);
        this.handleBasket();
      } else if (eventBeer.action === 'remove') {
        const beerIndex = this.actualOrderBeers.findIndex(
          findBeer => findBeer.beer_ibu === eventBeer.value.beer_ibu
        );
        if (beerIndex > -1) {
          this.actualOrderBeers.splice(beerIndex, 1);
          this.handleBasket();
        }
      } else if (eventBeer.action === 'clear') {
        this.actualOrderBeers = [];
        this.basketBeers = [];
        this.storageService.removeItem('STORE-BASKET');
      }
    });
  }

  ngOnInit() {
    const serializedBasket = this.storageService.getItem('STORE-BASKET');
    if (serializedBasket) {
      const deserializedBasket = JSON.parse(serializedBasket);
      this.actualOrderBeers = deserializedBasket;
      this.handleBasket();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskId'] &&
      changes['taskId'].currentValue &&
      changes['taskId'].currentValue !== changes['taskId'].previousValue) {
      if (this.showMode) {
        this.beerService.convertBeerOrder(this.taskId).subscribe((result) => {
          console.log('done');
        });
      }
    }
  }

  getBasketItems(beer: Beer): number {
    return this.actualOrderBeers.filter(basketItem => basketItem.bid === beer.bid).length;
  }

  private removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  private handleBasket() {
    this.basketBeers = this.removeDuplicates(this.actualOrderBeers, 'bid');
    this.storageService.setItem('STORE-BASKET', JSON.stringify(this.actualOrderBeers));
  }

  onClearBasketClick() {
    this.beerService.clearBasket();
  }

}
