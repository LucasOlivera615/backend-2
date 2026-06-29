const healthController = (req, res) => {

    res.json({
        success: true,
        message: "El servidor está activo"
    })
    
}

export default healthController