import { Component, OnInit, Output, EventEmitter, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BusinessService } from '@shared/services/business.service';
import { Empresa } from '@shared/models/Empresa';
import { ToastService } from '@shared/services/toast.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
  selector: 'app-tfilter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, AfterViewInit {

  public static selected: Empresa;

  @Output() empresa = new EventEmitter();

  business: Empresa[] = [];
  searchTerms = new Subject<string>();

  @ViewChild('company') companyInput: ElementRef<HTMLInputElement>;

  constructor(
    private _service: BusinessService,
    private _toast: ToastService
  ) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    value = value || '';
    if (typeof value === 'string') {
      value = value.toUpperCase();
      this.companyInput.nativeElement.value = value;
      this.searchTerms.next(value);
    }
  }

  ngOnInit(): void {
    this.change('');
    this.searchTerms
      .pipe(debounceTime(100), distinctUntilChanged())
      .subscribe(e => this.change(e));
  }

  ngAfterViewInit() {
    if (FilterComponent.selected) {
      this.confirm(FilterComponent.selected);
    }
  }

  get info() {
    return 'Escreva o nome da empresa selecionada ou escolha dentre as sugeridas';
  }

  public select(event: MatAutocompleteSelectedEvent) {
    this.confirm(event.option.value);
  }

  async confirm(company: Empresa) {
    company.razaoSocial = company.razaoSocial || '';
    this.companyInput.nativeElement.value = `${this.getErp(company.codigoERP)}${company.razaoSocial.toUpperCase()}`;
    FilterComponent.selected = company;
    this._toast.show(`Empresa ${company.razaoSocial} selecionada.`, 'primary');
    await new Promise(resolve => setTimeout(resolve, 300));
    this.devolve(company);
  }

  getErp(erp: string) {
    return erp ? `${erp} - ` : '';
  }

  async change(word: string) {
    const rs = await this.getCompanies(word);
    this.business = rs.records;
  }

  getCompanies(nomeCompleto: string) {
    return this._service.fetch({ nomeCompleto, pageSize: 5 })
      .toPromise();
  }

  devolve(e: Empresa) {
    this.empresa.emit(JSON.stringify(e));
  }

}
