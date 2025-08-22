import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

// Functional style interceptor (Angular >=15)
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const token = localStorage.getItem('token');
  if (token && req.url.startsWith('https://localhost:7188')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req);
};
