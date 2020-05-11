/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { Observable, of, Subject, interval, from } from 'rxjs';
import { beerList } from 'app/mock/public-api';
import { BeerList, Beer, BeerEvent } from 'app/models/beer-list.model';
import { map, tap, take, filter, timeInterval, switchMap } from 'rxjs/operators';
import { NotificationService, AlfrescoApiService, FormService, StorageService } from '@alfresco/adf-core';
import { ProcessInstance, TaskQueryRequestRepresentationModel, TaskListService,
        TaskListModel, TaskDetailsModel } from '@alfresco/adf-process-services';

@Injectable()
export class BeerService {

  currentProcessInstance: ProcessInstance = null;

  constructor(
    private notificationService: NotificationService,
    private taskService: TaskListService,
    private alfrescoApiservice: AlfrescoApiService,
    private formService: FormService,
    private storageService: StorageService
  ) {}

  beerBasket$: Subject<BeerEvent> = new Subject();

  saveProcessInstance(processInstance: ProcessInstance) {
    this.currentProcessInstance = processInstance;
  }

  getProcessInstance(): ProcessInstance {
    return this.currentProcessInstance;
  }

  searchBeer(): Observable<BeerList> {
    // return of(beerList).pipe(map(list => new BeerList(list)));
    return this.retrieveTaskFromProcessInstance().pipe(
      switchMap((task: TaskDetailsModel) => {
        console.log(task.id);
        return this.getBeerFromTaskVariables(task.id);
      })
    );
  }

  retrieveTaskFromProcessInstance(): Observable<TaskDetailsModel> {
    const requestTask: TaskQueryRequestRepresentationModel = new TaskQueryRequestRepresentationModel();
    requestTask.processInstanceId = this.getProcessInstance().id;
    requestTask.state = 'active';
    return interval(1000).pipe(
      timeInterval(),
      switchMap(() => this.taskService.getTasks(requestTask)),
      filter((tasks: TaskListModel) => tasks.data.length > 0),
      take(1),
      map((taskDetail: TaskListModel) => {
        console.log(taskDetail);
        return taskDetail.data[0];
      })
    );
  }

  getBeerFromTaskVariables(taskId: string): Observable<BeerList> {
    return from(
      this.alfrescoApiservice
        .getInstance()
        .activiti.taskFormsApi.getTaskFormVariables(taskId)
    ).pipe(
      switchMap((res: any) => {
        console.log(res);
        return res;
      }),
      filter((res: any) => {
        console.log(res);
        return res.id === 'sohel';
      }),
      map((correctVariable: any) => {
        console.log(correctVariable);
        return new BeerList(JSON.parse(correctVariable.value));
      })
    );
  }

  getBeerOrderByTaskId(taskId: string): Observable<string> {
    return from(
      this.alfrescoApiservice
        .getInstance()
        .activiti.taskFormsApi.getTaskFormVariables(taskId)
    ).pipe(
      switchMap((res: any) => {
        console.log(res);
        return res;
      }),
      filter((res: any) => {
        console.log(res);
        return res.id === 'orderdetails';
      }),
      map((result) => result.value)
    );
  }

  convertBeerOrder(taskId: string): Observable<any> {
    return this.getBeerFromTaskVariables(taskId).pipe(
      map((list: BeerList) => {
        return this.getBeerOrderByTaskId(taskId).subscribe(orderString => {
          const orderArray = orderString.trim().split('\n');
          orderArray.map((orderElement) => {
            const orderBeerName = orderElement.split(':')[0].split('"').join('');
            if (orderBeerName) {
              const orderBeerQuantity = parseInt(orderElement.split(':')[1], 10);
              const orderBeer = list.beers.find((beer) => beer.beer_name === orderBeerName);
              for (let i = 0; i < orderBeerQuantity; i++) {
                this.beerAdded(orderBeer);
              }
            }
          });
        });
      })
    );
  }

  beerAdded(beer: Beer) {
    const beerAddedEvent: BeerEvent = { action: 'add', value: beer};
    this.updateBasket(beerAddedEvent);
  }

  beerRemoved(beer: Beer) {
    const beerRemovedEvent: BeerEvent = { action: 'remove', value: beer};
    this.updateBasket(beerRemovedEvent);
  }

  perfomBuy(formValues: any): Observable<any> {
   return this.retrieveTaskFromProcessInstance().pipe(
      map((taskDetail: TaskDetailsModel) => this.formService.completeTaskForm(taskDetail.id, formValues, '$complete'))
    );
  }

  executedOutcome() {
    this.saveProcessInstance(null);
    this.notificationService.openSnackMessage(
      'Order SENT - Now it is TOO LATE !!! MUAHAHAHAH'
    );
  }

  clearBasket() {
    const beerClearEvent = { action: 'clear', value: null};
    this.updateBasket(beerClearEvent);
  }

  updateBasket(beerEvent: BeerEvent) {
    this.beerBasket$.next(beerEvent);
  }
}
