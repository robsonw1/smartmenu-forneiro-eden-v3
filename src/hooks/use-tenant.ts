/**
 * Hook para obter o tenant_id do sistema
 * Sistema Mono-Tenant: Forneiro Pizzaria Eden
 */

import { getTenantId } from '@/lib/tenant-config';

export const useTenant = (): { tenantId: string } => {
  // Para mono-tenant, simplesmente retorna o ID padrão
  return {
    tenantId: getTenantId(),
  };
};
