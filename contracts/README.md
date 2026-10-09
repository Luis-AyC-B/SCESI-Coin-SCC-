# Contratos

Requiere [Foundry](https://book.getfoundry.sh/getting-started/installation).

```bash
forge install foundry-rs/forge-std OpenZeppelin/openzeppelin-contracts
forge build
# con `docker compose up chain` corriendo (cuenta 0 de Anvil):
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

La clave de arriba es la cuenta de prueba pública de Anvil; nunca usarla fuera de local.
