export default {
  layout: 'team-profile.njk',
  tags: ['teamProfile'],
  eleventyComputed: {
    title: (data) => data.name,
    permalink: (data) => `/team/${data.name ? data.name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : data.page.fileSlug}/`
  }
};
