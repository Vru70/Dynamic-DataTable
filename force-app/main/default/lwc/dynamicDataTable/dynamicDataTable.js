/**
 * @author            : Vrushabh Uprikar
 * @last modified on  : 06-02-2021
 * @last modified by  : Vrushabh Uprikar
 * Modifications Log 
 * Ver   Date         Author             Modification
 * 1.0   06-02-2021   Vrushabh Uprikar   Initial Version
**/
import { LightningElement, api, track } from 'lwc';
import getFieldsAndRecords from '@salesforce/apex/FieldSetHelper.getFieldsAndRecords';
export default class DynamicDataTable extends LightningElement
{
    @api recordId;  // record id from record detail page e.g. ''0012v00002WCUdxAAH'
    @api SFDCobjectApiName; //kind of related list object API Name e.g. 'Account'
    @api fieldSetName; // FieldSet which is defined on that above object e.g. 'AccFieldSet'

    @track columns;   //columns for List of fields datatable
    @track tableData;   //data for list of fields datatable

    @track recordCount; //this displays record count inside the ()
    @track lblobjectName; //this displays the Object Name whose records are getting displayed

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
                this.tableData = listOfRecords;

                console.log('listOfRecords', listOfRecords);

                //assign values to display Object Name and Record Count on the screen
                this.lblobjectName = this.SFDCobjectApiName;
                this.recordCount = this.tableData.length;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                console.log('error', error);
                this.tableData = undefined;
                this.lblobjectName = this.SFDCobjectApiName;
            })
    }
}