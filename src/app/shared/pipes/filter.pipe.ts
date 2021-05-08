import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string, type: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    if (type === "Object") {
      return items.filter(it => {
        return it['full'].toLowerCase().includes(searchText);
      });
    } else {
      return items.filter(it => {
        return it.toLowerCase().includes(searchText);
      });
    }
  }
}
