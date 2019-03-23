import Vue from 'vue/dist/vue.esm'
import TurbolinksAdapter from 'vue-turbolinks' // some node module chris go rails made
import VueResource from 'vue-resource' // so that we have way to send ajax a bit easier

Vue.use(VueResource) // https://github.com/pagekit/vue-resource
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
    var id = element.dataset.id; // added due to strong params; match to rails strong params
    // when the page is loaded, the json of the rails object is already inside the #team-form div
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
        return { id: id, team: team }
      },
      methods: {
        addPlayer: function() {
          // add another div in the same spirit as a new AR instance
          // he later added this in ep2; accesing this variable properly...
          // it did work w/o it...but we probably want it there...
          this.team.players_attributes.push({
            id: null,
            name: "",
            // position: ""
            _destroy: null // keep in sync with other destroy methods
          })
        },

        removePlayer: function(index) {
          var player = this.team.players_attributes[index]

          if (player.id == null) {
            this.team.players_attributes.splice(index, 1);
          } else {
            this.team.players_attributes[index]._destroy = 1; // passing off destroy flag of nested attributes
          }
          // why do we need this here when we didn't when we added a player??
          // theory: the remove button is nested in some for-loop...so we must jump out of the scope by doing 'this' (Vue) and going down to the team

        },

        undoRemove: function(index) {
          this.team.players_attributes[index]._destroy = null; // just undo the delete flag //vue state will just automatically undo it for you and you get the form field exactly back to where it was
        },

        // vueResource gives up $http pretty lightweight plugin
        saveTeam: function() {
          // https://github.com/pagekit/vue-resource
          if (this.id == null) {
            // this is a brand new team...so do post request
            this.$http.post('/teams', { team: this.team }).then(response => {
              console.log(response); // this is success
              // Response {url: "/teams", ok: true, status: 201, statusText: "Created", headers: Headers, …}
              // option 1:
                // window.location = `/teams/${response.body.id}`
              // option 2: use turbolinks cause we have it...
                Turbolinks.visit(`/teams/${response.body.id}`);
            }, response => {
              console.log(response); // this is failure
            })
          } else {
            // this is an already created team... so put request
            this.$http.put(`/teams/${this.id}`, { team: this.team }).then(response => {
              Turbolinks.visit(`/teams/${response.body.id}`)
            }), response => {
              console.log(response);
            }
          }

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
