//https://randomuser.me/api/
//https://cafeastrology.com/free-natal-chart-report.html
//https://alabe.com/cgi-bin/chart/astrobot.cgi?INPUT1=c+b&INPUT2=&GENDER=Male&MONTH=09&DAY=01&YEAR=1984&HOUR=8&MINUTE=00&AMPM=PM&TOWN=portland&COUNTRY=USA&STATE=OR&INPUT9=&Submit=Submit
//https://horoscopes.astro-seek.com/calculate-birth-chart-horoscope-online/?send_calculation=1&narozeni_den=28&narozeni_mesic=10&narozeni_rok=1984&narozeni_hodina=06&narozeni_minuta=00&narozeni_city=Portland%2C+OR%2C+USA&narozeni_mesto_hidden=Portland&narozeni_stat_hidden=US&narozeni_podstat_kratky_hidden=OR&narozeni_podstat_hidden=Oregon&narozeni_podstat2_kratky_hidden=Multnomah+County&narozeni_podstat3_kratky_hidden=undefined&narozeni_input_hidden=&narozeni_sirka_stupne=45&narozeni_sirka_minuty=31&narozeni_sirka_smer=0&narozeni_delka_stupne=122&narozeni_delka_minuty=41&narozeni_delka_smer=1&narozeni_timezone_form=auto&narozeni_timezone_dst_form=auto&house_system=placidus&hid_chiron=1&hid_chiron_check=on&hid_lilith=1&hid_lilith_check=on&hid_uzel=1&hid_uzel_check=on&tolerance=1&tolerance_paral=1.2#tabs_redraw

const request = require("request");
const config = require('./config');
const lang = require('./lang');
const _ = require("lodash");
//const app = require('express')();
const mysql = require('node-mysql');
//const fs = require("fs");
const cps = require('cps');

var db;

const mysqlconnection = new mysql.DB({
    host:  _.isEmpty(process.env.JAWSDB_MARIA_URL) ? 'localhost' : config.dbhost,
    user: config.dbuser,
    password: config.dbpassword,
    database: _.isEmpty(process.env.JAWSDB_MARIA_URL) ? config.database : 'd2p95tvyuukjw7de'
});


mysqlconnection.connect((connection)=>{
    db=connection;
  	start();
});

mysqlconnection.add({
   name:'users',
    idFieldName:'id',
    Row:{
    	
    },
    Table:{
    	
    }
});
const Users = mysqlconnection.get('users');

const start = ()=>{
	cps.peach(
		new Array(100),
		(v,cb)=>{
			request("https://randomuser.me/api",(e,r,b)=>{
				var u = _.first(_.get(JSON.parse(b),"results"));
				console.log(u);
				Users.Table.create(db,{
					gender:u.gender,
					first:u.name.first,
					last:u.name.last,
					email:u.email,
					dob:u.dob,
					phone:u.phone,
					cell:u.cell,
					picture:u.picture.large,
					username:u.login.username,
					postcode:u.location.postcode,
					street:u.location.street,
					city:u.location.city,
					password:u.login.password,
					country:u.nat
				},(e,r,f)=>{
					//console.log(e,r,f);
					cb();
				})
			});
		}
	)
}
