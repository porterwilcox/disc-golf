<template>
   <div class="navigation w-100 mb-4">
      <div class="col d-flex justify-content-center">
          <h1 v-if="title" data-toggle="toggle" data-placement="top" title="Back to Home" class="action nav-title" @click="$router.push({name: 'home'})">{{title}}</h1>
          <h1 class="nav-title" v-else>Sc<img class="nav-img fa-pulse" src="../assets/dg-disc.png" />re Cards</h1>
      </div>
      <i @click="navCount++" :class="navCount % 2 ? 'far fa-times-circle text-white' : 'fas fa-bars color ts-white mr-3'" class="fa-2x side-nav-btn action" aria-label="toggle menu" data-target=".side-nav" data-toggle="collapse"></i>
      <div class="side-nav col-5 col-md-2 bg collapse">
         <div class="d-flex flex-column h-100 w-100">
            <button v-for="l in links" :key="l.name" :class="$route.name == l.routeName ? 'disabled btn-light' : 'btn-outline-light'" class="btn mb-1" @click="$router.push({name: l.routeName})">{{l.name}}</button>
            <slot></slot>
            <div v-if="!user.uid" class="btn-group btn-group-sm" role="group">
               <button @click="login" class="btn btn-outline-light">Sign In</button>
               <button @click="register" class="btn btn-outline-light">Sign Up</button>
            </div>
            <button v-else @click="logout" class="btn btn-outline-light">Logout</button>
         </div>
      </div>
   </div>
</template>

<script>
import Swal from 'sweetalert2'
export default {
   name: "navigation",
   props: ["title"],
   data() {
      return {
         homeTitle: 'sc<span class="nav-img"></span>re cards',
         creds: {
            email: '',
            username: '',
            password: ''
         },
         navCount: 0,
         links: [{name: "Home", routeName: "home"}, 
         {name: "Create a Course", routeName: "addCourse"}]
      }
   },
   computed: {
      user() {
         return this.$store.getters.User
      }
   },
   methods: {
      register(){
         Swal.mixin({
         confirmButtonText: 'Next',
         showCancelButton: true,
         progressSteps: ['<i class="fas fa-envelope"></i>', '<i class="fas fa-user"></i>' , '<i class="fas fa-lock"></i>']
         }).queue([
         {
            title: 'Sign Up',
            input: 'email',
            inputPlaceholder: 'Enter your email address',
            preConfirm: (email) => {
               return this.$store.getters["auth/IsUniqueEmail"](email)
                  .then(() => {
                     this.creds.email = email
                  })
                  .catch(e => {
                    Swal.showValidationMessage(`
                        <div class="d-flex flex-column">
                            <p><i>${e.message}</i></p>
                            <p><i class="redirect action">Click here to login.</i></p>
                        </div>
                    `)
                    document.querySelector('.redirect').addEventListener('click', async () => {
                       await Swal.close()
                       this.creds.email = email
                       this.login()
                    })
               })
            }
         },
         {
            title: 'Sign Up',
            input: 'text',
            inputPlaceholder: 'Enter a username',
            preConfirm: (text) => {
               if(text.length < 2) return Swal.showValidationMessage("Username must have at least 2 characters.")
               if (text.match(/\W/)) return Swal.showValidationMessage("Username can only contain alpha-numeric characters.")
               this.creds.username = text
               }
         },
         {
            title: 'Sign Up',
            html: 
            '<input id="pw1" autofocus class="swal2-input" type="password" placeholder="Enter a password">' +
            '<input id="pw2" class="swal2-input" type="password" placeholder="Confirm password">',
            preConfirm: () => {
               let password = document.getElementById('pw1').value
               if (password != document.getElementById('pw2').value) {
                  return Swal.showValidationMessage("Passwords don't match.")
               }
               if (password.length < 8) return Swal.showValidationMessage("Password must be at least 8 characters.")
               this.creds.password = password
               return this.$store.dispatch('auth/register', this.creds)
                  .then(() => {
                     $('.collapse').collapse('hide');
                     this.creds = {
                        email: '',
                        username: '',
                        password: ''
                     }
                  })
                  .catch(e => Swal.showValidationMessage(e.message))
            } 
         }
         ])
      },
      login(){
         Swal.mixin({
         confirmButtonText: 'Next',
         showCancelButton: true,
         progressSteps: ['<i class="fas fa-envelope"></i>', '<i class="fas fa-lock"></i>']
         }).queue([
         {
            title: 'Sign In',
            input: 'email',
            inputValue: this.creds.email || "",
            inputPlaceholder: 'Enter your email address',
            preConfirm: (email) => this.creds.email = email
         },
         {
            title: 'Sign In',
            input: 'password',
            inputPlaceholder: 'Enter your password',
            preConfirm: (password) => {
               this.creds.password = password
               return this.$store.dispatch('auth/login', this.creds)
                  .then(() => {
                     $('.collapse').collapse('hide');
                     this.creds = {
                        email: '',
                        password: ''
                     }
                  })
                  .catch(e => Swal.showValidationMessage(e.message))
            } 
         }
         ])
      },
      logout() {
         $('.collapse').collapse('hide');
         this.$router.push({name: 'home'})
         this.$store.dispatch('auth/logout')
      }
   },
   components: {},
   watch: {
      study: {
         immediate: true,
         handler: function (val, old) {
            if (val) {
               if(this.links[0].routeName == "study") {
                  this.links.shift()
               }
               this.links.unshift({name: this.study, routeName: "study"})
            } 
         }
      }
   }
}
</script>

<style>
.navigation {
   box-shadow: 0 -2px 10px 1px black;
   background-image: url('https://d36zo2s4q1lc88.cloudfront.net/wp-content/uploads/2018/11/20152349/Example-1.jpg');
   background-position: bottom;
}
.nav-title {
   color: var(--light);
   text-shadow: 5px 5px black;
}
.nav-img {
   height: 35px;
   width: 35px;
   border-radius: 50%;
}
.side-nav-btn {
    position: fixed;
    right: 1vw;
    top: 1.5vh;
    z-index: 2;
}
.side-nav {
    position: fixed;
    right: 0;
    top: 0;
    z-index: 1;
    box-shadow: 0 0 100px 10px black;
    padding-top: 20vh;
    height: 100vh;
}
.fa-pulse {
   animation-iteration-count: 2;
}
</style>