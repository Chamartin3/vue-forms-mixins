
const baseFormMixin = {
  props: { instanceID: { default: null } },
  data () {
    return {
      mode: 'creation',
      form: {},
      service: {},
      proxyForm:{},
      instance: null
    }
  },
  methods: {
    beforeSet (instance) {},
    afterSet (instance) {},
    preProcessInstance (instance) { return instance },
    _setProxy () {
      this.proxyForm = { ...this.form }
    },
    _clearForm (done) {
      this.form = { ...this.proxyForm }
    },
    async _setFields (instance) {
      this.beforeSet(instance)
      let inst = this.preProcessInstance(instance)
      let form = { ...this.proxyForm }
      if (inst) {
        for (var key in form) {
          form[key] = inst[key]
        }
        this.form = form
        this.mode = 'edition'
      } else {
        this.mode = 'creation'
      }
      this.afterSet(inst)
    },
    async _setInstance () {
      // Look for the id in the props
      if (this.instanceID) {
        // Look for the id in the url params
        this.instance = await this.service.retrieve(this.instanceID)
      } else if (this.$route.params.id) {
        // No instance
        this.instance = await this.service.retrieve(this.$route.params.id)
      } else {
        this.instance = null
      }
      this._setFields(this.instance)
    }
  },
  mounted () {
    this._setProxy()
    this._setInstance()
  }
}

const viewModeMixin = {
  data () {
    return {
      edit_form_var: false
    }
  },
  methods: {
    toggleEdition () {
      this.edit_form_var = !this.edit_form_var
    }
  },
  computed: {
    viewMode () {
      if (this.subForm) {
        return this.$parent.viewMode
      } else if (this.mode === 'creation') {
        return false
      } else {
        if (this.edit_form_var) { return false }
        return true
      }
    }
  }
}

const mainFormMixin = {
  data () {
    return {
      mode: 'creation',
      actionsOnFail: [],
      actionsOnSuccess: []
    }
  },
  methods: {

    beforeSend () {},
    _beforeSend () {},
    preProcessForm (form) { return form },
    _preProcessForm () { return this.form },
    successSend (success) {},
    _successSend (data) {
      for (var i = 0; i < this.actionsOnSuccess.length; i++) {
        this.actionsOnSuccess[i](data)
      }
    },
    failedSend (fail) {},
    _failedSend (fail) {
      for (var i = 0; i < this.actionsOnFail.length; i++) {
        this.actionsOnFail[i](fail)
      }
    },
    clearAll (done) {
      if (this.mode === 'creation') {
        this._clearForm()
        for (var i = this.$children.length - 1; i >= 0; i--) {
          if (this.$children[i].subForm) this.$children[i]._clearForm()
        }
        // instance
        // this._setFields(this.proxyForm)
      } else {
        if (this.edit_form_var) {
          this.edit_form_var = false
        }
      }
    },
    sendForm () {
      let self = this
      let form = this.preProcessForm(this._preProcessForm())
      this._beforeSend()
      this.beforeSend()
      if (this.mode === 'creation') {
        this.service.create(form).then(
          done => {
            self._successSend(done)
            self.successSend(done)
          },
          fail => {
            self._failedSend(fail)
            self.failedSend(fail)
          })
      } else {
        this.service.partial_update(this.instance.id, form).then(
          done => {
            self._successSend(done)
            self.successSend(done)
          },
          fail => {
            self._failedSend(fail)
            self.failedSend(fail)
          }
        )
      }
    }
  },
  mounted () {
    this.actionsOnSuccess.push(this.clearAll)
  }
}

const subFormMixin = {
  data () {
    return {
      subForm: true
    }
  },
  methods: {
    _preProcessForm () { 
      let proxy = { ...this.form }
      return proxy
    },
    preProcessForm (form) { return form },
    _setInstance () {
      if (this.$attrs.value) {
        this.instance = this.$attrs.value
      } else {
        this.instance = null
      }
      this._setFields(this.instance)
    }
  },
  watch: {
    form: {
      deep: true,
      handler: function (val, oldVal) {
        let form = this.preProcessForm(this._preProcessForm())
        if (form) this.$emit('input', form)
      }
    },
  }

}

const formResponses = {
  methods: {
    show_alert (response = null) {
      if (response) {
        this.alert.show = true
        this.alert.type = response.type
        this.alert.message = response.message
        let self = this
        setTimeout(function () { self.alert.show = false }, 5000)
      }
    }
  },
  data () {
    return {
      alert: { show: false, type: 'success', message: '' },
      response: {},
      actionsOnFail: [],
      actionsOnSuccess: []
    }
  },
  created () {
    this.actionsOnSuccess.push(this.show_alert)
    this.actionsOnFail.push(this.show_alert)
  }
}

export {
  baseFormMixin,
  mainFormMixin,
  subFormMixin,
  formResponses,
  viewModeMixin
}
