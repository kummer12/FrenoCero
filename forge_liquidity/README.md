# Forge Liquidity

Demo estatica basada en los exports de Stitch para convertir el concepto en una experiencia usable.

## Abrir

1. Abri `index.html` en tu navegador.
2. Navega entre `Panel`, `Inventario`, `Capacidad`, `Wallet` y `Stellar`.
3. Proba estos flujos:
   - tokenizar un repuesto, hora o factura
   - pedir un adelanto desde `Wallet`
   - repagar saldo y ver como cambia la linea libre
   - abrir `Stellar`, conectar wallet, sincronizar el pool y simular una liquidacion on-chain
   - usar `Reset demo` para volver al estado inicial

## Que hace esta version

- Mantiene el look industrial del concepto original.
- Conecta inventario, horas y facturas a un pool real de colateral.
- Calcula linea disponible, saldo abierto y caja en tiempo real.
- Suma una capa Stellar con red seleccionable, wallet mock, sync del pool y snippet de `@stellar/stellar-sdk`.
- Guarda el estado en `localStorage` para seguir despues de recargar.
