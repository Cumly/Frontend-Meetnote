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
import { trancribeMeet } from "../services/TranscriptionService";
import { useState, useEffect } from "react";

const MeetPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState(null);
  const [datosReunion, setDatosReunion] = useState(null);
  const [archivo, setArchivo] = useState("");
  const [token, setToken] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [acta, setActa] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [nuevo, setNuevo] = useState(false);
  const navigate = useNavigate();
  const [resultado, setResultado] = useState({
    temas: "",
    acuerdos: "",
    conclusiones: "",
  });

  const [progreso, setProgreso] = useState(0);
  const [mensaje, setMensaje] = useState("Iniciando...");
  const [idOperacion, setIdOperacion] = useState(null);

  const generarId = () => {
    return (
      "op_" +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).substring(2, 8)
    );
  };

  useEffect(() => {
    let isActive = true;

    const consultarProgreso = async () => {
      if (!loading || !idOperacion) return;

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/generateActaFromInput/getProgress/${idOperacion}/`
        );
        const data = await res.json();

        if (isActive) {
          setProgreso(data.progreso.porcentaje);
          setMensaje(data.progreso.mensaje);

          if (data.progreso.porcentaje < 100) {
            setTimeout(consultarProgreso, 1500);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error consultando progreso:", error);
        setLoading(false);
      }
    };

    if (loading) {
      consultarProgreso();
    }

    return () => {
      isActive = false;
    };
  }, [loading, idOperacion]);

  const handleGenerar = async () => {
    try {
      const id = generarId();
      setIdOperacion(id);
      setLoading(true);

      if (archivo) {
        console.log("id:", token);
        const respuesta = await trancribeMeet(archivo, token, platform, id);

        console.log("Respuesta de transcripción:", respuesta);
        setResultado({
          temas: respuesta.temas || "",
          acuerdos: respuesta.acuerdos || "",
          conclusiones: respuesta.conclusiones || "",
        });
      } else {
        console.warn("No se ha cargado un archivo.");
      }
      handleContinue();
      setNuevo(true);
    } catch (error) {
      console.error("Error al generar acta:", error);
    }
    // ❌ sin finally, dejamos que el progreso cierre el loading
  };

  const handleSelectMeeting = (meetingData) => {
    console.log(meetingData);
    setTitulo(meetingData.titulo);
    setToken(meetingData.token);
    setSelectedMeeting(meetingData);

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
      setDatosReunion(data);
      setTitulo(data.titulo);

      const actaHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">

        <h2 style="text-align:center; margin-bottom: 20px;">Acta de Reunión</h2>

    <ol style="margin-bottom: 20px;">
  <li><b>Título:</b> ${data.titulo}</li>
  <li><b>Fecha:</b> ${data.fecha}</li>
  <li><b>Hora inicio:</b> ${data.horaInicio}</li>
  <li><b>Hora fin:</b> ${data.horaFin}</li>
  <li><b>Participantes:</b> ${
    Array.isArray(data.participantes)
      ? data.participantes
          .map((p) =>
            String(p)
              .toLowerCase()
              .replace(/\b\w/g, (c) => c.toUpperCase())
          )
          .join(", ")
      : String(data.participantes || "")
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase())
  }</li>
</ol>
    <hr style="margin: 20px 0; border: 1px solid #ccc;" />

    <h3 style="color:#333;">Temas discutidos</h3>
    <ul>
      ${resultado.temas
        .split("•")
        .filter((t) => t.trim())
        .map((t) => `<li>${t.trim()}</li>`)
        .join("")}
    </ul>

    <h3 style="color:#333;">Decisiones y acuerdos</h3>
    <ul>
      ${resultado.acuerdos
        .split("•")
        .filter((a) => a.trim())
        .map((a) => `<li>${a.trim()}</li>`)
        .join("")}
    </ul>

    <h3 style="color:#333;">Observaciones y conclusiones</h3>
    <p>${resultado.conclusiones}</p>

  </div>
`;
      setActa(actaHtml);
      setNuevo(false);
      handleContinue();
    } catch (error) {
      console.error("Error al transformar en HTML:", error);
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
            onContinue={handleGenerar}
            onCancel={handleCancel}
          />
          <FormStep
            nuevo={nuevo}
            data={datosReunion}
            meeting={selectedMeeting}
            onGuardar={handleGuardar}
            onBack={handleNavigationBack}
            onCancel={handleCancel}
          />
          <EditStep
            data={acta}
            onBack={handleNavigationBack}
            onCancel={handleCancel}
            onGuardar={handleGuardarActa}
          />
        </StepperForm>
      </div>

      {/* Cuadro de confirmación */}
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
          <Typography>Se perderá el proceso. ¿Desea continuar?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmNo}>No</Button>
          <Button onClick={handleConfirmYes} variant="contained" color="error">
            Sí, cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Backdrop con progreso */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
        }}
        open={loading}
      >
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress variant="determinate" value={progreso} size={100} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" component="div" sx={{ color: "#fff" }}>
              {`${Math.round(progreso)}%`}
            </Typography>
          </Box>
        </Box>
        <Box mt={2}>
          <Typography variant="h6" align="center" sx={{ color: "#fff" }}>
            {mensaje}
          </Typography>
        </Box>
      </Backdrop>
    </>
  );
};

export default MeetPage;
