//zp-subheading.+?>([a-zA-Z]+?) in .+?([0-9][0-9]' [0-9][0-9].+?)\\/p>
//https://alabe.com/cgi-bin/chart/astrobot.cgi?INPUT1=c+b&INPUT2=&GENDER=Male&MONTH=09&DAY=01&YEAR=1984&HOUR=8&MINUTE=00&AMPM=PM&TOWN=portland&COUNTRY=USA&STATE=OR&INPUT9=&Submit=Submit



const fs = require('fs');
const $ = require('./jquery.js');
const _ = require('lodash');
const request = require("request");
const mysql = require('node-mysql');
const cps = require('cps');
const db = require('./db.js');
const moment = require('moment')
const NodeGeocoder = require('node-geocoder')

const geo = NodeGeocoder({
	provider:'google',
	httpAdapter:'https',
	apiKey:'AIzaSyDVG6owLa69C5S-67zxjou30FXZoCBADJk',
	formatter:null
})

db.c.connect((connection)=>{
	dispatchEvent(new Event("mysql.connect"))
    db.c=connection;
    start();	
});


function start(){
	db.users.Table.findAll(db.c,(e,r,f)=>{
		cps.peach(r,(u,cb)=>{
			d=u._data;
			//console.log(_.isNumber(d.lat),d.lat);
			if(!_.isNumber(d.lat)){
				geo.geocode(
					[d.city,d.state,d.country].join(', '), 
					(e,r)=>{
						//console.log(r);
						if(_.isEmpty(r)){cb();return;}
						else{
							r=_.first(r);
							console.log("get lat and lon");
							u.update(db.c,{lat:r.latitude,lon:r.longitude},()=>{});
						}	
					}
				);
			}else{
				r={latitude:d.lat,longitude:d.lon}
			}

			var m = moment(d.dob);
			var url = "https://alabe.com/cgi-bin/chart/astrobot.cgi?INPUT1=c+b&INPUT2=&GENDER="+
						d.gender+"&MONTH="+m.format("MM")+"&DAY="+m.format("DD")+"&YEAR="+m.format("YYYY")+"&HOUR="+m.format("hh")+"&MINUTE="+
						m.format("mm")+"&AMPM="+m.format("A")+
						//"&TOWN="+d.city+"&COUNTRY="+d.country+"&STATE="+d.state+
						"&INPUT6="+r.latitude+"&INPUT7="+r.longitude+
						"&INPUT8=dummy&Submit=Submit";
			//console.log(url);
			request(url,
				(e,r,c)=>{
					cps.peach(
						_.map(
							c.replace(/[\r\t]/g," ").match	(/[a-zA-Z\.\s].+?is in\s[0-9][0-9] Degrees/g),
							(c)=>{
								return {
									entity:_.replace(_.replace(_.trim(_.first(c.match(/[a-zA-Z\.\s]+?\sis\sin/)).replace(/\sis\sin/,"")),'Rising Sign','Ascendant'),'N. Node','North Node'),
									degree:_.parseInt(_.first(c.match(/[0-9][0-9]/)).replace("\'",""))
								}
							}
						),
						(e,cb)=>{
							console.log(e);
							db.entities.Table.findByName(e.entity,(r)=>{
								console.log(r);
								db.chart.Table.create(db.c,{
									user_id:d.id,
									entity_id:r,
									degree:e.degree
								},cb)
							})
						}
					)
				}
			)
		})
		
	});
}
/*
fs.readFile('cafe.test.json','utf8',(e,c)=>{
	console.log(
		_.map(
			c.match	(/zp-subheading.+?>([a-zA-Z]+?) in .+?([0-9][0-9]' [0-9][0-9].+?)\/p>/g),
			(c)=>{return c.match(/[a-zA-Z]+? in/)[0].replace(" in","") + " " + c.match(/[0-9][0-9]' [0-9][0-9]/)[0].replace("\'","")}
		)
	);
});
*/
/*
fs.readFile('astro.labe.test.html','utf8',(e,c)=>{
	console.log(
		_.map(
			c.replace(/[\r\t]/g," ").match	(/[a-zA-Z\.\s].+?is in\s[0-9][0-9] Degrees/g),
			(c)=>{return _.first(c.match(/[a-zA-Z\.\s]+?\sis\sin/)).replace(/\sis\sin/,"") + " " + _.first(c.match(/[0-9][0-9]/)).replace("\'","")}
		)
	);
});*/
