import { sha1 } from "./sha1";
import crypto from "crypto";

function isPrime(num) {
  if (num <= 1n) return false;
  if (num <= 3n) return true;
  if (num % 2n === 0n || num % 3n === 0n) return false;

  for (let i = 5n; i * i <= num; i += 6n) {
    if (num % i === 0n || num % (i + 2n) === 0n) return false;
  }
  return true;
}
function generateRandomHexString(bits) {
  const bytes = bits / 8;
  const hexString = Array(bytes)
    .fill()
    .map(() =>
      Math.floor(Math.random() * 0xff)
        .toString(16)
        .padStart(2, "0")
    )
    .join("");
  return BigInt(`0x${hexString}`);
}

function findSuitablePrime(q) {
  let k = 1n;

  while (true) {
    const p = k * q + 1n;

    if (isPrime(p)) {
      return p;
    }

    k++;
  }
}

export function generateParameters() {
  let q = generateRandomHexString(8);

  while (!isPrime(q)) {
    q = generateRandomHexString(8);
  }
  // console.log("q = ", q);

  const p = findSuitablePrime(q);
  // console.log("p = ", p);

  const g = modExp(2n, (p - 1n) / q, p);
  // console.log("g = ", g);

  return { p, q, g };
}
export function generateKeys(params) {
  const { p, q, g } = params;

  const x = randomBigInt(1n, q - 1n);

  const y = modExp(g, x, p);

  return { x, y };
}
function randomBigInt(min, max) {
  const range = max - min + 1n;
  const byteLength = (range.toString(2).length + 7) >> 3;
  let randomBigInt;

  do {
    const randomBytes = crypto.randomBytes(byteLength);
    randomBigInt = BigInt("0x" + randomBytes.toString("hex"));
  } while (randomBigInt >= range);

  return min + (randomBigInt % range);
}
function modExp(base, exponent, modulus) {
  if (modulus === 1n) return 0n;
  let result = 1n;
  base = base % modulus;
  while (exponent > 0) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    exponent = exponent >> 1n;
    base = (base * base) % modulus;
  }
  return result;
}
export function signMessage(params, keys, message) {
  const { p, q, g } = params;
  const { x } = keys;
  let s = 0n;
  let r = 0n;
  let k = 0n;

  const hash = BigInt("0x" + sha1(message));
  // console.log("Hash = ", hash);

  do {
    k = randomBigInt(2n, q - 1n);

    // console.log("K = ", k);

    r = modExp(g, k, p) % q;

    if (r === 0n) continue;

    const kInv = modInverse(k, q);
    s = (kInv * (hash + x * r)) % q;
  } while (s === 0n);

  return { r, s };
}
function modInverse(a, m) {
  let m0 = m;
  let y = 0n,
    x = 1n;

  if (m === 1n) return 0n;

  while (a > 1n) {
    const q = a / m;
    let t = m;

    m = a % m;
    a = t;
    t = y;

    y = x - q * y;
    x = t;
  }

  if (x < 0n) x += m0;

  return x;
}
export function verifySignature(params, keys, message, signature) {
  const { p, q, g } = params;
  const { y } = keys;
  const { r, s } = signature;

  if (r <= 0n || r >= q || s <= 0n || s >= q) return false;

  const hash = BigInt("0x" + sha1(message));

  const w = modInverse(s, q);

  const u1 = (hash * w) % q;
  const u2 = (r * w) % q;

  const v = ((modExp(g, u1, p) * modExp(y, u2, p)) % p) % q;

  return v === r;
}
