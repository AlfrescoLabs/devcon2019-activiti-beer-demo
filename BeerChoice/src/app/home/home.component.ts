import { Component, ViewEncapsulation, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { ProcessInstance, TaskDetailsModel } from '@alfresco/adf-process-services';
import { BeerService } from 'app/services/beer.service';
import { StorageService, AlfrescoApiService } from '@alfresco/adf-core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements AfterContentChecked {
  orderNumber = 0;
  backgroundImageUrl = './assets/beerBackground.jpg';
  currentTaskId = '';

  constructor(private router: Router,
              private beerService: BeerService,
              private storageService: StorageService,
              private alfrescoApiService: AlfrescoApiService) {}

  ngAfterContentChecked() {
    this.orderNumber = this.storageService.getItem('ORDER-NUMBER') ? parseInt(this.storageService.getItem('ORDER-NUMBER'), 10) : 0;
  }

  startOrder(processInstance: ProcessInstance) {
    this.beerService.saveProcessInstance(processInstance);
    this.router.navigate(['/beer-view']);
    this.orderNumber++;
    this.storageService.setItem('ORDER-NUMBER', this.orderNumber + '');
  }

  generateRandomName() {
    return `ORDER N: ${this.orderNumber}`;
  }

  isTheChoosen(): boolean {
    return this.alfrescoApiService.getInstance().getBpmUsername() === 'thechosenone@chosen.com';
  }

  onTaskClicked(event: CustomEvent) {
    this.currentTaskId = (<TaskDetailsModel> event.detail.value.obj).id;
  }
}
