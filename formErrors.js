try {
  const _ = require('lodash');
}

catch(error){

  console.log('There is an error importing lodash please enssure that you have that depdendencý')
  console.log(error)

}
const errorsMixin = {
  data () {
    return {
      inErrors: {},
      actionsOnFail: [],
      actionsOnSuccess: []
    }
  },
  methods: {
    setInErrors (errors = null) {
      let e = errors ? errors.data : {}
      this.$set(this, 'inErrors', e)
    },
    filterDatabaseError (error) {
      let transformed = error
      if (typeof error === 'object' && error[0]) { error = error[0] }
      if (error === 'Clave primaria "0" inválida - objeto no existe.') {
        transformed = 'Registro no existe en la base de datos'
      }
      return transformed
    },
  },
  props: {
    outErrors: {
      default: function () { return {} },
      type: [Object, String]
    }
  },
  computed: {
    errors () {
      let errors = {}
      let out = this.outErrors
      if (typeof this.outErrors === 'string') {
        out = {}
        for (var inst in this.form) { out[inst] = this.outErrors }
      }
      errors = _.merge(this.inErrors, out)
      let final = {}
      Object.entries(errors).forEach(([key, value]) => {
        let newVal = this.filterDatabaseError(value)
        final[key] = Array.isArray(newVal) ? newVal.join(',') : newVal
      })
      return final
    }
  },
  created () {
    this.actionsOnFail.push(this.setInErrors)
    this.actionsOnSuccess.push(this.setInErrors)
  }
}

export default errorsMixin