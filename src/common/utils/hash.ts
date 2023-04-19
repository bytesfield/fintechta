import * as bcrypt from 'bcrypt';

export default class Hash {
  static async make(data: string | Buffer, rounds = 10) {
    const salt = await bcrypt.genSalt(rounds);

    return await bcrypt.hash(data, salt);
  }

  static async verify(data: string | Buffer, encrypted: string) {
    return await bcrypt.compare(data, encrypted);
  }
}
