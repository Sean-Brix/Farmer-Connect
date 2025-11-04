// Re-export parseToken as authenticateToken for compatibility
import parseToken from './parseToken.js';

export const authenticateToken = parseToken;
export default parseToken;
