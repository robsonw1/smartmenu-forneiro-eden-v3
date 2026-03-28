/**
 * Configuração de Tenant - Sistema Mono-Tenant
 * Forneiro Pizzaria Eden
 * 
 * O sistema é mono-tenant, portanto todos os pedidos, produtos, etc
 * pertencem a este tenant_id padrão
 */

// UUID do tenant único da pizzaria Forneiro Eden
export const DEFAULT_TENANT_ID = '550e8400-e29b-41d4-a716-446655440000';

/**
 * Obtém o tenant_id ativo
 * Em ambiente mono-tenant, sempre retorna o DEFAULT_TENANT_ID
 */
export const getTenantId = (): string => {
  // Para futuras expansões multi-tenant, adicione lógica aqui
  return DEFAULT_TENANT_ID;
};
