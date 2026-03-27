const STORAGE_KEY = "forge-liquidity-demo-v1";
const NAV_ITEMS = [
  { id: "dashboard", title: "Panel", caption: "Caja y colateral" },
  { id: "inventory", title: "Inventario", caption: "Repuestos quietos" },
  { id: "capacity", title: "Capacidad", caption: "Horas y facturas" },
  { id: "wallet", title: "Wallet", caption: "Adelantos y pagos" },
  { id: "stellar", title: "Stellar", caption: "Rail on-chain" },
];

const currency0 = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const currency2 = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const number0 = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const percent0 = new Intl.NumberFormat("es-AR", {
  style: "percent",
  maximumFractionDigits: 0,
});
const dateFormat = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
});

const elements = {
  desktopNav: document.getElementById("desktop-nav"),
  mobileNav: document.getElementById("mobile-nav"),
  dashboard: document.getElementById("dashboard-content"),
  inventory: document.getElementById("inventory-content"),
  capacity: document.getElementById("capacity-content"),
  wallet: document.getElementById("wallet-content"),
  stellar: document.getElementById("stellar-content"),
  headerLiquidity: document.getElementById("header-liquidity"),
  statusPill: document.getElementById("status-pill"),
  toast: document.getElementById("toast"),
  recommendationTitle: document.getElementById("sidebar-recommendation-title"),
  recommendationCopy: document.getElementById("sidebar-recommendation-copy"),
};

let toastTimer = null;
let state = loadState();

renderAll();

document.addEventListener("click", handleClick);
document.addEventListener("input", handleInput);
document.addEventListener("change", handleChange);
document.addEventListener("submit", handleSubmit);

function loadState() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return buildSeedState();
    }

    const parsed = JSON.parse(stored);
    return hydrateState(parsed);
  } catch (error) {
    console.warn("No se pudo leer el estado guardado:", error);
    return buildSeedState();
  }
}

function hydrateState(parsed) {
  const seed = buildSeedState();
  return {
    ...seed,
    ...parsed,
    ui: {
      ...seed.ui,
      ...(parsed.ui || {}),
    },
    profile: {
      ...seed.profile,
      ...(parsed.profile || {}),
    },
    inventory: Array.isArray(parsed.inventory) ? parsed.inventory : seed.inventory,
    labor: Array.isArray(parsed.labor) ? parsed.labor : seed.labor,
    invoices: Array.isArray(parsed.invoices) ? parsed.invoices : seed.invoices,
    transactions: Array.isArray(parsed.transactions) ? parsed.transactions : seed.transactions,
    stellar: {
      ...seed.stellar,
      ...(parsed.stellar || {}),
      events: Array.isArray(parsed?.stellar?.events) ? parsed.stellar.events : seed.stellar.events,
    },
    trend: Array.isArray(parsed.trend) && parsed.trend.length ? parsed.trend : seed.trend,
  };
}

function buildSeedState() {
  return {
    ui: {
      activeView: "dashboard",
      inventorySearch: "",
      inventoryStatus: "all",
      drawAmount: 2400,
      repayAmount: 900,
      transactionsFilter: "all",
      stellarTransferAmount: 650,
    },
    profile: {
      walletBalance: 42800,
      outstandingAdvance: 1867,
      facilityLimit: 45000,
      weeklyBurn: 10300,
      utilization: 0.68,
      trustRating: "AA+",
      city: "Buenos Aires",
      payrollDate: "2026-04-02",
    },
    trend: [9400, 10600, 11800, 12700, 12100, 13400, 14400, 13850, 15200],
    inventory: [
      {
        id: "inv-7729",
        sku: "SKU-7729",
        name: "Embrague",
        subtitle: "Fiat Chronos",
        estimatedValue: 1250,
        advanceRate: 0.72,
        daysIdle: 214,
        status: "tokenized",
        tone: "cyan",
        code: "G82",
        note: "Pieza sana, mediana en rotacion pero facil de valuar.",
      },
      {
        id: "inv-4401",
        sku: "SKU-4401",
        name: "Sensores de Oxigeno",
        subtitle: "Bosch / Componente universal",
        estimatedValue: 345.5,
        advanceRate: 0.65,
        daysIdle: 96,
        status: "tokenized",
        tone: "amber",
        code: "O2",
        note: "Buena salida unitaria, bajo ticket.",
      },
      {
        id: "inv-9022",
        sku: "SKU-9022",
        name: "Luces Led H4",
        subtitle: "Lux Led/ Componente Universal",
        estimatedValue: 50,
        advanceRate: 0.6,
        daysIdle: 64,
        status: "available",
        tone: "lime",
        code: "LED",
        note: "Ticket alto, ideal para ampliar margen de maniobra.",
      },
      {
        id: "inv-1185",
        sku: "SKU-1185",
        name: "Aceite Sintetico 10w40",
        subtitle: "Castrol / Componente critico",
        estimatedValue: 890,
        advanceRate: 0.68,
        daysIdle: 188,
        status: "tokenized",
        tone: "cyan",
        code: "DSG",
        note: "En pool desde hace 12 dias, sigue libre para seguir cubriendo linea.",
      },
      {
        id: "inv-5833",
        sku: "SKU-5833",
        name: "Turbo Cartridge",
        subtitle: "Ford Ranger / diesel",
        estimatedValue: 1680,
        advanceRate: 0.66,
        daysIdle: 117,
        status: "tokenized",
        tone: "amber",
        code: "TUR",
        note: "Margen estable y valuacion sencilla.",
      },
      {
        id: "inv-2197",
        sku: "SKU-2197",
        name: "Computadora / ECU",
        subtitle: "Toyota Corolla / EPS",
        estimatedValue: 2240,
        advanceRate: 0.71,
        daysIdle: 74,
        status: "available",
        tone: "lime",
        code: "EPS",
        note: "Repuesto premium con alto potencial de adelanto.",
      },
    ],
    labor: [
      {
        id: "lab-032",
        sku: "CAP-032",
        name: "Modulo de calibracion ADAS",
        subtitle: "32 horas reservables",
        estimatedValue: 3200,
        advanceRate: 0.6,
        hours: 32,
        utilization: 0.76,
        status: "tokenized",
        tone: "cyan",
        code: "ADAS",
        note: "Reservas firmes para los proximos 18 dias.",
      },
      {
        id: "lab-048",
        sku: "CAP-048",
        name: "Alineacion Y Balanceo",
        subtitle: "5 horas comprometidas",
        estimatedValue: 2800,
        advanceRate: 0.58,
        hours: 24,
        utilization: 0.64,
        status: "available",
        tone: "lime",
        code: "FLT",
        note: "Trabajo repetitivo, flujo previsible.",
      },
      {
        id: "lab-071",
        sku: "CAP-071",
        name: "Reprogramacion (Stage)",
        subtitle: "40 horas cotizadas",
        estimatedValue: 4100,
        advanceRate: 0.55,
        hours: 40,
        utilization: 0.83,
        status: "tokenized",
        tone: "amber",
        code: "ENG",
        note: "Tarea compleja con muy buena visibilidad de cobro.",
      },
      {
        id: "lab-015",
        sku: "CAP-015",
        name: "Diagnostico rapido",
        subtitle: "16 horas premium",
        estimatedValue: 2400,
        advanceRate: 0.6,
        hours: 16,
        utilization: 0.71,
        status: "tokenized",
        tone: "cyan",
        code: "FAST",
        note: "Usado para descomprimir caja chica en semanas de pico.",
      },
    ],
    invoices: [
      {
        id: "ar-441",
        sku: "#441",
        name: "Reparacion integral de motor Perkins",
        subtitle: "Agro Delta SRL",
        estimatedValue: 3200,
        advanceRate: 0.82,
        dueInDays: 18,
        status: "tokenized",
        tone: "cyan",
        code: "441",
        note: "Cliente historico con comportamiento de pago sano.",
      },
      {
        id: "ar-538",
        sku: "#538",
        name: "Reparaciones por Aseguradora",
        subtitle: "Aseguradora Sur",
        estimatedValue: 4800,
        advanceRate: 0.82,
        dueInDays: 31,
        status: "tokenized",
        tone: "amber",
        code: "538",
        note: "Factura pesada, buena candidata para sostener linea activa.",
      },
      {
        id: "ar-551",
        sku: "#551",
        name: "Cambio de Aceite, filtro, agua y distribucion",
        subtitle: "Logistica Nexo",
        estimatedValue: 2600,
        advanceRate: 0.79,
        dueInDays: 12,
        status: "tokenized",
        tone: "cyan",
        code: "551",
        note: "Cobro corto y usable para mejorar el perfil de riesgo.",
      },
    ],
    transactions: [
      {
        id: "tx-1005",
        date: "2026-03-22T14:18:00.000Z",
        type: "repay",
        label: "Repago parcial de adelanto",
        detail: "Cancelaste caja usada para sueldos",
        amount: 1633,
      },
      {
        id: "tx-1004",
        date: "2026-03-19T16:05:00.000Z",
        type: "tokenize",
        label: "Factura #538 sumada al pool",
        detail: "Aseguradora Sur",
        amount: 3936,
      },
      {
        id: "tx-1003",
        date: "2026-03-14T10:43:00.000Z",
        type: "draw",
        label: "Fast liquidity withdrawal",
        detail: "Desembolso operativo para compras urgentes",
        amount: 3500,
      },
      {
        id: "tx-1002",
        date: "2026-03-11T12:26:00.000Z",
        type: "tokenize",
        label: "Bloque ADAS tokenizado",
        detail: "32 horas reservables",
        amount: 1920,
      },
      {
        id: "tx-1001",
        date: "2026-03-09T09:14:00.000Z",
        type: "tokenize",
        label: "Factura #441 sumada al pool",
        detail: "Agro Delta SRL",
        amount: 2624,
      },
    ],
    stellar: {
      network: "testnet",
      walletConnected: false,
      walletAddress: "GDYQ...7H4M",
      assetCode: "LQDT",
      issuer: "GDUK...ISSR",
      sacAddress: "CCOLLATPOOL7QJ4...XZ3N",
      rpcUrl: "https://soroban-testnet.stellar.org",
      networkPassphrase: "Test SDF Network ; September 2015",
      onChainPool: 12940,
      settlementAccount: "GBUS...PAYOUT",
      lastLedger: 57219834,
      events: [
        {
          id: "st-1003",
          type: "chain",
          title: "Pago piloto a proveedor",
          detail: "Liquidacion simulada desde wallet operativa",
          amount: 480,
          date: "2026-03-26T18:15:00.000Z",
        },
        {
          id: "st-1002",
          type: "sync",
          title: "Pool tokenizado sincronizado",
          detail: "Inventario + invoices reflejados como activo Stellar",
          amount: 12940,
          date: "2026-03-25T13:40:00.000Z",
        },
        {
          id: "st-1001",
          type: "wallet",
          title: "Wallet Stellar preparada",
          detail: "Configuracion base para testnet",
          amount: 0,
          date: "2026-03-25T10:05:00.000Z",
        },
      ],
    },
  };
}

function saveState() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function handleClick(event) {
  const actionNode = event.target.closest("[data-action]");
  if (!actionNode) {
    return;
  }

  const { action } = actionNode.dataset;

  if (action === "switch-view") {
    state.ui.activeView = actionNode.dataset.view;
    renderAll();
    return;
  }

  if (action === "jump-wallet") {
    state.ui.activeView = "wallet";
    renderAll();
    focusDrawInput();
    return;
  }

  if (action === "reset-demo") {
    const confirmed = window.confirm("Esto borra la sesion local y vuelve al estado inicial. Queres seguir?");
    if (!confirmed) {
      return;
    }

    state = buildSeedState();
    saveState();
    renderAll();
    showToast("La demo volvio al estado inicial.");
    return;
  }

  if (action === "set-inventory-filter") {
    state.ui.inventoryStatus = actionNode.dataset.value;
    renderInventory(getMetrics(state));
    saveState();
    return;
  }

  if (action === "toggle-collateral") {
    toggleCollateral(actionNode.dataset.group, actionNode.dataset.id);
    return;
  }

  if (action === "prefill-draw") {
    const metrics = getMetrics(state);
    const suggested = Math.min(metrics.availableToDraw, Number(actionNode.dataset.amount || 0) || 0);
    if (suggested > 0) {
      state.ui.drawAmount = roundCurrency(suggested);
    }
    state.ui.activeView = "wallet";
    renderAll();
    focusDrawInput();
    return;
  }

  if (action === "fill-max-draw") {
    const metrics = getMetrics(state);
    state.ui.drawAmount = roundCurrency(metrics.availableToDraw);
    renderWallet(metrics);
    saveState();
    focusDrawInput();
    return;
  }

  if (action === "fill-max-repay") {
    const metrics = getMetrics(state);
    state.ui.repayAmount = roundCurrency(Math.min(metrics.walletBalance, metrics.outstandingAdvance));
    renderWallet(metrics);
    saveState();
    focusRepayInput();
    return;
  }

  if (action === "toggle-stellar-wallet") {
    toggleStellarWallet();
    return;
  }

  if (action === "set-stellar-network") {
    setStellarNetwork(actionNode.dataset.network);
    return;
  }

  if (action === "sync-stellar-pool") {
    syncStellarPool();
    return;
  }

  if (action === "fill-stellar-max") {
    state.ui.stellarTransferAmount = roundCurrency(Math.min(state.profile.walletBalance, 1800));
    renderStellar(getMetrics(state));
    saveState();
  }
}

function handleInput(event) {
  if (event.target.id === "inventory-search") {
    const cursor = event.target.selectionStart ?? event.target.value.length;
    state.ui.inventorySearch = event.target.value;
    renderInventory(getMetrics(state));
    saveState();
    const input = document.getElementById("inventory-search");
    if (input) {
      input.focus();
      input.setSelectionRange(cursor, cursor);
    }
    return;
  }

  if (event.target.id === "draw-amount") {
    state.ui.drawAmount = sanitizeAmount(event.target.value);
    saveState();
    return;
  }

  if (event.target.id === "repay-amount") {
    state.ui.repayAmount = sanitizeAmount(event.target.value);
    saveState();
    return;
  }

  if (event.target.id === "stellar-transfer-amount") {
    state.ui.stellarTransferAmount = sanitizeAmount(event.target.value);
    saveState();
  }
}

function handleChange(event) {
  if (event.target.id === "transactions-filter") {
    state.ui.transactionsFilter = event.target.value;
    renderWallet(getMetrics(state));
    saveState();
  }
}

function handleSubmit(event) {
  if (event.target.id === "draw-form") {
    event.preventDefault();
    requestAdvance();
    return;
  }

  if (event.target.id === "repay-form") {
    event.preventDefault();
    repayAdvance();
    return;
  }

  if (event.target.id === "stellar-settlement-form") {
    event.preventDefault();
    settleOnStellar();
  }
}

function toggleStellarWallet() {
  state.stellar.walletConnected = !state.stellar.walletConnected;
  addStellarEvent({
    type: "wallet",
    title: state.stellar.walletConnected ? "Wallet conectada" : "Wallet desconectada",
    detail: state.stellar.walletConnected
      ? `${state.stellar.walletAddress} lista para firmar en ${networkLabel(state.stellar.network)}`
      : "La firma on-chain queda pausada hasta reconectar la wallet",
    amount: 0,
  });
  saveState();
  renderAll();
  showToast(
    state.stellar.walletConnected
      ? "Wallet Stellar conectada para firmar operaciones."
      : "Wallet Stellar desconectada.",
  );
}

function setStellarNetwork(network) {
  const presets = getStellarNetworkPreset(network);
  if (!presets) {
    return;
  }

  state.stellar.network = presets.id;
  state.stellar.rpcUrl = presets.rpcUrl;
  state.stellar.networkPassphrase = presets.passphrase;
  state.stellar.lastLedger = presets.ledger;
  addStellarEvent({
    type: "wallet",
    title: `Red cambiada a ${presets.label}`,
    detail: `RPC configurado en ${presets.rpcUrl}`,
    amount: 0,
  });
  saveState();
  renderAll();
  showToast(`La rail on-chain ahora apunta a ${presets.label}.`);
}

function syncStellarPool() {
  const metrics = getMetrics(state);
  state.stellar.onChainPool = metrics.tokenizedPool;
  state.stellar.lastLedger += 3;
  addStellarEvent({
    type: "sync",
    title: "Pool sincronizado con Stellar",
    detail: `${metrics.tokenized.length} activos quedaron reflejados on-chain`,
    amount: metrics.tokenizedPool,
  });
  saveState();
  renderAll();
  showToast("El pool tokenizado quedo sincronizado con la rail Stellar.");
}

function settleOnStellar() {
  const metrics = getMetrics(state);
  const amount = roundCurrency(state.ui.stellarTransferAmount);

  if (!state.stellar.walletConnected) {
    showToast("Conecta la wallet Stellar antes de enviar una liquidacion.");
    return;
  }

  if (amount < 50) {
    showToast("La liquidacion minima sugerida sobre Stellar es de US$ 50.");
    return;
  }

  if (amount > metrics.walletBalance) {
    showToast("No hay caja suficiente para liquidar ese monto.");
    return;
  }

  state.profile.walletBalance = roundCurrency(state.profile.walletBalance - amount);
  state.ui.stellarTransferAmount = roundCurrency(Math.min(900, state.profile.walletBalance));
  state.stellar.lastLedger += 1;

  addTransaction({
    type: "chain",
    label: "Liquidacion enviada por Stellar",
    detail: `${state.stellar.assetCode} / ${networkLabel(state.stellar.network)}`,
    amount,
  });
  addStellarEvent({
    type: "chain",
    title: "Liquidacion firmada y enviada",
    detail: `Destino ${state.stellar.settlementAccount} por ${state.stellar.assetCode}`,
    amount,
  });
  pushTrend(state.profile.walletBalance);
  saveState();
  renderAll();
  showToast(`Liquidaste ${currency0.format(amount)} por la rail de Stellar.`);
}

function requestAdvance() {
  const metrics = getMetrics(state);
  const amount = roundCurrency(state.ui.drawAmount);

  if (amount < 100) {
    showToast("El adelanto minimo sugerido es de US$ 100.");
    return;
  }

  if (amount > metrics.availableToDraw) {
    showToast("No alcanza la linea disponible. Tokeniza mas activos o pedi un monto menor.");
    return;
  }

  state.profile.walletBalance = roundCurrency(state.profile.walletBalance + amount);
  state.profile.outstandingAdvance = roundCurrency(state.profile.outstandingAdvance + amount);
  state.ui.drawAmount = roundCurrency(Math.max(Math.min(metrics.availableToDraw - amount, amount), 0));

  addTransaction({
    type: "draw",
    label: "Adelanto acreditado en wallet",
    detail: "La caja subio en tiempo real",
    amount,
  });
  pushTrend(state.profile.walletBalance);
  saveState();
  renderAll();
  showToast(`Acreditaste ${currency0.format(amount)} en caja.`);
}

function repayAdvance() {
  const metrics = getMetrics(state);
  const amount = roundCurrency(state.ui.repayAmount);

  if (amount < 100) {
    showToast("El repago minimo sugerido es de US$ 100.");
    return;
  }

  if (amount > metrics.walletBalance) {
    showToast("No hay caja suficiente para hacer ese repago.");
    return;
  }

  if (amount > metrics.outstandingAdvance) {
    showToast("El repago supera el saldo abierto del adelanto.");
    return;
  }

  state.profile.walletBalance = roundCurrency(state.profile.walletBalance - amount);
  state.profile.outstandingAdvance = roundCurrency(state.profile.outstandingAdvance - amount);
  state.ui.repayAmount = roundCurrency(Math.min(state.profile.outstandingAdvance, amount));

  addTransaction({
    type: "repay",
    label: "Repago ejecutado",
    detail: "El saldo abierto quedo mas liviano",
    amount,
  });
  pushTrend(state.profile.walletBalance);
  saveState();
  renderAll();
  showToast(`Repagaste ${currency0.format(amount)} del adelanto.`);
}

function toggleCollateral(group, id) {
  const collection = state[group];
  if (!Array.isArray(collection)) {
    return;
  }

  const item = collection.find((entry) => entry.id === id);
  if (!item) {
    return;
  }

  const metrics = getMetrics(state);
  const advanceValue = getAdvanceValue(item);

  if (item.status === "available") {
    item.status = "tokenized";
    addTransaction({
      type: "tokenize",
      label: `${item.name} sumado al pool`,
      detail: item.subtitle,
      amount: advanceValue,
    });
    saveState();
    renderAll();
    showToast(`${item.name} ahora respalda ${currency0.format(advanceValue)} de linea.`);
    return;
  }

  if (item.status === "tokenized") {
    const projectedPool = roundCurrency(metrics.tokenizedPool - advanceValue);

    if (projectedPool < metrics.outstandingAdvance) {
      showToast("No podes liberar este activo porque dejaria un adelanto sin respaldo.");
      return;
    }

    item.status = "available";
    addTransaction({
      type: "release",
      label: `${item.name} liberado del pool`,
      detail: item.subtitle,
      amount: advanceValue,
    });
    saveState();
    renderAll();
    showToast(`${item.name} volvio a estado disponible.`);
  }
}

function addTransaction(transaction) {
  state.transactions.unshift({
    id: `tx-${Date.now()}`,
    date: new Date().toISOString(),
    ...transaction,
  });
  state.transactions = state.transactions.slice(0, 40);
}

function pushTrend(value) {
  state.trend.push(roundCurrency(value));
  state.trend = state.trend.slice(-9);
}

function getMetrics(currentState) {
  const inventory = currentState.inventory.map((item) => ({ ...item, group: "inventory" }));
  const labor = currentState.labor.map((item) => ({ ...item, group: "labor" }));
  const invoices = currentState.invoices.map((item) => ({ ...item, group: "invoices" }));
  const assets = [...inventory, ...labor, ...invoices];

  const tokenized = assets.filter((item) => item.status === "tokenized");
  const available = assets.filter((item) => item.status === "available");
  const tokenizedPool = roundCurrency(
    tokenized.reduce((total, item) => total + getAdvanceValue(item), 0),
  );
  const totalPotential = roundCurrency(
    assets.reduce((total, item) => total + getAdvanceValue(item), 0),
  );
  const availableToDraw = roundCurrency(
    Math.max(Math.min(tokenizedPool, currentState.profile.facilityLimit) - currentState.profile.outstandingAdvance, 0),
  );
  const runwayDays = Math.round((currentState.profile.walletBalance / currentState.profile.weeklyBurn) * 7);
  const payrollGap = getDaysUntil(currentState.profile.payrollDate);
  const trustSignal =
    availableToDraw >= 10000
      ? "Pool sano"
      : availableToDraw >= 4000
        ? "Margen medio"
        : "Necesita colateral";

  const vaults = {
    inventory: buildVaultMetrics(currentState.inventory),
    labor: buildVaultMetrics(currentState.labor),
    invoices: buildVaultMetrics(currentState.invoices),
  };

  const recommendation = getRecommendation({
    availableToDraw,
    outstandingAdvance: currentState.profile.outstandingAdvance,
    runwayDays,
    inventoryReady: currentState.inventory.filter((item) => item.status === "available").length,
    invoicesHeavy: currentState.invoices.filter((item) => item.status === "available" && item.estimatedValue > 3000).length,
    walletBalance: currentState.profile.walletBalance,
    payrollGap,
  });

  const stellarSyncedPct = tokenizedPool
    ? Math.min(currentState.stellar.onChainPool / tokenizedPool, 1)
    : 1;

  return {
    assets,
    tokenized,
    available,
    tokenizedPool,
    totalPotential,
    availableToDraw,
    outstandingAdvance: currentState.profile.outstandingAdvance,
    walletBalance: currentState.profile.walletBalance,
    runwayDays,
    payrollGap,
    trustSignal,
    utilizationPct: tokenizedPool ? currentState.profile.outstandingAdvance / tokenizedPool : 0,
    stellarSyncedPct,
    stellarGap: roundCurrency(Math.max(tokenizedPool - currentState.stellar.onChainPool, 0)),
    vaults,
    recommendation,
  };
}

function buildVaultMetrics(collection) {
  const tokenized = collection.filter((item) => item.status === "tokenized");
  return {
    items: collection.length,
    ready: collection.filter((item) => item.status === "available").length,
    totalValue: roundCurrency(collection.reduce((total, item) => total + item.estimatedValue, 0)),
    tokenizedAdvance: roundCurrency(tokenized.reduce((total, item) => total + getAdvanceValue(item), 0)),
  };
}

function getRecommendation(metrics) {
  if (metrics.availableToDraw < 5000 && metrics.inventoryReady > 0) {
    return {
      title: "Subi dos repuestos premium",
      copy:
        "Todavia hay poco margen libre. Tokenizar inventario quieto empuja la linea sin tomar deuda nueva.",
      suggestedDraw: 3200,
    };
  }

  if (metrics.payrollGap <= 7 && metrics.availableToDraw > 0) {
    return {
      title: "Cubri la nomina con caja flexible",
      copy:
        "Faltan pocos dias para sueldos y ya tenes respaldo suficiente. Usa un adelanto corto y despues repagalo con cobranza.",
      suggestedDraw: 2800,
    };
  }

  if (metrics.outstandingAdvance > 0 && metrics.walletBalance > 45000) {
    return {
      title: "Baja costo financiero",
      copy:
        "La caja aguanta. Un repago parcial mejoraria la utilizacion del pool y deja activos libres para otra urgencia.",
      suggestedDraw: 0,
    };
  }

  return {
    title: "La linea esta equilibrada",
    copy:
      "Segui priorizando facturas y horas comprometidas: hoy son el colateral mas eficiente del taller.",
    suggestedDraw: 1800,
  };
}

function renderAll() {
  const metrics = getMetrics(state);
  renderNav(metrics);
  renderChrome(metrics);
  renderViews();
  renderDashboard(metrics);
  renderInventory(metrics);
  renderCapacity(metrics);
  renderWallet(metrics);
  renderStellar(metrics);
  saveState();
}

function renderNav(metrics) {
  const availableBadge = compactNumber(metrics.availableToDraw);
  const desktopMarkup = NAV_ITEMS.map((item) =>
    navButtonMarkup(
      item,
      state.ui.activeView === item.id,
      item.id === "wallet" ? availableBadge : item.id === "stellar" ? networkLabel(state.stellar.network) : null,
    ),
  ).join("");
  const mobileMarkup = NAV_ITEMS.map((item) =>
    navButtonMarkup(item, state.ui.activeView === item.id, null),
  ).join("");

  elements.desktopNav.innerHTML = desktopMarkup;
  elements.mobileNav.innerHTML = mobileMarkup;
}

function renderChrome(metrics) {
  elements.headerLiquidity.textContent = currency0.format(metrics.availableToDraw);
  elements.statusPill.textContent = `${metrics.trustSignal} / ${state.profile.trustRating}`;
  elements.recommendationTitle.textContent = metrics.recommendation.title;
  elements.recommendationCopy.textContent = metrics.recommendation.copy;
}

function renderViews() {
  const views = document.querySelectorAll(".view");
  views.forEach((view) => {
    view.classList.toggle("is-active", view.dataset.view === state.ui.activeView);
  });
}

function renderDashboard(metrics) {
  elements.dashboard.innerHTML = `
    <div class="hero-grid">
      <article class="hero-panel panel">
        <div class="hero-panel__top">
          <div>
            <p class="eyebrow">Liquidez inmediata</p>
            <h3 class="hero-panel__amount">${currency0.format(metrics.availableToDraw)}<small>.00</small></h3>
            <p class="hero-panel__caption">
              ${metrics.tokenized.length} activos tokenizados ya sostienen la linea. Quedan
              ${metrics.available.length} listos para ampliar capacidad.
            </p>
            <div class="hero-panel__delta">+${percent0.format(0.124)} vs. la semana pasada</div>
          </div>
        </div>
        <div class="hero-panel__actions">
          <button class="btn" type="button" data-action="switch-view" data-view="wallet">
            Pedir adelanto
          </button>
          <button
            class="btn btn--ghost"
            type="button"
            data-action="prefill-draw"
            data-amount="${metrics.recommendation.suggestedDraw}"
          >
            Usar recomendacion
          </button>
        </div>
        <div class="hero-panel__footer">
          <div class="summary-chip">
            <span>Caja actual</span>
            <strong>${currency0.format(metrics.walletBalance)}</strong>
          </div>
          <div class="summary-chip">
            <span>Saldo abierto</span>
            <strong>${currency0.format(metrics.outstandingAdvance)}</strong>
          </div>
          <div class="summary-chip">
            <span>Runway</span>
            <strong>${number0.format(metrics.runwayDays)} dias</strong>
          </div>
        </div>
      </article>

      <article class="metric-strip">
        <div>
          <p class="eyebrow">Pool health</p>
          <h3>${metrics.recommendation.title}</h3>
          <p class="metric-strip__copy">${metrics.recommendation.copy}</p>
        </div>
        <div class="metric-strip__row">
          <span>Utilizacion del pool</span>
          <strong>${percent0.format(metrics.utilizationPct)}</strong>
        </div>
        <div class="progress"><span style="width: ${Math.max(metrics.utilizationPct * 100, 4)}%"></span></div>
        <div class="metric-strip__row">
          <span>Potencial total</span>
          <strong>${currency0.format(metrics.totalPotential)}</strong>
        </div>
        <div class="metric-strip__row">
          <span>Nomina en</span>
          <strong>${number0.format(metrics.payrollGap)} dias</strong>
        </div>
      </article>
    </div>

    <div class="dashboard-grid">
      <article class="panel chart-shell">
        <div class="panel__header">
          <div>
            <h3>Caja operativa y disponibilidad</h3>
            <p class="chart-card__copy">
              El grafico deja de ser decorativo: se actualiza cada vez que pedis o repagas un adelanto.
            </p>
          </div>
          <div class="chart-card__meta">
            <span class="chart-badge">live pool</span>
          </div>
        </div>
        ${renderChart(state.trend)}
        <div class="chart-axis">
          <span>Hace 8 hitos</span>
          <span>Pico reciente</span>
          <span>Ahora</span>
        </div>
      </article>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h3>Senales del taller</h3>
            <p class="chart-card__copy">
              Estos indicadores conectan inventario, capacidad futura y caja en la misma lectura.
            </p>
          </div>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="eyebrow">Trust rating</span>
            <strong class="stat-card__value stat-card__value--primary">${state.profile.trustRating}</strong>
            <p class="stat-card__copy">Perfil de riesgo sostenido por facturas cortas y horas reservadas.</p>
          </div>
          <div class="stat-card">
            <span class="eyebrow">Uso de taller</span>
            <strong class="stat-card__value stat-card__value--positive">${percent0.format(
              state.profile.utilization,
            )}</strong>
            <p class="stat-card__copy">Carga actual de trabajo sobre la capacidad util del equipo.</p>
          </div>
          <div class="stat-card">
            <span class="eyebrow">Activos listos</span>
            <strong class="stat-card__value stat-card__value--warning">${number0.format(
              metrics.available.length,
            )}</strong>
            <p class="stat-card__copy">Repuestos u horas que todavia no entraron al pool y pueden hacerlo hoy.</p>
          </div>
        </div>
      </article>
    </div>

    <div class="vault-grid">
      ${renderVaultCard("inventory", "INV", "Inventory vault", metrics.vaults.inventory)}
      ${renderVaultCard("labor", "LAB", "Labor vault", metrics.vaults.labor)}
      ${renderVaultCard("invoices", "AR", "Invoice vault", metrics.vaults.invoices)}
    </div>

    <article class="panel">
      <div class="panel__header">
        <div>
          <h3>Actividad reciente</h3>
          <p class="chart-card__copy">Todo lo importante del pool y la wallet queda trazado abajo.</p>
        </div>
        <button class="btn btn--ghost" type="button" data-action="switch-view" data-view="wallet">
          Ver wallet
        </button>
      </div>
      <div class="activity-list">
        ${state.transactions.slice(0, 5).map(renderActivityCard).join("")}
      </div>
    </article>
  `;
}

function renderInventory(metrics) {
  const filteredInventory = filterInventory(state.inventory);
  const visibleAdvance = roundCurrency(
    filteredInventory.reduce((total, item) => total + getAdvanceValue(item), 0),
  );

  elements.inventory.innerHTML = `
    <div class="toolbar">
      <div class="toolbar__row">
        <input
          class="field"
          id="inventory-search"
          type="search"
          value="${escapeHtml(state.ui.inventorySearch)}"
          placeholder="Buscar por SKU, pieza o marca"
        />
        <div class="wallet-strip">
          <span>Visibles: ${number0.format(filteredInventory.length)}</span>
          <strong>${currency0.format(visibleAdvance)}</strong>
        </div>
      </div>
      <div class="filter-row">
        ${renderFilterChip("all", "Todo")}
        ${renderFilterChip("available", "Disponibles")}
        ${renderFilterChip("tokenized", "En pool")}
        ${renderFilterChip("high", "Ticket alto")}
      </div>
    </div>

    <div class="asset-grid">
      ${
        filteredInventory.length
          ? filteredInventory.map((item) => renderInventoryCard(item)).join("")
          : `<article class="panel"><p class="subtle-copy">No encontramos activos con ese filtro.</p></article>`
      }
    </div>

    <article class="panel">
      <div class="panel__header">
        <div>
          <h3>Lectura rapida del lote</h3>
          <p class="chart-card__copy">
            El objetivo es que puedas decidir en segundos que inventario conviene mover al pool.
          </p>
        </div>
      </div>
      <div class="summary-grid">
        <div class="stat-card">
          <span class="eyebrow">Valor bruto</span>
          <strong class="stat-card__value stat-card__value--primary">${currency0.format(
            metrics.vaults.inventory.totalValue,
          )}</strong>
          <p class="stat-card__copy">Suma total del inventario modelado en esta demo.</p>
        </div>
        <div class="stat-card">
          <span class="eyebrow">En pool</span>
          <strong class="stat-card__value stat-card__value--positive">${currency0.format(
            metrics.vaults.inventory.tokenizedAdvance,
          )}</strong>
          <p class="stat-card__copy">Linea activa sostenida hoy por repuestos ya tokenizados.</p>
        </div>
        <div class="stat-card">
          <span class="eyebrow">Listos para sumar</span>
          <strong class="stat-card__value stat-card__value--warning">${number0.format(
            metrics.vaults.inventory.ready,
          )}</strong>
          <p class="stat-card__copy">Piezas premium todavia fuera del pool.</p>
        </div>
        <div class="stat-card">
          <span class="eyebrow">Siguiente push</span>
          <strong class="stat-card__value">${currency0.format(
            roundCurrency(
              state.inventory
                .filter((item) => item.status === "available")
                .slice(0, 2)
                .reduce((total, item) => total + getAdvanceValue(item), 0),
            ),
          )}</strong>
          <p class="stat-card__copy">Tokenizar dos activos premium seria el empujon mas directo.</p>
        </div>
      </div>
    </article>
  `;
}

function renderCapacity(metrics) {
  elements.capacity.innerHTML = `
    <div class="summary-grid">
      <div class="stat-card">
        <span class="eyebrow">Horas valorizadas</span>
        <strong class="stat-card__value stat-card__value--primary">${currency0.format(
          metrics.vaults.labor.totalValue,
        )}</strong>
        <p class="stat-card__copy">Bolsa total de horas ya vendidas o reservables.</p>
      </div>
      <div class="stat-card">
        <span class="eyebrow">Facturas modeladas</span>
        <strong class="stat-card__value stat-card__value--positive">${currency0.format(
          metrics.vaults.invoices.totalValue,
        )}</strong>
        <p class="stat-card__copy">Cuentas por cobrar que sirven como colateral de corto plazo.</p>
      </div>
      <div class="stat-card">
        <span class="eyebrow">Labor en pool</span>
        <strong class="stat-card__value stat-card__value--warning">${currency0.format(
          metrics.vaults.labor.tokenizedAdvance,
        )}</strong>
        <p class="stat-card__copy">Linea hoy sostenida con capacidad futura comprometida.</p>
      </div>
      <div class="stat-card">
        <span class="eyebrow">AR en pool</span>
        <strong class="stat-card__value">${currency0.format(
          metrics.vaults.invoices.tokenizedAdvance,
        )}</strong>
        <p class="stat-card__copy">Lo mas eficiente de esta cartera sigue siendo la cobranza corta.</p>
      </div>
    </div>

    <div class="capacity-grid">
      <article class="panel">
        <div class="panel__header">
          <div>
            <h3>Capacidad futura</h3>
            <p class="chart-card__copy">
              Horas ya comprometidas que pueden convertirse en respaldo operativo.
            </p>
          </div>
        </div>
        <div class="asset-grid">
          ${state.labor.map((item) => renderLaborCard(item)).join("")}
        </div>
      </article>

      <article class="panel table-shell">
        <div class="panel__header">
          <div>
            <h3>Facturas por cobrar</h3>
            <p class="chart-card__copy">
              La combinacion mas util para un taller suele estar en AR corto y contratos reservados.
            </p>
          </div>
        </div>
        <div class="table-head">Cliente / Ticket / Estado</div>
        <div class="invoice-list">
          ${state.invoices.map((item) => renderInvoiceRow(item)).join("")}
        </div>
      </article>
    </div>
  `;
}

function renderWallet(metrics) {
  const filteredTransactions = state.transactions.filter((transaction) => {
    return state.ui.transactionsFilter === "all" || transaction.type === state.ui.transactionsFilter;
  });

  elements.wallet.innerHTML = `
    <div class="summary-grid">
      <div class="stat-card">
        <span class="eyebrow">Caja</span>
        <strong class="stat-card__value stat-card__value--primary">${currency0.format(
          metrics.walletBalance,
        )}</strong>
        <p class="stat-card__copy">Saldo operativo disponible ahora mismo.</p>
      </div>
      <div class="stat-card">
        <span class="eyebrow">Linea libre</span>
        <strong class="stat-card__value stat-card__value--positive">${currency0.format(
          metrics.availableToDraw,
        )}</strong>
        <p class="stat-card__copy">Monto que podes adelantar sin agregar nuevo colateral.</p>
      </div>
      <div class="stat-card">
        <span class="eyebrow">Saldo abierto</span>
        <strong class="stat-card__value stat-card__value--warning">${currency0.format(
          metrics.outstandingAdvance,
        )}</strong>
        <p class="stat-card__copy">Adelantos todavia vivos sobre el pool actual.</p>
      </div>
      <div class="stat-card">
        <span class="eyebrow">Pool tokenizado</span>
        <strong class="stat-card__value">${currency0.format(metrics.tokenizedPool)}</strong>
        <p class="stat-card__copy">Respaldo total activo tomando inventario, horas e invoices.</p>
      </div>
    </div>

    <div class="wallet-grid">
      <div class="view-content">
        <article class="form-card">
          <div class="panel__header">
            <div>
              <h3>Pedir adelanto</h3>
              <p>La demo acredita el monto en caja y consume linea en el mismo paso.</p>
            </div>
            <strong class="form-card__value">${currency0.format(metrics.availableToDraw)}</strong>
          </div>
          <form id="draw-form">
            <label>
              Monto a acreditar
              <input
                class="field"
                id="draw-amount"
                type="number"
                min="0"
                step="100"
                value="${escapeAttribute(state.ui.drawAmount)}"
              />
            </label>
            <div class="form-card__hint">
              <span>Disponible hoy</span>
              <strong>${currency2.format(metrics.availableToDraw)}</strong>
            </div>
            <div class="form-card__row">
              <button class="small-btn" type="submit">Acreditar ahora</button>
              <button class="small-btn small-btn--ghost" type="button" data-action="fill-max-draw">
                Usar maximo
              </button>
            </div>
          </form>
        </article>

        <article class="form-card">
          <div class="panel__header">
            <div>
              <h3>Repagar saldo</h3>
              <p>Reduce uso del pool y libera activos para la proxima urgencia.</p>
            </div>
            <strong class="form-card__value">${currency0.format(metrics.outstandingAdvance)}</strong>
          </div>
          <form id="repay-form">
            <label>
              Monto a cancelar
              <input
                class="field"
                id="repay-amount"
                type="number"
                min="0"
                step="100"
                value="${escapeAttribute(state.ui.repayAmount)}"
              />
            </label>
            <div class="form-card__hint">
              <span>Saldo abierto</span>
              <strong>${currency2.format(metrics.outstandingAdvance)}</strong>
            </div>
            <div class="form-card__row">
              <button class="small-btn" type="submit">Repagar</button>
              <button class="small-btn small-btn--ghost" type="button" data-action="fill-max-repay">
                Cancelar maximo
              </button>
            </div>
          </form>
        </article>
      </div>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h3>Ledger del taller</h3>
            <p class="chart-card__copy">El historial mezcla pool, adelantos y repagos en una sola vista.</p>
          </div>
          <div class="section-intro__actions">
            <select class="select-field" id="transactions-filter">
              ${renderTransactionOptions()}
            </select>
            <button class="btn btn--ghost" type="button" data-action="switch-view" data-view="stellar">
              Abrir rail Stellar
            </button>
          </div>
        </div>
        <div class="wallet-strip">
          <span>Utilizacion actual</span>
          <strong>${percent0.format(metrics.utilizationPct)}</strong>
        </div>
        <div class="transaction-list">
          ${
            filteredTransactions.length
              ? filteredTransactions.map(renderActivityCard).join("")
              : `<article class="list-card"><p class="subtle-copy">No hay movimientos con ese filtro.</p></article>`
          }
        </div>
      </article>
    </div>
  `;
}

function renderStellar(metrics) {
  const preset = getStellarNetworkPreset(state.stellar.network);
  const sdkSnippet = renderSdkSnippet();

  elements.stellar.innerHTML = `
    <div class="summary-grid">
      <div class="stat-card">
        <span class="eyebrow">Red activa</span>
        <strong class="stat-card__value stat-card__value--primary">${preset.label}</strong>
        <p class="stat-card__copy">Configuracion on-chain lista para ${preset.label.toLowerCase()}.</p>
      </div>
      <div class="stat-card">
        <span class="eyebrow">Pool on-chain</span>
        <strong class="stat-card__value stat-card__value--positive">${currency0.format(
          state.stellar.onChainPool,
        )}</strong>
        <p class="stat-card__copy">Colateral ya espejado sobre Stellar Asset / SAC bridge.</p>
      </div>
      <div class="stat-card">
        <span class="eyebrow">Sync del pool</span>
        <strong class="stat-card__value stat-card__value--warning">${percent0.format(
          metrics.stellarSyncedPct,
        )}</strong>
        <p class="stat-card__copy">Cuanto del pool tokenizado actual ya fue sincronizado on-chain.</p>
      </div>
      <div class="stat-card">
        <span class="eyebrow">Wallet</span>
        <strong class="stat-card__value">${state.stellar.walletConnected ? "Conectada" : "Pendiente"}</strong>
        <p class="stat-card__copy">Firma de operaciones con flujo pensado para Freighter o Wallets Kit.</p>
      </div>
    </div>

    <div class="stellar-grid">
      <div class="view-content">
        <article class="panel">
          <div class="panel__header">
            <div>
              <h3>Rail on-chain de liquidez</h3>
              <p class="chart-card__copy">
                La app ahora modela una salida natural a Stellar: activos del taller reflejados como
                colateral, pagos y settlement por red.
              </p>
            </div>
            <span class="status-pill" data-status="${state.stellar.walletConnected ? "wallet" : "available"}">
              ${state.stellar.walletConnected ? "wallet lista" : "wallet desconectada"}
            </span>
          </div>
          <div class="network-pill-row">
            ${renderNetworkPill("testnet", "Testnet")}
            ${renderNetworkPill("mainnet", "Mainnet")}
            ${renderNetworkPill("localnet", "Localnet")}
          </div>
          <div class="key-grid">
            <div class="key-card">
              <span>Asset</span>
              <strong>${state.stellar.assetCode}</strong>
            </div>
            <div class="key-card">
              <span>Ultimo ledger</span>
              <strong>${number0.format(state.stellar.lastLedger)}</strong>
            </div>
            <div class="key-card">
              <span>Issuer</span>
              <strong class="mono">${state.stellar.issuer}</strong>
            </div>
            <div class="key-card">
              <span>SAC / pool</span>
              <strong class="mono">${state.stellar.sacAddress}</strong>
            </div>
          </div>
          <div class="stellar-metric-row">
            <div class="wallet-strip wallet-strip--stellar">
              <span>RPC</span>
              <strong class="mono">${state.stellar.rpcUrl}</strong>
            </div>
            <div class="wallet-strip">
              <span>Gap de sync</span>
              <strong>${currency0.format(metrics.stellarGap)}</strong>
            </div>
          </div>
          <div class="section-intro__actions">
            <button class="btn" type="button" data-action="toggle-stellar-wallet">
              ${state.stellar.walletConnected ? "Desconectar wallet" : "Conectar wallet"}
            </button>
            <button class="btn btn--ghost" type="button" data-action="sync-stellar-pool">
              Sincronizar pool tokenizado
            </button>
          </div>
        </article>

        <article class="form-card">
          <div class="panel__header">
            <div>
              <h3>Liquidar pago por Stellar</h3>
              <p>
                Simula un pago al proveedor o una salida de tesoreria usando la rail de Stellar y
                deja trazabilidad en wallet + chain log.
              </p>
            </div>
            <strong class="form-card__value">${currency0.format(state.profile.walletBalance)}</strong>
          </div>
          <form id="stellar-settlement-form">
            <label>
              Monto a liquidar
              <input
                class="field"
                id="stellar-transfer-amount"
                type="number"
                min="0"
                step="50"
                value="${escapeAttribute(state.ui.stellarTransferAmount)}"
              />
            </label>
            <div class="form-card__hint">
              <span>Cuenta destino</span>
              <strong class="mono">${state.stellar.settlementAccount}</strong>
            </div>
            <div class="form-card__row">
              <button class="small-btn" type="submit">Firmar y liquidar</button>
              <button class="small-btn small-btn--ghost" type="button" data-action="fill-stellar-max">
                Usar sugerido
              </button>
            </div>
          </form>
        </article>
      </div>

      <div class="view-content">
        <article class="panel">
          <div class="panel__header">
            <div>
              <h3>Eventos on-chain</h3>
              <p class="chart-card__copy">
                Log separado para wallet, sync de colateral y liquidaciones.
              </p>
            </div>
          </div>
          <div class="chain-event-list">
            ${state.stellar.events.map(renderStellarEventCard).join("")}
          </div>
        </article>

        <article class="panel code-card">
          <div class="code-card__header">
            <h3>Snippet con js-stellar-sdk</h3>
            <p>Ejemplo listo para tomar como punto de partida cuando la demo pase a integracion real.</p>
          </div>
          <pre class="code-block"><code>${escapeHtml(sdkSnippet)}</code></pre>
        </article>
      </div>
    </div>
  `;
}

function navButtonMarkup(item, active, badge) {
  return `
    <button
      class="nav-item ${active ? "is-active" : ""}"
      type="button"
      data-action="switch-view"
      data-view="${item.id}"
    >
      <span class="nav-item__meta">
        <span class="nav-item__title">${item.title}</span>
        <span class="nav-item__caption">${item.caption}</span>
      </span>
      ${badge ? `<span class="nav-item__badge">${badge}</span>` : ""}
    </button>
  `;
}

function getAdvanceValue(item) {
  return roundCurrency(item.estimatedValue * item.advanceRate);
}

function getDaysUntil(dateString) {
  const today = new Date();
  const target = new Date(dateString);
  const diff = target.getTime() - today.getTime();
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
}

function compactNumber(value) {
  if (value >= 1000) {
    return `${currency0.format(value / 1000).replace(",00", "").replace("US$", "").trim()}k`;
  }
  return currency0.format(value);
}

function sanitizeAmount(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? roundCurrency(Math.max(numeric, 0)) : 0;
}

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function showToast(message) {
  elements.toast.hidden = false;
  elements.toast.textContent = message;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    elements.toast.hidden = true;
  }, 2800);
}

function focusDrawInput() {
  const input = document.getElementById("draw-amount");
  if (input) {
    input.focus();
    input.select();
  }
}

function focusRepayInput() {
  const input = document.getElementById("repay-amount");
  if (input) {
    input.focus();
    input.select();
  }
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function renderVaultCard(view, code, title, metrics) {
  return `
    <article class="vault-card" data-code="${code}">
      <div class="vault-card__top">
        <div>
          <h3>${title}</h3>
          <p class="vault-card__copy">${number0.format(metrics.ready)} listos / ${number0.format(
            metrics.items,
          )} modelados</p>
        </div>
        <span class="vault-card__badge">${code}</span>
      </div>
      <div>
        <span class="eyebrow">Linea activa</span>
        <strong class="vault-card__value">${currency0.format(metrics.tokenizedAdvance)}</strong>
      </div>
      <div class="vault-card__meta">
        <div class="vault-card__meta-row">
          <span>Valor bruto</span>
          <strong>${currency0.format(metrics.totalValue)}</strong>
        </div>
        <div class="vault-card__meta-row">
          <span>Listos para sumar</span>
          <strong>${number0.format(metrics.ready)}</strong>
        </div>
      </div>
      <button class="btn btn--ghost vault-card__action" type="button" data-action="switch-view" data-view="${
        view === "inventory" ? "inventory" : "capacity"
      }">
        Abrir vault
      </button>
    </article>
  `;
}

function renderActivityCard(entry) {
  return `
    <article class="list-card">
      <div class="list-card__row">
        <div>
          <span class="status-pill" data-status="${entry.type}">${transactionLabel(entry.type)}</span>
          <h3>${escapeHtml(entry.label)}</h3>
          <p class="list-card__copy">${escapeHtml(entry.detail || "")}</p>
        </div>
        <strong class="list-card__value">${transactionAmount(entry.type, entry.amount)}</strong>
      </div>
      <div class="list-card__meta">
        <span class="table-badge">${renderDate(entry.date)}</span>
      </div>
    </article>
  `;
}

function renderFilterChip(value, label) {
  const active = state.ui.inventoryStatus === value;
  return `
    <button
      class="filter-chip ${active ? "is-active" : ""}"
      type="button"
      data-action="set-inventory-filter"
      data-value="${value}"
    >
      ${label}
    </button>
  `;
}

function renderTransactionOptions() {
  const options = [
    { value: "all", label: "Todos los movimientos" },
    { value: "draw", label: "Solo adelantos" },
    { value: "repay", label: "Solo repagos" },
    { value: "tokenize", label: "Solo tokenizaciones" },
    { value: "release", label: "Solo liberaciones" },
    { value: "chain", label: "Solo Stellar" },
  ];

  return options
    .map(
      (option) =>
        `<option value="${option.value}" ${option.value === state.ui.transactionsFilter ? "selected" : ""}>${option.label}</option>`,
    )
    .join("");
}

function renderChart(series) {
  const width = 560;
  const height = 220;
  const padding = 14;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const spread = Math.max(max - min, 1);
  const xStep = (width - padding * 2) / Math.max(series.length - 1, 1);
  const points = series.map((value, index) => {
    const x = padding + xStep * index;
    const y = height - padding - ((value - min) / spread) * (height - padding * 2);
    return [x, y];
  });

  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point[0].toFixed(2)} ${point[1].toFixed(2)}`)
    .join(" ");
  const area = `${line} L ${points[points.length - 1][0].toFixed(2)} ${height - padding} L ${points[0][0].toFixed(
    2,
  )} ${height - padding} Z`;
  const current = points[points.length - 1];

  return `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Evolucion de caja y liquidez">
      <defs>
        <linearGradient id="area-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="rgba(0,220,229,0.34)"></stop>
          <stop offset="100%" stop-color="rgba(0,220,229,0)"></stop>
        </linearGradient>
      </defs>
      <path d="${area}" fill="url(#area-gradient)"></path>
      <path d="${line}" fill="none" stroke="#00dce5" stroke-width="3" stroke-linecap="round"></path>
      ${points
        .map(
          (point, index) =>
            `<circle cx="${point[0].toFixed(2)}" cy="${point[1].toFixed(
              2,
            )}" r="${index === points.length - 1 ? 5 : 3}" fill="${index === points.length - 1 ? "#d7ffc5" : "#00dce5"}"></circle>`,
        )
        .join("")}
      <g>
        <rect x="${Math.max(current[0] - 72, 12).toFixed(2)}" y="${Math.max(current[1] - 54, 8).toFixed(
          2,
        )}" width="72" height="34" rx="12" fill="rgba(9,17,29,0.94)" stroke="rgba(255,255,255,0.08)"></rect>
        <text x="${Math.max(current[0] - 64, 20).toFixed(2)}" y="${Math.max(current[1] - 32, 26).toFixed(
          2,
        )}" fill="#9cb0ca" font-size="10">Actual</text>
        <text x="${Math.max(current[0] - 64, 20).toFixed(2)}" y="${Math.max(current[1] - 16, 42).toFixed(
          2,
        )}" fill="#d7ffc5" font-size="14" font-family="Space Grotesk">${currency0.format(
          series[series.length - 1],
        )}</text>
      </g>
    </svg>
  `;
}

function renderNetworkPill(network, label) {
  return `
    <button
      class="network-pill ${state.stellar.network === network ? "is-active" : ""}"
      type="button"
      data-action="set-stellar-network"
      data-network="${network}"
    >
      ${label}
    </button>
  `;
}

function renderInventoryCard(item) {
  return `
    <article class="asset-card" data-tone="${item.tone}" data-code="${item.code}">
      <div>
        <div class="asset-card__header">
          <span class="asset-card__badge">${item.sku}</span>
          <span class="status-pill" data-status="${item.status}">${statusLabel(item.status)}</span>
        </div>
        <h3 class="asset-card__title">${escapeHtml(item.name)}</h3>
        <p class="asset-card__subtitle">${escapeHtml(item.subtitle)}</p>
      </div>
      <div class="asset-card__metrics">
        <div class="asset-card__metric">
          <span>Valor</span>
          <strong>${currency0.format(item.estimatedValue)}</strong>
        </div>
        <div class="asset-card__metric">
          <span>Adelanto</span>
          <strong>${currency0.format(getAdvanceValue(item))}</strong>
        </div>
        <div class="asset-card__metric">
          <span>Idle</span>
          <strong>${number0.format(item.daysIdle)} dias</strong>
        </div>
      </div>
      <p class="subtle-copy">${escapeHtml(item.note)}</p>
      <div class="asset-card__footer">
        <button
          class="small-btn ${item.status === "tokenized" ? "small-btn--ghost" : ""}"
          type="button"
          data-action="toggle-collateral"
          data-group="inventory"
          data-id="${item.id}"
        >
          ${item.status === "tokenized" ? "Liberar" : "Tokenizar"}
        </button>
        <span class="table-badge">${percent0.format(item.advanceRate)} LTV</span>
      </div>
    </article>
  `;
}

function renderLaborCard(item) {
  return `
    <article class="asset-card" data-tone="${item.tone}" data-code="${item.code}">
      <div>
        <div class="asset-card__header">
          <span class="asset-card__badge">${item.sku}</span>
          <span class="status-pill" data-status="${item.status}">${statusLabel(item.status)}</span>
        </div>
        <h3 class="asset-card__title">${escapeHtml(item.name)}</h3>
        <p class="asset-card__subtitle">${escapeHtml(item.subtitle)}</p>
      </div>
      <div class="asset-card__metrics">
        <div class="asset-card__metric">
          <span>Valor</span>
          <strong>${currency0.format(item.estimatedValue)}</strong>
        </div>
        <div class="asset-card__metric">
          <span>Horas</span>
          <strong>${number0.format(item.hours)} hs</strong>
        </div>
        <div class="asset-card__metric">
          <span>Uso</span>
          <strong>${percent0.format(item.utilization)}</strong>
        </div>
      </div>
      <p class="subtle-copy">${escapeHtml(item.note)}</p>
      <div class="asset-card__footer">
        <button
          class="small-btn ${item.status === "tokenized" ? "small-btn--ghost" : ""}"
          type="button"
          data-action="toggle-collateral"
          data-group="labor"
          data-id="${item.id}"
        >
          ${item.status === "tokenized" ? "Liberar" : "Tokenizar"}
        </button>
        <span class="table-badge">${currency0.format(getAdvanceValue(item))} usable</span>
      </div>
    </article>
  `;
}

function renderInvoiceRow(item) {
  return `
    <div class="table-row">
      <div class="table-row__primary">
        <span class="table-row__title">${escapeHtml(item.name)}</span>
        <span class="table-row__copy">${escapeHtml(item.subtitle)} / vence en ${number0.format(
          item.dueInDays,
        )} dias</span>
      </div>
      <div class="table-row__right">
        <span class="table-badge">${currency0.format(getAdvanceValue(item))}</span>
        <span class="status-pill" data-status="${item.status}">${statusLabel(item.status)}</span>
        <button
          class="small-btn ${item.status === "tokenized" ? "small-btn--ghost" : ""}"
          type="button"
          data-action="toggle-collateral"
          data-group="invoices"
          data-id="${item.id}"
        >
          ${item.status === "tokenized" ? "Liberar" : "Tokenizar"}
        </button>
      </div>
    </div>
  `;
}

function renderStellarEventCard(entry) {
  return `
    <article class="list-card">
      <div class="list-card__row">
        <div>
          <span class="status-pill" data-status="${entry.type}">${stellarEventLabel(entry.type)}</span>
          <h3>${escapeHtml(entry.title)}</h3>
          <p class="list-card__copy">${escapeHtml(entry.detail)}</p>
        </div>
        <strong class="list-card__value">${
          entry.amount ? currency0.format(entry.amount) : "sin monto"
        }</strong>
      </div>
      <div class="list-card__meta">
        <span class="table-badge">${renderDate(entry.date)}</span>
      </div>
    </article>
  `;
}

function filterInventory(collection) {
  const query = state.ui.inventorySearch.trim().toLowerCase();
  return collection.filter((item) => {
    const matchesQuery =
      !query ||
      `${item.sku} ${item.name} ${item.subtitle}`.toLowerCase().includes(query);

    if (!matchesQuery) {
      return false;
    }

    if (state.ui.inventoryStatus === "all") {
      return true;
    }

    if (state.ui.inventoryStatus === "available") {
      return item.status === "available";
    }

    if (state.ui.inventoryStatus === "tokenized") {
      return item.status === "tokenized";
    }

    if (state.ui.inventoryStatus === "high") {
      return item.estimatedValue >= 1600;
    }

    return true;
  });
}

function transactionLabel(type) {
  return {
    draw: "adelanto",
    repay: "repago",
    tokenize: "pool in",
    release: "pool out",
    chain: "stellar",
  }[type] || type;
}

function transactionAmount(type, amount) {
  if (type === "draw" || type === "tokenize") {
    return `+${currency0.format(amount)}`;
  }

  if (type === "repay" || type === "release") {
    return `-${currency0.format(amount)}`;
  }

  if (type === "chain") {
    return `-${currency0.format(amount)}`;
  }

  return currency0.format(amount);
}

function statusLabel(status) {
  return status === "tokenized" ? "en pool" : "disponible";
}

function renderDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "sin fecha";
  }
  return dateFormat.format(date);
}

function addStellarEvent(event) {
  state.stellar.events.unshift({
    id: `st-${Date.now()}`,
    date: new Date().toISOString(),
    ...event,
  });
  state.stellar.events = state.stellar.events.slice(0, 20);
}

function stellarEventLabel(type) {
  return {
    wallet: "wallet",
    sync: "sync",
    chain: "settlement",
  }[type] || type;
}

function getStellarNetworkPreset(id) {
  const presets = {
    testnet: {
      id: "testnet",
      label: "Testnet",
      rpcUrl: "https://soroban-testnet.stellar.org",
      passphrase: "Test SDF Network ; September 2015",
      ledger: 57219834,
    },
    mainnet: {
      id: "mainnet",
      label: "Mainnet",
      rpcUrl: "https://mainnet.stellar.validationcloud.io/v1/YOUR_KEY",
      passphrase: "Public Global Stellar Network ; September 2015",
      ledger: 56100421,
    },
    localnet: {
      id: "localnet",
      label: "Localnet",
      rpcUrl: "http://localhost:8000/rpc",
      passphrase: "Standalone Network ; February 2017",
      ledger: 1284,
    },
  };

  return presets[id] || presets.testnet;
}

function networkLabel(id) {
  return getStellarNetworkPreset(id).label;
}

function renderSdkSnippet() {
  const preset = getStellarNetworkPreset(state.stellar.network);
  const horizonUrl =
    preset.id === "testnet"
      ? "https://horizon-testnet.stellar.org"
      : preset.id === "mainnet"
        ? "https://horizon.stellar.org"
        : "http://localhost:8000";

  return `import * as StellarSdk from "@stellar/stellar-sdk";

const config = {
  horizonUrl: "${horizonUrl}",
  rpcUrl: "${preset.rpcUrl}",
  networkPassphrase: "${preset.passphrase}",
};

const horizon = new StellarSdk.Horizon.Server(config.horizonUrl);
const rpc = new StellarSdk.rpc.Server(config.rpcUrl);
const source = await horizon.loadAccount("${state.stellar.walletAddress}");
const asset = new StellarSdk.Asset("${state.stellar.assetCode}", "${state.stellar.issuer}");

const tx = new StellarSdk.TransactionBuilder(source, {
  fee: StellarSdk.BASE_FEE,
  networkPassphrase: config.networkPassphrase,
})
  .addOperation(
    StellarSdk.Operation.payment({
      destination: "${state.stellar.settlementAccount}",
      asset,
      amount: "${roundCurrency(state.ui.stellarTransferAmount).toFixed(2)}",
    }),
  )
  .setTimeout(180)
  .build();

const signedXdr = await wallet.signTransaction(tx.toXDR(), {
  networkPassphrase: config.networkPassphrase,
});

await horizon.submitTransaction(
  StellarSdk.TransactionBuilder.fromXDR(signedXdr, config.networkPassphrase),
);`;
}
