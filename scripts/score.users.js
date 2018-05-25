const _ = require('lodash');
const mysql = require('node-mysql');
const cps = require('cps');
const db = require('./db.js');
db.c.connect((connection)=>{
  db.c=connection;
	start();
});

function start(){
  db.users.Table.findAll(db.c,(e,r,f)=>{
    userids = _.map(r,(u)=>{return _.get(u,'_data.id')});
    cps.peach(r,(u,cb)=>{
			u=u._data;
      _.each(userids,(u2)=>{
        var q = `REPLACE INTO user_scores
                SELECT
                uc.user_id, uc2.user_id
                ,SUM(IF(er.score =4,1,0)) AS fours
                ,SUM(IF(er.score =3,1,0)) AS threes
                ,SUM(IF(er.score =2,1,0)) AS twos
                ,SUM(IF(er.score =1,1,0)) AS ones
                ,SUM(IF(er.score =-1,1,0)) AS nones
                ,SUM(IF(er.score =-2,1,0)) AS ntwos
                ,SUM(IF(er.score =-3,1,0)) AS nthrees
                ,SUM(IF(er.score =-4,1,0)) AS nfours

                ,IF(SUM(IF(er.score =4,1,0))>0,1,0)+
                #IF(SUM(IF(er.score =4,1,0))>2,1,0)+
                IF(SUM(IF(er.score =3,1,0))>=4,1,0)+
                IF(SUM(IF(er.score =-4,1,0))>0,-1,0)+
                IF(SUM(IF(er.score =-3,1,0))<=3,1,0)+
                IF(SUM(IF(er.score =-2,1,0)) BETWEEN 3 AND 7,1,0)
                AS overall_score
                FROM user_chart uc
                JOIN user_chart uc2
                ON uc.user_id=${u.id}
                AND uc2.user_id=${u2}

                JOIN aspects a
                ON ABS(uc.degree-uc2.degree) BETWEEN a.minangle AND a.maxangle

                LEFT JOIN entity_relationships er
                ON er.aspect_id=a.id
                AND (
                (
                er.entity_id=uc.entity_id
                AND
                er.entity2_id=uc2.entity_id
                )
                OR
                (
                er.entity2_id=uc.entity_id
                AND
                er.entity_id=uc2.entity_id
                )
                )`;
        db.c.query(q,(e,r,f)=>{console.log(e);});
      })
      cb();

    },(e,r,f)=>{console.log(e,'done')})
  })
}
