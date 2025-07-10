import { Card, CardActionArea, Typography } from "@mui/material";
import { SwapHoriz, AccountBalance } from "@mui/icons-material";
import HistoryIcon from '@mui/icons-material/History';
import { motion } from "framer-motion";
import Layout from "../layout/Layout";
import { useNavigate } from "react-router-dom";

export default function ContentTransfer() {
  const navigate = useNavigate();

  const handleTransferencia = () => {
    navigate("/transfer");
  };

  const handleInterbancaria = () => {
    navigate("/interTransfer");
  };

  const handleHistTransfer = () => {
    navigate("/histTransfer");
  };

  return (
    <Layout>
      <div className="flex flex-col items-center p-4">
        <div className="grid sm:grid-cols-2 gap-6 w-full max-w-4xl">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Card elevation={3}>
              <CardActionArea
                onClick={handleTransferencia}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  p: 4,
                  gap: 2,
                }}
              >
                <SwapHoriz sx={{ color: "#1976d2", fontSize: 50 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Transferencias
                </Typography>
                <div
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Ir a Transferencias
                </div>
              </CardActionArea>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Card elevation={3}>
              <CardActionArea
                onClick={handleInterbancaria}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  p: 4,
                  gap: 2,
                }}
              >
                <AccountBalance sx={{ color: "#2e7d32", fontSize: 50 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Transferencias Interbancarias
                </Typography>
                <div
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Ir a Interbancarias
                </div>
              </CardActionArea>
            </Card>
          </motion.div>
        </div>

        <div className="mt-6 w-full max-w-xs">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Card elevation={3}>
              <CardActionArea
                onClick={handleHistTransfer}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  p: 4,
                  gap: 2,
                }}
              >
                <HistoryIcon sx={{ color: "#f57c00", fontSize: 50 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Mis Transferencias
                </Typography>
                <div
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded"
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Ver Historial
                </div>
              </CardActionArea>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
