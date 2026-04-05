# Security Policy

## Principios

- Mínimo privilegio.
- Aprobaciones por defecto.
- Autopilot deshabilitado por defecto.
- Prohibido exponer secretos en repositorio o logs.

## Secretos

- No subir tokens/API keys.
- Usar GitHub Secrets o Vault.
- Rotar credenciales si se detecta exposición.

## Controles obligatorios

- Hook `pre-checks.sh`: bloquea ramas `main/master`, comandos fuera de whitelist y comandos peligrosos.
- Workflow `agent-safety.yml`: falla PR/push ante patrones de riesgo.

## Habilitación controlada de Autopilot

1. Aprobación humana explícita por cambio.
2. Entorno controlado y temporal.
3. Mantener `Default Approvals`.
4. Verificación post-cambio y rollback documentado.

## Pre-release checklist

- [ ] Backup reciente creado
- [ ] Tests en verde
- [ ] Scan de seguridad sin hallazgos
- [ ] Documentación actualizada
- [ ] Plan de rollback validado