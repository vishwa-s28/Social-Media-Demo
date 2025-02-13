import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Chat extends Model {
    static associate(models: any) {
      Chat.belongsTo(models.User, { foreignKey: "sender_id", as: "Sender" });
      Chat.belongsTo(models.User, {
        foreignKey: "receiver_id",
        as: "Receiver",
      });
    }
  }

  Chat.init(
    {
      id: {
        type: dataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      sender_id: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      receiver_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      message: {
        type: dataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: dataTypes.ENUM("sent", "delivered", "read"),
        defaultValue: "sent",
      },
    },
    {
      sequelize,
      modelName: "Chat",
      tableName: "chats",
      timestamps: true,
    }
  );

  return Chat;
};
