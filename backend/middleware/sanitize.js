/**
 * Input Sanitization — Comprehensive XSS Prevention
 *
 * Two-pass sanitizer that handles:
 * - HTML entity and hex-encoded payloads (decoded before sanitizing)
 * - All event handlers (quoted, unquoted, backtick-quoted)
 * - Dangerous tags: script, iframe, svg, object, embed, form, base, template, math, link, meta
 * - style and srcdoc attributes (can contain expression() or javascript:)
 * - data: URIs (all types, not just text/html)
 * - vbscript: protocol
 * - javascript: with whitespace obfuscation (j\na\tv ascript:)
 * - Nested/double-encoded payloads (runs two passes)
 * - Null bytes and control characters
 *
 * Applied to req.body, req.query, req.params.
 *
 * Does NOT modify:
 * - Non-string values (numbers, booleans, arrays)
 * - Password fields (they get hashed anyway)
 * - Fields explicitly whitelisted
 */

const SKIP_FIELDS = ['password', 'currentPassword', 'newPassword', 'refreshToken', 'token', 'accessKey', 'staffKey', 'schoolKey'];

/**
 * Dangerous HTML tags that can execute scripts or load external content
 */
const DANGEROUS_TAGS = [
  'script', 'iframe', 'object', 'embed', 'form', 'base',
  'template', 'math', 'svg', 'link', 'meta', 'applet',
  'frameset', 'frame', 'layer', 'ilayer', 'bgsound',
];

/**
 * Decode HTML entities and hex/decimal character references
 * This ensures encoded payloads like &#x3C;script&#x3E; are caught
 */
function decodeEntities(str) {
  return str
    // Decode hex entities: &#x3C; &#x3E; etc.
    .replace(/&#x([0-9a-f]{1,6});?/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    // Decode decimal entities: &#60; &#62; etc.
    .replace(/&#(\d{1,7});?/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    // Decode named entities commonly used in XSS
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&tab;/gi, '\t')
    .replace(/&newline;/gi, '\n');
}

/**
 * Single pass of sanitization
 */
function sanitizePass(str) {
  let result = str;

  // 1. Remove null bytes and control characters (except newline, tab, carriage return)
  result = result.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 2. Remove dangerous tags and their content
  for (const tag of DANGEROUS_TAGS) {
    // Remove opening + content + closing: <script>...</script>
    const openClose = new RegExp(`<${tag}\\b[^]*?<\\/${tag}\\s*>`, 'gi');
    result = result.replace(openClose, '');
    // Remove self-closing or unclosed: <script ...> or <script .../>
    const selfClosing = new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi');
    result = result.replace(selfClosing, '');
    // Also catch closing tags without openers: </script>
    const closingOnly = new RegExp(`<\\/${tag}\\s*>`, 'gi');
    result = result.replace(closingOnly, '');
  }

  // 3. Remove ALL event handlers regardless of quoting style
  //    Catches: onclick="..." onclick='...' onclick=alert(1) onclick=`...`
  //    Also catches onmouseover, onerror, onload, onfocus, etc.
  result = result.replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|`[^`]*`|[^\s>]*)/gi, '');

  // 4. Remove style attributes (can contain expression() or url(javascript:))
  result = result.replace(/\bstyle\s*=\s*(?:"[^"]*"|'[^']*'|`[^`]*`|[^\s>]*)/gi, '');

  // 5. Remove srcdoc attributes (can embed full HTML documents)
  result = result.replace(/\bsrcdoc\s*=\s*(?:"[^"]*"|'[^']*'|`[^`]*`|[^\s>]*)/gi, '');

  // 6. Remove javascript: protocol (with whitespace/encoding obfuscation)
  //    Handles: javascript:, j avascript:, java\nscript:, etc.
  result = result.replace(/j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/gi, '');

  // 7. Remove vbscript: protocol
  result = result.replace(/v\s*b\s*s\s*c\s*r\s*i\s*p\s*t\s*:/gi, '');

  // 8. Remove ALL data: URIs (not just text/html — image/svg+xml can also execute JS)
  result = result.replace(/data\s*:[^\s,]*,/gi, '');
  // Also catch data: without comma (data:text/html;base64,...)
  result = result.replace(/data\s*:\s*\w+\/[\w+.-]+/gi, '');

  // 9. Remove expression() in remaining attribute values (IE CSS expression)
  result = result.replace(/expression\s*\(/gi, '');

  // 10. Remove any remaining HTML tags (keep text content)
  result = result.replace(/<[^>]*>/g, '');

  // 11. Remove remaining angle brackets that could form tags
  result = result.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return result.trim();
}

/**
 * Full sanitization with entity decoding and two passes
 * Two passes catch nested/double-encoded payloads that only reveal
 * themselves after the first pass removes outer layers
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;

  // First: decode HTML entities so encoded payloads are visible
  let decoded = decodeEntities(str);

  // Pass 1: sanitize decoded input
  let result = sanitizePass(decoded);

  // Decode again in case first pass exposed new encoded content
  let decodedAgain = decodeEntities(result);

  // Pass 2: catch anything that was nested/double-encoded
  if (decodedAgain !== result) {
    result = sanitizePass(decodedAgain);
  }

  return result;
}

/**
 * Recursively sanitize an object
 */
function sanitizeObject(obj, depth = 0) {
  if (depth > 10) return obj; // Prevent infinite recursion
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitizeString(obj);
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map((item) => sanitizeObject(item, depth + 1));

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip password/token fields
    if (SKIP_FIELDS.includes(key)) {
      sanitized[key] = value;
    } else {
      sanitized[key] = sanitizeObject(value, depth + 1);
    }
  }
  return sanitized;
}

/**
 * Express middleware — sanitize req.body, req.query, req.params
 */
function inputSanitizer(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }
  next();
}

module.exports = { inputSanitizer, sanitizeString, sanitizeObject };
