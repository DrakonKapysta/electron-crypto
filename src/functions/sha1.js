function sha1Pad(message) {
  const buffer = Buffer.from(message, "utf-8");
  const originalLength = BigInt(buffer.length * 8); // Довжина в бітах
  const blocks = [];

  // Добавляєм блоки по 512 біт (64 байта)
  for (let i = 0; i < buffer.length; i += 64) {
    blocks.push(buffer.slice(i, i + 64));
  }

  // Доповнення останнього блока
  let lastBlock = blocks[blocks.length - 1] || Buffer.alloc(0);
  const isMore = lastBlock.length >= 56;

  const padding = Buffer.alloc(64);
  padding[0] = 0x80; // добавляєм 1 біт

  const paddingLength = (lastBlock.length * 8) % 512;
  const zerosToAdd =
    paddingLength < 448 ? 448 - paddingLength : 512 - paddingLength + 512;

  lastBlock = Buffer.concat([
    lastBlock,
    padding.slice(0, Math.ceil(zerosToAdd / 8)),
  ]);

  if (isMore) {
    blocks[blocks.length - 1] = Buffer.from(lastBlock);
    lastBlock = Buffer.alloc(56); // Новий пустий блок
  }

  // Добавляєм довжину повідомлення в бітах
  const lengthBuffer = Buffer.alloc(8);
  lengthBuffer.writeUInt32BE(
    Number((originalLength >> BigInt(32)) & BigInt(0xffffffff)),
    0
  ); // старші 32 біта
  lengthBuffer.writeUInt32BE(Number(originalLength & BigInt(0xffffffff)), 4); // молодші 32 біта

  lastBlock = Buffer.concat([lastBlock, lengthBuffer]);
  isMore ? blocks.push(lastBlock) : (blocks[blocks.length - 1] = lastBlock);

  return blocks;
}

export function sha1(message) {
  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  const blocks = sha1Pad(message);

  for (const block of blocks) {
    const w = new Array(80);
    for (let i = 0; i < 16; i++) {
      w[i] = block.readUInt32BE(i * 4);
    }
    for (let i = 16; i < 80; i++) {
      w[i] =
        ((w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]) << 1) |
        ((w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]) >>> 31);
    }
    let a = h0,
      b = h1,
      c = h2,
      d = h3,
      e = h4;

    for (let i = 0; i < 80; i++) {
      let f, k;
      if (i < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (i < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (i < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }
      let temp = ((a << 5) | (a >>> 27)) + f + e + k + (w[i] >>> 0);
      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = temp >>> 0; // Беззнаковe приведення до цілого
    }
    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
  }
  const hash = Buffer.alloc(20);
  hash.writeUInt32BE(h0, 0);
  hash.writeUInt32BE(h1, 4);
  hash.writeUInt32BE(h2, 8);
  hash.writeUInt32BE(h3, 12);
  hash.writeUInt32BE(h4, 16);

  return hash.toString("hex");
}
