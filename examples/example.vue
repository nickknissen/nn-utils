<template>
  <form @submit.prevent="onSubmit">
    <div class="form-group" :class="{'has-error': form.errors.has('name')}">
      <input type="text" v-model="form.name_1">
      <span v-show="form.errors.has('name_1')">
        {{ form.errors.get('name_1') }}
      </span>
    </div>
    <div class="form-group" :class="{'has-error': form.errors.has('email')}">
      <input type="text" v-model="form.email">
      <span v-show="form.errors.has('email')">
        {{ form.errors.get('email') }}
      </span>
    </div>
    <div class="form-group" :class="{'has-error': form.errors.has('password')}">
      <input type="password" v-model="form.password">
      <span v-show="form.errors.has('password')">
        {{ form.errors.get('password') }}
      </span>
    </div>
    <button type="submit" :disabled="form.busy">Submit form</button>
  </form>
</template>
<script>
  import { nnForm, nnFormSender } from '../utils/nnUtils';
  export default {
    data() {
      return {
        form: new nnForm({
          name: '',
          email: '',
          password: '',
        })
      }
    },
    methods: {
      onSubmit() {
        console.log('submit');
        nnFormSender
          .post('/api/admin/word', this.form)
          .then((data) => {
            console.log(data);
          });
      }
    }
  }
</script>
