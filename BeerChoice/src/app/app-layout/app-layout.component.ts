import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlfrescoApiService } from '@alfresco/adf-core';

@Component({
  selector: 'app-root',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent {

  constructor(private route: Router,
              private alfrescoApiService: AlfrescoApiService) {
  }

  onStartOrderClicked() {
    this.route.navigate(['']);
  }

  onBeerListClick() {
    this.route.navigate(['/beer-view']);
  }

  onLogout() {
    this.route.navigate(['/logout']);
  }

  onOldOrdersClicked() {
    this.route.navigate(['/old-orders']);
  }

  onStartSuggestionClicked() {
    this.route.navigate(['']);
  }

  isTheChoosen(): boolean {
    return this.alfrescoApiService.getInstance().getBpmUsername() === 'thechosenone@chosen.com';
  }
}
