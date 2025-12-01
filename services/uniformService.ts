import { ApiClientError, CanvasClient, ComponentInstance } from '@uniformdev/canvas';

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
    const state = options?.preview ? 0 : 64;
    
    // Try different slug formats
    const slugVariants = [
      path.length > 0 ? `/${path.join('/mobile')}` : '/',  // With leading slash: /about
      path.length > 0 ? path.join('/') : '',          // Without leading slash: about
    ];

    for (const slug of slugVariants) {
      try {
        console.log('[UniformService] Fetching composition:', {
          path: path,
          slug: slug,
          state: state,
          preview: options?.preview || false,
        });

        const response = await this.client.getCompositionBySlug({
          slug: slug,
          state: state,
        });

        console.log('[UniformService] Response received:', {
          hasComposition: !!response.composition,
          compositionId: response.composition?._id,
          compositionType: response.composition?.type,
          slug: slug,
        });

        if (response.composition) {
          return response.composition;
        }
      } catch (error) {
        // Log error but continue to next variant
        if (error instanceof ApiClientError) {
          console.warn('[UniformService] API error with slug variant:', {
            slug: slug,
            message: error.message,
            error: error,
          });
        } else if (error instanceof Error) {
          console.warn('[UniformService] Error with slug variant:', {
            slug: slug,
            message: error.message,
            name: error.name,
          });
        } else {
          console.warn('[UniformService] Unknown error with slug variant:', {
            slug: slug,
            error: error,
          });
        }
        // Continue to next variant
      }
    }

    // If all variants failed, log final error
    console.error('[UniformService] All slug variants failed for path:', path);
    return null;
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
      const routes = response.compositions?.map((c: any) => {
        const routeInfo = {
          path: c.path || '',
          slug: c.slug || '',
          _id: c._id || '',
          type: c.type || '',
        };
        console.log('[UniformService] Available route:', routeInfo);
        return routeInfo.path || routeInfo.slug || '';
      }).filter(Boolean) || [];
      
      console.log('[UniformService] Total routes found:', routes.length);
      return routes;
    } catch (error) {
      console.error('[UniformService] Error fetching routes:', error);
      return [];
    }
  }

  /**
   * Debug helper: Get all compositions with their details
   */
  async getAllCompositions(): Promise<any[]> {
    try {
      const response = await this.client.getCompositionList();
      const compositions = response.compositions || [];
      console.log('[UniformService] All compositions:', compositions.map((c: any) => ({
        _id: c._id,
        type: c.type,
        path: c.path,
        slug: c.slug,
        state: c.state,
      })));
      return compositions;
    } catch (error) {
      console.error('[UniformService] Error fetching all compositions:', error);
      return [];
    }
  }
}