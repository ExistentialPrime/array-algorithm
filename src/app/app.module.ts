import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app.component';
import { TestWidgetComponent } from './components/test-widget/test-widget.component';

@NgModule({
  declarations: [
    AppComponent,
    TestWidgetComponent
  ],
  imports: [
		BrowserModule,
		FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
