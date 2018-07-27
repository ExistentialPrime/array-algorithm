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
		// this.dataArray =  [['1', '2', '3'], ['4', '5'], ['6', '7']]; // test
		this.dataArrayString = JSON.stringify(this.dataArray);
		this.layoutArray = [{'1': [2, 1]}, {'2': [1, 3]}]; // given
		// this.layoutArray = [{'2': [3, 3]}, {'5': [1, 2]}]; // test
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
		let maxHeight = 0;
		let maxWidth = 0;

		// Find the max table width and height
		let arrayWidths = [];
		let rowIndex = 0;
		this.dataArray.forEach(dataRow => {
			let rowHeight = 1; // each row is only 1 high by default
			let curWidth = 0;
			if (arrayWidths[rowIndex] === undefined) { arrayWidths.push(0); }
			else { curWidth = arrayWidths[rowIndex]; } // if existing empty space exists, add it in
			dataRow.forEach(dataItem => {
				curWidth += 1; // add one to width for the data item
				let layoutInfo = this.layoutArray.find(item =>  Object.keys(item)[0] === dataItem);
				if (layoutInfo && layoutInfo !== undefined) {
					let key =  Object.keys(layoutInfo)[0]; // use reflection to get our key
					let colspan = Number(layoutInfo[key][1]); // colspan = extra width
					curWidth += colspan - 1; // now add the empty columns to the width

					// Now calc data height and push any veritical bulge into lower rows
					let rowspan = Number(layoutInfo[key][0]);
					let extraHeight = rowspan - 1;
					let rowNum = rowIndex + 1; // add one because it's zero indexed
					if (rowNum + extraHeight > maxHeight) { maxHeight = rowNum + extraHeight; }
					for (let i = 1; i < rowspan; i++) {
						if (arrayWidths[rowIndex + i] === undefined) { arrayWidths.push(0); }
						arrayWidths[rowIndex + i] = colspan;
					}
				}
				arrayWidths[rowIndex] = curWidth;
			});
			if (curWidth > maxWidth) { maxWidth = curWidth; }
			rowIndex++;
		});
		maxWidth = Math.max(...arrayWidths);

		// construct the output array
		for (let i = 0; i < maxHeight; i++) {
			this.outputArray.push([]);
			for (let j = 0; j < maxWidth; j++) {
				this.outputArray[i].push('null');
			}
		}

		// Now iterate over each row in the array and add numbers or nulls in the appropriate places
		let rowIndx = 0;
		let colIndx = 0;
		this.dataArray.forEach(dataRow => {
			dataRow.forEach(dataItem => {

				// Check if the position is open first, otherwise advance it until it is
				while (this.outputArray[rowIndx][colIndx] !== 'null') { colIndx++; }

				let layoutInfo = this.layoutArray.find(item =>  Object.keys(item)[0] === dataItem);
				if (layoutInfo && layoutInfo !== undefined) {
					let key =  Object.keys(layoutInfo)[0]; // use reflection to get our key
					let rowspan = Number(layoutInfo[key][0]); // rowspan = extra height
					let colspan = Number(layoutInfo[key][1]); // colspan = extra width
					for (let i = 0; i < rowspan; i++) {
						for (let j = 0; j < colspan; j++) {
							this.outputArray[rowIndx + i][colIndx + j] = `null (${dataItem})`;
						}
					}
				}

				this.outputArray[rowIndx][colIndx] = dataItem;
				colIndx++;
			});
			colIndx = 0;
			rowIndx++;
		});

		this.outputArrayString = JSON.stringify(this.outputArray);
		console.log('Raw Output Array: ', this.outputArray);
		console.table(this.outputArray);
	}

	// Make sure layout array is properly formatted with positive integers
	validateArrays(): boolean {
		try {

			// convert strings to actual array
			this.dataArray = JSON.parse(this.dataArrayString);
			this.layoutArray = JSON.parse(this.layoutArrayString);

			// Now validate the layout array
			this.layoutArray.forEach(item => {
				// console.log('item[Object.keys(obj)[0]]: ' + item[Object.keys(item)[0]]);
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
