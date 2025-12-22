import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
    const tenantId = environment.tenantId;
    const authReq = req.clone({
        setHeaders: { 'X-Tenant-ID': tenantId }
    });
    return next(authReq);
};
