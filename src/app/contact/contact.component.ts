import { Component, OnInit, NgModuleFactoryLoader } from '@angular/core';
import { Contact } from './contact.model';
import { Http } from '@angular/http';
import { LocalStorageService } from '../localStorageService';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { MatButtonToggleGroupMultiple } from '@angular/material';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { NumberValueAccessor } from '@angular/forms/src/directives';
import { totalmem } from 'os';

export interface IContact {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  owed: number;
}
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contacts: Array<IContact> = [];
  params: string;
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
  }

  async ngOnInit() {
    this.contacts = await this.loadContacts();
  }

  async loadContacts() {
    let contacts = JSON.parse(localStorage.getItem('contacts'));
    if (contacts && contacts.length > 0) {
      // contacts = contacts;
    } else {
      contacts = await this.loadContactsFromJson();
    }
    console.log('this.contacts from ngOninite...', this.contacts);
    this.contacts = contacts;
    return contacts;
  }

  async loadContactsFromJson() {
    const contacts = await this.http.get('assets/contacts.json').toPromise();
    return contacts.json();
  }

  addContact() {
    const contact: IContact = {
      id: null,
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      owed: null
    };
    this.contacts.unshift(contact);
    this.saveTolocalStorage();
  }

  deleteContact(index: number) {
    this.contacts.splice(index, 1);
    this.saveTolocalStorage();

  }

  saveTolocalStorage() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  finalize() {
    const data = this.calculate();
    this.router.navigate(['home', data]);
  }

  calculate() {
    let owed = 0;
    for (let i = 0; i < this.contacts.length; i++) {
      owed += this.contacts[i].owed;

    }
    return {
      numberOfContacts: this.contacts.length,
      subTotal: owed,
      taxAmount: owed * .10,
      total: owed + (owed * .10)
    };
  }

  search(params: string) {

    this.contacts = this.contacts.filter((contact: IContact) => {
      return contact.firstName.toLowerCase() === params.toLowerCase();
    });
  }

}
