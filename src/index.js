/*
Primary Attribution
Richard Moore <ricmoo@me.com>
https://github.com/ethers-io

Note, Richard is a god of ether gods. Follow and respect him, and use Ethers.io!
*/

const zero = BigInt(0);
const negative1 = BigInt(-1);

function numberToBigInt(arg) {
  if (typeof arg === "string") {
    return BigInt(arg);
  }
  if (typeof arg === "number") {
    return BigInt(arg);
  }
  // eslint-disable-next-line valid-typeof
  if (typeof arg === "bigint") {
    return arg;
  }
  if (typeof arg === "object" && arg !== null) {
    if (typeof arg.toString === "function") {
      return BigInt(arg.toString());
    }
  }
  throw new Error(`Cannot convert ${typeof arg} to BigInt`);
}

// complete ethereum unit map
const unitMap = {
  noether: "0", // eslint-disable-line
  wei: "1", // eslint-disable-line
  kwei: "1000", // eslint-disable-line
  Kwei: "1000", // eslint-disable-line
  babbage: "1000", // eslint-disable-line
  femtoether: "1000", // eslint-disable-line
  mwei: "1000000", // eslint-disable-line
  Mwei: "1000000", // eslint-disable-line
  lovelace: "1000000", // eslint-disable-line
  picoether: "1000000", // eslint-disable-line
  gwei: "1000000000", // eslint-disable-line
  Gwei: "1000000000", // eslint-disable-line
  shannon: "1000000000", // eslint-disable-line
  nanoether: "1000000000", // eslint-disable-line
  nano: "1000000000", // eslint-disable-line
  szabo: "1000000000000", // eslint-disable-line
  microether: "1000000000000", // eslint-disable-line
  micro: "1000000000000", // eslint-disable-line
  finney: "1000000000000000", // eslint-disable-line
  milliether: "1000000000000000", // eslint-disable-line
  milli: "1000000000000000", // eslint-disable-line
  ether: "1000000000000000000", // eslint-disable-line
  kether: "1000000000000000000000", // eslint-disable-line
  grand: "1000000000000000000000", // eslint-disable-line
  mether: "1000000000000000000000000", // eslint-disable-line
  gether: "1000000000000000000000000000", // eslint-disable-line
  tether: "1000000000000000000000000000000", // eslint-disable-line
};

/**
 * Returns value of unit in Wei
 *
 * @method getValueOfUnit
 * @param {String} unit the unit to convert to, default ether
 * @returns {bigint} value of the unit (in Wei)
 * @throws error if the unit is not correct:w
 */
function getValueOfUnit(unitInput) {
  const unit = unitInput ? unitInput.toLowerCase() : "ether";
  var unitValue = unitMap[unit]; // eslint-disable-line

  if (typeof unitValue !== "string") {
    throw new Error(
      `[ethjs-unit] the unit provided ${unitInput} doesn't exists, please use the one of the following units ${JSON.stringify(
        unitMap,
        null,
        2
      )}`
    );
  }

  return BigInt(unitValue);
}

/**
 * Converts a number to a string
 *
 * @method numberToString
 * @param {Number|bigint|String|Object} arg the number to convert to a string
 * @returns {String} the string representation of the number
 * @throws error if the number is invalid
 */
function numberToString(arg) {
  if (typeof arg === "string") {
    if (!arg.match(/^-?[0-9.]+$/)) {
      throw new Error(
        `while converting number to string, invalid number value '${arg}', should be a number matching (^-?[0-9.]+).`
      );
    }
    return arg;
  }
  if (typeof arg === "number") {
    return String(arg);
  }
  // eslint-disable-next-line valid-typeof
  if (typeof arg === "bigint") {
    return arg.toString();
  }
  if (
    typeof arg === "object" &&
    arg.toString &&
    (arg.toTwos || arg.dividedToIntegerBy)
  ) {
    if (arg.toPrecision) {
      return String(arg.toPrecision());
    }
    return arg.toString(10);
  }
  throw new Error(
    `while converting number to string, invalid number value '${arg}' type ${typeof arg}.`
  );
}

/**
 * Converts a number from Wei to a string
 *
 * @method fromWei
 * @param {Number|bigint|String|Object} weiInput the number to convert from Wei
 * @param {String} unit the unit to convert to, default ether
 * @param {Object} options the options to use for the conversion
 * @returns {String} the string representation of the number
 * @throws error if the number is invalid
 */
function fromWei(weiInput, unit, optionsInput) {
  var wei = numberToBigInt(weiInput); // eslint-disable-line
  var negative = wei < zero; // eslint-disable-line
  const base = getValueOfUnit(unit);
  const baseLength = unitMap[unit].length - 1 || 1;
  const options = optionsInput || {};

  if (negative) {
    wei = wei * negative1;
  }

  var fraction = (wei % base).toString(); // eslint-disable-line

  while (fraction.length < baseLength) {
    fraction = `0${fraction}`;
  }

  if (!options.pad) {
    fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1]; // eslint-disable-line prefer-destructuring
  }

  var whole = (wei / base).toString(); // eslint-disable-line

  if (options.commify) {
    whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  var value = `${whole}${fraction == "0" ? "" : `.${fraction}`}`; // eslint-disable-line

  if (negative) {
    value = `-${value}`;
  }

  return value;
}

/**
 * Converts a number to Wei
 *
 * @method toWei
 * @param {Number|bigint|String|Object} etherInput the number to convert to Wei
 * @param {String} unit the unit to convert to, default ether
 * @returns {bigint} the number in Wei
 * @throws error if the number is invalid
 */
function toWei(etherInput, unit) {
  var ether = numberToString(etherInput); // eslint-disable-line
  const base = getValueOfUnit(unit);
  const baseLength = unitMap[unit].length - 1 || 1;

  // Is it negative?
  var negative = ether.substring(0, 1) === "-"; // eslint-disable-line
  if (negative) {
    ether = ether.substring(1);
  }

  if (ether === ".") {
    throw new Error(
      `[ethjs-unit] while converting number ${etherInput} to wei, invalid value`
    );
  }

  // Split it into a whole and fractional part
  var comps = ether.split("."); // eslint-disable-line
  if (comps.length > 2) {
    throw new Error(
      `[ethjs-unit] while converting number ${etherInput} to wei,  too many decimal points`
    );
  }

  let whole = comps[0];
  let fraction = comps[1]; // eslint-disable-line

  if (!whole) {
    whole = "0";
  }
  if (!fraction) {
    fraction = "0";
  }
  if (fraction.length > baseLength) {
    throw new Error(
      `[ethjs-unit] while converting number ${etherInput} to wei, too many decimal places`
    );
  }

  while (fraction.length < baseLength) {
    fraction += "0";
  }

  whole = BigInt(whole);
  fraction = BigInt(fraction);
  var wei = whole * base + fraction; // eslint-disable-line

  if (negative) {
    wei = wei * negative1;
  }

  return wei;
}

module.exports = {
  unitMap,
  numberToString,
  getValueOfUnit,
  fromWei,
  toWei,
};
