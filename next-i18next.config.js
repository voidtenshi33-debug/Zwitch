/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'mr', 'hi'],
  },
  // This is a workaround for a bug in next-i18next. It's not a security issue.
  // We're telling next-i18next to not try to load translations from the server.
  // This is because we're using a static export, and so we don't have a server.
  // This is a known issue with next-i18next and static exports.
  // https://github.com/i18next/next-i18next/issues/1862
  ssg: false,
};
