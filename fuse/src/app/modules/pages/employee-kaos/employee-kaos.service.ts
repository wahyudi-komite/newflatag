import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AbstractService } from '../../../node/common/abstract.service';

@Injectable({
    providedIn: 'root',
})
export class EmployeeKaosService extends AbstractService {
    url = `${environment.apiUrl}/employee-kaos`;

    printElementById(targetId: string, title = 'Print') {
        const srcEl = document.getElementById(targetId);
        if (!srcEl) return;

        const styles = Array.from(
            document.querySelectorAll('link[rel="stylesheet"], style')
        )
            .map((el) => (el as HTMLElement).outerHTML)
            .join('');

        const printWin = window.open('', '_blank', 'width=1000,height=800');
        if (!printWin) return;

        printWin.document.open();
        printWin.document.write(`<!doctype html>
        <html>
        <head>
        <meta charset="utf-8">
        <title>${title}</title>
        ${styles}
        <style>
            @page { size: 98mm 148mm;; margin: 0; }
            @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
        </style>
        </head>
        <body>
        ${srcEl.outerHTML}
        <script>
        (function () {
            // Tunggu hingga semua gambar (termasuk QR code) selesai dimuat
            const waitImages = Array.from(document.images)
                .map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = img.onerror = r; }));
            
            Promise.all(waitImages).then(() => {
                window.focus();
                window.print();
                // window.close();
            });
        })();
    </script>
        </body>
        </html>`);
        printWin.document.close();
    }
}
