/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '*.graphql' {
  import { DocumentNode } from 'graphql';
  const value: DocumentNode;
  export = value;
}
declare module 'vue-next-select' {
  import { VueSelect } from 'vue-next-select'
  export { VueSelect }
}
declare module 'lodash/find' {
  import  find  from 'lodash/find';
  export = find
}
declare module "@/assets/scss/**/*.scss" {
  const styles: any;
  export = styles;
}

declare module "@/assets/css/*.css" {
  const styles: any;
  export = styles;
}
