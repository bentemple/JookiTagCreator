const nfc_secret = [
  0x03, 0x9c, 0x25, 0x6f, 0xb9, 0x2e, 0xe8, 0x08, 0x09, 0x83, 0xd9, 0x33, 0x56,
];
const iv = [0x80, 0x77, 0x51];
const JOOKI_UID_LEN = 7;
const JOOKI_PLAIN_LEN = 12;

export const tiles = {
    256: 'Jooki.Dragon',
    257: 'Jooki.Fox',
    258: 'Jooki.Ghost',
    259: 'Jooki.Knight',
    260: 'Jooki.ThankYou',
    261: 'Jooki.Whale',
    262: 'Jooki.Black.Dragon',
    263: 'Jooki.Black.Fox',
    264: 'Jooki.Black.Knight',
    265: 'Jooki.Black.Whale',
    266: 'Jooki.White.Dragon',
    267: 'Jooki.White.Fox',
    268: 'Jooki.White.Knight',
    269: 'Jooki.White.Whale',
    512: 'Jooki.Flat',
    528: 'G2.Orange',
    529: 'G2.DarkBlue',
    530: 'G2.Turquoise',
    531: 'G2.Yellow',
    532: 'G2.Red',
    533: 'G2.Purple',
    534: 'G2.Green',
    535: 'G2.Pink',
    768: 'sys.record',
    769: 'sys.factory_mode_on',
    770: 'sys.factory_mode_off',
    771: 'sys.airplane_mode_on',
    772: 'sys.airplane_mode_off',
    773: 'sys.toy_safe_on',
    774: 'sys.toy_safe_off',
    775: 'sys.wifi_on',
    776: 'sys.wifi_off',
    777: 'sys.bt_on',
    778: 'sys.bt_off',
    779: 'sys.production_finished',
    780: 'sys.production_test_start',
    781: 'sys.production_test_buttons',
    782: 'sys.production_test_audio',
    783: 'sys.production_test_radio',
    1023: 'sys.factory_reset',
    1024: 'test.0',
    1025: 'test.1',
    1026: 'test.2',
    1027: 'test.3',
    1028: 'test.4',
    1029: 'test.5',
    1030: 'test.6',
    1031: 'test.7',
    1032: 'test.8',
    1033: 'test.9',
    1040: 'test.10',
    1041: 'test.11',
    1042: 'test.12',
    1043: 'test.13',
    1044: 'test.14',
    1045: 'test.15',
    1046: 'test.16',
    1047: 'test.17',
    1048: 'test.18',
    1049: 'test.19',
    1056: 'test.20',
    2304: 'Jooki.Temp0',
    2305: 'Jooki.Temp1',
    2306: 'Jooki.Temp2',
    2307: 'Jooki.Temp3',
    2308: 'Jooki.Temp4',
    2309: 'Jooki.Temp5',
    2310: 'Jooki.Temp6',
    2311: 'Jooki.Temp7',
    2312: 'Jooki.Temp8',
    2313: 'Jooki.Temp9',
}

function parseStringToHex(s: string): number[] {
  const res: number[] = [];
  if (s.indexOf(':') > -1) {
    const parts = s.split(':');
    for (const part of parts) {
      res.push(parseInt(part, 16));
    }
  } else {
    for (let i = 0; i < JOOKI_UID_LEN; i++) {
      res.push(parseInt(s.substring(i * 2, (i + 1) * 2), 16));
    }
  }
  return res;
}

function getUrlParam(tid: number, uid: number[]) {
  const d = [
    iv[0],
    iv[1],
    iv[2],
    (tid >> 8) & 0xff,
    tid & 0xff,
    uid[0],
    uid[1],
    uid[2],
    uid[3],
    uid[4],
    uid[5],
    uid[6],
  ];
  const enc: number[] = [];
  for (let i = 0; i < JOOKI_PLAIN_LEN; i++) {
    if (i < 3) {
      enc[i] = d[i] ^ nfc_secret[i];
    } else {
      enc[i] = d[i] ^ nfc_secret[i] ^ d[i % 3];
    }
  }
  const p = btoa(enc.map((n) => String.fromCodePoint(n)).join(''));
  return p;
}

export async function createUrl(tag: number, serial: string): Promise<string> {
  const clipTextMatches =
    /[0-9a-fA-F]{2}(:[0-9a-fA-F]{2})+/.test(serial) ||
    /[0-9a-fA-F]{14}/.test(serial);
  //const serial = "04002B4A6B1191";
  //const uid = [0x04, 0xFA, 0x2B, 0x4A, 0x6B, 0x11, 0x90];
  const uid = parseStringToHex(serial);
  const baseUrl = 'https://s.jooki.rocks/s/?s=';
  const p = getUrlParam(tag, uid);
  const url = baseUrl + p;
  return url;
}
