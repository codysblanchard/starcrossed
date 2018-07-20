import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import User from './user.jsx'
import _ from 'lodash'
import './style.scss';

/*
create login / logout, auth system, signup register
*/

class Root extends React.Component{
  constructor(props){
    super(props);
    this.state={
      user:{},
      users:[],
      userid:_.isEmpty(location.hash) ? 1 : location.hash.replace('#',''),
      menuVisible:false
    }
    this.loadUser();
    this.loadAllUsers();
  }
  loadUser(){
    axios.get('http://localhost:3000/user/'+this.state.userid).then((r)=>{
      this.setState({
        user:r.data
      })
    });
  }
  loadAllUsers(){
    axios.get('http://localhost:3000/mylist/'+this.state.userid).then((r)=>{
      this.setState({
        users:r.data
      })
    })
  }
  toggleNav(){
    this.setState({menuVisible: !this.state.menuVisible});
  }
  render(){
    return (
      <div>

        <nav className={'menu '+(this.state.menuVisible ? '' : 'hidden')}>
          <div className='hamburger clickable' onClick={this.toggleNav.bind(this)}>
            =<br />=
          </div>
          <ul>
            <li>
              home
            </li>
            <li>
              account
            </li>
            <li>
              profile
            </li>
          </ul>
        </nav>
        <User class='me' user={this.state.user} />
        <div>
          {
            this.state.users.map((u,i)=>{
              return <User user={u} />
            })
          }
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Root/>,document.getElementById('root'))
