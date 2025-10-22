import { ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';

export class EqualPasswordValidator {
  static validatorPassword(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      if (!(group instanceof FormGroup)) {
        return null;
      }

      const password = group.get(passwordKey);
      const confirm = group.get(confirmPasswordKey);

      if (!password || !confirm) {
        return null;
      }

      const passwordValue = password.value;
      const confirmValue = confirm.value;

      if (passwordValue === confirmValue) {
        // Si existía el error passwordMismatch en el control confirm, lo limpiamos
        if (confirm.hasError('passwordMismatch')) {
          const errors = { ...confirm.errors };
          delete errors['passwordMismatch'];
          if (Object.keys(errors).length === 0) {
            confirm.setErrors(null);
          } else {
            confirm.setErrors(errors);
          }
        }
        return null;
      }

      // Establecer/mezclar el error en el control confirm
      confirm.setErrors({ ...(confirm.errors || {}), passwordMismatch: true });
      return { passwordMismatch: true };
    };
  }
}
