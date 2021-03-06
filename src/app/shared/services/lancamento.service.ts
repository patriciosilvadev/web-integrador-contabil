import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { environment } from '@env';

import { GenericPageableResponse } from '@shared/models/GenericPageableResponse';
import { HttpHandlerService } from '@app/services/http-handler.service';
import { GenericResponse } from '@shared/models/GenericResponse';
import { Lancamento } from '@shared/models/Lancamento';
import { PostFormatRule } from '@shared/models/Rule';
import { Empresa } from '@shared/models/Empresa';

const BASE_URL = `${environment.serviceUrl}/api/v1/lancamentos`;

@Injectable({ providedIn: 'root' })
export class LancamentoService {

  constructor(private http: HttpHandlerService) { }

  public getLancamentos(searchCriteria: any): Observable<GenericPageableResponse<Lancamento>> {
    return this.http.get<GenericPageableResponse<Lancamento>>([BASE_URL, searchCriteria], 'Falha ao obter lançamentos!');
  }

  public import(entry: Lancamento) {
    const url = `${BASE_URL}/importar`;
    return this.http.post(url, entry, 'Falha ao gerar lançamentos!');
  }

  public inactivate(fileId: number) {
    const url = `${BASE_URL}/inativar/${fileId}`;
    return this.http.put(url, {}, 'Falha ao excluir lançamento!');
  }

  public calcPercentage(searchCriteria: any) {
    const url = `${BASE_URL}/porcentagem`;
    return this.http.get([url, searchCriteria], 'Falha ao obter porcentagem de lançamentos concluídos!');
  }

  public totalPerFile(tipoMovimento: string, cnpjEmpresa: string, cnpjContabilidade: string) {
    const searchCriteria = { tipoMovimento, cnpjEmpresa, cnpjContabilidade };
    const url = `${BASE_URL}/total_arquivos`;
    return this.http.get<GenericResponse<{ numeroLancamentos: number, nomeArquivo: string }>>
      ([url, searchCriteria], 'Falha ao obter o total de lançamentos agrupado por arquivo!');
  }

  public skip(id: number): Observable<Lancamento> {
    return this.patch(id, { tipoConta: 4 });
  }

  public patch(id: number, body: any) {
    const url = `${BASE_URL}/${id}`;
    return this.http.patch<Lancamento>(url, body, 'Falha ao vincular lançamento!');
  }

  public fetchByRule(rules: PostFormatRule[], searchCriteria: any): Observable<GenericPageableResponse<Lancamento>> {
    const url = `${BASE_URL}/regras`;
    return this.http.post<GenericPageableResponse<Lancamento>>([url, searchCriteria], rules, 'Falha ao obter lançamentos afetados!');
  }

  public ignoreLancamento(lancamento: Lancamento): Observable<Lancamento> {
    const url = `${BASE_URL}/${lancamento.id}/ignorar`;
    return this.http.post<Lancamento>(url, {}, 'Falha ao ignorar lançamento!');
  }

  public saveAsDePara(lancamento: Lancamento, account: string): Observable<Lancamento> {
    const url = `${BASE_URL}/${lancamento.id}/depara?contaMovimento=${account}`;
    return this.http.post<Lancamento>(url, {}, 'Falha ao vincular lançamento a uma conta de fornecedor!');
  }

  /**
   * @deprecated
   */
  public getByRulePaginated(rules: PostFormatRule[], e: Empresa, page: number, pageSize: number) {
    const searchCriteria = { cnpjEmpresa: e.cnpj, pageIndex: page, pageSize, tipoConta: 0, ativo: true };
    return this.fetchByRule(rules, searchCriteria);
  }

  /**
   * @deprecated
   */
  public getByRule(rules: PostFormatRule[], e: Empresa) {
    const searchCriteria = { cnpjEmpresa: e.cnpj, pageSize: 1, ativo: true };
    return this.fetchByRule(rules, searchCriteria);
  }

  /**
   * @deprecated
   */
  public getPercentage(cnpjEmpresa: string, tipoMovimento: string) {
    return this.calcPercentage({ cnpjEmpresa, tipoMovimento });
  }

}
