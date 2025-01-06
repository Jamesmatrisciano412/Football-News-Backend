const express = require("express");
const router = express.Router();
const verifyToken = require("./verifyToken");
var axios = require("axios");
var dayjs = require("dayjs");

router.post("/", verifyToken, (req, res) => {
  const { date } = req.body;
  var config = {
    method: "get",
    url: process.env.API_URL + "/v4/matches?date=" + date,
    headers: {
      "X-Auth-Token": process.env.API_KEY,
    },
  };

  axios(config)
    .then((result) => {
      if (!result.data.resultSet.count) {
        return res.status(200).json({MatchList: []});
      }

      let matches = result.data.matches;

      const groupedByMatches = matches.reduce((accumulator, cur) => {
        var curMatch = {
          teams: [
            { name: cur.homeTeam.name, mark: cur.homeTeam.crest },
            { name: cur.awayTeam.name, mark: cur.awayTeam.crest },
          ],
          date: dayjs(date),
          result: [cur.score.fullTime.home, cur.score.fullTime.away],
          other: cur.status,
        };

        for (let i = 0; i < accumulator.length; i++) {
          if (accumulator[i].league == cur.competition.name) {
            accumulator[i].matches.push(curMatch);
            return accumulator;
          }
        }

        let newCompetition = {
          league: cur.competition.name,
          mark: cur.competition.emblem,
          matches: [curMatch],
        };

        accumulator.push(newCompetition);

        return accumulator;
      }, []);

      groupedByMatches.sort((a, b) => {
        let aName = a.league.toUpperCase();
        let bName = b.league.toUpperCase();

        if(aName < bName) return -1;
        else if(aName > bName) return 1;
        else return 0; 
      })
      
      res.status(200).json({MatchList: groupedByMatches});
    })
    .catch((err) => {
      console.log(err, "This is get match list error");
    });
});

module.exports = router;
