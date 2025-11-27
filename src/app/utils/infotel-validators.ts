import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class InfotelValidators {

  static minDate(dateToCompare: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.value) return null;

      if (control.value instanceof Date || typeof (control.value) === 'string') {
        let actualDate = typeof (control.value) === 'string' ? new Date(control.value) : control.value;
        if (actualDate.getTime() < dateToCompare.getTime()) {
          return { minDate: { requiredDate: dateToCompare, actualDate: actualDate } };
        }
      } else {
        console.error(`InfotelValidators.minDate : ${control.value} n'est pas une date valide.`);
      }

      return null;
    }
  }

  static requiredWith(controlToCompare: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return (control.value == null && controlToCompare.value != null) ? { 'required': true } : null;
    }
  }
}
