const mysql = require('node-mysql');
const _ = require('lodash');
const config = require('./config.js')


const mysqlconnection = new mysql.DB({
    host:  _.isEmpty(process.env.JAWSDB_MARIA_URL) ? 'localhost' : config.dbhost,
    user: _.isEmpty(process.env.JAWSDB_MARIA_URL) ?'root' : config.dbuser,
    password: _.isEmpty(process.env.JAWSDB_MARIA_URL) ? '' : config.dbpassword,
    database: _.isEmpty(process.env.JAWSDB_MARIA_URL) ? config.database : 'd2p95tvyuukjw7de'
});

mysqlconnection.add({
   name:'users',
    idFieldName:'id',
    Row:{

    },
    Table:{
      get:(db,id,cb)=>{
         db.query("select * from users where id = ?",[id],(e,r,f)=>{
              if(e!=null)console.log(e);
              cb(_.isEmpty(r) ? r : r[0])
          })
      },
      getOrderByScore:(db,id,cb)=>{
          db.query("select u.*,uc.* from user_scores uc join users u on u.id=uc.user2_id join users me on me.id=user_id where u.gender != me.gender and uc.user_id = ? order by overall_score desc",[id],(e,r,f)=>{
            cb(r);
          })
      }
    }
});
mysqlconnection.add({
   name:'entities',
    idFieldName:'id',
    Row:{

    },
    Table:{
    	findByName:(db,name,cb,createIfEmpty)=>{
         db.query("select id from entities where name = ?",[name],(e,r,f)=>{
             	if(e!=null)console.log(e);
        		 	if(_.isEmpty(r) && createIfEmpty){
        		 		console.log('creating',name);
        		 		Entities.Table.create(db,{name:name},(e,r,f)=>{
        		 			if(e!=null)console.log(e);
        		 			//console.log(name, 'create complete');
        		 			cb(r._data.id)
    		 			  });
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
    		 mysqlconnection.query("select id from aspects where name = ?",[name],(e,r,f)=>{
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

mysqlconnection.add({
    name: 'user_chart',
    idFieldName:'id'
})

const Entities = mysqlconnection.get('entities');
Entities.Table.relatesTo({
	name:"entity2",
	leftKey:"entity_id",
	rightKey:"entity2_id",
	through:"entity_relationships",
	table:"entities"
})


module.exports = {
	c: mysqlconnection,
	entities: mysqlconnection.get('entities'),
	aspects: mysqlconnection.get('aspects'),
	relationships: mysqlconnection.get('entity_relationships'),
	users: mysqlconnection.get('users'),
    chart:mysqlconnection.get('user_chart')
};
