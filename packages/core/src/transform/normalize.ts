import type { NormalizedRow } from '../types.js';

// biome-ignore lint/suspicious/noExplicitAny: Notion property values are dynamic
export function normalizeData(rows: NormalizedRow[]): Array<Record<string, any>> {
  return rows.map((row) => {
    // biome-ignore lint/suspicious/noExplicitAny: Notion property values are dynamic
    const normalized: Record<string, any> = {
      id: row.id,
      createdTime: row.createdTime,
      lastEditedTime: row.lastEditedTime,
    };

    // Extract values from Notion property format
    for (const [key, property] of Object.entries(row.properties)) {
      normalized[key] = extractPropertyValue(property);
    }

    return normalized;
  });
}

// biome-ignore lint/suspicious/noExplicitAny: Notion property structure varies by type
function extractPropertyValue(property: any): any {
  if (!property) return null;

  switch (property.type) {
    case 'title':
      return property.title?.[0]?.plain_text || '';
    case 'rich_text':
      return property.rich_text?.[0]?.plain_text || '';
    case 'number':
      return property.number;
    case 'select':
      return property.select?.name || null;
    case 'multi_select':
      // biome-ignore lint/suspicious/noExplicitAny: Notion multi_select item structure
      return property.multi_select?.map((s: any) => s.name) || [];
    case 'date':
      return property.date?.start || null;
    case 'checkbox':
      return property.checkbox;
    case 'url':
      return property.url;
    case 'email':
      return property.email;
    case 'phone_number':
      return property.phone_number;
    case 'status':
      return property.status?.name || null;
    case 'people':
      // biome-ignore lint/suspicious/noExplicitAny: Notion people item structure
      return property.people?.map((p: any) => p.name) || [];
    case 'files':
      // biome-ignore lint/suspicious/noExplicitAny: Notion file item structure
      return property.files?.map((f: any) => f.name) || [];
    case 'created_time':
      return property.created_time;
    case 'last_edited_time':
      return property.last_edited_time;
    default:
      return null;
  }
}
