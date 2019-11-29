import {baseFormMixin, mainFormMixin} from './formMixin'
import axios from 'axios'

function getCookie (name) {
  var cookieValue = null
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';')
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim()
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}
const csrftoken = getCookie('csrftoken')

export default{
mixins:[baseFormMixin, mainFormMixin],
data () {
  return {
      authdata: {
        email: '',
        password: ''
      },
      al: {
        mensaje: '',
        type: 'danger',
        icon: ['fas', 'exclamation-triangle'],
        visible: false
      }
  };
},
  methods: {
    send () {
      console.log(this.authdata.email)
      console.log(this.authdata.password)

      let config = {
        headers: {
          'X-CSRFToken': csrftoken,
          csrf: csrftoken
        }
      }
      const self = this
      var qs = require('qs')
      console.log(config)
      console.log('coockie:' + csrftoken)
      var req = axios.post('/ajaxlogin/login/', qs.stringify(this.authdata), config).then(
        done => {
          console.log(done)
          var mensaje = done.data.message
          // var alerta = {}
          if (mensaje == 'Exito') {
            // alerta.mensaje = 'Ingresando a tu cuenta de Movil Job'
            // alerta.type = 'success'
            // alerta.icon = ['fas', 'thumbs-up']
            // self.$emit('alerta',alerta)

            let host = window.location.protocol + '//' + window.location.host
            window.location = host + '/tablero/'
          } else {
            // alerta.mensaje = mensaje
            // alerta.type = 'danger'
            // alerta.icon = ['fas', 'exclamation-triangle']
            // self.$emit('alerta',alerta)

          }
        },
        fail => {
          console.log('fail')
          console.log(fail)
          // alerta.mensaje = 'Error desconocido'
          // alerta.type = 'danger'
          // alerta.icon = ['fas', 'exclamation-triangle']
          // self.$emit('alerta',  alerta )

        })
    }
  }
}