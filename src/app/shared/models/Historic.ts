import { EntryUtils } from '@shared/utils/entry.utils';

export class HistoricField {
  constructor(public field: string, public value: string) { }

  public static null() {
    return new HistoricField(null, null);
  }
}


export class FormattedHistoric {

  public id: number;
  public dataCriacao: string;
  public dataAtualizacao: string;

  constructor(
    public historico: string,
    public contaMovimento: string,
    public tipoLancamento: number,
    public idRoteiro: string,
    public cnpjEmpresa: string,
    public cnpjContabilidade: string
  ) {}

}

export class Historic {
  public id: string;
  public com1: string;
  public field1: HistoricField;
  public com2: string;
  public field2: HistoricField;
  public com3: string;
  public field3: HistoricField;
  public com4: string;
  public field4: HistoricField;
  public com5: string;
  public field5: HistoricField;

  constructor() {
    this.field1 = HistoricField.null();
    this.field2 = HistoricField.null();
    this.field3 = HistoricField.null();
    this.field4 = HistoricField.null();
    this.field5 = HistoricField.null();
  }

  public static verify(historic: string): boolean {
    let validate = true;

    const details = historic.split('}');
    details.pop();

    if (details.length !== 5) {
      validate = false;
    }
    if (details[0].includes('CodigoHistorico:')) {
      if (!details[0].split('$')[0].includes('CodigoHistorico:')) {
        validate = false;
      }
    }

    details.forEach(info => {
      const originalField = info.split('${')[1];
      const field = EntryUtils.fromTo(originalField);
      if (!originalField || field === originalField) {
        validate = false;
      }
    });

    return validate;

  }

  public static parse(historic: string): Historic {
    if (!this.verify(historic)) {
      throw new Error(`Não foi possível converter o histórico para um objeto iterável: ${historic}`);
    }

    const obj = new Historic();

    const details = historic.split('}');

    if (details[0].includes('CodigoHistorico:')) {
      obj.id = details[0].slice(16, details[0].indexOf('$'));
      details[0] = details[0].slice(details[0].indexOf('$') + 1);
    } else {
      details[0] = details[0].slice(1);
    }

    obj.com1 = this._getValues(details[0]).com;
    obj.com2 = this._getValues(details[1]).com;
    obj.com3 = this._getValues(details[2]).com;
    obj.com4 = this._getValues(details[3]).com;
    obj.com5 = this._getValues(details[4]).com;

    obj.field1 = this._getValues(details[0]).field;
    obj.field2 = this._getValues(details[1]).field;
    obj.field3 = this._getValues(details[2]).field;
    obj.field4 = this._getValues(details[3]).field;
    obj.field5 = this._getValues(details[4]).field;

    return obj;

  }

  private static _getValues(area: string) {
    const values = area.split(' ${').map(val => val = val.trim());
    return {
      com: values[0],
      field: { field: values[1], value: '' }
    };
  }

  public get preview() {
    const array = this._comments([
      { text: this.field1.value, param: false },
      { text: this.field2.value, param: false },
      { text: this.field3.value, param: false },
      { text: this.field4.value, param: false },
      { text: this.field5.value, param: false }
    ]);
    return this._iterate(array);
  }

  public historic(contaMovimento: string, cnpjEmpresa: string, cnpjContabilidade: string, tipoLancamento: number, idRoteiro: string): FormattedHistoric {
    return new FormattedHistoric(
      this.toParams(),
      contaMovimento,
      tipoLancamento,
      idRoteiro,
      cnpjEmpresa,
      cnpjContabilidade
    );
  }


  public toParams() {
    const array = this._comments([
      { text: this.field1.field, param: true },
      { text: this.field2.field, param: true },
      { text: this.field3.field, param: true },
      { text: this.field4.field, param: true },
      { text: this.field5.field, param: true }
    ]);
    const text = this._iterate(array);
    if (this.id) {
      return `CodigoHistorico:${this.id}$ ${text}`;
    }
    return `$ ${text}`;

  }

  private _comments(fields: any[]) {
    return [
      { text: this.com1, param: false },
      fields[0],
      { text: this.com2, param: false },
      fields[1],
      { text: this.com3, param: false },
      fields[2],
      { text: this.com4, param: false },
      fields[3],
      { text: this.com5, param: false },
      fields[4]
    ];
  }

  private _iterate(array: any[]) {
    let text = '';
    array.forEach(arr => {
      text += this._verifyAndReturn(arr);
    });
    return text;
  }

  private _verifyAndReturn(obj: any): string {
    let yes: string;
    let no: string;

    if (obj.param === true) {
      yes = '${' + obj.text + '} ';
      no = '${nenhum} ';
    } else {
      yes = obj.text + ' ';
      no = '';
    }
    return obj.text ? yes : no;
  }
}
