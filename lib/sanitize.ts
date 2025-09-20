import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a DOMPurify instance using a JSDOM window
const window = new JSDOM('').window;
const purify = DOMPurify(window as any);

export function sanitizeInput(input: string): string {
  return purify.sanitize(input);
}