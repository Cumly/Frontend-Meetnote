import MeetStep from "../components/organisms/meetStep";
import StepperForm from "../components/molecules/stepperForm";
import EditStep from "../components/organisms/editStep";
import FormStep from "./../components/organisms/formStep";
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
import { trancribeGoogle } from "../services/TranscriptionService";
import { useState } from "react";

const MeetPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState(null);
  const [datosReunion, setDatosReunion] = useState(null);
  const [archivo, setArchivo] = useState("");
  const [token, setToken] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [acta, setActa] = useState(null);
  const navigate = useNavigate();
  const [platform, setPlatform] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const handleSelectMeeting = (meetingData) => {
    setTitulo(meetingData.titulo);
    setToken(meetingData.token);

    // Determinar archivo según plataforma
    let archivoSeleccionado;
    if (platform === "zoom") {
      archivoSeleccionado = meetingData.grabacion?.descargar;
    } else if (platform === "google") {
      archivoSeleccionado = meetingData.grabacion?.fileId;
    }
    setArchivo(archivoSeleccionado || meetingData.id);

    console.log("Archivo seleccionado:", archivoSeleccionado);
  };

  const handleGuardar = async (data) => {
    try {
      setLoading(true);
      setDatosReunion(data);
      setTitulo(data.titulo);

      if (archivo) {
        const resultado = await trancribeGoogle(
          archivo,
          token,
          platform,
          data.titulo, // Título del acta
          data.fecha, // Fecha de reunión
          data.horaInicio, // Hora de inicio
          data.horaFin, // Hora de fin
          data.participantes // Lista de participantes
        );

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
        <StepperForm
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          texto={acta}
          titulo={titulo}
        >
          <MeetStep
            platform={platform}
            setPlatform={setPlatform}
            selectedMeeting={selectedMeeting}
            setSelectedMeeting={setSelectedMeeting}
            handleSelectMeeting={handleSelectMeeting}
            onContinue={handleContinue}
            onCancel={handleCancel}
          />
          <FormStep
            data={datosReunion}
            meeting={selectedMeeting} // <-- pasa la reunión seleccionada
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
          <Typography>Se perdera el proceso. ¿Desea continuar?</Typography>
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
            Procesando grabación de la reunión...
          </Typography>
        </Box>
      </Backdrop>
    </>
  );
};

export default MeetPage;
