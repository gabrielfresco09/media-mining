import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../api.service";
import { LoginPayload } from "../apiModel/login.payload";
import { LoginResponse } from "../apiModel/login.response";
import { HttpHeaders } from "@angular/common/http";
import { Query } from "../apiModel/query";
import { QueryParser } from "../helpers/queryParser";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { tap } from "rxjs/operators";

import { environment } from "../../environments/environment";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  authToken: String;
  query: Query;
  displayedColumns: string[] = ["wid", "pubDate", "language"];
  results: MatTableDataSource<{}>;
  totalCount: number;
  isLoading: boolean;

  constructor(
    private apiService: ApiService,
    private queryParser: QueryParser
  ) {
    this.query = new Query(undefined, new Date(), new Date());
  }
  ngOnInit() {
    this.apiService
      .loginRequest(
        new LoginPayload(environment.apiUser, environment.apiPassword)
      )
      .subscribe((data: LoginResponse) => {
        this.authToken = data.authToken;
      });
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.searchNewItems())).subscribe();
  }

  handleSearchClick() {
    this.paginator.pageIndex = 0;
    this.searchNewItems();
  }

  searchNewItems() {
    const headers = new HttpHeaders({
      authorization: this.authToken.toString(),
      "Content-Type": "application/xml"
    });

    const params = this.queryParser.parseToXml(
      this.query,
      this.paginator.pageSize,
      this.paginator.pageIndex
    );

    this.isLoading = true;

    this.apiService
      .queryRequest(params, headers)
      .subscribe((response: { results: []; resultCount: number }) => {
        this.results = new MatTableDataSource<{}>(response.results);
        this.totalCount = response.resultCount;
        this.isLoading = false;
      });
  }
  getLanguage(fields: [{ name: string; value: string }]): string {
    const langField = fields.filter(field => field.name === "language");
    return langField[0].value;
  }
}
