import { readFile } from 'fs/promises';

const logReader = (...args: any) => {
  if (false) {
    console.log(...args);
  }
}
class Reader {
  str: string;
  cursor: number;
  remaining: string;

  constructor(input: string) {
    this.str = input;
    this.cursor = 0;
    this.remaining = "";
  }

  _byteToBits(hexStr: string) {
    const binary = hexStr.split('')
      .map(hex => parseInt(hex, 16).toString(2).padStart(hex.length * 4, "0"))
      .join('');
    logReader(hexStr, "->", binary);
    return binary;
  }

  read(bitCount: number = 1) {
    let result = "";
    while (bitCount > 0) {
      const byteCount = Math.floor(bitCount / 4);
      logReader("top: bitCount", bitCount, "bytes", byteCount, "result", result, result.length)
      if (this.remaining.length > 0) {
        const bits = Math.min(bitCount, this.remaining.length);
        const include = this.remaining.substr(0, bits);
        logReader("bits", bits, "include", include);
        if (bits < this.remaining.length) {
          this.remaining = this.remaining.substr(bits);
        } else {
          this.remaining = "";
        }
        result += include;
        bitCount -= bits;
      } else if (byteCount > 0) {
        const hexPart = this.str.substr(this.cursor, byteCount);
        this.cursor += byteCount;
        const binary = this._byteToBits(hexPart);
        logReader("hexPart", hexPart, "binary", binary);
        result += binary;
        bitCount -= byteCount * 4;
      } else {
        const binary = this._byteToBits(this.str.charAt(this.cursor));
        this.cursor++;
        const include = binary.substr(0, bitCount);
        const remaining = binary.substr(bitCount);
        logReader("binary", binary, "include", include, "remaining", remaining);
        result += include;
        bitCount -= bitCount;
        this.remaining = remaining;
      }
    }
    // console.log("--read", result);
    return result;
  }

  readAll() {
    return this.read(this.remainingData());
  }

  hasData() {
    return this.remainingData() != 0;
  }

  remainingData() {
    return (this.str.length - this.cursor) * 4 + this.remaining.length;
  }
}

const bin = (binaryStr: string) => parseInt(binaryStr, 2);

const packetLog = (...args: any[]) => {
  if (false) {
    console.log(...args);
  }
}
const readPacket = (reader: Reader, depth: number = 1) => {
  // console.log("-----------".repeat(depth))
  const isLiteral = (type: number) => type == 4;
  const versionBits = reader.read(3);
  const version = bin(versionBits);
  packetLog("#version", version, versionBits);
  const typeBits = reader.read(3);
  const type = bin(typeBits);
  packetLog("#type", type, typeBits);
  let versionSum = 0;
  if (isLiteral(type)) {
    let binString = "";
    let indicator = 1;
    while (indicator != 0) {
      indicator = bin(reader.read());
      binString += reader.read(4);
    }
    const number = bin(binString);
    packetLog("#number", number);
  } else {
    packetLog("#operator type", type);
    const lengthType = bin(reader.read());
    packetLog("#lengthType", lengthType);
    if (lengthType == 0) {
      const bitLength = bin(reader.read(15));
      let bitsToRead = bitLength;
      packetLog("#bitsToRead", bitsToRead);
      while(bitsToRead > 0) {
        const start = reader.remainingData();
        versionSum += readPacket(reader, depth + 1);
        const end = reader.remainingData();
        bitsToRead -= (start - end);
      }
      if (bitsToRead != 0) {
        console.log("read unexpected number of bytes", bitsToRead);
      }
    } else {
      const numPackets = bin(reader.read(11));
      packetLog("#numPackets", numPackets);

      for (let i = 0; i < numPackets; i++) {
        versionSum += readPacket(reader, depth + 1);
      }
    }
  }
  return version + versionSum;
}

const operate = (operatorType: number, operatorPackets: number[]): number => {
  switch (operatorType) {
    case 0:
     //sum
     return operatorPackets.reduce((a, c) => a + c);
    case 1:
      //product
      return operatorPackets.reduce((a, c) => a * c);
    case 2:
      //minimum
      return Math.min(...operatorPackets);
    case 3:
      // maximum
      return Math.max(...operatorPackets);
    case 4:
      throw new Error("unexpected literal");
    case 5:
      // greater than
      if (operatorPackets.length != 2) {
        throw new Error(`greater than: expected 2 packets, but got ${operatorPackets.join()}`);
      }
      return operatorPackets[0] > operatorPackets[1] ? 1 : 0;
    case 6:
      // less than
      if (operatorPackets.length != 2) {
        throw new Error(`less than: expected 2 packets, but got ${operatorPackets.join()}`);
      }
      return operatorPackets[0] < operatorPackets[1] ? 1 : 0;
    case 7:
      // equal
      if (operatorPackets.length != 2) {
        throw new Error(`equal to: expected 2 packets, but got ${operatorPackets.join()}`);
      }
      return operatorPackets[0] == operatorPackets[1] ? 1 : 0;
    default:
      throw new Error(`unexpected operator type: ${operatorType}`)
  }
}

const readPacketP2 = (reader: Reader, depth: number = 1): number => {
  // console.log("-----------".repeat(depth))
  const isLiteral = (type: number) => type == 4;
  const versionBits = reader.read(3);
  const version = bin(versionBits);
  packetLog("#version", version, versionBits);
  const typeBits = reader.read(3);
  const type = bin(typeBits);
  packetLog("#type", type, typeBits);
  if (isLiteral(type)) {
    let binString = "";
    let indicator = 1;
    while (indicator != 0) {
      indicator = bin(reader.read());
      binString += reader.read(4);
    }
    const number = bin(binString);
    packetLog("#number", number);
    return number;
  } else {
    packetLog("#operator type", type);
    const lengthType = bin(reader.read());
    packetLog("#lengthType", lengthType);
    const operatorPackets: number[] = []
    if (lengthType == 0) {
      const bitLength = bin(reader.read(15));
      let bitsToRead = bitLength;
      packetLog("#bitsToRead", bitsToRead);
      while(bitsToRead > 0) {
        const start = reader.remainingData();
        operatorPackets.push(readPacketP2(reader, depth + 1));
        const end = reader.remainingData();
        bitsToRead -= (start - end);
      }
      if (bitsToRead != 0) {
        console.log("read unexpected number of bytes", bitsToRead);
      }
    } else {
      const numPackets = bin(reader.read(11));
      packetLog("#numPackets", numPackets);

      for (let i = 0; i < numPackets; i++) {
        operatorPackets.push(readPacketP2(reader, depth + 1));
      }
    }
    return operate(type, operatorPackets);
  }
}


const p1 = (file: Buffer | string) => {
  const string = file.toString().replace('\n', '');
  const reader = new Reader(string);

  let sum = 0;
  // while (reader.hasData()) {
  //   sum += readPacket(reader);
  // }
  console.log("sum is", readPacket(reader));
}

const p2 = (file: Buffer) => {
  const string = file.toString().replace('\n', '');
  const reader = new Reader(string);

  console.log("sum is", readPacketP2(reader));

}

const run = async () => {
  const file = await readFile("day16/input.txt");
  // p1(file);
  p2(file);
}

run();
