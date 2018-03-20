
var port = process.env.PORT || 3000;
app.listen(port,()=>{console.log('listening...')});
app.get('/',(req,res)=>{
    userInput(req.query.Body,res,req.query.From);
});


function userInput(input,res,phone){
    input=input.toLowerCase();
    db.query("select * from users where phone=?",[phone],(e,r,f)=>{
        if(_.isEmpty(r)){
            console.log('new user...');
            var start = _.sample(startingPoints);
            var newuser={
                phone:phone,
                x:start.x,
                y:start.y
            };
            db.query("INSERT INTO users SET ?",
                newuser,
                (e,r)=>{
                    user=newuser;
                    Zone.get(start.x,start.y,[0,0],lang.welcome+br,_.partialRight(reply,res));
                }
            );
        }
        else{
            user=r[0];
            var msg='';
            var command = _.words(input);
            var dir=[0,0];
            if(_.includes(command,'north'))dir=[0,-1];
            if(_.includes(command,'east'))dir=[1,0];
            if(_.includes(command,'south'))dir=[0,1];
            if(_.includes(command,'west'))dir=[-1,0];

            user.x+=dir[0];user.y+=dir[1];

            if(user.x<1 || user.y<1){
                if(user.x<1)user.x=1;
                if(user.y<1)user.y=1;
                msg=lang.edge;
            }

            Zone.get(user.x,user.y,dir,msg,(response)=>{
                var q = db.query("update users set ? where id=?",[user,user.id],(e,r,f)=>{
                    //console.log(e,r,f);
                });
                reply(response,res);
            });

            //console.log(q.sql);
        }


    });
}


const Zone = {
    content:'',
    tiles:[],
    output:function(){

    },
    get:function(x,y,dir,msg,cb){
        //msg = "X"+user.x+"Y"+user.y+" F"+user.fatigue+br;//msg+br;

        db.query('select * from zones where x=? and y=?',[x,y],(e,r)=>{
            if(_.isEmpty(r)){
                db.query('select * from map where x=? and y=?',[x,y],(e,m)=>{
                    if(_.isEmpty(m) || parseInt(m[0].val,10)===0){
                        user.x-=dir[0];
                        user.y-=dir[1];
                        db.query("select * from zones where x=? and y=?",[user.x,user.y],(e,z)=>{
                            cb(this.render(z[0],msg+lang.edge+br));
                        });
                    }
                    else {
                        var myPallette = _.map(_.filter(pallette, (p)=> {
                            return m[0].val >= p.min && m[0].val <= p.max
                        }), 'emoji');
                        //console.log(myPallette);
                        var zone = {
                            x: x,
                            y: y,
                            layout: _.replace(this.build({bg: [_.sample(myPallette), _.sample(myPallette), _.sample(myPallette)]}), /\:/g, '')
                        };
                        //console.log(zone);
                        var q = db.query(
                            "insert into zones set ?",
                            zone,
                            (e, r, f)=> {
                                cb(this.render(zone,msg));
                            }
                        )
                    }
                });
            }
            else {
                cb(this.render(r[0],msg));
            }
        });
    },
    getEncounter:function(x,y,fatigue){

    },
    render:function(data,msg){
        var rarity = _.random(0,300);
        var encounter = _.sample(_.filter(encounters,(n)=>{return parseInt(n.rarity,10) > rarity}));

        var layout = _.map(_.split(data.layout,"\n"),function(l){return _.split(l,'')});
        if(!_.isEmpty(encounter)){
            layout[1][4]=encounter.emoji;//emoji.get('slightly_smiling_face');
            layout[1][1]=encounter.face;//emoji.get('scorpion');
            msg+=encounter.text+br;
        }else layout[1][1]=emoji.get('slightly_smiling_face');
        return msg+_.map(layout,(l)=>{return l.join('')}).join(br);
    },
    build:function(data){//backdrop,player,encounter){
        var tiles=[];
        for(var i=0;i<3;i++){
            tiles[i]=[];
            for(var j=0;j<6;j++){
                tiles[i][j]=emoji.get(_.sample(data.bg));
            }
        }
        if(!_.isEmpty(data.emoji))tiles[1][4]=emoji.get(data.emoji);
        if(!_.isEmpty(data.face))tiles[1][1]=emoji.get(data.face);
        return _.map(tiles,(t)=>{return t.join('')}).join(br);
    }
};

function reply(output,res){
        res.send(commandForm+_.replace(output,/\n/g,"<br />"));
}