// import { ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';

// export class EqualPasswordValidator {
//   static validatorPassword(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
//     return (group: AbstractControl): { [key: string]: any } | null => {
//       if (!(group instanceof FormGroup)) {
//         return null;
//       }

//       const password = group.get(passwordKey);
//       const confirm = group.get(confirmPasswordKey);

//       if (!password || !confirm) {
//         return null;
//       }

//       const passwordValue = password.value;
//       const confirmValue = confirm.value;

//       if (passwordValue === confirmValue) {
//         // Si existía el error passwordMismatch en el control confirm, lo limpiamos
//         if (confirm.hasError('passwordMismatch')) {
//           const errors = { ...confirm.errors };
//           delete errors['passwordMismatch'];
//           if (Object.keys(errors).length === 0) {
//             confirm.setErrors(null);
//           } else {
//             confirm.setErrors(errors);
//           }
//         }
//         return null;
//       }

//       // Establecer/mezclar el error en el control confirm
//       confirm.setErrors({ ...(confirm.errors || {}), passwordMismatch: true });
//       return { passwordMismatch: true };
//     };
//   }
// }


// /**
//  * Validador que falla si el valor tiene espacios al inicio o final.
//  * Mantiene el contrato: devuelve `{ whitespace: true }` si hay espacios en los extremos, o `null` si es válido.
//  */
// export const noWhitespace: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
//   const raw = control.value;
//   if (raw == null) return null; // no hay valor, dejar que required maneje esto si aplica
//   const str = String(raw);
//   return str !== str.trim() ? { whitespace: true } : null;
// };

// /**
//  * Crea un validador que requiere un número mínimo de caracteres.
//  * Retorna `{ minCharacters: { required, actual } }` cuando falla, o `null` cuando pasa.
//  */
// export const minCharacters = (min: number): ValidatorFn => (control: AbstractControl): { [key: string]: any } | null => {
//   const raw = control.value;
//   const length = raw == null ? 0 : String(raw).length;
//   return length < min ? { minCharacters: { required: min, actual: length } } : null;
// };

