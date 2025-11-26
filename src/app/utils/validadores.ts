import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export function noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const isWhitespace = (control.value || '').trim().length === 0;
        return isWhitespace ? { 'whitespace': true } : null;
    };
}

export function urlFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const url = (control.value || '');
        if (url === '') {
            return null; 
        }
        const regex = new RegExp('^(https?://)','i');
        return !regex.test(url) ? { 'invalidUrlFormat': true } : null;
    };   
}

export function minWordsValidator(minWords: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = (control.value || '').trim();
        if (!value) {
            return null;
        }
        const wordCount = value.split(/\s+/).length;
        if (wordCount < minWords) {
            return {'minWords' : true};

        }
        return null;
    };
}
export function allowedEmailDomains(domains: string[]): ValidatorFn {
  const set = new Set(domains.map(d => d.toLowerCase()));

  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');

    if (!value.includes('@')) return null;

    const domain = value.split('@').pop()!.toLowerCase();

    return set.has(domain) ? null : {domainNotAllowed: {allowed: domains}};
  };
  
}
/**
 * estructura del email (contiene '@' y '.' después).
 */
export function emailStructureValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value || '');

    // 'required'
    if (!value) {
      return null;
    }

    //  Tiene '@'
    if (!value.includes('@')) {
      return { missingAtSymbol: true }; // Error: Falta '@'
    }

    // ¿Tiene '.' DESPUÉS del '@'?
    const parts = value.split('@');
    const domainPart = parts[1]; // La parte después del '@'
    if (!domainPart || !domainPart.includes('.')) {
      return { missingDomainDot: true }; // Error: Falta '.' en el dominio
    }

    //  ¿Hay algo antes del '@' y entre '@' y '.' y después del '.'?
    const userPart = parts[0];
    const domainParts = domainPart.split('.');
    if (!userPart || domainParts.length < 2 || !domainParts[0] || !domainParts[1]) {
        return { invalidStructure: true }; // Error: Estructura general inválida
    }


    // las 3
    return null;
  };
  
}
export function matchPasswordsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    // Si no coinciden y ambos tienen valor, devolvemos error
    return password && confirmPassword && password !== confirmPassword
      ? { passwordsDontMatch: true }
      : null;
  };
}
    