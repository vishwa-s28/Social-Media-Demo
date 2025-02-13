import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Block extends Model {
    static associate(models: any) {
      Block.belongsTo(models.User, { foreignKey: "blocker_id", as: "Blocker" });
      Block.belongsTo(models.User, { foreignKey: "blocked_id", as: "Blocked" });
    }
  }

  Block.init(
    {
      id: {
        type: dataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      blocker_id: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      blocked_id: {
        type: dataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Block",
      tableName: "blocks",
      timestamps: true,
    }
  );

  return Block;
};
