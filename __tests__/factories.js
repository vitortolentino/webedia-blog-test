import faker from 'faker';
import { factory } from 'factory-girl';

import { Author, Article } from '../src/app/models';

factory.define('Author', Author, () => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
}));

factory.define('Article', Article, () => ({
  title: faker.lorem.word(),
  subtitle: faker.lorem.words(),
  content: faker.lorem.text(),
}));

export default factory;
