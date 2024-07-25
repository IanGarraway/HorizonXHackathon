const LLModel = (sequelize, DataTypes) => {
    return sequelize.define("LLM", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        organisation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdDate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        modelCard: {
            type: DataTypes.STRING,
            allowNull: false
        },
        modality: {
            type: DataTypes.STRING,
            allowNull: false
        },analysis: {
            type: DataTypes.STRING,
            allowNull: false
        },size: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dependencies: {
            type: DataTypes.STRING,
            allowNull: true
        },
        trainingEmissions: {
            type: DataTypes.STRING,
            allowNull: false
        },
        trainingTime: {
            type: DataTypes.STRING,
            allowNull: false
        },
        trainingHardware: {
            type: DataTypes.STRING,
            allowNull: false
        },
        qualityControl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        access: {
            type: DataTypes.STRING,
            allowNull: false
        },
        license: {
            type: DataTypes.STRING,
            allowNull: false
        },
        intendedUses: {
            type: DataTypes.STRING,
            allowNull: false
        },
        prohibitedUses: {
            type: DataTypes.STRING,
            allowNull: false
        },
        monitoring: {
            type: DataTypes.STRING,
            allowNull: false
        },
        feedback: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
    }, {
        freezeTableName: true
    });
};

export default LLModel;