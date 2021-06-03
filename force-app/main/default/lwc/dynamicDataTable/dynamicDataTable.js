/**
 * @author            : Vrushabh Uprikar
 * @last modified on  : 06-03-2021
 * @last modified by  : Vrushabh Uprikar
 * Modifications Log 
 * Ver   Date         Author             Modification
 * 1.0   06-02-2021   Vrushabh Uprikar   Initial Version
**/
import { LightningElement, api, track } from 'lwc';
import getFieldsAndRecords from '@salesforce/apex/FieldSetHelper.getFieldsAndRecords';
let i = 0; // Counter
export default class DynamicDataTable extends LightningElement {
    @api recordId;  // record id from record detail page e.g. ''0012v00002WCUdxAAH'
    @api SFDCobjectApiName; //kind of related list object API Name e.g. 'Account'
    @api fieldSetName; // FieldSet which is defined on that above object e.g. 'AccFieldSet'

    @track columns;   //columns for List of fields datatable
    allData;   //data for list of fields datatable

    @track recordCount; //this displays record count inside the ()
    @track lblobjectName; //this displays the Object Name whose records are getting displayed

    @track page = 1; //this will initialize 1st page
    @track startingRecord = 1; //start record position per page
    @track endingRecord = 0; //end record position per page
    @track pageSize = 5; //default value we are assigning
    @track totalRecountCount = 0; //total record count received from all retrieved records
    @track totalPage = 0; //total number of page is needed to display all records
    @track dataToDisp = []; //data to be displayed in the table

    
    @track totalSelection;
    @track hasPageChanged;
    @track initialLoad = true;
    @track selectedRows = [];
    

    connectedCallback()
    {
        //make an implicit call to fetch records from database
        getFieldsAndRecords({
            strObjectApiName: this.SFDCobjectApiName,
            strfieldSetName: this.fieldSetName
            })
            .then(data => {
                //get the entire map
                let objStr = JSON.parse(data);

                /* retrieve listOfFields from the map,
                 here order is reverse of the way it has been inserted in the map */
                let listOfFields = JSON.parse(Object.values(objStr)[1]);

                //retrieve listOfRecords from the map
                let listOfRecords = JSON.parse(Object.values(objStr)[0]);

                let items = []; //local array to prepare columns

                listOfFields.map(element => {
                    
                        items = [...items, {
                            label: element.label,
                            fieldName: element.fieldPath
                        }];
                });

                //finally assigns item array to columns
                this.columns = items;
                var xx = JSON.stringify(listOfRecords);
                this.allData = JSON.parse(xx);
                console.log('this.allData:', this.allData); // collecting all data

                this.totalRecountCount = listOfRecords.length;
                console.log('totalRecountCount >', this.totalRecountCount); //here it is 10   

                this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); //here it is 5
                console.log('totalPage >', this.totalPage);

                this.dataToDisp = this.allData.slice(0, this.pageSize);
                console.log('this.dataToDisp', this.dataToDisp);
                this.endingRecord = this.pageSize;

                this.lblobjectName = this.SFDCobjectApiName; // Assigning Headder i.e Acount
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                console.log('error', error);
                this.allData = undefined;
                this.lblobjectName = this.SFDCobjectApiName;
            })
    }

    //this method displays records page by page
    displayRecordPerPage(page)
    {

        this.startingRecord = ((page - 1) * this.pageSize);
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount)
            ? this.totalRecountCount : this.endingRecord;

        this.dataToDisp = this.allData.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    }

    //clicking on previous button this method will be called
    previousHandler()
    {
        if (this.page > 1)
        {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
            this.hasPageChanged = true;
            this.template.querySelector('lightning-datatable').selectedRows = this.selectedRows;
        }  
    }

    //clicking on next button this method will be called
    nextHandler()
    {
        if ((this.page < this.totalPage) && this.page !== this.totalPage)
        {
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);
            this.hasPageChanged = true;
            this.template.querySelector('lightning-datatable').selectedRows = this.selectedRows;
        }  
    }

    handleRowSelection(event)
    {
        if (!this.hasPageChanged || this.initialLoad)
        {
            //setting initial load false
            this.initialLoad = false;
            
            var aa = event.detail.selectedRows;
            var selctedRow = JSON.parse(JSON.stringify(aa))
            console.log('selctedRow:', selctedRow);
            let idSet = new Set();
            for (let i = 0; i < selctedRow.length; i++) {
                idSet.add(selctedRow[i].Id);
            }

            this.selectedRows = Array.from(idSet);
            console.log('selectedRows:', JSON.stringify(this.selectedRows));
        }
    }
    
}