// Importación directa para resolver problemas de referencia
import { DatabaseFactory } from "./infrastructure/database-factory";

// Re-exportamos los tipos y clases
export type { DatabaseClient, DatabaseClientFactory } from "./domain/database-client.interface";
export { DatabaseFactory } from "./infrastructure/database-factory";

// Re-exportamos el cliente por comodidad para mantener compatibilidad con código existente
export function factoryDbClient() {
  return DatabaseFactory.getClient();
} 