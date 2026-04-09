(() => {
  // src/utils/format.js
  var formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);
  };
  var formatPercent = (value) => {
    return new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 1 }).format(value / 100);
  };
  var MONTHS_MAP = {
    "01": "ene",
    "1": "ene",
    "ene": "ene",
    "enero": "ene",
    "jan": "ene",
    "january": "ene",
    "02": "feb",
    "2": "feb",
    "feb": "feb",
    "febrero": "feb",
    "february": "feb",
    "03": "mar",
    "3": "mar",
    "mar": "mar",
    "marzo": "mar",
    "march": "mar",
    "04": "abr",
    "4": "abr",
    "abr": "abr",
    "abril": "abr",
    "apr": "abr",
    "april": "abr",
    "05": "may",
    "5": "may",
    "may": "may",
    "mayo": "may",
    "06": "jun",
    "6": "jun",
    "jun": "jun",
    "junio": "jun",
    "june": "jun",
    "07": "jul",
    "7": "jul",
    "jul": "jul",
    "julio": "jul",
    "july": "jul",
    "08": "ago",
    "8": "ago",
    "ago": "ago",
    "agosto": "ago",
    "aug": "ago",
    "august": "ago",
    "09": "sep",
    "9": "sep",
    "sep": "sep",
    "septiembre": "sep",
    "sept": "sep",
    "september": "sep",
    "10": "oct",
    "oct": "oct",
    "octubre": "oct",
    "october": "oct",
    "11": "nov",
    "nov": "nov",
    "noviembre": "nov",
    "november": "nov",
    "12": "dic",
    "dic": "dic",
    "diciembre": "dic",
    "dec": "dic",
    "december": "dic"
  };
  var parsePeriodToMmmYy = (period) => {
    if (!period) return null;
    let strPeriod = String(period).trim().toLowerCase();
    const formatDateEs = (jsDate) => {
      if (isNaN(jsDate.getTime())) return null;
      const formatter = new Intl.DateTimeFormat("es-ES", { month: "short", year: "2-digit", timeZone: "UTC" });
      const parts = formatter.formatToParts(jsDate);
      let month = parts.find((p) => p.type === "month")?.value || "";
      month = month.replace(/\./g, "").toLowerCase().substring(0, 3);
      const year = parts.find((p) => p.type === "year")?.value || "";
      return month && year ? `${month}-${year}` : null;
    };
    let match = strPeriod.match(/^(\d{4})[-\s/.](\d{1,2})$/);
    if (match) {
      const jsDate = new Date(Date.UTC(parseInt(match[1]), parseInt(match[2]) - 1, 1));
      return formatDateEs(jsDate);
    }
    if (strPeriod.includes("t")) {
      strPeriod = strPeriod.split("t")[0];
    }
    match = strPeriod.match(/^(\d{4})[-\s/.](\d{1,2})[-\s/.](\d{1,2})$/);
    if (match) {
      const jsDate = new Date(Date.UTC(parseInt(match[1]), parseInt(match[2]) - 1, 1));
      return formatDateEs(jsDate);
    }
    if (!isNaN(strPeriod) && Number(strPeriod) > 1e4) {
      const jsDate = new Date(Math.round((Number(strPeriod) - 25569) * 86400 * 1e3));
      const resetDate = new Date(Date.UTC(jsDate.getUTCFullYear(), jsDate.getUTCMonth(), 1));
      return formatDateEs(resetDate);
    }
    match = strPeriod.match(/^(\d{1,2})[-\s/.](\d{2,4})$/);
    if (match) {
      let year = parseInt(match[2]);
      if (year < 100) year += 2e3;
      const jsDate = new Date(Date.UTC(year, parseInt(match[1]) - 1, 1));
      return formatDateEs(jsDate);
    }
    match = strPeriod.match(/^(\d{1,2})[-\s/.,]+([a-z]+)[-\s/.,]+(\d{2,4})$/);
    if (match) {
      const monthWord = match[2];
      let year = parseInt(match[3]);
      if (year < 100) year += 2e3;
      const monthMapStr = MONTHS_MAP[monthWord];
      if (monthMapStr) {
        const mIndex = Object.keys(MONTHS_MAP).indexOf(monthMapStr) % 12;
        const monthIndexes = { "ene": 0, "feb": 1, "mar": 2, "abr": 3, "may": 4, "jun": 5, "jul": 6, "ago": 7, "sep": 8, "oct": 9, "nov": 10, "dic": 11 };
        const jsDate = new Date(Date.UTC(year, monthIndexes[monthMapStr], 1));
        return formatDateEs(jsDate);
      }
    }
    match = strPeriod.match(/^([a-z]+)[-\s/.,]+(\d{2,4})$/);
    if (match) {
      const monthWord = match[1];
      let rightPart = match[2];
      let year = parseInt(rightPart);
      if (year < 100) year += 2e3;
      const monthMapStr = MONTHS_MAP[monthWord];
      if (monthMapStr) {
        const monthIndexes = { "ene": 0, "feb": 1, "mar": 2, "abr": 3, "may": 4, "jun": 5, "jul": 6, "ago": 7, "sep": 8, "oct": 9, "nov": 10, "dic": 11 };
        const jsDate = new Date(Date.UTC(year, monthIndexes[monthMapStr], 1));
        return formatDateEs(jsDate);
      }
    }
    match = strPeriod.match(/^(\d{2,4})[-\s/.,]+([a-z]+)$/);
    if (match) {
      let year = parseInt(match[1]);
      if (year < 100) year += 2e3;
      const monthWord = match[2];
      const monthMapStr = MONTHS_MAP[monthWord];
      if (monthMapStr) {
        const monthIndexes = { "ene": 0, "feb": 1, "mar": 2, "abr": 3, "may": 4, "jun": 5, "jul": 6, "ago": 7, "sep": 8, "oct": 9, "nov": 10, "dic": 11 };
        const jsDate = new Date(Date.UTC(year, monthIndexes[monthMapStr], 1));
        return formatDateEs(jsDate);
      }
    }
    return null;
  };
  var formatPeriod = (period) => {
    const parsed = parsePeriodToMmmYy(period);
    if (parsed) {
      return parsed;
    }
    return period;
  };

  // src/services/storage.js
  var STORAGE_KEY = "pmo_app_data_v1";
  var PROJECT_STORAGE_KEY = "pmo_projects_v1";
  var PRO_STORAGE_KEY = "pmo_professionals_v1";
  var MOCK_DATA = [
    {
      id: "1",
      project: "Transformaci\xF3n Digital Banco X",
      month: "2023-10",
      revenue: 45e3,
      professionals: [
        { name: "Juan P.", hours: 160, rate: 80 },
        { name: "Ana M.", hours: 150, rate: 90 }
      ],
      thirdPartyCosts: 2e3
    },
    {
      id: "2",
      project: "Migraci\xF3n SAP Retail Y",
      month: "2023-10",
      revenue: 8e4,
      professionals: [
        { name: "Carlos S.", hours: 170, rate: 100 },
        { name: "Elena R.", hours: 160, rate: 110 },
        { name: "Junior 1", hours: 160, rate: 40 }
      ],
      thirdPartyCosts: 5e3
    },
    {
      id: "3",
      project: "Asesor\xEDa Agile Telco Z",
      month: "2023-10",
      revenue: 12e3,
      professionals: [
        { name: "Coach 1", hours: 100, rate: 110 }
      ],
      thirdPartyCosts: 0
    }
  ];
  var StorageService = {
    getAllEntries: () => {
      const data = sessionStorage.getItem(STORAGE_KEY);
      let entries = [];
      if (!data) {
        entries = MOCK_DATA;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      } else {
        entries = JSON.parse(data);
      }
      let needsSave = false;
      entries = entries.map((e) => {
        const parsed = parsePeriodToMmmYy(e.month);
        if (parsed && parsed !== e.month) {
          e.month = parsed;
          needsSave = true;
        }
        return e;
      });
      if (needsSave) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      }
      return entries;
    },
    saveEntriesBulk: (entries) => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    },
    getEntriesByProject: (projectName) => {
      const entries = StorageService.getAllEntries();
      return entries.filter((e) => e.project === projectName);
    },
    saveEntry: (entry) => {
      const entries = StorageService.getAllEntries();
      const newEntry = { ...entry, id: `e_${Date.now()}_${Math.random().toString(36).substr(2, 5)}` };
      entries.push(newEntry);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      return newEntry;
    },
    updateEntry: (entryId, updatedData) => {
      const entries = StorageService.getAllEntries();
      const index = entries.findIndex((e) => e.id === entryId);
      if (index > -1) {
        entries[index] = { ...entries[index], ...updatedData };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      } else {
        throw new Error("Registro no encontrado");
      }
    },
    getProjects: () => {
      const data = sessionStorage.getItem(PROJECT_STORAGE_KEY);
      if (!data) {
        const entries = StorageService.getAllEntries();
        const uniqueProjects = [...new Set(entries.map((e) => e.project))];
        const initialProjects = uniqueProjects.map((name, index) => ({
          id: `p_${Date.now()}_${index}`,
          code: `PRJ-${String(index + 1).padStart(3, "0")}`,
          name,
          status: "Activo"
        }));
        sessionStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(initialProjects));
        return initialProjects;
      }
      return JSON.parse(data);
    },
    saveProject: (project) => {
      const projects = StorageService.getProjects();
      if (project.id) {
        const index = projects.findIndex((p) => p.id === project.id);
        if (index > -1) {
          projects[index] = project;
        } else {
          projects.push(project);
        }
      } else {
        project.id = `p_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        projects.push(project);
      }
      sessionStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
      return project;
    },
    saveProjectsBulk: (projectsList) => {
      sessionStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projectsList));
    },
    getProfessionals: () => {
      const data = sessionStorage.getItem(PRO_STORAGE_KEY);
      if (!data) return [];
      let pros = JSON.parse(data);
      let needsSave = false;
      pros = pros.map((p) => {
        const parsed = parsePeriodToMmmYy(p.period);
        if (parsed && parsed !== p.period) {
          p.period = parsed;
          needsSave = true;
        }
        return p;
      });
      if (needsSave) {
        sessionStorage.setItem(PRO_STORAGE_KEY, JSON.stringify(pros));
      }
      return pros;
    },
    saveProfessional: (pro) => {
      const pros = StorageService.getProfessionals();
      if (pro.id) {
        const index = pros.findIndex((p) => p.id === pro.id);
        if (index > -1) {
          pros[index] = pro;
        } else {
          pros.push(pro);
        }
      } else {
        pros.push({ ...pro, id: `pro_${Date.now()}_${Math.random().toString(36).substr(2, 5)}` });
      }
      sessionStorage.setItem(PRO_STORAGE_KEY, JSON.stringify(pros));
    },
    saveProfessionalsBulk: (prosList) => {
      sessionStorage.setItem(PRO_STORAGE_KEY, JSON.stringify(prosList));
    },
    deleteProfessional: (proId) => {
      const pros = StorageService.getProfessionals();
      const proToDelete = pros.find((p) => p.id === proId);
      if (!proToDelete) throw new Error("Profesional no encontrado");
      const entries = StorageService.getAllEntries();
      const isUsed = entries.some(
        (entry) => entry.month === proToDelete.period && entry.professionals && entry.professionals.some((p) => p.name === proToDelete.name)
      );
      if (isUsed) {
        throw new Error("No se puede eliminar: El profesional tiene registros asociados en Cierre de Mes o datos hist\xF3ricos en este periodo.");
      }
      const updatedPros = pros.filter((p) => p.id !== proId);
      sessionStorage.setItem(PRO_STORAGE_KEY, JSON.stringify(updatedPros));
    },
    clearData: () => {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(PROJECT_STORAGE_KEY);
      sessionStorage.removeItem(PRO_STORAGE_KEY);
    }
  };

  // src/services/analytics.js
  var AnalyticsService = {
    calculateMetrics: (entry) => {
      const internalCost = entry.professionals.reduce((sum, p) => sum + p.hours * p.rate, 0);
      const totalCost = internalCost + (entry.thirdPartyCosts || 0);
      const margin = entry.revenue - totalCost;
      const profitability = entry.revenue > 0 ? margin / entry.revenue * 100 : 0;
      return {
        ...entry,
        internalCost,
        totalCost,
        margin,
        profitability
      };
    },
    getHealthStatus: (profitability) => {
      if (profitability < 10) return { status: "danger", label: "Cr\xEDtico" };
      if (profitability < 20) return { status: "warning", label: "Riesgo" };
      return { status: "success", label: "Saludable" };
    },
    generateInsights: (processedEntries) => {
      const insights = [];
      const criticalProjects = processedEntries.filter((e) => e.profitability < 20);
      if (criticalProjects.length > 0) {
        insights.push({
          type: "critical",
          title: `${criticalProjects.length} Proyectos en Riesgo`,
          details: criticalProjects.map((p) => `${p.project}: ${p.profitability.toFixed(1)}% margen.`).slice(0, 3)
        });
      } else {
        insights.push({
          type: "success",
          title: "Cartera Saludable",
          details: ["Todos los proyectos superan el 20% de rentabilidad."]
        });
      }
      criticalProjects.forEach((p) => {
        const laborShare = p.internalCost / p.revenue;
        if (laborShare > 0.8) {
          insights.push({
            type: "warning",
            title: `Alerta: ${p.project}`,
            details: [`Costo laboral excesivo (${(laborShare * 100).toFixed(0)}% del ingreso). Revisar asignaci\xF3n de horas.`]
          });
        }
      });
      return insights;
    }
  };

  // src/services/apiService.js
  var API_BASE_URL = "https://pmoapp-avbhckasgjbfcag4.brazilsouth-01.azurewebsites.net/api";
  var handleResponse = async (response) => {
    if (!response.ok) {
      const payload = await response.json().catch(() => ({ message: "Unknown error" }));
      const details = payload.error ? ` - Detalles: ${payload.error}` : "";
      throw new Error((payload.message || `Request failed: ${response.status}`) + details);
    }
    return response.json();
  };
  var getHeaders = () => {
    const userStr = sessionStorage.getItem("pmo_auth_user_v1");
    const user = userStr ? JSON.parse(userStr) : null;
    return {
      "Content-Type": "application/json",
      "x-user-role": "Admin",
      // Strict Case Sensitive required by backend auth
      "x-user-name": user ? user.name : "PMO WebApp"
    };
  };
  var ApiService = {
    // Projects
    getProjects: async () => {
      const response = await fetch(`${API_BASE_URL}/projects`, { headers: getHeaders() });
      return handleResponse(response);
    },
    createProject: async (projectData) => {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(projectData)
      });
      return handleResponse(response);
    },
    updateProject: async (id, projectData) => {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(projectData)
      });
      return handleResponse(response);
    },
    deleteProject: async (id) => {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    // Resources
    getResources: async () => {
      const response = await fetch(`${API_BASE_URL}/resources`, { headers: getHeaders() });
      return handleResponse(response);
    },
    createResource: async (resourceData) => {
      const response = await fetch(`${API_BASE_URL}/resources`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(resourceData)
      });
      return handleResponse(response);
    },
    updateResource: async (id, resourceData) => {
      const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(resourceData)
      });
      return handleResponse(response);
    },
    deleteResourceBase: async (id) => {
      const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    // Rates
    getAllRates: async () => {
      const response = await fetch(`${API_BASE_URL}/rates/all`, { headers: getHeaders() });
      return handleResponse(response);
    },
    getRates: async (period) => {
      const response = await fetch(`${API_BASE_URL}/rates?period=${period}`, { headers: getHeaders() });
      return handleResponse(response);
    },
    saveRates: async (period, rates) => {
      const response = await fetch(`${API_BASE_URL}/rates`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ period, rates })
      });
      return handleResponse(response);
    },
    deleteRate: async (id, period) => {
      const response = await fetch(`${API_BASE_URL}/rates/${id}?period=${period}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    // Closures
    getAllEntries: async (filters = {}) => {
      if (filters.projectCode && filters.month) {
        try {
          const data = await ApiService.getClosure(filters.projectCode, filters.month);
          return [data];
        } catch (e) {
          if (e.message.includes("not found")) return [];
          throw e;
        }
      }
      const response = await fetch(`${API_BASE_URL}/closures/all`, { headers: getHeaders() });
      return handleResponse(response);
    },
    getClosure: async (projectCode, period) => {
      const response = await fetch(`${API_BASE_URL}/closures?projectCode=${projectCode}&period=${period}`, { headers: getHeaders() });
      return handleResponse(response);
    },
    saveEntry: async (entry) => {
      const payload = {
        projectCode: entry.projectCode || entry.project,
        // Fallback, but backend needs Code
        period: entry.month,
        revenue: entry.revenue,
        thirdPartyCosts: entry.thirdPartyCosts,
        resources: entry.professionals.map((p) => ({
          resourceName: p.name,
          hours: p.hours,
          rate: p.rate
        })),
        status: entry.tipoRegistro === "REAL" ? "VALIDATED" : "DRAFT"
      };
      const response = await fetch(`${API_BASE_URL}/closures`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      return handleResponse(response);
    },
    validateClosure: async (id) => {
      const response = await fetch(`${API_BASE_URL}/closures/${id}/validate`, {
        method: "POST",
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    unvalidateClosure: async (id) => {
      const response = await fetch(`${API_BASE_URL}/closures/${id}/unvalidate`, {
        method: "POST",
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    clearData: () => {
      console.warn("clearData not supported in API mode");
    }
  };

  // src/components/dashboard-view.js
  async function renderDashboard(container, options = {}) {
    const {
      projectFilter = "all",
      calcMode = "accumulated",
      // 'accumulated' or 'punctual'
      showAllProjects = false,
      startDate = "",
      endDate = "",
      skipFetch = false
    } = options;
    if (!skipFetch) {
      container.innerHTML = '<div style="padding:20px; text-align:center;">Cargando datos desde el servidor...</div>';
      try {
        const [dbProjects, dbClosures] = await Promise.all([
          ApiService.getProjects(),
          ApiService.getAllEntries()
        ]);
        const mappedProjects = dbProjects.map((p) => ({
          id: String(p.id),
          code: p.project_code,
          name: p.name,
          manager: p.manager,
          status: p.status === "INACTIVE" ? "Finalizado" : "Activo"
        }));
        const mappedEntries = dbClosures.map((c) => ({
          id: String(c.id),
          projectCode: c.project_code,
          project: c.project_name,
          month: parsePeriodToMmmYy(c.period),
          revenue: Number(c.revenue) || 0,
          thirdPartyCosts: Number(c.third_party_costs) || 0,
          professionals: (c.resources || []).map((r) => ({
            name: r.resource_name,
            hours: Number(r.hours),
            rate: Number(r.rate_snapshot_direct) + Number(r.rate_snapshot_indirect)
          })),
          tipoRegistro: c.status === "VALIDATED" ? "REAL" : "PROYECCION"
        }));
        StorageService.saveProjectsBulk(mappedProjects);
        StorageService.saveEntriesBulk(mappedEntries);
      } catch (err) {
        console.error("Error sincronizando con Backend en Dashboard:", err);
      }
    }
    const allProjects = StorageService.getProjects();
    const activeProjectNames = new Set(allProjects.filter((p) => p.status === "Activo").map((p) => p.name));
    const projectCodeMap = /* @__PURE__ */ new Map();
    allProjects.forEach((p) => {
      if (p.name && p.code) {
        projectCodeMap.set(p.name, p.code);
      }
    });
    const isExcelEntry = (entry) => {
      return entry.professionals && entry.professionals.length === 1 && (entry.professionals[0].name === "Carga Hist\xF3rica" || entry.professionals[0].name === "Recurso Importado");
    };
    let rawEntries = StorageService.getAllEntries();
    let filteredAllEntries = [...rawEntries];
    if (!showAllProjects) {
      filteredAllEntries = filteredAllEntries.filter((e) => activeProjectNames.has(e.project));
    }
    const MONTHS_ORDER = {
      "ene": 0,
      "feb": 1,
      "mar": 2,
      "abr": 3,
      "may": 4,
      "jun": 5,
      "jul": 6,
      "ago": 7,
      "sep": 8,
      "oct": 9,
      "nov": 10,
      "dic": 11
    };
    const getPeriodValue = (period) => {
      if (!period) return 0;
      const [m, y] = period.split("-");
      return parseInt(y) * 12 + MONTHS_ORDER[m];
    };
    const availableProjects = showAllProjects ? allProjects.map((p) => p.name).sort() : Array.from(activeProjectNames).sort();
    if (projectFilter !== "all") {
      filteredAllEntries = filteredAllEntries.filter((e) => e.project === projectFilter);
    }
    let realEntriesMap = /* @__PURE__ */ new Map();
    let projEntriesMap = /* @__PURE__ */ new Map();
    filteredAllEntries.forEach((entry) => {
      const key = `${entry.project}_${entry.month}`;
      const type = entry.tipoRegistro || "REAL";
      const targetMap = type === "PROYECCION" ? projEntriesMap : realEntriesMap;
      if (!targetMap.has(key)) {
        targetMap.set(key, entry);
      } else {
        const existing = targetMap.get(key);
        if (isExcelEntry(existing) && !isExcelEntry(entry)) {
          targetMap.set(key, entry);
        } else if (isExcelEntry(existing) === isExcelEntry(entry)) {
          targetMap.set(key, entry);
        }
      }
    });
    const validRealEntries = Array.from(realEntriesMap.values());
    const validProjEntries = Array.from(projEntriesMap.values());
    const projectConsolidated = /* @__PURE__ */ new Map();
    validRealEntries.forEach((entry) => {
      const metrics = AnalyticsService.calculateMetrics(entry);
      if (!projectConsolidated.has(entry.project)) {
        projectConsolidated.set(entry.project, {
          project: entry.project,
          month: entry.month,
          revenue: 0,
          totalCost: 0,
          margin: 0,
          profitability: 0
        });
      }
      const pData = projectConsolidated.get(entry.project);
      pData.revenue += metrics.revenue;
      pData.totalCost += metrics.totalCost;
      pData.margin += metrics.margin;
      if (getPeriodValue(entry.month) > getPeriodValue(pData.month)) {
        pData.month = entry.month;
      }
    });
    const processedData = Array.from(projectConsolidated.values()).map((pData) => {
      pData.profitability = pData.revenue > 0 ? pData.margin / pData.revenue * 100 : 0;
      return pData;
    }).sort((a, b) => b.profitability - a.profitability);
    const totalRevenue = processedData.reduce((sum, e) => sum + e.revenue, 0);
    const totalMargin = processedData.reduce((sum, e) => sum + e.margin, 0);
    const avgProfitability = totalRevenue > 0 ? totalMargin / totalRevenue * 100 : 0;
    const html = `
        <div class="dashboard-grid">
            <!-- Filters Section -->
            <div class="dashboard-filters" style="grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 15px; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 5px; align-items: center;">
                <div style="display: flex; gap: 10px; align-items: center;">
                    <label for="dash-project-filter" style="font-weight: 500; color: #4b5563;">Proyecto:</label>
                    <select id="dash-project-filter" class="form-input" style="width: auto;">
                        <option value="all" ${projectFilter === "all" ? "selected" : ""}>Todos los proyectos</option>
                        ${availableProjects.map((p) => {
      const pCode = projectCodeMap.get(p) || "";
      const display = pCode ? `${p} - ${pCode}` : p;
      return `<option value="${p}" ${projectFilter === p ? "selected" : ""}>${display}</option>`;
    }).join("")}
                    </select>
                </div>

                <div style="display: flex; gap: 10px; align-items: center;">
                    <label for="dash-calc-mode" style="font-weight: 500; color: #4b5563;">Modo:</label>
                    <select id="dash-calc-mode" class="form-input" style="width: auto;">
                        <option value="accumulated" ${calcMode === "accumulated" ? "selected" : ""}>Acumulado</option>
                        <option value="punctual" ${calcMode === "punctual" ? "selected" : ""}>Mensual</option>
                    </select>
                </div>

                <div style="display: flex; gap: 10px; align-items: center;">
                    <label for="dash-start-date" style="font-weight: 500; color: #4b5563;">Desde:</label>
                    <input type="month" id="dash-start-date" class="form-input" style="width: auto;" value="${startDate}">
                </div>
                
                <div style="display: flex; gap: 10px; align-items: center;">
                    <label for="dash-end-date" style="font-weight: 500; color: #4b5563;">Hasta:</label>
                    <input type="month" id="dash-end-date" class="form-input" style="width: auto;" value="${endDate}">
                </div>

                <div style="flex-grow: 1; display: flex; justify-content: flex-end;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: #4b5563; font-weight: 500;">
                        <input type="checkbox" id="toggle-all-projects" ${showAllProjects ? "checked" : ""}>
                        Incluir finalizados
                    </label>
                </div>
            </div>

            <!-- KPI Row -->
            <div class="kpi-row">
                <div class="kpi-card">
                    <span class="kpi-title">Ingresos Totales</span>
                    <span class="kpi-value">${formatCurrency(totalRevenue)}</span>
                    <span class="kpi-trend text-success">\u2191 vs mes anterior (sim)</span>
                </div>
                <div class="kpi-card ${avgProfitability < 20 ? "warning" : "success"}">
                    <span class="kpi-title">Rentabilidad Global</span>
                    <span class="kpi-value">${formatPercent(avgProfitability)}</span>
                    <span class="kpi-trend text-secondary">Objetivo: 20%</span>
                </div>
                <div class="kpi-card">
                    <span class="kpi-title">Proyectos Activos</span>
                    <span class="kpi-value">${activeProjectNames.size}</span>
                </div>
                <div class="kpi-card danger">
                    <span class="kpi-title">En Riesgo (<10%)</span>
                    <span class="kpi-value">${processedData.filter((d) => d.profitability < 10).length}</span>
                </div>
            </div>

            <!-- Main Charts -->
            <div class="chart-container span-4">
                <div class="chart-header">
                    <h3 class="chart-title">Evoluci\xF3n del Negocio (Rentabilidad vs Ingresos/Costos)</h3>
                </div>
                <div class="custom-chart-legend" style="display: flex; flex-wrap: wrap; gap: 20px; font-size: 0.9em; margin-bottom: 15px;">
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <strong>L\xEDneas:</strong>
                        <span style="display: flex; align-items: center; gap: 5px;"><span style="display: inline-block; width: 20px; border-bottom: 3px solid #2A7FDE;"></span> REAL</span>
                        <span style="display: flex; align-items: center; gap: 5px;"><span style="display: inline-block; width: 20px; border-bottom: 3px dashed #2A7FDE;"></span> PROYECCI\xD3N</span>
                    </div>
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <strong>Barras:</strong>
                        <span style="display: flex; align-items: center; gap: 5px;">Ingreso Total = </span>
                        <span style="display: flex; align-items: center; gap: 5px;"><span style="display: inline-block; width: 14px; height: 14px; background: #7A7A7A;"></span> Costo Total</span> +
                        <span style="display: flex; align-items: center; gap: 5px;"><span style="display: inline-block; width: 14px; height: 14px; background: #0B8E84;"></span> Margen</span>
                    </div>
                </div>
                <div class="chart-wrapper">
                    <canvas id="profitChart"></canvas>
                </div>
            </div>

            <!-- Analysis & Rankings -->
             <div class="analysis-panel">
                <h3 class="chart-title">An\xE1lisis Inteligente</h3>
                <div class="analysis-grid">
                    <div class="analysis-box" id="insights-container">
                        <h4>\u{1F50D} Hallazgos Principales</h4>
                        <ul class="analysis-list" id="dashboard-insights-list">
                            <!-- Populated dynamically by initCharts matching exact visual data -->
                        </ul>
                    </div>
                     <div class="analysis-box">
                        <h4>\u{1F3C6} Ranking de Rentabilidad</h4>
                         <table class="ranking-table">
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Proyecto</th>
                                    <th>Ingreso</th>
                                    <th>Margen %</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${processedData.filter((p) => activeProjectNames.has(p.project)).map((p) => {
      const health = AnalyticsService.getHealthStatus(p.profitability);
      return `
                                    <tr>
                                        <td><span class="status-dot bg-${health.status}"></span></td>
                                        <td>${p.project}</td>
                                        <td>${formatCurrency(p.revenue)}</td>
                                        <td class="${health.status === "danger" ? "text-danger" : ""}"><strong>${formatPercent(p.profitability)}</strong></td>
                                    </tr>
                                    `;
    }).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = html;
    const getPeriodValueSafe = (periodStr) => {
      if (!periodStr) return 0;
      const [m, yStr] = periodStr.split("-");
      let y = parseInt(yStr);
      if (y < 100) y += 2e3;
      return y * 12 + MONTHS_ORDER[m];
    };
    const getIsoMonthValue = (isoString) => {
      if (!isoString) return 0;
      const [y, m] = isoString.split("-");
      return parseInt(y) * 12 + (parseInt(m) - 1);
    };
    let chartEntries = [...validRealEntries, ...validProjEntries];
    if (startDate || endDate) {
      let startVal = startDate ? getIsoMonthValue(startDate) : 0;
      let endVal = endDate ? getIsoMonthValue(endDate) : Infinity;
      chartEntries = chartEntries.filter((e) => {
        const pv = getPeriodValueSafe(e.month);
        return pv >= startVal && pv <= endVal;
      });
    }
    initCharts(chartEntries, calcMode);
    const getOptions = () => ({
      projectFilter: document.getElementById("dash-project-filter").value,
      calcMode: document.getElementById("dash-calc-mode").value,
      showAllProjects: document.getElementById("toggle-all-projects").checked,
      startDate: document.getElementById("dash-start-date").value,
      endDate: document.getElementById("dash-end-date").value,
      skipFetch: true
      // prevent re-fetching on local filter changes
    });
    const addListener = (id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("change", () => renderDashboard(container, getOptions()));
    };
    addListener("dash-project-filter");
    addListener("dash-calc-mode");
    addListener("toggle-all-projects");
    addListener("dash-start-date");
    addListener("dash-end-date");
  }
  function initCharts(allEntries, calcMode) {
    if (!allEntries || allEntries.length === 0) return;
    const periodsMap = /* @__PURE__ */ new Map();
    allEntries.forEach((entry) => {
      const d = AnalyticsService.calculateMetrics(entry);
      const tipoRegistro = entry.tipoRegistro || "REAL";
      if (!periodsMap.has(d.month)) {
        periodsMap.set(d.month, {
          realRevenue: 0,
          realCost: 0,
          projRevenue: 0,
          projCost: 0
        });
      }
      const current = periodsMap.get(d.month);
      if (tipoRegistro === "PROYECCION") {
        current.projRevenue += d.revenue;
        current.projCost += d.totalCost;
      } else {
        current.realRevenue += d.revenue;
        current.realCost += d.totalCost;
      }
    });
    const CHART_MONTHS_ORDER = {
      "ene": 0,
      "feb": 1,
      "mar": 2,
      "abr": 3,
      "may": 4,
      "jun": 5,
      "jul": 6,
      "ago": 7,
      "sep": 8,
      "oct": 9,
      "nov": 10,
      "dic": 11
    };
    const sortedPeriods = Array.from(periodsMap.keys()).sort((a, b) => {
      const [monthA, yearA] = a.split("-");
      const [monthB, yearB] = b.split("-");
      const dateA = parseInt(yearA) * 12 + CHART_MONTHS_ORDER[monthA];
      const dateB = parseInt(yearB) * 12 + CHART_MONTHS_ORDER[monthB];
      return dateA - dateB;
    });
    const labels = sortedPeriods.map((p) => formatPeriod(p));
    const costData = [];
    const marginData = [];
    const projCostData = [];
    const projMarginData = [];
    const profitData = [];
    const projProfitData = [];
    const tooltipData = [];
    let firstProjIndex = -1;
    sortedPeriods.forEach((p, idx) => {
      const metrics = periodsMap.get(p);
      if (metrics.projRevenue > 0 || metrics.projCost > 0) {
        if (firstProjIndex === -1) {
          firstProjIndex = idx;
        }
      }
    });
    let runningRealRev = 0, runningRealCost = 0;
    let accumulatedProjRev = 0, accumulatedProjCost = 0;
    sortedPeriods.forEach((p, idx) => {
      const originalMetrics = periodsMap.get(p);
      let activeMetrics = { ...originalMetrics };
      const originalRealRev = originalMetrics.realRevenue;
      const originalRealCost = originalMetrics.realCost;
      const originalProjRev = originalMetrics.projRevenue;
      const originalProjCost = originalMetrics.projCost;
      if (calcMode === "accumulated") {
        runningRealRev += originalRealRev;
        runningRealCost += originalRealCost;
        if (firstProjIndex === -1 || idx < firstProjIndex) {
          accumulatedProjRev = 0;
          accumulatedProjCost = 0;
        } else if (idx === firstProjIndex) {
          const baseRealRev = runningRealRev - originalRealRev;
          const baseRealCost = runningRealCost - originalRealCost;
          accumulatedProjRev = baseRealRev + originalProjRev;
          accumulatedProjCost = baseRealCost + originalProjCost;
        } else {
          accumulatedProjRev += originalProjRev;
          accumulatedProjCost += originalProjCost;
        }
        activeMetrics.realRevenue = runningRealRev;
        activeMetrics.realCost = runningRealCost;
        activeMetrics.projRevenue = accumulatedProjRev;
        activeMetrics.projCost = accumulatedProjCost;
      }
      const realMargin = activeMetrics.realRevenue - activeMetrics.realCost;
      const realProfitPercent = activeMetrics.realRevenue > 0 ? realMargin / activeMetrics.realRevenue * 100 : null;
      const projMargin = activeMetrics.projRevenue - activeMetrics.projCost;
      const projProfitPercent = activeMetrics.projRevenue > 0 ? projMargin / activeMetrics.projRevenue * 100 : null;
      const hasReal = originalRealRev > 0 || originalRealCost > 0;
      const hasProj = originalProjRev > 0 || originalProjCost > 0;
      costData.push(hasReal ? activeMetrics.realCost : null);
      marginData.push(hasReal ? realMargin : null);
      if (calcMode === "accumulated") {
        const isProjActive = firstProjIndex !== -1 && idx >= firstProjIndex;
        projCostData.push(isProjActive ? activeMetrics.projCost : null);
        projMarginData.push(isProjActive ? projMargin : null);
      } else {
        projCostData.push(hasProj ? activeMetrics.projCost : null);
        projMarginData.push(hasProj ? projMargin : null);
      }
      if (hasReal) {
        profitData.push(realProfitPercent !== null ? realProfitPercent.toFixed(1) : 0);
      } else {
        profitData.push(null);
      }
      if (calcMode === "accumulated") {
        if (firstProjIndex === -1 || idx < firstProjIndex) {
          projProfitData.push(null);
        } else {
          projProfitData.push(projProfitPercent !== null ? projProfitPercent.toFixed(1) : 0);
        }
      } else {
        if (hasProj) {
          projProfitData.push(projProfitPercent !== null ? projProfitPercent.toFixed(1) : 0);
        } else {
          projProfitData.push(null);
        }
      }
      let totalRev = activeMetrics.realRevenue + activeMetrics.projRevenue;
      let totalMargin = realMargin + projMargin;
      let combinedProfitDesc = totalRev > 0 ? totalMargin / totalRev * 100 : 0;
      tooltipData.push({
        period: formatPeriod(p),
        realRev: activeMetrics.realRevenue,
        realCost: activeMetrics.realCost,
        realMarg: realMargin,
        realProfit: realProfitPercent !== null ? realProfitPercent.toFixed(1) : "N/A",
        rawRealProfit: realProfitPercent,
        projRev: activeMetrics.projRevenue,
        projCost: activeMetrics.projCost,
        projMarg: projMargin,
        projProfit: projProfitPercent !== null ? projProfitPercent.toFixed(1) : "N/A",
        rawProjProfit: projProfitPercent,
        profitPercent: combinedProfitDesc.toFixed(1),
        hasRealDot: profitData[profitData.length - 1] !== null,
        hasProjDot: projProfitData[projProfitData.length - 1] !== null
      });
    });
    const insights = [];
    let devPeriod = null;
    for (let i = tooltipData.length - 1; i >= 0; i--) {
      const d = tooltipData[i];
      if (d.hasRealDot && d.hasProjDot && d.rawRealProfit !== null && d.rawProjProfit !== null && isFinite(d.rawRealProfit) && isFinite(d.rawProjProfit) && d.rawProjProfit !== 0) {
        devPeriod = d;
        break;
      }
    }
    if (devPeriod) {
      const dev = (devPeriod.rawRealProfit - devPeriod.rawProjProfit) / Math.abs(devPeriod.rawProjProfit) * 100;
      let tipoWord = "igual a";
      if (dev > 0.1) tipoWord = "sobre";
      else if (dev < -0.1) tipoWord = "bajo";
      insights.push({
        title: "Desviaci\xF3n de Margen",
        details: [`El resultado real est\xE1 ${Math.abs(dev).toFixed(1)}% ${tipoWord} la proyecci\xF3n.`],
        data: `(Desviaci\xF3n: ${dev.toFixed(1)}%)`
      });
    }
    const realPoints = tooltipData.filter((d) => d.hasRealDot && d.rawRealProfit !== null && isFinite(d.rawRealProfit));
    if (realPoints.length >= 3) {
      const p0 = realPoints[realPoints.length - 3];
      const p2 = realPoints[realPoints.length - 1];
      const diff = p2.rawRealProfit - p0.rawRealProfit;
      let trendLabel = "estable";
      if (diff > 0.5) trendLabel = "creciente";
      else if (diff < -0.5) trendLabel = "decreciente";
      insights.push({
        title: "Tendencia Reciente",
        details: [`La evoluci\xF3n en los \xFAltimos 3 periodos reales es ${trendLabel}.`],
        data: `(Variaci\xF3n Rentabilidad: ${diff > 0 ? "+" : ""}${diff.toFixed(1)}%)`
      });
    }
    let lastProjPoint = null;
    for (let i = tooltipData.length - 1; i >= 0; i--) {
      if (tooltipData[i].hasProjDot && tooltipData[i].rawProjProfit !== null && isFinite(tooltipData[i].rawProjProfit)) {
        lastProjPoint = tooltipData[i];
        break;
      }
    }
    if (lastProjPoint) {
      const finalProf = lastProjPoint.rawProjProfit;
      let proyClass = "alta rentabilidad";
      if (finalProf < 10) proyClass = "baja rentabilidad o deterioro";
      else if (finalProf < 20) proyClass = "rentabilidad media";
      insights.push({
        title: "Proyecci\xF3n Final",
        details: [`El resultado esperado en base a la proyecci\xF3n es de ${proyClass}.`],
        data: `(Rentabilidad Proyectada: ${finalProf.toFixed(1)}%)`
      });
    }
    const insightsHtml = insights.map((i) => `
        <li>
            <strong>${i.title}:</strong> ${i.details.join(" ")}
            <br/><span>${i.data}</span>
        </li>`).join("");
    const insightsListEl = document.getElementById("dashboard-insights-list");
    if (insightsListEl) {
      insightsListEl.innerHTML = insightsHtml;
    }
    const customCanvasBackgroundColor = {
      id: "customCanvasBackgroundColor",
      beforeDraw: (chart, args, options) => {
        const { ctx } = chart;
        ctx.save();
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = options.color || "#F3F3F3";
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
    };
    new Chart(document.getElementById("profitChart"), {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            type: "line",
            label: "REAL",
            data: profitData,
            borderColor: "#2A7FDE",
            backgroundColor: "#2A7FDE",
            borderWidth: 3,
            tension: 0.3,
            yAxisID: "y",
            spanGaps: true,
            order: 0
          },
          {
            type: "line",
            label: "PROYECCION",
            data: projProfitData,
            borderColor: "#2A7FDE",
            backgroundColor: "transparent",
            borderWidth: 3,
            borderDash: [5, 5],
            tension: 0.3,
            yAxisID: "y",
            spanGaps: true,
            order: 0
          },
          {
            type: "bar",
            label: "REAL_COST",
            data: costData,
            backgroundColor: "#7A7A7A",
            yAxisID: "y1",
            stack: "Stack Real",
            order: 2
          },
          {
            type: "bar",
            label: "REAL_MARGIN",
            data: marginData,
            backgroundColor: "#0B8E84",
            yAxisID: "y1",
            stack: "Stack Real",
            order: 1
          },
          {
            type: "bar",
            label: "PROJ_COST",
            data: projCostData,
            backgroundColor: "rgba(122, 122, 122, 0.4)",
            borderColor: "#7A7A7A",
            borderWidth: { top: 2, right: 2, left: 2, bottom: 0 },
            borderDash: [5, 5],
            yAxisID: "y1",
            stack: "Stack Proj",
            order: 2
          },
          {
            type: "bar",
            label: "PROJ_MARGIN",
            data: projMarginData,
            backgroundColor: "rgba(11, 142, 132, 0.4)",
            borderColor: "#0B8E84",
            borderWidth: { top: 2, right: 2, left: 2, bottom: 0 },
            borderDash: [5, 5],
            yAxisID: "y1",
            stack: "Stack Proj",
            order: 1
          }
        ]
      },
      plugins: [customCanvasBackgroundColor],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false
        },
        plugins: {
          customCanvasBackgroundColor: {
            color: "#F3F3F3"
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: function() {
                return null;
              },
              beforeBody: function(context) {
                const index = context[0].dataIndex;
                const data = tooltipData[index];
                let lines = [
                  `Periodo: ${data.period}`
                ];
                if (data.realRev > 0 || data.realCost > 0) {
                  lines.push("--- REAL ---");
                  lines.push(`valor REAL: ${data.realProfit}%`);
                  lines.push(`Ingreso: ${new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(data.realRev)}`);
                  lines.push(`Costo:   ${new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(data.realCost)}`);
                  lines.push(`Margen:  ${new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(data.realMarg)}`);
                }
                if (data.projRev > 0 || data.projCost > 0) {
                  lines.push("--- PROYECCION ---");
                  lines.push(`valor PROYECCION: ${data.projProfit}%`);
                  lines.push(`Ingreso: ${new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(data.projRev)}`);
                  lines.push(`Costo:   ${new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(data.projCost)}`);
                  lines.push(`Margen:  ${new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(data.projMarg)}`);
                }
                if ((data.realRev > 0 || data.realCost > 0) && (data.projRev > 0 || data.projCost > 0)) {
                  if (data.rawProjProfit !== null && data.rawRealProfit !== null && data.rawProjProfit !== 0 && isFinite(data.rawProjProfit) && isFinite(data.rawRealProfit)) {
                    const dev = (data.rawRealProfit - data.rawProjProfit) / Math.abs(data.rawProjProfit) * 100;
                    lines.push("--- COMPARATIVO ---");
                    lines.push(`% Desviaci\xF3n: ${dev.toFixed(1)}%`);
                  }
                }
                return lines;
              },
              label: function() {
                return null;
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false }
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: true,
              text: "Rentabilidad (%)"
            },
            ticks: {
              callback: function(value) {
                return value + "%";
              }
            }
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            stacked: true,
            title: {
              display: true,
              text: "Monto (CLP)"
            },
            grid: {
              drawOnChartArea: false
              // only want the grid lines for one axis to show up
            },
            ticks: {
              callback: function(value) {
                if (value >= 1e6) {
                  return "$" + (value / 1e6).toFixed(1) + "M";
                } else if (value >= 1e3) {
                  return "$" + (value / 1e3).toFixed(1) + "k";
                }
                return "$" + value;
              }
            }
          }
        }
      }
    });
  }

  // src/components/entry-form.js
  function renderEntryForm(container) {
    const activeProjects = StorageService.getProjects().filter((p) => p.status === "Activo");
    const allProfessionals = StorageService.getProfessionals();
    const uniqueProNames = [...new Set(allProfessionals.map((p) => p.name))].sort();
    const html = `
        <div class="form-container">
            <h2 style="margin-bottom: 1.5rem">Nuevo Registro de Proyecto</h2>
            <form id="projectForm">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Proyecto</label>
                        <select name="project" class="form-input" required>
                            <option value="" disabled selected>Seleccione un proyecto activo...</option>
                            ${activeProjects.map((p) => `<option value="${p.name}">${p.name} (${p.code})</option>`).join("")}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Periodo (Mes/A\xF1o)</label>
                        <input type="month" id="entry-month" name="month" class="form-input" required>
                    </div>
                </div>

                <div class="form-row">
                     <div class="form-group">
                        <label class="form-label">Ingreso Mensual (CLP)</label>
                        <input type="number" name="revenue" class="form-input" step="any">
                    </div>
                     <div class="form-group">
                        <label class="form-label">Costos de Terceros</label>
                        <input type="number" name="thirdPartyCosts" class="form-input" value="0" min="0">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Tipo de Registro</label>
                        <select name="tipoRegistro" class="form-input" required>
                            <option value="REAL" selected>Real</option>
                            <option value="PROYECCION">Proyecci\xF3n</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Equipo de Trabajo (Horas & Tarifas)</label>
                    <div id="professionals-list" class="dynamic-list">
                        <!-- Items will be here -->
                    </div>
                    <button type="button" id="add-pro-btn" class="btn-secondary" style="margin-top: 10px">+ Agregar Profesional</button>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancel-btn">Cancelar</button>
                    <button type="submit" class="btn-primary">Guardar Proyecto</button>
                </div>
            </form>
        </div>
    `;
    container.innerHTML = html;
    const list = document.getElementById("professionals-list");
    const addBtn = document.getElementById("add-pro-btn");
    const form = document.getElementById("projectForm");
    const monthInput = document.getElementById("entry-month");
    const updateRowRate = (row) => {
      const rawMonth = monthInput.value;
      const month = parsePeriodToMmmYy(rawMonth);
      const nameSelect = row.querySelector('[name="pro_name"]');
      const rateDisplayInput = row.querySelector('[name="pro_rate_display"]');
      const rateInput = row.querySelector('[name="pro_rate"]');
      if (!month || !nameSelect.value) {
        rateDisplayInput.value = "";
        rateInput.value = "";
        return;
      }
      const tipoRegistroSelect2 = form.querySelector('[name="tipoRegistro"]');
      const tipoRegistro = tipoRegistroSelect2 ? tipoRegistroSelect2.value : "REAL";
      const exactPro = allProfessionals.find((p) => p.name === nameSelect.value && p.period === month);
      if (exactPro) {
        const beRate = Number(exactPro.directRate) + Number(exactPro.indirectRate);
        rateDisplayInput.value = formatCurrency(beRate);
        rateInput.value = beRate;
      } else {
        if (tipoRegistro === "PROYECCION") {
          const monthIndexes = { "ene": 0, "feb": 1, "mar": 2, "abr": 3, "may": 4, "jun": 5, "jul": 6, "ago": 7, "sep": 8, "oct": 9, "nov": 10, "dic": 11 };
          const getVal = (str) => {
            if (!str) return 0;
            const [m, y] = str.split("-");
            return parseInt(y) * 12 + monthIndexes[m];
          };
          const targetVal = getVal(month);
          const pastPros = allProfessionals.filter((p) => p.name === nameSelect.value && getVal(p.period) < targetVal);
          if (pastPros.length > 0) {
            pastPros.sort((a, b) => getVal(b.period) - getVal(a.period));
            const fallbackPro = pastPros[0];
            const beRate = Number(fallbackPro.directRate) + Number(fallbackPro.indirectRate);
            rateDisplayInput.value = formatCurrency(beRate);
            rateInput.value = beRate;
            return;
          } else {
            rateDisplayInput.value = "";
            rateInput.value = "";
            alert("No existe tarifa disponible para el profesional seleccionado");
            nameSelect.value = "";
            return;
          }
        }
        rateDisplayInput.value = "";
        rateInput.value = "";
        alert(`No se encontr\xF3 Tarifa definida para ${nameSelect.value} en el periodo ${month}. Por favor reg\xEDstrela en el Maestro de Profesionales.`);
        nameSelect.value = "";
      }
    };
    monthInput.addEventListener("change", () => {
      const rows = list.querySelectorAll(".list-item");
      rows.forEach(updateRowRate);
    });
    const tipoRegistroSelect = form.querySelector('[name="tipoRegistro"]');
    if (tipoRegistroSelect) {
      tipoRegistroSelect.addEventListener("change", () => {
        const rows = list.querySelectorAll(".list-item");
        rows.forEach(updateRowRate);
      });
    }
    const addProfessionalRow = () => {
      const div = document.createElement("div");
      div.className = "list-item";
      div.innerHTML = `
            <select name="pro_name" class="form-input" style="flex:2" required>
                <option value="" disabled selected>Seleccione Profesional...</option>
                ${uniqueProNames.map((name) => `<option value="${name}">${name}</option>`).join("")}
            </select>
            <input type="number" name="pro_hours" placeholder="Horas" class="form-input" style="flex:1" min="0" required>
            <input type="text" name="pro_rate_display" placeholder="Tarifa B/E Auto" class="form-input" style="flex:1; background-color: #f3f4f6; cursor: not-allowed;" readonly required>
            <input type="hidden" name="pro_rate">
            <button type="button" class="btn-remove">\xD7</button>
        `;
      div.querySelector(".btn-remove").addEventListener("click", () => div.remove());
      div.querySelector('[name="pro_name"]').addEventListener("change", () => updateRowRate(div));
      list.appendChild(div);
    };
    addProfessionalRow();
    addBtn.addEventListener("click", addProfessionalRow);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const professionals = [];
      const rawRevenue = formData.get("revenue");
      const revenueNum = Number(rawRevenue);
      if (!rawRevenue || String(rawRevenue).trim() === "" || !Number.isInteger(revenueNum) || revenueNum <= 0) {
        alert("Ingreso Mensual debe ser un n\xFAmero entero positivo");
        return;
      }
      const names = formData.getAll("pro_name");
      const hours = formData.getAll("pro_hours");
      const rates = formData.getAll("pro_rate");
      names.forEach((name, i) => {
        if (name) {
          professionals.push({
            name,
            hours: Number(hours[i]),
            rate: Number(rates[i])
          });
        }
      });
      const parsedMonth = parsePeriodToMmmYy(formData.get("month"));
      if (!parsedMonth) {
        alert("El formato del periodo es inv\xE1lido o faltante. Use mmm-yy (ej: ene-25).");
        return;
      }
      const projectName = formData.get("project");
      const tipoRegistro = formData.get("tipoRegistro") || "REAL";
      const projectObj = activeProjects.find((p) => p.name === projectName);
      const projectCode = projectObj ? String(projectObj.code).trim().toUpperCase() : "";
      const allEntries = StorageService.getAllEntries();
      const allProjects = StorageService.getProjects();
      const codeMap = new Map(allProjects.map((p) => [p.name, String(p.code).trim().toUpperCase()]));
      const isDuplicate = allEntries.some(
        (e2) => codeMap.get(e2.project) === projectCode && e2.month === parsedMonth && (e2.tipoRegistro || "REAL") === tipoRegistro
      );
      if (isDuplicate) {
        alert("Registro duplicado: ya existe un proyecto con el mismo C\xF3digo, Periodo y Status");
        return;
      }
      const entry = {
        project: projectName,
        month: parsedMonth,
        revenue: Number(formData.get("revenue")),
        thirdPartyCosts: Number(formData.get("thirdPartyCosts")),
        tipoRegistro,
        professionals
      };
      StorageService.saveEntry(entry);
      alert("Registro ingresado correctamente");
      window.location.reload();
    });
  }

  // src/components/projects-view.js
  async function renderProjects(container) {
    container.innerHTML = '<div style="padding:20px; text-align:center;">Cargando datos desde el servidor...</div>';
    try {
      const [dbProjects, dbClosures] = await Promise.all([
        ApiService.getProjects(),
        ApiService.getAllEntries()
      ]);
      const mappedProjects = dbProjects.map((p) => ({
        id: String(p.id),
        code: p.project_code,
        name: p.name,
        manager: p.manager,
        status: p.status === "INACTIVE" ? "Finalizado" : "Activo"
      }));
      const mappedEntries = dbClosures.map((c) => ({
        id: String(c.id),
        projectCode: c.project_code,
        project: c.project_name,
        // fallback for legacy code
        month: parsePeriodToMmmYy(c.period),
        revenue: Number(c.revenue) || 0,
        thirdPartyCosts: Number(c.third_party_costs) || 0,
        professionals: (c.resources || []).map((r) => ({
          name: r.resource_name,
          hours: Number(r.hours),
          rate: Number(r.rate_snapshot_direct) + Number(r.rate_snapshot_indirect)
        })),
        tipoRegistro: c.status === "VALIDATED" ? "REAL" : "PROYECCION"
        // Mapping concept
      }));
      StorageService.saveProjectsBulk(mappedProjects);
      StorageService.saveEntriesBulk(mappedEntries);
    } catch (err) {
      console.error("Error sincronizando con Backend:", err);
    }
    let projects = StorageService.getProjects();
    const entries = StorageService.getAllEntries();
    projects.sort((a, b) => a.code.localeCompare(b.code));
    const isExcelEntry = (entry) => {
      return entry.professionals && entry.professionals.length === 1 && (entry.professionals[0].name === "Carga Hist\xF3rica" || entry.professionals[0].name === "Recurso Importado");
    };
    let realEntriesMap = /* @__PURE__ */ new Map();
    entries.forEach((entry) => {
      const type = entry.tipoRegistro || "REAL";
      if (type !== "REAL") return;
      const key = `${entry.project}_${entry.month}`;
      if (!realEntriesMap.has(key)) {
        realEntriesMap.set(key, entry);
      } else {
        const existing = realEntriesMap.get(key);
        if (isExcelEntry(existing) && !isExcelEntry(entry)) {
          realEntriesMap.set(key, entry);
        } else if (isExcelEntry(existing) === isExcelEntry(entry)) {
          realEntriesMap.set(key, entry);
        }
      }
    });
    const validRealEntries = Array.from(realEntriesMap.values());
    const projectStats = {};
    validRealEntries.forEach((entry) => {
      const metrics = AnalyticsService.calculateMetrics(entry);
      if (!projectStats[entry.project]) {
        projectStats[entry.project] = {
          totalRevenue: 0,
          totalMargin: 0
        };
      }
      projectStats[entry.project].totalRevenue += metrics.revenue;
      projectStats[entry.project].totalMargin += metrics.margin;
    });
    const getProfitabilityColor = (profitability) => {
      if (profitability > 20) return "#0B8E84";
      if (profitability >= 10) return "#C9A227";
      return "#B03A2E";
    };
    let currentFilter = "Todos";
    const normalizeCode = (code) => {
      return String(code || "").trim().replace(/\s+/g, " ").toUpperCase();
    };
    const normalizeText = (text) => {
      return String(text || "").trim().replace(/\s+/g, " ");
    };
    const render = () => {
      const filteredProjects = projects.filter((p) => currentFilter === "Todos" || p.status === currentFilter);
      const html = `
            <div class="projects-container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <label for="statusFilter" style="font-weight: 500;">Filtro por Estado:</label>
                        <select id="statusFilter" class="form-input" style="width: auto;">
                            <option value="Todos" ${currentFilter === "Todos" ? "selected" : ""}>Todos</option>
                            <option value="Activo" ${currentFilter === "Activo" ? "selected" : ""}>Activo</option>
                            <option value="Finalizado" ${currentFilter === "Finalizado" ? "selected" : ""}>Finalizado</option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <input type="file" id="excel-upload" accept=".xlsx, .xls" style="display: none;" />
                        <button id="btn-import-excel" class="btn-secondary">\u2B07\uFE0F Importar Excel</button>
                        <button id="btn-export-excel" class="btn-secondary" style="background-color: #0B8E84; color: white;">\u2B07\uFE0F Exportar Excel</button>
                        <button id="btn-new-project" class="btn-primary">+ Nuevo Proyecto</button>
                    </div>
                </div>

                <div class="table-container" style="background: white; border-radius: 8px; padding: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <table class="data-table" style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 2px solid #e5e7eb; text-align: left;">
                                <th style="padding: 12px; color: #6b7280;">C\xF3digo</th>
                                <th style="padding: 12px; color: #6b7280;">Nombre del Proyecto</th>
                                <th style="padding: 12px; color: #6b7280;">Estado</th>
                                <th style="padding: 12px; color: #6b7280;">Rentabilidad Final</th>
                                <th style="padding: 12px; color: #6b7280; text-align: center;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredProjects.map((p) => {
        const stats = projectStats[p.name] || { totalRevenue: 0, totalMargin: 0 };
        const profitability = stats.totalRevenue > 0 ? stats.totalMargin / stats.totalRevenue * 100 : 0;
        const color = getProfitabilityColor(profitability);
        return `
                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                        <td style="padding: 12px;">${p.code}</td>
                                        <td style="padding: 12px;">${p.name}</td>
                                        <td style="padding: 12px;">
                                            <select class="status-select form-input" data-id="${p.id}" style="width: 130px; padding: 6px; border-radius: 4px;">
                                                <option value="Activo" ${p.status === "Activo" ? "selected" : ""}>Activo</option>
                                                <option value="Finalizado" ${p.status === "Finalizado" ? "selected" : ""}>Finalizado</option>
                                            </select>
                                        </td>
                                        <td style="padding: 12px;">
                                            <strong style="color: ${color}; font-size: 1.1em;">${formatPercent(profitability)}</strong>
                                        </td>
                                        <td style="padding: 12px; text-align: center;">
                                            <button class="btn-edit-project" data-name="${p.name}" style="background: none; border: none; cursor: pointer; font-size: 1.2rem;" title="Editar Registros">\u270F\uFE0F</button>
                                            <button class="btn-delete-project" data-name="${p.name}" data-id="${p.id}" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; color: #dc2626;" title="Eliminar Proyecto">\u{1F5D1}\uFE0F</button>
                                        </td>
                                    </tr>
                                `;
      }).join("")}
                            ${filteredProjects.length === 0 ? '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #6b7280;">No hay proyectos para el filtro seleccionado.</td></tr>' : ""}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
      container.innerHTML = html;
      attachEvents();
    };
    const attachEvents = () => {
      const filter = document.getElementById("statusFilter");
      if (filter) {
        filter.addEventListener("change", (e) => {
          currentFilter = e.target.value;
          render();
        });
      }
      const btnNew = document.getElementById("btn-new-project");
      if (btnNew) {
        btnNew.addEventListener("click", openNewProjectModal);
      }
      const selects = document.querySelectorAll(".status-select");
      selects.forEach((select) => {
        select.addEventListener("change", async (e) => {
          const id = e.target.getAttribute("data-id");
          const newStatus = e.target.value;
          const project = projects.find((p) => p.id === id);
          if (project) {
            const previousStatus = project.status;
            if (newStatus === "Finalizado") {
              const confirmed = confirm(`\xBFEst\xE1 seguro de que desea cambiar el estado a "Finalizado" para el proyecto "${project.name}"?`);
              if (!confirmed) {
                e.target.value = previousStatus;
                return;
              }
            }
            e.target.disabled = true;
            try {
              await ApiService.updateProject(id, {
                project_code: project.code,
                name: project.name,
                manager: project.manager || "",
                status: newStatus === "Finalizado" ? "INACTIVE" : "ACTIVE"
              });
              project.status = newStatus;
              StorageService.saveProject(project);
            } catch (error) {
              alert("Error al guardar el estado en el servidor: " + error.message);
              e.target.value = previousStatus;
              project.status = previousStatus;
            } finally {
              e.target.disabled = false;
              if (currentFilter !== "Todos" && currentFilter !== newStatus) {
                render();
              }
            }
          }
        });
      });
      const editBtns = document.querySelectorAll(".btn-edit-project");
      editBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const projectName = e.target.closest("button").dataset.name;
          openEditModal(projectName);
        });
      });
      const deleteBtns = document.querySelectorAll(".btn-delete-project");
      deleteBtns.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const btnEl = e.target.closest("button");
          const projectName = btnEl.dataset.name;
          const projectId = btnEl.dataset.id;
          if (confirm(`\xBFEst\xE1 seguro de que desea eliminar el proyecto "${projectName}" de la base de datos?
Esta acci\xF3n tambi\xE9n eliminar\xE1 todas sus proyecciones y costos asociados.`)) {
            btnEl.disabled = true;
            try {
              await ApiService.deleteProject(projectId);
              const allProjects = StorageService.getProjects();
              const remaining = allProjects.filter((p) => p.id !== projectId);
              sessionStorage.setItem("pmo_projects_v1", JSON.stringify(remaining));
              const allEntries = StorageService.getAllEntries();
              const remainingEntries = allEntries.filter((e2) => e2.project !== projectName);
              sessionStorage.setItem("pmo_app_data_v1", JSON.stringify(remainingEntries));
              projects = remaining;
              render();
            } catch (error) {
              alert("Error al intentar eliminar el proyecto: " + error.message);
              btnEl.disabled = false;
            }
          }
        });
      });
      const btnImportExcel = document.getElementById("btn-import-excel");
      const excelUpload = document.getElementById("excel-upload");
      if (btnImportExcel && excelUpload) {
        btnImportExcel.addEventListener("click", () => excelUpload.click());
        excelUpload.addEventListener("change", handleExcelUpload);
      }
      const btnExportExcel = document.getElementById("btn-export-excel");
      if (btnExportExcel) {
        btnExportExcel.addEventListener("click", () => {
          const filteredProjects = projects.filter((p) => currentFilter === "Todos" || p.status === currentFilter);
          if (filteredProjects.length === 0) {
            alert("No hay proyectos para exportar con el filtro actual.");
            return;
          }
          const allEntries = StorageService.getAllEntries();
          const exportData = [];
          filteredProjects.forEach((project) => {
            const projectEntries = allEntries.filter((e) => e.project === project.name);
            if (projectEntries.length === 0) return;
            projectEntries.forEach((entry) => {
              const internalCost = entry.professionals ? entry.professionals.reduce((sum, pro) => sum + pro.hours * pro.rate, 0) : 0;
              const externalCost = entry.thirdPartyCosts || 0;
              const revenue = entry.revenue || 0;
              const margin = revenue - internalCost - externalCost;
              exportData.push({
                "Codigo_Proyecto": project.code,
                "Nombre_Proyecto": project.name,
                "Periodo": entry.month,
                "Jefe_Proyecto": project.manager || "",
                "Ingreso_CLP": revenue,
                "Costo_Interno_CLP": internalCost,
                "Costo_Externo_CLP": externalCost,
                "Margen_CLP": margin
              });
            });
          });
          if (exportData.length > 0) {
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Proyectos");
            XLSX.writeFile(wb, "Exportacion_Proyectos.xlsx");
          } else {
            alert("Los proyectos seleccionados no tienen registros que exportar.");
          }
        });
      }
    };
    const openNewProjectModal = () => {
      let modalContainer = document.getElementById("modal-container");
      let modalOverlay = document.getElementById("modal-overlay");
      if (!modalContainer || !modalOverlay) {
        modalOverlay = document.createElement("div");
        modalOverlay.id = "modal-overlay";
        modalContainer = document.createElement("div");
        modalContainer.id = "modal-container";
        document.body.appendChild(modalOverlay);
        document.body.appendChild(modalContainer);
      }
      modalOverlay.className = "hidden";
      modalOverlay.style.cssText = "position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000;";
      modalContainer.className = "hidden";
      modalContainer.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1001; background: transparent; width: 100%; display: flex; justify-content: center;";
      const html = `
            <div class="modal-content" style="background: white; padding: 20px; border-radius: 8px; width: 90%; max-width: 400px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h3 style="margin-bottom: 20px; color: #4f46e5;">Nuevo Proyecto</h3>
                <div class="form-group" style="margin-bottom: 15px;">
                    <label class="form-label" style="display:block; margin-bottom: 5px; font-weight: 500;">C\xF3digo de Proyecto <span style="color:red;">*</span></label>
                    <input type="text" id="new-project-code" class="form-input" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;" placeholder="Ej: PRJ-001">
                </div>
                <div class="form-group" style="margin-bottom: 15px;">
                    <label class="form-label" style="display:block; margin-bottom: 5px; font-weight: 500;">Nombre de Proyecto <span style="color:red;">*</span></label>
                    <input type="text" id="new-project-name" class="form-input" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;" placeholder="Ej: Implementaci\xF3n ERP">
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                    <button id="btn-cancel-new" class="btn-secondary" style="padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Cancelar</button>
                    <button id="btn-save-new" class="btn-primary" style="padding: 8px 16px; background: #0B8E84; color: white; border: none; border-radius: 4px; cursor: pointer;">Guardar Proyecto</button>
                </div>
            </div>
        `;
      modalContainer.innerHTML = html;
      modalContainer.classList.remove("hidden");
      modalOverlay.classList.remove("hidden");
      document.getElementById("btn-cancel-new").addEventListener("click", () => {
        modalContainer.classList.add("hidden");
        modalOverlay.classList.add("hidden");
      });
      document.getElementById("btn-save-new").addEventListener("click", async () => {
        const rawCodeInput = document.getElementById("new-project-code").value;
        const codeInput = normalizeCode(rawCodeInput);
        const rawNameInput = document.getElementById("new-project-name").value;
        const nameInput = normalizeText(rawNameInput);
        if (!codeInput) {
          alert("El C\xF3digo de Proyecto es obligatorio.");
          return;
        }
        if (!nameInput) {
          alert("El Nombre de Proyecto es obligatorio.");
          return;
        }
        const existingProject = projects.find((p) => normalizeCode(p.code) === codeInput);
        if (existingProject) {
          alert("El c\xF3digo ingresado ya est\xE1 registrado. Por favor, ingrese un c\xF3digo diferente.");
          return;
        }
        try {
          const dbProject = await ApiService.createProject({
            project_code: codeInput,
            name: nameInput,
            status: "ACTIVE"
          });
          const newProject = {
            id: String(dbProject.id),
            // Store DB id to avoid sync issues when editing status
            code: dbProject.project_code,
            name: dbProject.name,
            status: dbProject.status === "INACTIVE" ? "Finalizado" : "Activo"
          };
          StorageService.saveProject(newProject);
          projects = StorageService.getProjects();
          modalContainer.classList.add("hidden");
          modalOverlay.classList.add("hidden");
          render();
        } catch (err) {
          alert("Error al crear proyecto en servidor: " + err.message);
        }
      });
    };
    const openEditModal = (projectName) => {
      let modalContainer = document.getElementById("modal-container");
      let modalOverlay = document.getElementById("modal-overlay");
      if (!modalContainer || !modalOverlay) {
        modalOverlay = document.createElement("div");
        modalOverlay.id = "modal-overlay";
        modalContainer = document.createElement("div");
        modalContainer.id = "modal-container";
        document.body.appendChild(modalOverlay);
        document.body.appendChild(modalContainer);
      }
      modalOverlay.className = "hidden";
      modalOverlay.style.cssText = "position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000;";
      modalContainer.className = "hidden";
      modalContainer.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1001; background: transparent; width: 100%; display: flex; justify-content: center;";
      const projectEntries = StorageService.getEntriesByProject(projectName);
      if (projectEntries.length === 0) {
        alert("Este proyecto no tiene registros (Cierre de Mes) para editar.");
        return;
      }
      projectEntries.sort((a, b) => b.month.localeCompare(a.month));
      const html = `
            <div class="modal-content" style="background: white; padding: 20px; border-radius: 8px; width: 90%; max-width: 600px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h3 style="margin-bottom: 20px; color: #4f46e5;">Editar Proyecto: ${projectName}</h3>
                <div class="form-group" style="margin-bottom: 15px;">
                    <label class="form-label" style="display:block; margin-bottom: 5px; font-weight: 500;">Seleccione Periodo a Editar:</label>
                    <select id="edit-period-select" class="form-input" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                        ${projectEntries.map((e, index) => `<option value="${e.id}" ${index === 0 ? "selected" : ""}>${e.month} ${e.tipoRegistro === "PROYECCION" ? "(Proyecci\xF3n)" : "(Real)"}</option>`).join("")}
                    </select>
                </div>
                <div id="edit-form-content">
                    <!-- Formulario din\xE1mico inyectado aqu\xED -->
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                    <button id="btn-cancel-edit" class="btn-secondary" style="padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Cancelar</button>
                    <button id="btn-save-edit" class="btn-primary" style="padding: 8px 16px; background: #0B8E84; color: white; border: none; border-radius: 4px; cursor: pointer;">Guardar Cambios</button>
                </div>
            </div>
        `;
      modalContainer.innerHTML = html;
      modalContainer.classList.remove("hidden");
      modalOverlay.classList.remove("hidden");
      const selectPeriod = document.getElementById("edit-period-select");
      const fillEditForm = (entryId) => {
        const entry = projectEntries.find((e) => e.id === entryId);
        if (!entry) return;
        const isHistorical = entry.professionals && entry.professionals.length === 1 && (entry.professionals[0].name === "Carga Hist\xF3rica" || entry.professionals[0].name === "Recurso Importado");
        let professionalsHtml = "";
        if (isHistorical) {
          const totalHours = entry.professionals.reduce((sum, p) => sum + Number(p.hours), 0);
          professionalsHtml = `
                    <div class="form-group">
                        <label class="form-label">Total Horas Registradas</label>
                        <input type="number" class="form-input" value="${totalHours}" disabled style="background:#f3f4f6;">
                        <small style="color:var(--text-secondary); display:block; margin-top:4px;">Registro hist\xF3rico cerrado. Horas no editables.</small>
                    </div>
                `;
        } else {
          professionalsHtml = `
                    <div class="form-group" style="grid-column: 1 / -1;">
                        <label class="form-label">Horas de Profesionales</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 5px;">
                            ${entry.professionals.map((p, i) => `
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <span style="flex:1; font-size: 0.9em; color: #4b5563;">${p.name}</span>
                                    <input type="number" class="form-input edit-prof-hour" data-index="${i}" value="${p.hours}" style="width: 80px;" min="0">
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `;
        }
        const formHtml = `
                <div class="form-row" style="margin-top: 15px;">
                    <div class="form-group">
                        <label class="form-label">Ingreso Mensual (CLP)</label>
                        <input type="number" id="edit-revenue" class="form-input" value="${entry.revenue}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Costos de Terceros</label>
                        <input type="number" id="edit-third-costs" class="form-input" value="${entry.thirdPartyCosts}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Tipo de Registro</label>
                        <select id="edit-type-record" class="form-input">
                            <option value="REAL" ${entry.tipoRegistro !== "PROYECCION" ? "selected" : ""}>Real</option>
                            <option value="PROYECCION" ${entry.tipoRegistro === "PROYECCION" ? "selected" : ""}>Proyecci\xF3n</option>
                        </select>
                    </div>
                </div>
                <div class="form-row" style="margin-top: 10px;">
                    ${professionalsHtml}
                </div>
            `;
        document.getElementById("edit-form-content").innerHTML = formHtml;
      };
      selectPeriod.addEventListener("change", (e) => fillEditForm(e.target.value));
      fillEditForm(selectPeriod.value);
      document.getElementById("btn-cancel-edit").addEventListener("click", () => {
        modalContainer.classList.add("hidden");
        modalOverlay.classList.add("hidden");
      });
      document.getElementById("btn-save-edit").addEventListener("click", () => {
        const rawRevenue = document.getElementById("edit-revenue").value;
        const revenueNum = Number(rawRevenue);
        if (!rawRevenue || String(rawRevenue).trim() === "" || !Number.isInteger(revenueNum) || revenueNum <= 0) {
          alert("Ingreso Mensual debe ser un n\xFAmero entero positivo");
          return;
        }
        const entryId = selectPeriod.value;
        const entry = projectEntries.find((e) => e.id === entryId);
        const isHistorical = entry.professionals && entry.professionals.length === 1 && (entry.professionals[0].name === "Carga Hist\xF3rica" || entry.professionals[0].name === "Recurso Importado");
        let updatedPros = [...entry.professionals];
        if (!isHistorical) {
          const hourInputs = document.querySelectorAll(".edit-prof-hour");
          hourInputs.forEach((input) => {
            const idx = input.getAttribute("data-index");
            updatedPros[idx].hours = Number(input.value);
          });
        }
        const updatedData = {
          revenue: Number(document.getElementById("edit-revenue").value),
          thirdPartyCosts: Number(document.getElementById("edit-third-costs").value),
          tipoRegistro: document.getElementById("edit-type-record").value,
          professionals: updatedPros
        };
        try {
          StorageService.updateEntry(entryId, updatedData);
          alert("Registro actualizado exitosamente.");
          modalContainer.classList.add("hidden");
          modalOverlay.classList.add("hidden");
          const updatedEntries = StorageService.getAllEntries();
          render();
        } catch (error) {
          alert(error.message);
        }
      });
    };
    const handleExcelUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const btnImportExcel = document.getElementById("btn-import-excel");
      if (btnImportExcel) {
        btnImportExcel.innerHTML = "\u23F3 Procesando...";
        btnImportExcel.disabled = true;
      }
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          if (data.length === 0) {
            alert("El archivo Excel est\xE1 vac\xEDo.");
            return;
          }
          const firstRow = data[0];
          const required = ["Codigo_Proyecto", "Nombre_Proyecto", "Periodo", "Ingreso_CLP", "Costo_Interno_CLP", "Costo_Externo_CLP"];
          const missing = required.filter((col) => !(col in firstRow));
          if (missing.length > 0) {
            alert("Faltan columnas obligatorias: " + missing.join(", "));
            return;
          }
          let loadedReal = 0;
          let loadedProj = 0;
          let errorCount = 0;
          let errors = [];
          const currentProjects = StorageService.getProjects();
          const allEntries = StorageService.getAllEntries();
          const processedRows = /* @__PURE__ */ new Set();
          for (let index = 0; index < data.length; index++) {
            const row = data[index];
            const rawCode = String(row["Codigo_Proyecto"] || "");
            const rowCode = normalizeCode(rawCode);
            const rowName = normalizeText(row["Nombre_Proyecto"]);
            const rowManager = normalizeText(row["Jefe_Proyecto"]);
            const rowStatus = "Activo";
            const rowPeriod = row["Periodo"];
            const statusKey = Object.keys(row).find((k) => String(k).trim().toLowerCase() === "status");
            const rawStatus = statusKey ? row[statusKey] : "";
            if (!rawStatus || String(rawStatus).trim() === "") {
              errorCount++;
              errors.push(`Fila ${index + 2}: La columna "Status" es obligatoria.`);
              continue;
            }
            let importStatus = String(rawStatus).trim().toUpperCase();
            importStatus = importStatus.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (!rowCode || !rowName) {
              errorCount++;
              errors.push(`Fila ${index + 2}: Codigo_Proyecto y Nombre_Proyecto no pueden estar vac\xEDos.`);
              continue;
            }
            if (importStatus !== "REAL" && importStatus !== "PROYECCION") {
              errorCount++;
              errors.push(`Fila ${index + 2}: Status inv\xE1lido "${row[statusKey]}". Debe ser REAL o PROYECCION.`);
              continue;
            }
            const parsedPeriod = parsePeriodToMmmYy(rowPeriod);
            if (!parsedPeriod) {
              errorCount++;
              errors.push(`Fila ${index + 2}: Periodo inv\xE1lido o faltante (${rowPeriod || "vac\xEDo"}). Debe ser formato mmm-yy.`);
              continue;
            }
            const rowRevenue = Number(row["Ingreso_CLP"]);
            const rowInternalCost = Number(row["Costo_Interno_CLP"]);
            const rowExternalCost = Number(row["Costo_Externo_CLP"]);
            if (isNaN(rowRevenue) || isNaN(rowInternalCost) || isNaN(rowExternalCost)) {
              errorCount++;
              errors.push(`Fila ${index + 2}: Ingreso_CLP, Costo_Interno_CLP y Costo_Externo_CLP deben ser num\xE9ricos.`);
              continue;
            }
            if (rowRevenue < 0 || rowInternalCost < 0 || rowExternalCost < 0) {
              errorCount++;
              errors.push(`Fila ${index + 2}: No se permiten montos negativos.`);
              continue;
            }
            const uniqueKey = `${rowCode}_${parsedPeriod}_${importStatus}`;
            if (processedRows.has(uniqueKey)) {
              errorCount++;
              errors.push(`Fila ${index + 2}: Registro duplicado: ya existe un proyecto con el mismo C\xF3digo, Periodo y Status`);
              continue;
            }
            processedRows.add(uniqueKey);
            let project = currentProjects.find((p) => normalizeCode(p.code) === rowCode);
            if (!project) {
              try {
                const newProject = await ApiService.createProject({
                  project_code: rowCode,
                  name: rowName,
                  manager: rowManager,
                  status: rowStatus === "Activo" ? "ACTIVE" : "INACTIVE"
                });
                project = {
                  id: String(newProject.id),
                  code: newProject.project_code,
                  name: newProject.name,
                  manager: newProject.manager,
                  status: newProject.status === "INACTIVE" ? "Finalizado" : "Activo"
                };
                StorageService.saveProject(project);
                currentProjects.push(project);
              } catch (err) {
                errorCount++;
                errors.push(`Fila ${index + 2}: Error creando proyecto - ${err.message}`);
                continue;
              }
            }
            const existingEntryDuplicate = allEntries.some((e2) => {
              const pObj = currentProjects.find((cp) => cp.name === e2.project);
              const eCode = pObj ? normalizeCode(pObj.code) : "";
              return eCode === rowCode && e2.month === parsedPeriod && (e2.tipoRegistro || "REAL") === importStatus;
            });
            if (existingEntryDuplicate) {
              errorCount++;
              errors.push(`Fila ${index + 2}: Registro duplicado: ya existe un proyecto con el mismo C\xF3digo, Periodo y Status`);
              continue;
            }
            if (importStatus === "REAL") {
              loadedReal++;
            } else if (importStatus === "PROYECCION") {
              loadedProj++;
            }
            const mockProfessional = {
              name: "Carga Hist\xF3rica",
              hours: 1,
              rate: rowInternalCost
            };
            try {
              await ApiService.createResource({ resource_name: "Carga Hist\xF3rica", role: "Gen\xE9rico" });
              const entryData = {
                projectCode: rowCode,
                month: parsedPeriod,
                revenue: rowRevenue,
                thirdPartyCosts: rowExternalCost,
                tipoRegistro: importStatus,
                professionals: [mockProfessional]
              };
              const savedEntry = await ApiService.saveEntry(entryData);
              allEntries.push(savedEntry);
            } catch (err) {
              errorCount++;
              errors.push(`Fila ${index + 2}: Error guardando registro - ${err.message}`);
            }
          }
          e.target.value = "";
          let message = `Importaci\xF3n Finalizada:
\u2714\uFE0F Cargados: ${loadedReal} REAL | ${loadedProj} PROYECCION
\u274C ${errorCount} errores.`;
          if (errors.length > 0) {
            message += `

Detalles de errores:
` + errors.slice(0, 5).join("\n");
            if (errors.length > 5) message += `
...y ${errors.length - 5} m\xE1s.`;
          } else {
            message = "Registro ingresado correctamente.\n\n" + message;
          }
          alert(message);
          projects = StorageService.getProjects();
          render();
        } catch (err) {
          console.error(err);
          alert("Ocurri\xF3 un error al procesar el archivo Excel: " + err.message);
        } finally {
          const btnImportExcelInner = document.getElementById("btn-import-excel");
          if (btnImportExcelInner) {
            btnImportExcelInner.innerHTML = "\u2B07\uFE0F Importar Excel";
            btnImportExcelInner.disabled = false;
          }
        }
      };
      reader.readAsBinaryString(file);
    };
    render();
  }

  // src/components/resources-view.js
  async function renderResources(container) {
    container.innerHTML = '<div style="padding:20px; text-align:center;">Cargando datos desde el servidor...</div>';
    try {
      const ratesResult = await ApiService.getAllRates();
      const mappedPros = ratesResult.map((rr) => ({
        id: String(rr.resource_id),
        name: rr.resource_name,
        period: rr.period,
        directRate: Number(rr.direct_rate) || 0,
        indirectRate: Number(rr.indirect_rate) || 0
      }));
      StorageService.saveProfessionalsBulk(mappedPros);
    } catch (err) {
      console.error("Error al sincronizar profesionales con el servidor:", err);
    }
    let professionals = StorageService.getProfessionals();
    let currentViewMode = "plana";
    let expandedGroups = /* @__PURE__ */ new Set();
    const MONTHS_ORDER = {
      "ene": 0,
      "feb": 1,
      "mar": 2,
      "abr": 3,
      "may": 4,
      "jun": 5,
      "jul": 6,
      "ago": 7,
      "sep": 8,
      "oct": 9,
      "nov": 10,
      "dic": 11
    };
    const getPeriodValue = (period) => {
      if (!period) return 0;
      const parts = period.split("-");
      if (parts.length === 2 && MONTHS_ORDER[parts[0]] !== void 0) {
        return parseInt(parts[1]) * 12 + MONTHS_ORDER[parts[0]];
      }
      return 0;
    };
    const render = () => {
      const html = `
            <div class="projects-container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <h2 style="margin: 0; color: #111827;">Maestro de Profesionales</h2>
                        <div style="display: flex; gap: 10px; align-items: center; margin-left: 20px; border-left: 1px solid #e5e7eb; padding-left: 20px;">
                            <label for="view-mode-select" style="font-weight: 500; font-size: 0.95em; color: #4b5563;">Filtro por:</label>
                            <select id="view-mode-select" class="form-input" style="width: auto; padding: 6px 12px;">
                                <option value="plana" ${currentViewMode === "plana" ? "selected" : ""}>Vista Completa</option>
                                <option value="mensual" ${currentViewMode === "mensual" ? "selected" : ""}>Agrupar por Periodo</option>
                            </select>
                            ${currentViewMode === "mensual" ? `
                                <button id="btn-expand-all" class="btn-secondary" style="padding: 6px 12px; margin-left: 10px;">Expandir todo</button>
                                <button id="btn-collapse-all" class="btn-secondary" style="padding: 6px 12px;">Contraer todo</button>
                            ` : ""}
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <input type="file" id="excel-upload" accept=".xlsx, .xls" style="display: none;" />
                        <button id="btn-import-excel" class="btn-secondary">\u{1F4E4} Importar Excel</button>
                        <button id="btn-new-pro" class="btn-primary">+ Nuevo Profesional</button>
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
                            ${(() => {
        if (professionals.length === 0) {
          return '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #6b7280;">No hay profesionales registrados. Use "Nuevo Profesional" o "Importar Excel".</td></tr>';
        }
        if (currentViewMode === "plana") {
          return professionals.map((p) => {
            const beRate = Number(p.directRate) + Number(p.indirectRate);
            return `
                                            <tr style="border-bottom: 1px solid #e5e7eb;">
                                                <td style="padding: 12px;">${p.name}</td>
                                                <td style="padding: 12px;">${formatPeriod(p.period)}</td>
                                                <td style="padding: 12px; text-align: right;">${formatCurrency(p.directRate)}</td>
                                                <td style="padding: 12px; text-align: right;">${formatCurrency(p.indirectRate)}</td>
                                                <td style="padding: 12px; text-align: right;"><strong>${formatCurrency(beRate)}</strong></td>
                                                <td style="padding: 12px; text-align: center;">
                                                    <button class="btn-edit-pro" data-id="${p.id}" data-period="${p.period}" style="background: none; border: none; cursor: pointer; font-size: 1.2rem;" title="Editar Profesional">\u270F\uFE0F</button>
                                                    <button class="btn-delete-pro" data-id="${p.id}" data-period="${p.period}" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; color: #dc2626;" title="Eliminar Profesional">\u{1F5D1}\uFE0F</button>
                                                </td>
                                            </tr>
                                        `;
          }).join("");
        }
        if (currentViewMode === "mensual") {
          const groups = {};
          professionals.forEach((p) => {
            const key = p.period || "Sin Periodo";
            if (!groups[key]) groups[key] = [];
            groups[key].push(p);
          });
          const sortedKeys = Object.keys(groups).sort((a, b) => getPeriodValue(b) - getPeriodValue(a));
          let html2 = "";
          sortedKeys.forEach((key) => {
            const groupPros = groups[key];
            groupPros.sort((a, b) => String(a.name).localeCompare(String(b.name)));
            const isExpanded = expandedGroups.has(key);
            const arrowIcon = isExpanded ? "\u25BC" : "\u25B6";
            html2 += `
                                            <tr class="group-header" data-period="${key}" style="background: #f9fafb; border-bottom: 2px solid #e5e7eb; cursor: pointer; transition: background 0.2s;">
                                                <td colspan="6" style="padding: 12px; color: #374151;">
                                                    <span style="display: inline-block; width: 24px; text-align: center; color: #6b7280; font-size: 0.85em; font-family: monospace;">${arrowIcon}</span>
                                                    <strong style="text-transform: uppercase;">${formatPeriod(key)}</strong>
                                                    <span style="margin-left: 10px; font-weight: normal; color: #6b7280; font-size: 0.9em;">- ${groupPros.length} Profesional${groupPros.length !== 1 ? "es" : ""}</span>
                                                </td>
                                            </tr>
                                        `;
            if (isExpanded) {
              html2 += groupPros.map((p) => {
                const beRate = Number(p.directRate) + Number(p.indirectRate);
                return `
                                                    <tr style="border-bottom: 1px solid #e5e7eb;">
                                                        <td style="padding: 12px; padding-left: 40px;">${p.name}</td>
                                                        <td style="padding: 12px;">${formatPeriod(p.period)}</td>
                                                        <td style="padding: 12px; text-align: right;">${formatCurrency(p.directRate)}</td>
                                                        <td style="padding: 12px; text-align: right;">${formatCurrency(p.indirectRate)}</td>
                                                        <td style="padding: 12px; text-align: right;"><strong>${formatCurrency(beRate)}</strong></td>
                                                        <td style="padding: 12px; text-align: center;">
                                                            <button class="btn-edit-pro" data-id="${p.id}" data-period="${p.period}" style="background: none; border: none; cursor: pointer; font-size: 1.2rem;" title="Editar Profesional">\u270F\uFE0F</button>
                                                            <button class="btn-delete-pro" data-id="${p.id}" data-period="${p.period}" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; color: #dc2626;" title="Eliminar Profesional">\u{1F5D1}\uFE0F</button>
                                                        </td>
                                                    </tr>
                                                `;
              }).join("");
            }
          });
          return html2;
        }
      })()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
      container.innerHTML = html;
      attachEvents();
    };
    const attachEvents = () => {
      const viewModeSelect = document.getElementById("view-mode-select");
      if (viewModeSelect) {
        viewModeSelect.addEventListener("change", (e) => {
          currentViewMode = e.target.value;
          render();
        });
      }
      const btnExpandAll = document.getElementById("btn-expand-all");
      if (btnExpandAll) {
        btnExpandAll.addEventListener("click", () => {
          const uniquePeriods = new Set(professionals.map((p) => p.period || "Sin Periodo"));
          expandedGroups = uniquePeriods;
          render();
        });
      }
      const btnCollapseAll = document.getElementById("btn-collapse-all");
      if (btnCollapseAll) {
        btnCollapseAll.addEventListener("click", () => {
          expandedGroups.clear();
          render();
        });
      }
      const groupHeaders = document.querySelectorAll(".group-header");
      groupHeaders.forEach((header) => {
        header.addEventListener("click", (e) => {
          const period = e.currentTarget.getAttribute("data-period");
          if (expandedGroups.has(period)) {
            expandedGroups.delete(period);
          } else {
            expandedGroups.add(period);
          }
          render();
        });
        header.addEventListener("mouseenter", () => header.style.background = "#f3f4f6");
        header.addEventListener("mouseleave", () => header.style.background = "#f9fafb");
      });
      const btnNew = document.getElementById("btn-new-pro");
      if (btnNew) {
        btnNew.addEventListener("click", async () => {
          const name = prompt("Nombre del profesional:");
          if (!name) return;
          let period = prompt("Periodo (Ej: ene-25):");
          if (!period) return;
          const parsedPeriod = parsePeriodToMmmYy(period);
          if (!parsedPeriod) {
            alert("Formato de periodo inv\xE1lido. Debe ser mmm-yy (ej: ene-25).");
            return;
          }
          period = parsedPeriod;
          const directRate = prompt("Tarifa Directa (CLP):");
          if (!directRate || isNaN(directRate)) return;
          const indirectRate = prompt("Tarifa Indirecta (CLP):");
          if (!indirectRate || isNaN(indirectRate)) return;
          const exists = professionals.some((p) => String(p.name).trim() === name.trim() && String(p.period).trim() === period.trim());
          if (exists) {
            alert("Registro duplicado: ya existe un profesional con el mismo Nombre en ese Periodo");
            return;
          }
          try {
            const dbResource = await ApiService.createResource({ resource_name: name.trim(), role: "Profesional" });
            await ApiService.saveRates(period.trim(), [{
              resourceName: dbResource.resource_name,
              directRate: Number(directRate),
              indirectRate: Number(indirectRate)
            }]);
            StorageService.saveProfessional({
              id: String(dbResource.id),
              name: dbResource.resource_name,
              period: period.trim(),
              directRate: Number(directRate),
              indirectRate: Number(indirectRate)
            });
            alert("Registro ingresado correctamente");
            professionals = StorageService.getProfessionals();
            render();
          } catch (err) {
            alert("Error al guardar en el servidor: " + err.message);
          }
        });
      }
      const btnImport = document.getElementById("btn-import-excel");
      const fileInput = document.getElementById("excel-upload");
      if (btnImport && fileInput) {
        btnImport.addEventListener("click", () => {
          fileInput.click();
        });
        fileInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const btnImportExcel = document.getElementById("btn-import-excel");
          if (btnImportExcel) {
            btnImportExcel.innerHTML = "\u23F3 Procesando...";
            btnImportExcel.disabled = true;
          }
          const reader = new FileReader();
          reader.onload = async function(evt) {
            try {
              const data = evt.target.result;
              const workbook = XLSX.read(data, { type: "binary" });
              const firstSheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[firstSheetName];
              const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
              if (json.length > 1) {
                const newPros = [];
                let hasDuplicate = false;
                for (let i = 1; i < json.length; i++) {
                  const row = json[i];
                  if (row && row.length >= 4 && row[0] && row[1]) {
                    const rawName = String(row[0]).trim();
                    const rawPeriod = String(row[1]).trim();
                    const parsedPeriod = parsePeriodToMmmYy(rawPeriod);
                    if (parsedPeriod) {
                      const isDuplicateInFile = newPros.some((p) => p.name === rawName && p.period === parsedPeriod);
                      const isDuplicateInDB = professionals.some((p) => p.name === rawName && p.period === parsedPeriod);
                      if (isDuplicateInFile || isDuplicateInDB) {
                        alert(`Fila ${i + 1}: Registro duplicado: ya existe un profesional con el mismo Nombre en ese Periodo`);
                        hasDuplicate = true;
                        break;
                      }
                      newPros.push({
                        name: rawName,
                        period: parsedPeriod,
                        directRate: Number(row[2]) || 0,
                        indirectRate: Number(row[3]) || 0
                      });
                    }
                  }
                }
                if (hasDuplicate) {
                  fileInput.value = "";
                  return;
                }
                if (newPros.length > 0) {
                  try {
                    const mappedPros = [];
                    for (const pro of newPros) {
                      const dbResource = await ApiService.createResource({ resource_name: pro.name, role: "Profesional" });
                      await ApiService.saveRates(pro.period, [{
                        resourceName: dbResource.resource_name,
                        directRate: pro.directRate,
                        indirectRate: pro.indirectRate
                      }]);
                      mappedPros.push({
                        id: String(dbResource.id),
                        name: dbResource.resource_name,
                        period: pro.period,
                        directRate: pro.directRate,
                        indirectRate: pro.indirectRate
                      });
                    }
                    StorageService.saveProfessionalsBulk(mappedPros);
                    alert(`Registro ingresado correctamente.
Se cargaron/actualizaron ${newPros.length} profesionales exitosamente.`);
                    professionals = StorageService.getProfessionals();
                    render();
                  } catch (apiErr) {
                    alert("Error al guardar en base de datos: " + apiErr.message);
                  }
                } else {
                  alert("No se encontraron filas v\xE1lidas en el Excel. Formato esperado: Nombre, Periodo, Tarifa Directa, Tarifa Indirecta.");
                }
              }
            } catch (err) {
              alert("Error al leer el archivo Excel: " + err.message);
            } finally {
              if (btnImportExcel) {
                btnImportExcel.innerHTML = "\u{1F4E4} Importar Excel";
                btnImportExcel.disabled = false;
              }
            }
            fileInput.value = "";
          };
          reader.readAsBinaryString(file);
        });
      }
      const editBtns = document.querySelectorAll(".btn-edit-pro");
      editBtns.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.closest("button").dataset.id;
          const srcPeriod = e.target.closest("button").dataset.period;
          const matchPeriod = srcPeriod === "undefined" || srcPeriod === "null" ? null : srcPeriod;
          const pro = professionals.find((p) => p.id === id && (p.period === matchPeriod || String(p.period) === String(matchPeriod)));
          if (!pro) return;
          const newName = prompt("Nombre del profesional:", pro.name);
          if (newName === null) return;
          let newPeriod = prompt("Periodo (Ej: ene-25):", formatPeriod(pro.period));
          if (newPeriod === null) return;
          const parsedPeriod = parsePeriodToMmmYy(newPeriod);
          if (!parsedPeriod && newPeriod.trim() !== "") {
            alert("Formato de periodo inv\xE1lido. Debe ser mmm-yy (ej: ene-25).");
            return;
          } else if (!parsedPeriod) {
            return;
          }
          const newDirectRate = prompt("Tarifa Directa (CLP):", pro.directRate);
          if (newDirectRate === null || isNaN(newDirectRate) || newDirectRate.trim() === "") return;
          const newIndirectRate = prompt("Tarifa Indirecta (CLP):", pro.indirectRate);
          if (newIndirectRate === null || isNaN(newIndirectRate) || newIndirectRate.trim() === "") return;
          const exists = professionals.some((p) => p.id !== pro.id && String(p.name).trim() === newName.trim() && p.period === parsedPeriod);
          if (exists) {
            alert("Registro duplicado: ya existe un profesional con el mismo Nombre en ese Periodo");
            return;
          }
          try {
            if (newName.trim() !== pro.name) {
              await ApiService.updateResource(pro.id, { resource_name: newName.trim() });
            }
            if (parsedPeriod !== pro.period) {
              await ApiService.saveRates(parsedPeriod, [{
                resourceName: newName.trim(),
                directRate: Number(newDirectRate),
                indirectRate: Number(newIndirectRate)
              }]);
              await ApiService.deleteRate(pro.id, pro.period);
            } else {
              await ApiService.saveRates(parsedPeriod, [{
                resourceName: newName.trim(),
                directRate: Number(newDirectRate),
                indirectRate: Number(newIndirectRate)
              }]);
            }
            alert("Registro Actualizado en BD (Azure).");
            const ratesResult = await ApiService.getAllRates();
            const mappedPros = ratesResult.map((rr) => ({
              id: String(rr.resource_id),
              name: rr.resource_name,
              period: rr.period,
              directRate: Number(rr.direct_rate) || 0,
              indirectRate: Number(rr.indirect_rate) || 0
            }));
            StorageService.saveProfessionalsBulk(mappedPros);
            professionals = StorageService.getProfessionals();
            render();
          } catch (err) {
            alert("Error guardando en Azure: " + err.message);
          }
        });
      });
      const deleteBtns = document.querySelectorAll(".btn-delete-pro");
      deleteBtns.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.closest("button").dataset.id;
          const period = e.target.closest("button").dataset.period;
          if (!period || period === "undefined" || period === "null") {
            if (confirm(`El profesional no tiene una tarifa o un periodo v\xE1lido. \xBFDeseas eliminar al profesional por completo del sistema (Nivel Base)?`)) {
              try {
                await ApiService.deleteResourceBase(id);
                alert("Profesional eliminado completamente del sistema.");
                const ratesResult = await ApiService.getAllRates();
                const mappedPros = ratesResult.map((rr) => ({
                  id: String(rr.resource_id),
                  name: rr.resource_name,
                  period: rr.period,
                  directRate: Number(rr.direct_rate) || 0,
                  indirectRate: Number(rr.indirect_rate) || 0
                }));
                StorageService.saveProfessionalsBulk(mappedPros);
                professionals = StorageService.getProfessionals();
                render();
              } catch (err) {
                alert("Error al borrar desde Nivel Base: " + err.message);
              }
            }
            return;
          }
          const cleanPeriod = period.trim();
          if (confirm(`\xBFEst\xE1s seguro de eliminar este profesional para el periodo ${cleanPeriod}?`)) {
            try {
              await ApiService.deleteRate(id, cleanPeriod);
              alert("Operaci\xF3n validada en Azure. Registro eliminado.");
              const ratesResult = await ApiService.getAllRates();
              const mappedPros = ratesResult.map((rr) => ({
                id: String(rr.resource_id),
                name: rr.resource_name,
                period: rr.period,
                directRate: Number(rr.direct_rate) || 0,
                indirectRate: Number(rr.indirect_rate) || 0
              }));
              StorageService.saveProfessionalsBulk(mappedPros);
              professionals = StorageService.getProfessionals();
              render();
            } catch (err) {
              alert("Error al borrar en Azure: " + err.message);
            }
          }
        });
      });
    };
    render();
  }

  // src/services/auth.js
  var AUTH_KEY = "pmo_auth_user_v1";
  var USERS_KEY = "pmo_users_v1";
  var MOCK_USERS = [
    {
      email: "admin@pmo.com",
      password: "admin",
      name: "Admin",
      role: "Administrador"
    },
    {
      email: "user@pmo.com",
      password: "user",
      name: "Analista PMO",
      role: "Analista"
    }
  ];
  var AuthService = {
    init: () => {
      if (!sessionStorage.getItem(USERS_KEY)) {
        sessionStorage.setItem(USERS_KEY, JSON.stringify(MOCK_USERS));
      }
    },
    login: (email, password) => {
      const users = JSON.parse(sessionStorage.getItem(USERS_KEY)) || [];
      const user = users.find((u) => u.email === email && u.password === password);
      if (user) {
        const { password: _, ...userWithoutPass } = user;
        sessionStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPass));
        return userWithoutPass;
      }
      throw new Error("Credenciales incorrectas");
    },
    logout: () => {
      sessionStorage.removeItem(AUTH_KEY);
    },
    getCurrentUser: () => {
      const userStr = sessionStorage.getItem(AUTH_KEY);
      return userStr ? JSON.parse(userStr) : null;
    },
    recoverPassword: (email) => {
      const users = JSON.parse(sessionStorage.getItem(USERS_KEY)) || [];
      const exists = users.some((u) => u.email === email);
      if (exists) {
        return Promise.resolve(true);
      }
      return Promise.reject(new Error("El correo ingresado no est\xE1 registrado"));
    }
  };

  // src/app.js
  var App = class {
    constructor() {
      this.container = document.getElementById("content-area");
      this.navBtns = document.querySelectorAll(".nav-btn");
      this.init();
    }
    init() {
      const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      document.getElementById("current-date").textContent = (/* @__PURE__ */ new Date()).toLocaleDateString("es-ES", dateOptions);
      const mobileMenuBtn = document.getElementById("mobile-menu-btn");
      const sidebar = document.querySelector(".sidebar");
      const sidebarOverlay = document.getElementById("sidebar-overlay");
      if (mobileMenuBtn && sidebar && sidebarOverlay) {
        mobileMenuBtn.addEventListener("click", () => {
          sidebar.classList.add("open");
          sidebarOverlay.classList.remove("hidden");
        });
        sidebarOverlay.addEventListener("click", () => {
          sidebar.classList.remove("open");
          sidebarOverlay.classList.add("hidden");
        });
      }
      this.navBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const view = btn.dataset.view;
          this.navigate(view);
          this.navBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          if (sidebar) sidebar.classList.remove("open");
          if (sidebarOverlay) sidebarOverlay.classList.add("hidden");
        });
      });
      const btnNewEntry = document.getElementById("btn-new-entry");
      if (btnNewEntry) {
        btnNewEntry.addEventListener("click", () => {
          this.navigate("entry");
          this.navBtns.forEach((b) => b.classList.remove("active"));
          document.querySelector('[data-view="entry"]')?.classList.add("active");
        });
      }
      this.navigate("dashboard");
    }
    navigate(view) {
      this.container.innerHTML = "";
      const title = document.getElementById("page-title");
      switch (view) {
        case "dashboard":
          title.textContent = "Dashboard Ejecutivo";
          renderDashboard(this.container);
          break;
        case "entry":
          title.textContent = "Ingreso de Datos Operacionales";
          renderEntryForm(this.container);
          break;
        case "projects":
          title.textContent = "Gesti\xF3n de Proyectos";
          renderProjects(this.container);
          break;
        case "resources":
          title.textContent = "Maestro de Profesionales";
          renderResources(this.container);
          break;
        default:
          renderDashboard(this.container);
      }
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    AuthService.init();
    const loginContainer = document.getElementById("login-container");
    const mainAppContainer = document.getElementById("main-app-container");
    const loginForm = document.getElementById("login-form");
    const logoutBtn = document.getElementById("btn-logout");
    const forgotPasswordLink = document.getElementById("forgot-password");
    const startInactivityTimer = () => {
      let timeout;
      const TIMEOUT_MS = 5 * 60 * 1e3;
      const resetTimer = () => {
        clearTimeout(timeout);
        if (AuthService.getCurrentUser()) {
          timeout = setTimeout(() => {
            AuthService.logout();
            alert("Por tu seguridad, tu sesi\xF3n ha expirado por inactividad.");
            window.location.reload();
          }, TIMEOUT_MS);
        }
      };
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("click", resetTimer);
      window.addEventListener("scroll", resetTimer);
      window.addEventListener("touchstart", resetTimer);
      resetTimer();
    };
    const updateProfileUI = (user) => {
      if (!user) return;
      document.getElementById("user-display-name").textContent = user.name;
      document.getElementById("user-display-role").textContent = user.role;
      let initials = user.name.substring(0, 2).toUpperCase();
      if (user.name === "Admin") initials = "ADM";
      document.getElementById("user-avatar-initials").textContent = initials;
    };
    const checkSession = () => {
      const user = AuthService.getCurrentUser();
      if (user) {
        loginContainer.classList.add("hidden");
        mainAppContainer.classList.remove("hidden");
        updateProfileUI(user);
        new App();
        startInactivityTimer();
      } else {
        loginContainer.classList.remove("hidden");
        mainAppContainer.classList.add("hidden");
      }
    };
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;
      try {
        const user = AuthService.login(email, password);
        if (user) {
          checkSession();
          loginForm.reset();
        }
      } catch (error) {
        alert(error.message);
      }
    });
    logoutBtn.addEventListener("click", () => {
      AuthService.logout();
      window.location.reload();
    });
    forgotPasswordLink.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = prompt("Ingrese su correo electr\xF3nico para recuperar la contrase\xF1a:");
      if (email) {
        try {
          await AuthService.recoverPassword(email);
          alert("Se ha enviado un enlace de recuperaci\xF3n a su correo (Simulado).");
        } catch (error) {
          alert(error.message);
        }
      }
    });
    checkSession();
  });
})();
