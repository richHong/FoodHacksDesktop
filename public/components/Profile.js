import React, { Component } from 'react'
import { render } from 'react-dom'
import Markdown from 'react-markdown'
import 'isomorphic-fetch'


const url = {
  testing: "http://localhost:3000/user/",
  production: "https://tranquil-spire-52253.herokuapp.com/user/"
}

export default class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      repos: [],
      id: undefined,
      readme: undefined
    }
    this.getRepo = this.getRepo.bind(this)
    this.receiveRepos = this.receiveRepos.bind(this);
  }

  getRepo(repo, owner) {
    fetch( url.testing + this.state.id + '/' + owner + '/' + repo)
      .then(res => res.json())
      .then(json => this.setState({readme: json})) 

  }

  receiveRepos(repos) {
    console.log('number of repos',repos.length)
    repos.forEach(repo => {
        repo.fork === false && this.setState({repos: [...this.state.repos, repo]})
      })
    console.log("We in there!", this.state);
  }

  componentDidMount() {
    //this might have to be changed
    let id = window.location.href.split('/').pop();
    id !== 'about:blank' ? this.setState({ id }) : id = 123456; 

    return fetch(url.testing + id + '/profile')
      .then(res => res.json())
      .then(json => this.receiveRepos(json))
  }

  render() {
    return (
      <div>
        {this.state.repos.map((repo, i) => {
          return <div onClick={e => this.getRepo(repo.name, repo.owner.login)} key={i}>{repo.name}</div>
        })}
        <div>{this.state.readme ? <Markdown source={window.atob(this.state.readme.content)} /> : null}</div>
      </div>
    )
  }
}