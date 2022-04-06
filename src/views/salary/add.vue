<template>
  <div>
    薪酬新增
    <search />
    <tags-input />
  </div>
</template>

<script>
import { search, tagsInput } from './components'

export default {
  components: {
    search, tagsInput
  }
}
</script>
