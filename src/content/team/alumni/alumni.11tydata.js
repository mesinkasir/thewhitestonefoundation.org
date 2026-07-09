export default {
  layout: 'team-profile.njk',
  tags: ['teamProfile', 'teamAlumni'],
  eleventyComputed: {
    title: (data) => data.name,
    permalink: (data) => `/team/alumni/${data.name ? data.name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : data.page.fileSlug}/`
  }
};
