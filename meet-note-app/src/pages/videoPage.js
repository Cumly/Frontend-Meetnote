import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { marked } from "marked";
import { Backdrop, CircularProgress, Box } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import UploadStep from "../components/organisms/uploadStep";
import StepperForm from "../components/molecules/stepperForm";
import FormStep from "../components/organisms/formStep";
import EditStep from "../components/organisms/editStep";
import { transcribeVideo } from "../services/TranscriptionService";
import { useState } from "react";
import ExportActa from "../components/organisms/exportActa";

const VideoPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [datosReunion, setDatosReunion] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [acta, setActa] = useState(null);
  const navigate = useNavigate();

  const handleGuardar = async (data) => {
    try {
      setLoading(true);
      setDatosReunion(data);

      console.log("Archivo a enviar:", archivo);
      console.log("Es instancia de File:", archivo instanceof File);
      if (archivo) {
        const resultado = await transcribeVideo(
          archivo,
          data.titulo, // Título del acta
          data.fecha, // Fecha de reunión
          data.horaInicio, // Hora de inicio
          data.horaFin, // Hora de fin
          data.participantes // Lista de participantes
        );

        console.log("Respuesta de transcripción:", resultado);

        // Accede al contenido del acta
        const actaMarkdown = resultado["Acta generada"];

        // Convertir markdown a HTML para CKEditor
        const actaHtml = marked.parse(actaMarkdown);

        setActa(actaHtml);
        handleContinue();
      } else {
        console.warn("No se ha cargado un archivo.");
      }
    } catch (error) {
      console.error("Error al transcribir:", error);
      // Aquí puedes mostrar un mensaje al usuario si lo deseas
    } finally {
      setLoading(false); // Ocultar loading
    }
  };

  const handleGuardarActa = (contenidoEditado) => {
    setActa(contenidoEditado);
    handleContinue();
  };

  const handleContinue = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleNavigationBack = () => {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleCancel = () => {
    setConfirmOpen(true);
  };

  const handleConfirmYes = () => {
    setConfirmOpen(false);
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  const handleConfirmNo = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <div>
        <StepperForm activeStep={activeStep} setActiveStep={setActiveStep}>
          <UploadStep
            allowedExtensions={["mp4", "wav"]}
            onFileSelected={setArchivo}
            onContinue={handleContinue}
            file={archivo}
            onCancel={handleCancel}
          />
          <FormStep
            onGuardar={handleGuardar}
            onBack={handleNavigationBack}
            onCancel={handleCancel}
          />
          <EditStep
            data={acta}
            onBack={handleNavigationBack}
            onCancel={handleCancel}
            onGuardar={handleGuardarActa}
          ></EditStep>
          <ExportActa textoPlano={acta}></ExportActa>
        </StepperForm>
      </div>

      {/* Cuadro de confirmación completamente fuera del Stepper */}
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmNo}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberIcon color="warning" />
          ¿Cancelar proceso?
        </DialogTitle>
        <DialogContent>
          <Typography>
            Se perderá el archivo seleccionado. ¿Desea continuar?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmNo}>No</Button>
          <Button onClick={handleConfirmYes} variant="contained" color="error">
            Sí, cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Box mt={2}>
          <Typography variant="h6" align="center">
            Procesando transcripción...
          </Typography>
        </Box>
      </Backdrop>
    </>
  );
};

export default VideoPage;
