try {
  const createCurrencyFormat = require('vue-currency-input/src/utils/createCurrencyFormat')
  const defaultOptions = require('vue-currency-input/src/defaultOptions')
}
catch(error){
  console.log('You need vue-currency-input to run the errors')
  console.log(error)
  throw error
}

import parse from 'vue-currency-input/src/utils/formatHelper')

// try {
//   const createCurrencyFormat = require('vue-currency-input/src/util/createCurrencyFormat')
//   const { parse }  = require('vue-currency-input/src/utils/formatHelper')
//   const defaultOptions = require('vue-currency-input/src/defaultOptions')

// }

// catch(error){
//   console.log('If you gonna use the currency form mixin you need you need vue currency input')
//   console.log('There is an error importing vue-currency-input please enssure that you have that depdendencý')
//   console.log(error)

// }

const currencyMixin = {
  data () {
    return {
      currency_fields: [],
      currency: 'ARS',
      locale: 'es'
    }
  },
  methods: {
    _preProcessForm () {
      let proxy = { ...this.form }
      return this._parseCurrencyFields(proxy)
    },
    _parseCurrency (val) {
      let parseCurrency = (str, locale = this.locale, currency = this.currency) => {
        return parse(str, createCurrencyFormat({ ...defaultOptions, locale, currency }))
      }
      return parseCurrency(val, this.locale, this.currency)
    },
    _parseCurrencyFields (form) {
      let formToSend = form
      for (var key in form) {
        if (this.currency_fields.includes(key)) {
          let currencyString = String(form[key])
          let newformat = this._parseCurrency(currencyString)
          formToSend[key] = newformat
        }
      }
      return formToSend
    }
  }
}

export default currencyMixin
