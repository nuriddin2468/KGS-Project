import config from "../config";
import Queue from 'bull';
import redisService from "./redis.service";

export interface ItemResponse {
    market_hash_name: string,
    currency: string,
    suggested_price: number,
    item_page: string,
    market_page: string,
    min_price: number,
    max_price: number,
    mean_price: number,
    median_price: number,
    quantity: number,
    created_at: number,
    updated_at: number
}

export interface CacheResponse {
     market_hash_name: string,
    tradable_min_price: number,
    nonTradable_min_price: number,
}

class SkinportService {
    private readonly url = 'https://api.skinport.com/v1';
    private readonly requestQueue = new Queue('skinport', config.REDIS_URL);

    constructor() {
        this.requestQueue.process(async (job, done) => {
           try {
             const items = await this.mapItems();
            redisService.set('items', JSON.stringify(items));
            done();
           } catch {
             done(new Error('some unexpected error'));
           }
        });
        this.requestQueue.add(null);

        // запуск  таски каждые 5 минут (according to docs)
        this.requestQueue.add(null, {repeat: {cron: '*/5 * * * *'}});
    }

    getMappedItems() {
        return redisService.get('items');
    }

    private fetchItems(tradable: boolean): Promise<ItemResponse[]> {
        return fetch(`${this.url}/items?tradable=${tradable ? 'true': 'false'}`, {
                method: 'GET',
                headers: {
                    'Accept-Encoding': 'br',
                    'Authorization': `Basic ${config.SKINPORT_TOKEN}`
                }
            }).then((res) => res.json())
    }

    private async mapItems() {
        const [tradable, nonTradable] = await Promise.all([this.fetchItems(true), this.fetchItems(false)]);
        return tradable.map(tr => {
            const item = nonTradable.find(nonTr => nonTr.market_hash_name === tr.market_hash_name);
            return {
                market_hash_name: tr.market_hash_name,
                tradable_min_price: tr.min_price,
                nonTradable_min_price: item?.min_price,
            } as CacheResponse
        });
    }
}

export default new SkinportService();