import got from 'got';
import cheerio from 'cheerio';
import unshorten from 'unshorten';

function doUnshorten(shortUrl) {
  return new Promise(resolve => {
    unshorten(shortUrl, url => {
      resolve(url);
    });
  });
}

const TuSerie = {
  search(query, callback) {
    got(`http://tuserie.com/?s=${query}`)
        .then(data => {
          const $ = cheerio.load(data.body);
          const episodes = [];

          $('.content-main .content .post-main h2 a').each(function () {
            episodes.push($(this).attr('href'));
          });
          callback(null, episodes);
        })
        .catch(err => {
          callback(err);
        });
  },
  getMegaLinks(episode, callback) {
    got(episode)
        .then(data => {
          const $ = cheerio.load(data.body);
          const promises = [];
          $('.content-main .post-main .post p strong a').each(function el() {
            if ($(this).contents()[0].data.indexOf('MEGA') === -1) {
              return;
            }
            promises.push(doUnshorten($(this).attr('href')));
          });

          Promise.all(promises).then(links => {
            callback(null, links);
          });
        })
        .catch(err => {
          callback(err);
        });
  },
};

export default TuSerie;
