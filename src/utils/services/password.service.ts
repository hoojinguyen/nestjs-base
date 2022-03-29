import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordService {
  constructor() {
    // empty
  }

  public async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  public comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }
}
