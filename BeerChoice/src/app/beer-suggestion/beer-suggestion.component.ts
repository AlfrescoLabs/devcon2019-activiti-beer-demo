import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BeerService } from 'app/services/beer.service';
import { map, debounceTime, filter } from 'rxjs/operators';
import { BeerList, Beer, BeerEvent } from 'app/models/beer-list.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-beer-suggestion',
  templateUrl: './beer-suggestion.component.html',
  styleUrls: ['./beer-suggestion.component.css']
})
export class BeerSuggestionComponent implements OnChanges {

  @Input()
  taskId: string;

  beersList$: any = null;
  click$: Subject<BeerEvent> = new Subject();

  constructor(private beerService: BeerService) {
    this.click$
      .pipe(
        debounceTime(200),
        filter(action => action.action === 'add'),
        map((action) => action.value))
      .subscribe(beer => {
        this.beerService.beerAdded(beer);
      });

    this.click$
      .pipe(
        debounceTime(200),
        filter(action => action.action === 'remove'),
        map((action) => action.value))
      .subscribe(beer => {
        this.beerService.beerRemoved(beer);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskId'] &&
      changes['taskId'].currentValue &&
      changes['taskId'].currentValue !== changes['taskId'].previousValue) {
      this.beersList$ = this.beerService.getBeerFromTaskVariables(this.taskId).pipe(
        map((beerList: BeerList) => {
          return beerList.beers;
        })
      );
    }
  }

  onClickSuggest(beer: Beer) {
    this.click$.next({ action: 'add', value: beer });
  }

  onClickRemove(beer: Beer) {
    this.click$.next({ action: 'remove', value: beer });
  }
}
