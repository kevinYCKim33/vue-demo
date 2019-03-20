import Vue from 'vue/dist/vue.esm'
import TurbolinksAdapter from 'vue-turbolinks' // some npm package chris go rails made
import VueResource from 'vue-resource' // so that we have way to send ajax a bit easier

Vue.use(VueResource) // which initilaizes all that
Vue.use(TurbolinksAdapter) // https://stackoverflow.com/questions/46239040/error-vue-js-cannot-read-property-props-of-undefined

// then go to terminal and go yarn add vue-turbolinks vue-resource
// chris already added all these; see package.json <=> Gemfile

document.addEventListner('turbolinks:load', () => {

  Vue.http.headers.common['X-CSRF-Token'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  // we will have access to csrf token that shows up on every page and we'll be able to submit across as part of the ajax request automatically
  // wtf does that mean???
  element = document.getElementById("team-form")
  // if #team-form exists, invoke Vue microApp

  if (element != null) {

    var team = JSON.parse(element.dataset.team); // grab the team json attribute and parse it out
    var players_attributes = JSON.parse(element.dataset.playersAttributes) // camel case to access properly
    players_attributes.forEach(function(player) { player._destroy = null }) // so we can set up automatically to have _destroy when we have edit form to be able to monitor with vue,
    team.players_attributes = players_attributes;

    var app = new Vue({
      el: 'hello',
      data: function() {
        return { team: team }
      }
    })
  }
})

// define a mixin object
  // var myMixin = {
  //   created: function () {
  //     this.hello()
  //   },
  //   methods: {
  //     hello: function () {
  //       console.log('hello from mixin!')
  //     }
  //   }
  // }
  //
  // // define a component that uses this mixin
  // var Component = Vue.extend({
  //   mixins: [myMixin]
  // })
  //
  // var component = new Component() // => "hello from mixin!"
