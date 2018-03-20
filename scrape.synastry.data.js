/*
TODO
 */

const _ = require('lodash');
const config = require('./config');
const lang = require('./lang');
const app = require('express')();
const mysql = require('node-mysql');
const fs = require("fs");
const cps = require('cps');

var db;
var user;
const testing=true;
const commandForm = "<form method='get'><input name='Body' onload='this.focus();'><input type='hidden' name='From' value='5033125056'></form>";
const br="\n";

const mysqlconnection = new mysql.DB({
    host:  _.isEmpty(process.env.JAWSDB_MARIA_URL) ? 'localhost' : config.dbhost,
    user: config.dbuser,
    password: config.dbpassword,
    database: _.isEmpty(process.env.JAWSDB_MARIA_URL) ? config.database : 'd2p95tvyuukjw7de'
})


mysqlconnection.connect((connection)=>{
    db=connection;
  	parseSynastry();
});


mysqlconnection.add({
   name:'entities',
    idFieldName:'id',
    Row:{
    	
    },
    Table:{
    	findByName:(name,cb,createIfEmpty)=>{
    		 db.query("select id from entities where name = ?",[name],(e,r,f)=>{
    		 	if(e!=null)console.log(e);
    		 	if(_.isEmpty(r) && createIfEmpty){
    		 		console.log('creating',name);
    		 		Entities.Table.create(db,{name:name},(e,r,f)=>{
    		 			if(e!=null)console.log(e);
    		 			//console.log(name, 'create complete');
    		 			cb(r._data.id)
		 			})
    		 	}
    		 	else cb(_.isEmpty(r) ? r : r[0].id)
		 	})
    	}
    }
});

mysqlconnection.add({
   name:'aspects',
    idFieldName:'id',
    Row:{
    	
    },
    Table:{
    	findByName:(name,cb,createIfEmpty)=>{
    		//console.log('searching for ',name);
    		 db.query("select id from aspects where name = ?",[name],(e,r,f)=>{
    		 	if(e!=null)console.log(e);
    		 	if(_.isEmpty(r) && createIfEmpty){
    		 		console.log('creating',name);
    		 		Aspects.Table.create(db,{name:name},(e,r,f)=>{
    		 			//console.log(name, 'create complete');
    		 			//console.log(e,r,f);
    		 			cb(r._data.id)
		 			})
    		 	}
    		 	else cb(_.isEmpty(r) ? r : r[0].id)
		 	})
    	}
    }
});

mysqlconnection.add({
   name:'entity_relationships',
    idFieldName:'id',
    Row:{
    	
    },
    Table:{
    	getScore:(entity,entity2,aspect,cb)=>{
    		 db.query("select id from aspects where name = ?",[name],(e,r,f)=>{
    		 	cb(_.isEmpty(r) ? r : r[0].score)
		 	})
    	}
    }
});

const Relationships = mysqlconnection.get('entity_relationships');
const Aspects = mysqlconnection.get('aspects');
const Entities = mysqlconnection.get('entities');

Entities.Table.relatesTo({
	name:"entity2",
	leftKey:"entity_id",
	rightKey:"entity2_id",
	through:"entity_relationships",
	table:"entities"
})

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
				
				Entities.Table.findByName(entity1,(r)=>{
					Entities.Table.findByName(entity2,(r2)=>{
							for(let pc in parts){
								var p = parts[pc]
								Aspects.Table.findByName(p,(r3)=>{
									//console.log(r,r2,r3);
									Relationships.Table.create(db,{entity_id:r,entity2_id:r2,aspect_id:r3,score:score},pc==parts.length-1 ? cb : ()=>{});
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
