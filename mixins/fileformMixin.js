const fileForm = {
  methods:{
    preProcessFileForm(form){return form},
    preProcessForm(form) {
      form=this.preProcessFileForm(form)
            
      let formData = this.objectToFormData(form)
      this._fileHeaders()
      return formData
    },
    objectToFormData(obj, form, namespace) {
      let fd = form || new FormData();
      let formKey;
      for(let property in obj) {
        if(obj.hasOwnProperty(property) && obj[property]) {
          if (namespace) {
            formKey = namespace + '[' + property + ']';
          } else {
            formKey = property;
          }
          // if the property is an object, but not a File, use recursivity.
          if (obj[property] instanceof Date) {
            fd.append(formKey, obj[property].toISOString());
          } else if (typeof obj[property] === 'object'
          && !(obj[property] instanceof File)) {
            this.objectToFormData(obj[property], fd, formKey);
          } else { // if it's a string or a File object
            fd.append(formKey, obj[property]);
          }
        }
      }
      return fd;
    },
    _fileHeaders () {
      this.service.service.defaults.headers['Content-Type'] =  'multipart/form-data'
      // this.service.service.defaults.headers.post['Content-Type'] =  'multipart/form-data'
      // this.service.service.defaults.headers.patch['Content-Type'] =  'multipart/form-data'
    }
  },
  // mounted() { this._fileHeaders()

}

export default fileForm
