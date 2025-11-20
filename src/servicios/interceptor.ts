import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if(token == null){
    return next(req);
  }
  const httpReq = req.clone({
    setHeaders:{'Authorization': `Bearer ${token}`}
  })
  return next(httpReq);

};