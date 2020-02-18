import Sequelize, { Model } from 'sequelize';

const baseUrl = 'http://localhost:3333';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${baseUrl}/files/${this.path}`;
          },
        },
      },
      { sequelize }
    );

    return this;
  }
}

export default File;
