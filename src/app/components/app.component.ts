import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

	// Properties
	private showAnswer = true;
	private answer = `
	this.dataArray.forEach(dataRow => {
		this.outputArray.push([]);
	});`;

	// Toggle our answer to be visible or hidden
	private toggleAnswer() {
		this.showAnswer = !this.showAnswer;
	}

}
