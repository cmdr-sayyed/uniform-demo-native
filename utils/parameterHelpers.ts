import { ComponentInstance } from '@uniformdev/canvas';

export function getStringParameter(
  component: ComponentInstance,
  paramId: string,
  defaultValue: string = ''
): string {
  const param = component.parameters?.[paramId];
  if (param?.value && typeof param.value === 'string') {
    return param.value;
  }
  return defaultValue;
}

export function getLinkParameter(
  component: ComponentInstance,
  paramId: string
): { path: string; type: string } | null {
  const param = component.parameters?.[paramId];
  if (param?.value && typeof param.value === 'object') {
    const link = param.value as any;
    return {
      path: link.path || '',
      type: link.type || 'internal',
    };
  }
  return null;
}

export function getAssetParameter(
  component: ComponentInstance,
  paramId: string
): { url: string; title?: string } | null {
  const param = component.parameters?.[paramId];
  if (param?.value) {
    const asset = param.value as any;
    if (asset.url) {
      return {
        url: asset.url,
        title: asset.title,
      };
    }
    if (asset.fields?.url?.value) {
      return {
        url: asset.fields.url.value,
        title: asset.fields.title?.value,
      };
    }
  }
  return null;
}