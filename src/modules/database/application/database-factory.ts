import { DatabaseService } from "@/modules/database/application/database-service";
import { type IDatabaseService } from "@/modules/database/domain/interfaces";

export function DatabaseServiceFactory(): IDatabaseService {
  return DatabaseService.getInstance();
}
