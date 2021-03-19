import { container } from 'tsyringe';

import RedisCacheProvider from './implementations/RedisCacheProvider';
import ICacheProvider from './models/ICacheprovider';

const providers = {
  redis: RedisCacheProvider,
};

container.registerSingleton<ICacheProvider>('CacheProvider', providers.redis);
