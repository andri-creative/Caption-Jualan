module.exports = (sequelize, DataTypes) => {
    const Caption = sequelize.define('Captions', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        product_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        input_prompt: {
            type: DataTypes.STRING,
            allowNull: false
        },
        model_used: {
            type: DataTypes.STRING,
            allowNull: false
        },
        result_text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'captions',
        timestamps: true,
        underscored: true
    })
    return Caption
}