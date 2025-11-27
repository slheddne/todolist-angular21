import { Pipe, PipeTransform } from '@angular/core';
import { TodoLocation } from '../models/todo.model';

@Pipe({
  name: 'todolocation',
})
export class TodolocationPipe implements PipeTransform {

  transform(value: TodoLocation, map?: string): string {

    if (map === 'google-maps') {
      return `https://maps.google.com/maps?q=${value.latitude},${value.longitude}`;
    }

    let latitude = Math.round(value.latitude * 10000) / 10000;
    let longitude = Math.round(value.longitude * 10000) / 10000;

    return `Latitude : ${latitude}\nLongitude : ${longitude}`;
  }

}
