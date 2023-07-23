import fetch from 'node-fetch';

import { Article } from '../interfaces/article.js';
import { CreateDevToArticleRequest } from '../interfaces/create-dev-to-article-request.js';
import { CreateDevToArticleResponse } from '../interfaces/create-dev-to-article-response.js';
import { getCoverImageUrl, insertCanonicalUrl } from '../utils/markdown.js';

export const publishArticleOnDevTo = async ({
  content,
  canonicalUrl,
  coverImagePath,
  tags,
  title,
}: Required<Article>): Promise<void> => {
  if (tags.length > 4)
    console.warn('publishArticleOnDevTo: more than 4 tags, publishing only first 4');

  const requestBody: CreateDevToArticleRequest = {
    title,
    body_markdown: insertCanonicalUrl(content, canonicalUrl),
    published: false,
    main_image: getCoverImageUrl(coverImagePath),
    canonical_url: canonicalUrl,
    tags: tags.map((tag) => tag.replace(/-/g, '')).slice(0, 4),
  };

  const response = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'api-key': process.env.DEV_TO_KEY,
      accept: 'application/vnd.forem.api-v1+json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ article: requestBody }),
  });
  const responseJson = (await response.json()) as CreateDevToArticleResponse;

  if (responseJson.error) throw new Error(`Dev.to: ${responseJson.status} ${responseJson.error}`);

  console.log(`Dev.to: published draft article '${title}'`);
};