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
  const uri = `https://www.sports-reference.com/cbb/schools/${req.params.team}/${year}-gamelogs.html`;
  const options = {
    uri,
    transform: function (body) {
      return cheerio.load(body);
    }
  };
  rp(options)
    .then(($) => {
      const table = $('div.table_outer_container').find('tbody');
      const rows = $(table).find('tr:not(.thead)');
      console.log('there are this many games', rows.length);
      const games = rows.map(function (i, elem) {
        const game = {
          opp: $("td[data-stat='opp_id'] a", this).text(),
          location: $("td[data-stat='game_location']", this).text(),
          result: $("td[data-stat='game_result']", this).text(),
          pts: $("td[data-stat='pts']", this).text(),
          oppPts: $("td[data-stat='opp_pts']", this).text(),
          fg: $("td[data-stat='fg']", this).text(),
          fga: $("td[data-stat='fga']", this).text(),
          fgPct: $("td[data-stat='fg_pct']", this).text(),
          fg3: $("td[data-stat='fg3']", this).text(),
          fg3a: $("td[data-stat='fg3a']", this).text(),
          fg3Pct: $("td[data-stat='fg3_pct']", this).text(),
          ft: $("td[data-stat='ft']", this).text(),
          fta: $("td[data-stat='fta']", this).text(),
          ftPct: $("td[data-stat='ft_pct']", this).text(),
          orb: $("td[data-stat='orb']", this).text(),
          trb: $("td[data-stat='trb']", this).text(),
          ast: $("td[data-stat='ast']", this).text(),
          stl: $("td[data-stat='stl']", this).text(),
          blk: $("td[data-stat='blk']", this).text(),
          tov: $("td[data-stat='tov']", this).text(),
          pf: $("td[data-stat='pf']", this).text(),
          oppFg: $("td[data-stat='opp_fg']", this).text(),
          oppFga: $("td[data-stat='opp_fga']", this).text(),
          oppFgPct: $("td[data-stat='opp_fg_pct']", this).text(),
          oppFg3: $("td[data-stat='opp_fg3']", this).text(),
          oppFg3a: $("td[data-stat='opp_fg3a']", this).text(),
          oppFg3Pct: $("td[data-stat='opp_fg3_pct']", this).text(),
          oppFt: $("td[data-stat='opp_ft']", this).text(),
          oppFta: $("td[data-stat='opp_fta']", this).text(),
          oppFtPct: $("td[data-stat='opp_ft_pct']", this).text(),
          oppOrb: $("td[data-stat='opp_orb']", this).text(),
          oppTrb: $("td[data-stat='opp_trb']", this).text(),
          oppAst: $("td[data-stat='opp_ast']", this).text(),
          oppStl: $("td[data-stat='opp_stl']", this).text(),
          oppBlk: $("td[data-stat='opp_blk']", this).text(),
          oppTov: $("td[data-stat='opp_tov']", this).text(),
          oppPf: $("td[data-stat='opp_pf']", this).text(),
        };
        game.drb = game.trb - game.orb;
        game.oppDrb = game.oppTrb - game.oppOrb;
        game.fg2 = game.fg - game.fg3;
        game.fg2a = game.fga - game.fg3a;
        game.fg2Pct = game.fg2 / game.fg2a;
        game.oppFg2 = game.oppFg - game.oppFg3;
        game.oppFg2a = game.oppFga - game.oppFg3a;
        game.oppFg2Pct = game.oppFg2 / game.oppFg2a;
        return game;
      }).get();
      resp.status(200).send(games);
    })
    .catch((err) => {
      console.log(err);
      resp.status(500).send({ error: err, message: 'Error loading team gamelog' });
    });
});

server.get('/team_roster/:team', function (req, resp) {
  const uri = `https://www.sports-reference.com/cbb/schools/${req.params.team}/2018.html`;
  const options = {
    uri,
    transform: function (body) {
      return cheerio.load(body);
    }
  };
  rp(options)
    .then(($) => {
      const table = $('#all_roster').find('tbody');
      console.log('there are this many players', $(table).find('a').length);
      const players = $('a', table).map(function (i, elem) {
        const link = $(this).attr('href'); // /cbb/players/elijah-bryant-1.html
        const namePart = link.split('/').filter(segment => segment.includes('html'))[0];
        console.log('namePart', namePart)
        const nameId = namePart.replace('.html', '');
        return {
          id: nameId,
          name: $(this).text(),
        };
      }).get();
      resp.status(200).send(players);
    })
    .catch((err) => {
      console.log(err);
      resp.status(500).send({ error: err, message: 'Error loading players for team' });
    });
});

server.get('/player_logs/:player', function (req, resp) {
  const uri = `https://www.sports-reference.com/cbb/players/${req.params.player}${gamelogsUrl}${year}`;
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
      const games = rows.map(function (i, elem) {
        return {
          opp: $("td[data-stat='opp_name'] a", this).text(),
          location: $("td[data-stat='game_location']", this).text(),
          type: $("td[data-stat='game_type']", this).text(),
          result: $("td[data-stat='game_result']", this).text(),
          started: $("td[data-stat='gs']", this).text(),
          mp: $("td[data-stat='mp']", this).text(),
          fg: $("td[data-stat='fg']", this).text(),
        fga: $("td[data-stat='fga']", this).text(),
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
      resp.status(200).send(games);
    })
    .catch((err) => {
      console.log('Error compiling log for a player', err);
      resp.status(500).send({ error: err, message: 'Error loading stats' });
    });
});
server.listen(port).on('error', (err) => console.log('error', err));
console.log('successfully started server on port ', port);