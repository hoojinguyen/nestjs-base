import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async setString(key: string, data: string) {
    return await this.cacheManager.set(key, data);
  }

  public getString(key: string) {
    return this.cacheManager.get(key);
  }

  public setObject(key: string, data: Record<string, any>) {
    return this.cacheManager.set(key, JSON.stringify(data));
  }

  public async getObject(key: string) {
    const data = await this.cacheManager.get<string>(key);
    return JSON.parse(data || '{}');
  }
}
