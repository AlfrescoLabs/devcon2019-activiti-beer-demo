import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentModule } from '@alfresco/adf-content-services';
import { ProcessModule } from '@alfresco/adf-process-services';
import { CoreModule, TRANSLATION_PROVIDER } from '@alfresco/adf-core';
import { FileViewComponent } from './file-view/file-view.component';
import { BlobViewComponent } from './file-view/blob-view.component';
import { PreviewService } from './services/preview.service';
import { MatBadgeModule } from '@angular/material/badge';


// Custom stencils
import { StencilsModule } from './stencils.module';

// App components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AppsComponent } from './apps/apps.component';
import { TasksComponent } from './tasks/tasks.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { StartProcessComponent } from './start-process/start-process.component';
import { appRoutes } from './app.routes';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { CardListViewComponent } from './card-list-view/card-list-view.component';
import { BeerService } from './services/beer.service';
import { BasketComponent } from './basket/basket.component';
import { BasketViewComponent } from './basket-view/basket-view.component';
import { BasketBuyButtonComponent } from './basket-buy-button/basket-buy-button.component';
import { OldOrdersComponent } from './old-orders/old-orders.component';
import { BeerSuggestionComponent } from './beer-suggestion/beer-suggestion.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      appRoutes // ,
      // { enableTracing: true } // <-- debugging purposes only
    ),

    // ADF modules
    CoreModule.forRoot(),
    ContentModule.forRoot(),
    ProcessModule.forRoot(),
    StencilsModule,
    MatBadgeModule
  ],
  declarations: [
    AppComponent,
    AppsComponent,
    HomeComponent,
    LoginComponent,
    TasksComponent,
    TaskDetailsComponent,
    StartProcessComponent,
    AppLayoutComponent,
    FileViewComponent,
    BlobViewComponent,
    CardListViewComponent,
    BasketComponent,
    BasketViewComponent,
    BasketBuyButtonComponent,
    OldOrdersComponent,
    BeerSuggestionComponent
  ],
  providers: [
    PreviewService,
    BeerService,
    {
      provide: TRANSLATION_PROVIDER,
      multi: true,
      useValue: {
        name: 'app',
        source: 'assets'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
