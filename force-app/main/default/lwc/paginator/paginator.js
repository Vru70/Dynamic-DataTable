/**
 * @author            : Vrushabh Uprikar
 * @last modified on  : 06-02-2021
 * @last modified by  : Vrushabh Uprikar
 * Modifications Log 
 * Ver   Date         Author             Modification
 * 1.0   06-02-2021   Vrushabh Uprikar   Initial Version
**/
import { LightningElement } from 'lwc';

export default class Paginator extends LightningElement
{
    previousHandler()
    {
        this.dispatchEvent(new CustomEvent('previous'));
    }

    nextHandler()
    {
        this.dispatchEvent(new CustomEvent('next'));
    }
 }