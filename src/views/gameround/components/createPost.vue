<template>
  <div class="form-container">
    <Form @createSuccess="createSuccess" />
  </div>
</template>

<script>
import Form from './postForm'
export default {
  name: 'CreateGameRound',
  components: { Form },
  methods: {
    createSuccess() {
      this.$emit('createSuccess')
    }
  }
}
</script>
<style scoped>
.form-container {

}
</style>
