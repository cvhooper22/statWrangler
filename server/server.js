let ex = require('express');
const rp = require('request-promise');
const cheerio = require('cheerio');
// https://stackoverflow.com/questions/16088824/serve-static-files-and-app-get-conflict-using-express-js

const port = 3666;
const server = ex();
const year = 2018;
const gamelogsUrl = '/gamelog/';
console.log('__dirname is', __dirname);
server.use(ex.static(__dirname + '/../public'));

server.get('/team_logs/:team', function (req, resp) {
  // do team stuff
});

server.get('/player_logs/:player', function (req, resp) {
  const uri = `https://www.sports-reference.com/${player}${gamelogsUrl}${year}`;
  const options = {
    uri,
    transform: function (body) {
      return cheerio.load(body);
    }
  };
  rp(options)
    .then(($) => {
      const table = $('#all_gamelog').find('tbody');
      const rows = $(table).find('tr');
      console.log('there are this many games', rows.length);
      const games = rows.map(function (i, elem) {
        return {
          opp: $("td[data-stat='opp_name'] a", this).text(),
          location: $("td[data-stat='game_location']", this).text(),
          type: $("td[data-stat='game_type']", this).text(),
          result: $("td[data-stat='game_result']", this).text(),
          started: $("td[data-stat='gs']", this).text(),
          mp: $("td[data-stat='mp']", this).text(),
          fg: $("td[data-stat='fg']", this).text(),
          fgs: $("td[data-stat='fga']", this).text(),
          fgPct: $("td[data-stat='fg_pct']", this).text(),
          fg2: $("td[data-stat='fg2']", this).text(),
          fg2a: $("td[data-stat='fg2a']", this).text(),
          fg2Pct: $("td[data-stat='fg2_pct']", this).text(),
          fg3: $("td[data-stat='fg3']", this).text(),
          fg3a: $("td[data-stat='fg3a']", this).text(),
          fg3Pct: $("td[data-stat='fg3_pct']", this).text(),
          ft: $("td[data-stat='ft']", this).text(),
          fta: $("td[data-stat='fta']", this).text(),
          ftPct: $("td[data-stat='ft_pct']", this).text(),
          orb: $("td[data-stat='orb']", this).text(),
          drb: $("td[data-stat='drb']", this).text(),
          trb: $("td[data-stat='trb']", this).text(),
          ast: $("td[data-stat='ast']", this).text(),
          stl: $("td[data-stat='stl']", this).text(),
          blk: $("td[data-stat='blk']", this).text(),
          tov: $("td[data-stat='tov']", this).text(),
          pf: $("td[data-stat='pf']", this).text(),
          pts: $("td[data-stat='pts']", this).text(),
        };
      }).get();
      res.send(games);
    })
    .catch((err) => {
      console.log(err);
      res.send('Error loading stats', err);
    });
});
server.listen(port).on('error', (err) => console.log('error', err));
console.log('successfully started server on port ', port);