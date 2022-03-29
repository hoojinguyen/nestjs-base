import * as fs from 'fs';
import * as glob from 'glob';

import { BaseService } from '@base/base.service';
import { FilterOperator } from 'nestjs-paginate';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RulesService extends BaseService {
  protected filterableColumns: any = {
    roleId: [FilterOperator.EQ],
  };

  public loadACL() {
    const options = null;

    return new Promise((resolve, reject) => {
      glob('src/**/acl.json', options, (error, paths) => {
        if (error) {
          reject(error);
        }

        const acl: any = {};

        for (const path of paths) {
          const patterns = path.split('/');
          let tmp = acl;
          patterns.shift();
          const fileName = patterns.pop();
          patterns.pop();
          patterns.push(fileName);

          for (const pattern of patterns) {
            if (!tmp.children) {
              tmp.children = {};
            }

            if (pattern === 'acl.json') {
              const data = JSON.parse(fs.readFileSync(path, 'utf8'));
              Object.assign(tmp, data);
            } else if (tmp.children[pattern]) {
              tmp = tmp.children[pattern];
            } else {
              tmp.children[pattern] = {};
              tmp = tmp.children[pattern];
            }
          }
        }

        resolve(acl.children);
      });
    });
  }
}
