import { getImageUrl } from './supabase';

export const insertCoverImage = (
  title: string,
  markdown: string,
  coverImagePath: string
): string => {
  const string = `\n![${title}](${getImageUrl(coverImagePath)})\n`;
  return `${string}${markdown}`;
};

export const insertCanonicalUrl = (markdown: string, url: string): string => {
  const string = `\n*This article was originally published on [my blog](${url}).*\n`;
  return `${string}${markdown}`;
};

export const getCanonicalUrl = (slug: string): string => {
  return `${process.env.HASHNODE_URL}/${slug}`;
};

export const getImages = (markdown: string): string[] => {
  const regex = /!\[.*\]\((.*)\)/g;
  const matches = markdown.match(regex);
  return matches ? matches.map((match) => match.replace(regex, '$1')) : [];
};
