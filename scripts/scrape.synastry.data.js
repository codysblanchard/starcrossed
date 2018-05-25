/*
TODO
hxf3zo
 */

const _ = require('lodash');
const config = require('./config');
const lang = require('./lang');
const app = require('express')();
const mysql = require('node-mysql');
const fs = require("fs");
const cps = require('cps');
const db = require('./db');

var db;
var user;
const testing=true;
const br="\n";

db.c.connect((connection)=>{
  db.c=connection;
    parseSynastry();
});


function parseSynastry(){
	fs.readFile('synastry.dat', 'utf8', async function(err, contents) {
		var c=0;
		//for(let a of contents.replace(/hard aspect/g,"").replace(/\(|\)/g,"").replace(/\s?house\s?/g," ").split(br)){
		cps.peach(
			contents.replace(/hard aspect/g,"")
				.replace(/\(|\)/g,"")
				.replace(/\s?house\s?/g," ")
				.replace(/\sthe\s/g," ")
				.replace(/(South|North) (Node)/g,"$1-$2")
				.replace(/Sun\/Moon midpoint/g,"Sun-Moon-Midpoint")
				.replace(/Nodes of Moon/g,"Nodes-of-Moon")
				.replace(/either Node of Moon/g,"Any-Node-of-Moon")
				.split(br),
			(a,cb)=>{
				c++;
				console.log('line',c);
				a=_.trim(a);
				if(_.isEmpty(a)){
					console.log('--------------------------empty line');
					cb();
					return;
				}
				console.log('non-empty line');
				console.log(a);
				var parts = a.split(" ");
				entity1 = parts.shift();
				score = parts.pop();
				entity2 = parts.pop();
				var aspect="";

				parts = _.compact(_.map(parts.join().split(/\,|or/),_.trim));

				//var callback=_.after(parts.length-1,cb);

				db.entities.Table.findByName(db.c,entity1,(r)=>{
					db.entities.Table.findByName(db.c,entity2,(r2)=>{
							for(let pc in parts){
								var p = parts[pc]
								db.aspects.Table.findByName(db.c,p,(r3)=>{
									//console.log(r,r2,r3);
									db.relationships.Table.create(db.c,{entity_id:r,entity2_id:r2,aspect_id:r3,score:score},pc==parts.length-1 ? cb : ()=>{});
								},true);
							}
						},true);
					},true);

				//let [e1,e2,asp] = await Promise.all([entity1,entity2,aspect]);

			},
			(a,b,c)=>{console.log('done')}
		);
	});
}
return;
