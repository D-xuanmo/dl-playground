import {
  Select,
  Option,
  Tag,
  Loading
} from 'tdesign-vue-next'

export default {
  install(app: any) {
    app
      .use(Select)
      .use(Option)
      .use(Tag)
      .use(Loading)
  }
}
