import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class GroupChat extends Model {
    static associate(models: any) {
      GroupChat.belongsTo(models.User, {
        foreignKey: "creator_id",
        as: "Creator",
      });
    }
  }

  GroupChat.init(
    {
      id: {
        type: dataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      group_name: {
        type: dataTypes.STRING,
        allowNull: true,
      },
      creator_id: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      members: {
        type: dataTypes.JSON, // Storing members as JSON
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "GroupChat",
      tableName: "group_chats",
      timestamps: true,
    }
  );

  return GroupChat;
};
