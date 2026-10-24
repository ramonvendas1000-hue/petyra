/** Pure rules only. Load authoritative prices, membership and stock on the server. */
export type SalesChannel = 'tutor_app' | 'counter';
export interface CheckoutLine {
  id: string;
  organizationId: string;
  kind: 'product' | 'service';
  quantity: number;
  unitPriceCents: number;
  /** Total discount for this line, already allocated by the server. */
  discountCents?: number;
}
export interface QuotedLine {
  id: string;
  kind: CheckoutLine['kind'];
  netCents: number;
  dueNowCents: number;
  remainingCents: number;
  platformFeeCents: number;
}
const MAX = BigInt(Number.MAX_SAFE_INTEGER);
function integer(value: number, label: string, minimum = 0): bigint {
  if (!Number.isSafeInteger(value) || value < minimum) throw new RangeError(label);
  return BigInt(value);
}
function safe(value: bigint): number {
  if (value < 0n || value > MAX) throw new RangeError('Money exceeds safe integer range');
  return Number(value);
}
function percent(cents: bigint, rate: bigint): bigint {
  return (cents * rate + 50n) / 100n;
}
export function quoteCheckout(input: {
  organizationId: string;
  channel: SalesChannel;
  lines: readonly CheckoutLine[];
  /** Applies only to service lines. Products are paid in full. */
  serviceDepositPercent?: number;
}) {
  if (!input.organizationId || !['tutor_app', 'counter'].includes(input.channel)) {
    throw new Error('Invalid checkout context');
  }
  if (!input.lines.length) throw new Error('Empty cart');
  const deposit = integer(input.serviceDepositPercent ?? 100, 'Invalid deposit');
  if (deposit > 100n) throw new RangeError('Deposit must be between 0 and 100');
  const seen = new Set<string>();
  const lines: QuotedLine[] = input.lines.map(line => {
    if (!line.id || seen.has(line.id)) throw new Error('Invalid or duplicate line');
    seen.add(line.id);
    if (line.organizationId !== input.organizationId) throw new Error('Cross-tenant cart');
    if (!['product', 'service'].includes(line.kind)) throw new Error('Invalid line kind');
    const gross = integer(line.unitPriceCents, 'Invalid price') * integer(line.quantity, 'Invalid quantity', 1);
    safe(gross);
    const discount = integer(line.discountCents ?? 0, 'Invalid discount');
    if (discount > gross) throw new RangeError('Discount exceeds line total');
    const net = gross - discount;
    const dueNow = line.kind === 'product' ? net : percent(net, deposit);
    const fee = input.channel === 'tutor_app' && line.kind === 'product' ? percent(net, 8n) : 0n;
    return {id: line.id, kind: line.kind, netCents: safe(net), dueNowCents: safe(dueNow),
      remainingCents: safe(net - dueNow), platformFeeCents: safe(fee)};
  });
  const sum = (key: keyof Pick<QuotedLine, 'netCents'|'dueNowCents'|'remainingCents'|'platformFeeCents'>) =>
    safe(lines.reduce((total, line) => total + BigInt(line[key]), 0n));
  const totalCents = sum('netCents');
  const dueNowCents = sum('dueNowCents');
  const platformFeeCents = sum('platformFeeCents');
  return {organizationId: input.organizationId, channel: input.channel, lines, totalCents,
    dueNowCents, remainingCents: sum('remainingCents'), platformFeeCents,
    merchantGrossCents: dueNowCents - platformFeeCents,
    gatewayFeeCents: null as number | null};
}
