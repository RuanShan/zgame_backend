<template>
  <div class="form-container">
  <Form  />
  </div>
</template>

<script>

import Form from './postForm'

export default {
  name: 'CreateGameRound',
  components: { Form }

}

</script>
<style scoped>
.form-container {
  padding: 40px 45px 20px 50px;
}
</style>
