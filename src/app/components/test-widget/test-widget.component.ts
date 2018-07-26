import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';

@Component({
  selector: 'app-test-widget',
  templateUrl: './test-widget.component.html',
  styleUrls: ['./test-widget.component.css']
})
export class TestWidgetComponent implements OnInit {

	// Properties
	private dataArray = [];
	private layoutArray = [];
	private outputArray = [];

	private dataArrayString = '';
	private layoutArrayString = '';
	private outputArrayString = '';

	// Constructor (Dependency Injection)
  constructor() { }

	// Initialization
  ngOnInit() {
		// Set up our example data array and layout array
		this.dataArray =  [['1', '2'], ['3', '4', '5']]; // given
		// this.dataArray =  [['1', '2', '3'], ['4', '5']]; // test
		this.dataArrayString = JSON.stringify(this.dataArray);
		this.layoutArray = [{'1': [2, 1]}, {'2': [1, 3]}]; // given
		// this.layoutArray = [{'5': [2, 3]}]; // test
		this.layoutArrayString = JSON.stringify(this.layoutArray);
	}


	// Calculate the output array based on our inputs
	private calculate() {

		// Convert and validate our strings to usable arrays
		if (this.validateArrays() === false) {
			swal('Error', 'Invalid DataAray or LayoutArray values! Please use positive integers in array format', 'error');
			return;
		}



		// First stand up the output array
		this.outputArray = [];

		console.log('layout array: ', this.layoutArray);
		console.table(this.dataArray);

		// Now iterate through the data and layout arrays to populate the output array
		let currentRow = 0;
		this.dataArray.forEach(dataRow => {
			dataRow.forEach(dataItem => {
				// First, push the item into the appropriate row
				if (this.outputArray[currentRow] === undefined) { this.outputArray.push([]); }
				this.outputArray[currentRow].push(dataItem);

				// Now check if the item has layout information in the layout array
				let layoutInfo = this.layoutArray.find(item =>  Object.keys(item)[0] === dataItem);

				// If layout info exists, push the 'empty' slots into the array
				if (layoutInfo && layoutInfo !== undefined) {
					let key =  Object.keys(layoutInfo)[0]; // use reflection to get our key
					let rowspan = Number(layoutInfo[key][0]);
					for (let i = 1; i < rowspan; i++) {
						console.log('pushing output array: ', this.outputArray);
						if (this.outputArray[currentRow + i] === undefined) { this.outputArray.push([]); }
						this.outputArray[currentRow + i].push('null');
					}
					let colspan = Number(layoutInfo[key][1]);
					for (let i = 1; i < colspan; i++) {
						this.outputArray[currentRow].push('null');
					}
					// ERROR: This only iterates following rows, need to somehow fix previous too
				}

			});
			currentRow++;
		});

		this.outputArrayString = JSON.stringify(this.outputArray);
		console.log(this.outputArray);
	}

	// Make sure layout array is properly formatted with positive integers
	validateArrays(): boolean {
		try {

			// convert strings to actual array
			this.dataArray = JSON.parse(this.dataArrayString);
			this.layoutArray = JSON.parse(this.layoutArrayString);
			console.log('layoutArray is now: ', this.layoutArray);

			// Now validate the layout array
			this.layoutArray.forEach(item => {
				console.log('item[Object.keys(obj)[0]]: ' + item[Object.keys(item)[0]]);
				let spanInfo = item[Object.keys(item)[0]];
				spanInfo.forEach(span => {
					if (!Number.isInteger(span) || span <= 0) { return false; }
				 });
			});
			return true;
		}	catch (error) {
			return false;
		}
	}

}
