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

    // setting end time to last minute of selected date
    query.to.setHours(23);
    query.to.setMinutes(59);
    query.to.setSeconds(59);
    params = params.concat(
      `<date begin="${this.formatDate(query.from)}" end="${this.formatDate(
        query.to
      )}"/>`
    );

    pageIndex++;

    const start = pageIndex === 1 ? pageIndex : pageIndex * pageSize;
    const end = pageIndex === 1 ? pageSize : pageIndex * pageSize;
    params = params.concat("</and>");
    params = params.concat(`<page start="${start}" end="${end}" returnCount="true" />
    <orderBy type="date" ascending="false" />`);
    return params.concat("</params>");
  }

  private formatDate(date: Date): string {
    return moment(date).format("YYYYMMDDHHmm");
  }
}
