import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

export function setupSwagger(app: Express) {
  // Read the OpenAPI specification
  const openApiPath = path.join(__dirname, '..', 'src', 'openapi.yaml');
  const openApiContent = fs.readFileSync(openApiPath, 'utf8');
  const openApiSpec = yaml.parse(openApiContent);

  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'PartyPilot API Documentation',
  }));
} 