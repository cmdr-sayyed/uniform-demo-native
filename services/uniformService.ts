import { CanvasClient, ComponentInstance } from '@uniformdev/canvas';

export interface UniformConfig {
  apiKey: string;
  projectId: string;
  apiHost?: string;
}

export class UniformService {
  private client: CanvasClient;

  constructor(config: UniformConfig) {
    this.client = new CanvasClient({
      apiKey: config.apiKey,
      projectId: config.projectId,
      apiHost: config.apiHost || 'https://api.uniform.app',
    });
  }

  /**
   * Fetch a composition by route path
   */
  async fetchCompositionByRoute(
    path: string[] = [],
    options?: { preview?: boolean }
  ): Promise<ComponentInstance | null> {
    try {
      const routePath = path.length > 0 ? `/${path.join('/')}` : '/';
      console.log('routePath', routePath);
      const response = await this.client.getCompositionBySlug({
        slug: routePath,
        state: options?.preview ? 0 : 64,
      });
      console.log('response', response);

      return response.composition || null;
    } catch (error) {
      console.error('Error fetching composition:', error);
      return null;
    }
  }

  /**
   * Fetch a composition by ID
   */
  async fetchCompositionById(
    compositionId: string,
    options?: { preview?: boolean }
  ): Promise<ComponentInstance | null> {
    try {
      const response = await this.client.getCompositionById({
        compositionId,
        state: options?.preview ? 0 : 64,
      });

      return response.composition || null;
    } catch (error) {
      console.error('Error fetching composition:', error);
      return null;
    }
  }

  /**
   * Fetch all routes (for navigation)
   */
  async fetchRoutes(): Promise<string[]> {
    try {
      const response = await this.client.getCompositionList();
      return response.compositions?.map((c) => (c as any).path || '') || [];
    } catch (error) {
      console.error('Error fetching routes:', error);
      return [];
    }
  }
}