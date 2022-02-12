/** Trims the incoming string by trimLength value of symbols, adding '...' in the end. */

function stringTrimmer(value: string, trimLength: number) {
  return value.slice(0, trimLength - 3).concat("...");
}

export default stringTrimmer;
