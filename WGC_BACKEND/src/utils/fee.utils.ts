/**
 * WGC Fee Calculation Logic
 */
export class FeeUtility {
  private static CARD_PERCENT = 0.023; // 2.3%
  private static CARD_FLAT = 0.25;    // 25 cents
  private static ACH_FLAT = 0.25;     // 25 cents

  /**
   * Calculate fees based on amount and method
   */
  static calculate(amount: number, method: 'CARD' | 'ACH' = 'CARD') {
    let fee = 0;

    if (method === 'CARD') {
      fee = (amount * this.CARD_PERCENT) + this.CARD_FLAT;
    } else {
      fee = this.ACH_FLAT;
    }

    // Round to 2 decimal places
    fee = Math.round(fee * 100) / 100;
    
    const net = Math.max(0, amount - fee);

    return {
      gross: amount,
      fee,
      net
    };
  }
}
