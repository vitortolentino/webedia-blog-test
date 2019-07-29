import { name, internet, lorem } from 'faker';
import { factory } from 'factory-girl';

import { Author, Article } from '../src/app/models';

factory.define('Author', Author, () => ({
  name: name.findName(),
  email: internet.email(),
  password: internet.password(),
}));

factory.define('Article', Article, () => ({
  title: lorem.word(),
  subtitle: lorem.words(),
  content: lorem.text(),
}));

export default factory;
