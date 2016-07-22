import React              from 'react';
import { shallow, mount } from 'enzyme';
import expect             from 'expect';
import { spy, stub }      from 'sinon';
import nock               from 'nock';

import Profile            from '../public/components/Profile';
import { testData }       from './testData';

describe('Profile Component', () => {

  it('calls componentDidMount', () => {
    const profileSpy = spy(Profile.prototype, 'componentDidMount')
    const wrapper = mount(<Profile />);
    expect(profileSpy.calledOnce).toEqual(true);
    profileSpy.restore();
  });


  it('should fetch repos and call receiveRepos', () => {
    //stubs http requests returns with 200 success code
    const id = 123456;
    nock('https://localhost:3000')
      .get('/user/' + id + '/profile')
      .reply(200, testData);
      const repoStub = stub(Profile.prototype, 'receiveRepos');

      return Profile.prototype.componentDidMount()
        .then(() => {
          expect(repoStub.calledOnce).toEqual(true);
          repoStub.restore()
        })
  });

  it('should return correct repos', () => {
    stub(Profile.prototype, 'componentDidMount');
    const wrapper = mount(<Profile />);
    // const repos = Profile.prototype.receiveRepos(testData);
    wrapper.instance().receiveRepos(testData);
    console.log(wrapper.state());

  })

}); 