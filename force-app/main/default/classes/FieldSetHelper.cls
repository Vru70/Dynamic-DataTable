/**
 * @author            : Vrushabh Uprikar
 * @last modified on  : 06-02-2021
 * @last modified by  : Vrushabh Uprikar
 * Modifications Log 
 * Ver   Date         Author             Modification
 * 1.0   06-02-2021   Vrushabh Uprikar   Initial Version
**/
public with sharing class FieldSetHelper 
{
    @AuraEnabled (cacheable=true)
    public static String getFieldsAndRecords(String strObjectApiName, String strfieldSetName)                                       
    {
        Map<String, String> returnMap = new Map<String,String>();
        if(!String.isEmpty(strObjectApiName) && !String.isEmpty(strfieldSetName))
        {
            //get fields from FieldSet
            SObject sObj = (SObject)(Type.forName('Schema.'+ strObjectApiName).newInstance()); //  Create new sObj
            List<Schema.FieldSetMember> lstFSMember = 
                sObj.getSObjectType().getDescribe().fieldSets.getMap().get(strfieldSetName).getFields(); // Collecting all fields from fildSet

            //prepare SOQL query based on fieldAPIs	
            String query = 'SELECT ';
            for(Schema.FieldSetMember f : lstFSMember) //Use of Schema.FieldSetMember to get the fields from Field Set.
            {
                query += f.getFieldPath() + ', '; // getFieldPath() of FieldSetMember gives the fieldAPI which has been used to build SOQL query.
            }
            query += 'Id FROM ' + strObjectApiName ;
            query += ' LIMIT 10 '; 
        
	        //execute query
            List<SObject> lstRecords = Database.query(query);
            
            //prepare a map which will hold fieldList and recordList and return it
            returnMap.put('FIELD_LIST', JSON.serialize(lstFSMember));
            returnMap.put('RECORD_LIST', JSON.serialize(lstRecords));
            return JSON.serialize(returnMap);
        }
        return null; // will return null if ObjectApi and FieldSet not found
    }
}