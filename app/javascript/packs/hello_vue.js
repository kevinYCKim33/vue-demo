import Vue from 'vue/dist/vue.esm'
import TurbolinksAdapter from 'vue-turbolinks' // some node module chris go rails made
import VueResource from 'vue-resource' // so that we have way to send ajax a bit easier

Vue.use(VueResource) // which initilaizes all that
Vue.use(TurbolinksAdapter) // https://stackoverflow.com/questions/46239040/error-vue-js-cannot-read-property-props-of-undefined

// then go to terminal and go yarn add vue-turbolinks vue-resource
// chris already added all these; see package.json <=> Gemfile

document.addEventListener('turbolinks:load', () => {

  Vue.http.headers.common['X-CSRF-Token'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  // we will have access to that csrf token that shows up on every page and we'll be able to submit across as part of the ajax request automatically
  // wtf does that mean???
  var element = document.getElementById("team-form")

  // if #team-form exists, invoke Vue microApp
  if (element != null) {

    var team = JSON.parse(element.dataset.team); // grab the team json attribute and parse it out
      // data-team = {id: null, name: null}
    var players_attributes = JSON.parse(element.dataset.playersAttributes) // camel case to access properly, weird quirk
      // data-players-attributes = []
    players_attributes.forEach(function(player) { player._destroy = null }) // so we can set up automatically to have _destroy when we have edit form to be able to monitor with vue,

    // low key a clutch move in mirroring rails has_many/nested_attributes relations
    team.players_attributes = players_attributes;

    var app = new Vue({
      el: element,
      data: function() {
        return { team: team }
      },
      methods: {
        addPlayer: function() {
          debugger;
          // add another div in the same spirit as a new AR instance
          team.players_attributes.push({
            id: null,
            name: "",
            // position: ""
            _destroy: null // keep in sync with other destroy methods
          })
        },

        removePlayer: function(index) {
          debugger;
          // why do we need this here when we didn't when we added a player??
          // theory: the remove button is nested in some for-loop...so we must jump out of the scope by doing 'this' (Vue) and going down to the team
          this.team.players_attributes.splice(index, 1);
        }
      }
    })
  }
})

// define a mixin object
// didn't need Turbolinks it turns out
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
