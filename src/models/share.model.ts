import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Share extends Model {
    static associate(models: any) {
      Share.belongsTo(models.User, { as: "Sender", foreignKey: "sender_id" });
      Share.belongsTo(models.User, {
        as: "Receiver",
        foreignKey: "receiver_id",
      });

      Share.belongsTo(models.Post, { as: "SharedPost", foreignKey: "post_id" });
    }
  }

  Share.init(
    {
      id: {
        type: dataTypes.UUID,
        primaryKey: true,
        defaultValue: dataTypes.UUIDV4,
      },
      sender_id: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      receiver_id: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      post_id: {
        type: dataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Share",
      tableName: "shares",
      timestamps: true,
    }
  );

  return Share;
};
