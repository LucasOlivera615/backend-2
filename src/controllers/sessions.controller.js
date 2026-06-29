const sessionController = (req, res) => {
  res.json({
    success: true,
    message: "La ruta de sesiones está funcionando.",
    data: null
  });
};

export default sessionController;