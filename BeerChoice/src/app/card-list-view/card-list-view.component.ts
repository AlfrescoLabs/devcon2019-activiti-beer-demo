import { Component, OnDestroy } from '@angular/core';
import { BeerService } from 'app/services/beer.service';
import { map, debounceTime, tap, filter, switchMap } from 'rxjs/operators';
import { Beer, BeerEvent, BeerList } from 'app/models/beer-list.model';
import { Subject } from 'rxjs';
import { ProcessInstance, TaskListService,
         TaskQueryRequestRepresentationModel, TaskListModel,
         TaskDetailsModel } from '@alfresco/adf-process-services';

@Component({
  selector: 'app-card-list-view',
  templateUrl: './card-list-view.component.html',
  styleUrls: ['./card-list-view.component.css']
})
export class CardListViewComponent {
  beersList$: any = null;
  click$: Subject<BeerEvent> = new Subject();

  constructor(private beerService: BeerService) {

    this.beersList$ = this.beerService.retrieveTaskFromProcessInstance().pipe(
      switchMap((task: TaskDetailsModel) => this.beerService.getBeerFromTaskVariables(task.id)),
      map((beerList: BeerList) => {
        return beerList.beers;
      })
    );

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

  onClickAdd(beer: Beer) {
    this.click$.next({ action: 'add', value: beer });
  }

  onClickRemove(beer: Beer) {
    this.click$.next({ action: 'remove', value: beer });
  }

}
