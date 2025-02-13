import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Notification extends Model {
    static associate(models: any) {
      Notification.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }

  Notification.init(
    {
      id: {
        type: dataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      is_read: {
        type: dataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Notification",
      tableName: "notifications",
      timestamps: true,
    }
  );

  return Notification;
};
