import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

	// Properties
	private showAnswer = false;

	// Toggle our answer to be visible or hidden
	private toggleAnswer() {
		this.showAnswer = !this.showAnswer;
	}

}
