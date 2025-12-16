declare module 'flutterwave-node-v3' {
  export default class Flutterwave {
    constructor(publicKey: string, secretKey: string);
    Charge: any;
    Transaction: any;
  }
}
