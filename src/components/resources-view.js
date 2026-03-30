import { ApiService } from '../services/apiService.js';
import { formatCurrency, formatPeriod, parsePeriodToMmmYy } from '../utils/format.js';
import { AuthService } from '../services/auth.js';

export async function renderResources(container) {
    let professionals = await ApiService.getAllRates();

    const render = () => {
        const user = AuthService.getCurrentUser() || {};
        const isViewer = user.role === 'Visualizador';
        
        const html = `
            <div class="projects-container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #111827;">Maestro de Profesionales</h2>
                    <div style="display: flex; gap: 10px;">
                        ${!isViewer ? `
                        <input type="file" id="excel-upload" accept=".xlsx, .xls" style="display: none;" />
                        <button id="btn-import-excel" class="btn-secondary">📤 Importar Excel</button>
                        <button id="btn-new-pro" class="btn-primary">+ Nuevo Profesional</button>
                        ` : ''}
                    </div>
                </div>

                <div class="table-container" style="background: white; border-radius: 8px; padding: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <table class="data-table" style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 2px solid #e5e7eb; text-align: left;">
                                <th style="padding: 12px; color: #6b7280;">Nombre</th>
                                <th style="padding: 12px; color: #6b7280;">Periodo</th>
                                <th style="padding: 12px; color: #6b7280; text-align: right;">Tarifa Directa</th>
                                <th style="padding: 12px; color: #6b7280; text-align: right;">Tarifa Indirecta</th>
                                <th style="padding: 12px; color: #6b7280; text-align: right;">Tarifa Break Even</th>
                                <th style="padding: 12px; color: #6b7280; text-align: center;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${professionals.map(p => {
                                const beRate = Number(p.directRate) + Number(p.indirectRate);
                                return `
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 12px;">${p.name}</td>
                                        <td style="padding: 12px;">${formatPeriod(p.period)}</td>
                                        <td style="padding: 12px; text-align: right;">${formatCurrency(p.directRate)}</td>
                                        <td style="padding: 12px; text-align: right;">${formatCurrency(p.indirectRate)}</td>
                                        <td style="padding: 12px; text-align: right;"><strong>${formatCurrency(beRate)}</strong></td>
                                        <td style="padding: 12px; text-align: center;">
                                            ${!isViewer ? `
                                            <button class="btn-edit-rate" data-name="${p.name}" data-period="${p.period}" data-direct="${p.directRate}" data-indirect="${p.indirectRate}" style="background: none; border: none; cursor: pointer; font-size: 1.2rem;" title="Editar Tarifa">✏️</button>
                                            <button class="btn-delete-rate" data-name="${p.name}" data-period="${p.period}" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; color: #dc2626;" title="Eliminar Registro">🗑️</button>
                                            ` : ''}
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                            ${professionals.length === 0 ? '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #6b7280;">No hay profesionales registrados. Use "Nuevo Profesional" o "Importar Excel".</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        container.innerHTML = html;
        attachEvents();
    };

    const attachEvents = () => {
        // Manual Add
        const btnNew = document.getElementById('btn-new-pro');
        if (btnNew) {
            btnNew.addEventListener('click', () => {
                const name = prompt('Nombre del profesional:');
                if (!name) return;
                let period = prompt('Periodo (Ej: ene-25):');
                if (!period) return;
                const parsedPeriod = parsePeriodToMmmYy(period);
                if (!parsedPeriod) {
                    alert('Formato de periodo inválido. Debe ser mmm-yy (ej: ene-25).');
                    return;
                }
                period = parsedPeriod;
                const directRate = prompt('Tarifa Directa (CLP):');
                if (!directRate || isNaN(directRate)) return;
                const indirectRate = prompt('Tarifa Indirecta (CLP):');
                if (!indirectRate || isNaN(indirectRate)) return;

                ApiService.saveProfessional({
                    name: name.trim(),
                    period: period.trim(),
                    directRate: Number(directRate),
                    indirectRate: Number(indirectRate)
                }).then(() => {
                    ApiService.getAllRates().then(p => {
                        professionals = p;
                        render();
                    });
                }).catch(err => alert("Error al crear tarifa: " + err.message));
            });
        }

        // Excel Import
        const btnImport = document.getElementById('btn-import-excel');
        const fileInput = document.getElementById('excel-upload');
        
        if (btnImport && fileInput) {
            btnImport.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function(evt) {
                    try {
                        const data = evt.target.result;
                        // Assuming XLSX is available in global scope (via index.html)
                        const workbook = XLSX.read(data, { type: 'binary' });
                        const firstSheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[firstSheetName];
                        
                        // Parse JSON
                        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                        
                        // Expecting header row to be: Nombre | Periodo | Tarifa Directa | Tarifa Indirecta
                        if (json.length > 1) {
                            const newPros = [];
                            // Skip header row (index 0)
                            for(let i = 1; i < json.length; i++) {
                                const row = json[i];
                                if (row && row.length >= 4 && row[0] && row[1]) {
                                    const rawPeriod = String(row[1]).trim();
                                    const parsedPeriod = parsePeriodToMmmYy(rawPeriod);
                                    if (parsedPeriod) {
                                        newPros.push({
                                            name: String(row[0]).trim(),
                                            period: parsedPeriod,
                                            directRate: Number(row[2]) || 0,
                                            indirectRate: Number(row[3]) || 0
                                        });
                                    }
                                }
                            }
                            
                            if (newPros.length > 0) {
                                ApiService.saveProfessionalsBulk(newPros).then(() => {
                                    alert(`Se cargaron/actualizaron ${newPros.length} profesionales exitosamente.`);
                                    ApiService.getAllRates().then(p => {
                                        professionals = p;
                                        render();
                                    });
                                }).catch(err => alert("Error en bulk: " + err.message));
                            } else {
                                alert('No se encontraron filas válidas en el Excel. Formato esperado: Nombre, Periodo, Tarifa Directa, Tarifa Indirecta.');
                            }
                        }
                    } catch (err) {
                        alert('Error al leer el archivo Excel: ' + err.message);
                    }
                    fileInput.value = ''; // reset file input
                };
                reader.readAsBinaryString(file);
            });
        }

        const deleteRateBtns = document.querySelectorAll('.btn-delete-rate');
        deleteRateBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const btnEl = e.target.closest('button');
                const name = btnEl.dataset.name;
                const period = btnEl.dataset.period;
                
                if (confirm(`¿Está seguro de eliminar la tarifa de ${name} para el periodo ${period}?`)) {
                    try {
                        await ApiService.deleteRate(name, period);
                        alert('Registro eliminado exitosamente.');
                        ApiService.getAllRates().then(p => {
                            professionals = p;
                            render();
                        });
                    } catch (err) {
                        alert('Error al eliminar: ' + err.message);
                    }
                }
            });
        });

        const editRateBtns = document.querySelectorAll('.btn-edit-rate');
        editRateBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const btnEl = e.target.closest('button');
                const name = btnEl.dataset.name;
                const period = btnEl.dataset.period;
                const currentDirect = btnEl.dataset.direct;
                const currentIndirect = btnEl.dataset.indirect;
                
                const newDirect = prompt(`Editar Tarifa Directa para ${name} (${period}):`, currentDirect);
                if (newDirect === null || newDirect.trim() === '') return;
                
                const newIndirect = prompt(`Editar Tarifa Indirecta para ${name} (${period}):`, currentIndirect);
                if (newIndirect === null || newIndirect.trim() === '') return;
                
                if (isNaN(newDirect) || isNaN(newIndirect)) {
                    alert('Las tarifas deben ser valores numéricos.');
                    return;
                }

                try {
                    await ApiService.saveProfessional({
                        name: name,
                        period: period,
                        directRate: Number(newDirect),
                        indirectRate: Number(newIndirect)
                    });
                    alert('Tarifa actualizada correctamente.');
                    ApiService.getAllRates().then(p => {
                        professionals = p;
                        render();
                    });
                } catch (err) {
                    alert('Error al actualizar: ' + err.message);
                }
            });
        });
    };

    render();
}
