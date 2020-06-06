<template>
  <div class="col-full push-top">
    <h1>Welcome to the forum</h1>
    <CategoryList :categories="categories"/>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import CategoryList from '@/components/CategoryList'
  
  export default {
    components: {
      CategoryList
    },

    methods: {
      ...mapActions(['fetchAllCategories', 'fetchForums'])
    },

    computed: {
      categories () {
        return Object.values(this.$store.state.categories)
      }
    },

    created () {
      this.fetchAllCategories()
      .then(categories => {
        categories.forEach(category => this.fetchForums({ids: Object.keys(category.forums)}))
      })
    }
  }
</script> 
