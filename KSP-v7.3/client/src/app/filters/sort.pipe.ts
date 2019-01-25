import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sort'
})

@Injectable()
export class SortPipe implements PipeTransform {
    transform(array: Array<any>, args: any): Array<any> {
        if (typeof args[0] === "undefined" || args[1] === false) {
            return array;
        }
        let direction = args[0][0];
        let column = args[0].replace('-','');
        array.sort((a: any, b: any) => {
            let left = Number(new Date(a[column]));
            let right = Number(new Date(b[column]));
            return (direction === "-") ? right - left : left - right;
        });
        return array;
    }
}