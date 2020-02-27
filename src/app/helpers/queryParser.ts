import { Injectable } from "@angular/core";
import { Query } from "../apiModel/query";
import * as moment from "moment";

@Injectable({
  providedIn: "root"
})
export class QueryParser {
  public parseToXml(query: Query, pageSize: number, pageIndex: number) {
    let params = "<params><and>";
    if (query.text) {
      params = params.concat("<words>");
      const words = query.text.split(" ");
      words.forEach(word => {
        params = params.concat(`<word>${word}</word>`);
      });
      params = params.concat("</words>");
    }

    params = params.concat(
      `<date begin="${this.formatDate(query.from)}" end="${this.formatDate(
        query.to
      )}"/>`
    );

    const start = pageIndex === 0 ? 1 : pageIndex * pageSize + 1;
    const end = pageIndex === 0 ? pageSize : (pageIndex + 1) * pageSize;
    params = params.concat("</and>");
    params = params.concat(`<page start="${start}" end="${end}" returnCount="true" />
    <orderBy type="date" ascending="false" />`);
    console.log("params", params);
    return params.concat("</params>");
  }

  private formatDate(date: Date): string {
    return moment(date).format("YYYYMMDDHHmm");
  }
}
