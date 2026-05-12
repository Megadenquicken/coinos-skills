#!/usr/bin/env node
// AiCoin News & Flash CLI
import { apiGet, apiGetText, cli } from '../lib/aicoin-api.mjs';

function exchangeListingImpl({ language, memberIds, page_size, pageSize } = {}) {
  const p = {};
  if (language) p.language = language;
  if (memberIds) p.memberIds = memberIds;
  const ps = page_size || pageSize;
  if (ps) p.pageSize = ps;
  return apiGet('/api/v2/content/exchange-listing-flash', p);
}

cli({
  news_list: ({ page, page_size, pageSize = '20' } = {}) => {
    const p = { pageSize: page_size || pageSize };
    if (page) p.page = page;
    return apiGet('/api/v2/content/news-list', p);
  },
  news_detail: ({ id }) => apiGet('/api/v2/content/news-detail', { id }),
  // 该端点返 RSS XML 不是 JSON, 必须用 apiGetText 拿原文。
  // 返回 { contentType: "application/xml...", body: "<?xml..." }。
  // agent 拿到后自己解析 XML 或转告用户原文 (不要试图 JSON.parse)。
  news_rss: ({ page, page_size, pageSize = '20' } = {}) => {
    const p = { pageSize: page_size || pageSize };
    if (page) p.page = page;
    return apiGetText('/api/v2/content/square/market/news-list', p);
  },
  newsflash: ({ language } = {}) => {
    const p = {};
    if (language) p.language = language;
    return apiGet('/api/v2/content/newsflash', p);
  },
  flash_list: ({ language, createtime } = {}) => {
    const p = {};
    if (language) p.language = language;
    if (createtime) p.createtime = createtime;
    return apiGet('/api/v2/content/flashList', p);
  },
  exchange_listing: exchangeListingImpl,
  // alias: SKILL.md 早期用 exchange_listing_flash, 实际 action 是 exchange_listing
  exchange_listing_flash: exchangeListingImpl,
});
