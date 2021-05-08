import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'shortNumber'
})

export class ShortNumberPipe implements PipeTransform {
  transform(number: number): any {
    if(number <= 999){                                          // return null;
      return number.toFixed(2) ;
    } else if(number >= 1000 && number <= 999999){              // thousands
      return ((number / 1000).toFixed(2)) + ' K';
    } else if(number >= 1000000 && number <= 999999999){        // millions
      return ((number / 1000000).toFixed(2)) + ' M';
    } else if(number >= 1000000000 && number <= 999999999999){  // billions
      return ((number / 1000000000).toFixed(2)) + ' B';
    } else{
      return number ;
    }
  }
}
